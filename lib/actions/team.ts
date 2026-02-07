'use server';

/**
 * Team Server Actions
 * Manage team members and invitations
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { sendTeamInviteEmail } from '@/lib/email/send';
import { checkUserLimit } from '@/lib/billing/check-limits';

/**
 * Get all team members for the current organization
 */
export async function getTeamMembers() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')
    .eq('organization_id', organization.id)
    .order('created_at');

  if (error) throw error;
  return data;
}

/**
 * Get pending invites for the current organization
 */
export async function getPendingInvites() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('invites')
    .select('id, email, role, created_at, expires_at')
    .eq('organization_id', organization.id)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Invite a new team member
 */
export async function inviteTeamMember(email: string, role: 'admin' | 'member') {
  const supabase = await createClient();
  const { user, organization } = await getUserWithOrganization();

  // Check user limit
  const limitCheck = await checkUserLimit();
  if (!limitCheck.allowed) {
    return {
      error: 'limit_exceeded' as const,
      resource: 'users' as const,
      ...limitCheck,
    };
  }

  // Check user role (only owner/admin can invite)
  const { data: currentUser } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!currentUser || !['owner', 'admin'].includes(currentUser.role)) {
    return { error: 'unauthorized' as const };
  }

  // Check if user already exists in org
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('organization_id', organization.id)
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    return { error: 'already_member' as const };
  }

  // Create invite
  const { data: invite, error } = await supabase
    .from('invites')
    .insert({
      organization_id: organization.id,
      email,
      role,
      invited_by: user.id,
    })
    .select('token')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'already_invited' as const };
    }
    throw error;
  }

  // Send invite email
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://batchtrack.vercel.app';
  await sendTeamInviteEmail({
    to: email,
    inviterName: currentUser.full_name || undefined,
    organizationName: organization.name,
    role,
    inviteUrl: `${baseUrl}/invite/${invite.token}`,
  });

  revalidatePath('/settings/team');
  return { success: true };
}

/**
 * Accept an invite by token
 */
export async function acceptInvite(token: string) {
  const supabase = await createClient();

  // Get the invite
  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .select('id, organization_id, email, role, expires_at, accepted_at')
    .eq('token', token)
    .single();

  if (inviteError || !invite) {
    return { error: 'invalid_token' as const };
  }

  if (invite.accepted_at) {
    return { error: 'already_accepted' as const };
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'expired' as const };
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'not_authenticated' as const, email: invite.email };
  }

  // Check if user's email matches the invite
  if (user.email !== invite.email) {
    return { error: 'email_mismatch' as const, expectedEmail: invite.email };
  }

  // Check if user already has a profile
  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existingProfile) {
    // Update existing user to new org
    const { error: updateError } = await supabase
      .from('users')
      .update({
        organization_id: invite.organization_id,
        role: invite.role,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;
  } else {
    // Create new user profile
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: invite.email,
        organization_id: invite.organization_id,
        role: invite.role,
      });

    if (insertError) throw insertError;
  }

  // Mark invite as accepted
  await supabase
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id);

  return { success: true, organizationId: invite.organization_id };
}

/**
 * Remove a team member (owner only)
 */
export async function removeTeamMember(userId: string) {
  const supabase = await createClient();
  const { user, organization } = await getUserWithOrganization();

  // Check current user is owner
  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!currentUser || currentUser.role !== 'owner') {
    return { error: 'unauthorized' as const };
  }

  // Prevent removing self
  if (userId === user.id) {
    return { error: 'cannot_remove_self' as const };
  }

  // Remove the user from the organization
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
    .eq('organization_id', organization.id);

  if (error) throw error;

  revalidatePath('/settings/team');
  return { success: true };
}

/**
 * Cancel a pending invite
 */
export async function cancelInvite(inviteId: string) {
  const supabase = await createClient();
  await getUserWithOrganization();

  const { error } = await supabase
    .from('invites')
    .delete()
    .eq('id', inviteId);

  if (error) throw error;

  revalidatePath('/settings/team');
  return { success: true };
}
