/**
 * Team Management Page
 * Manage team members and invitations (Pro feature)
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrganizationPlan } from '@/lib/billing/check-limits';
import { getTeamMembers, getPendingInvites } from '@/lib/actions/team';
import { UpgradePromptCard } from '@/components/billing';
import { TeamMemberList } from '@/components/settings/team-member-list';
import { InviteMemberDialog } from '@/components/settings/invite-member-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'Team | Settings | BatchTrack',
  description: 'Manage your team members',
};

export default async function TeamSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const planId = await getOrganizationPlan();

  // Gate behind Pro plan
  if (planId !== 'pro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Invite and manage team members
          </p>
        </div>

        <UpgradePromptCard
          resource="users"
          currentCount={1}
          limit={1}
          planId={planId}
        />
      </div>
    );
  }

  const [members, invites] = await Promise.all([
    getTeamMembers(),
    getPendingInvites(),
  ]);

  // Check if current user is owner
  const currentMember = members.find((m) => m.id === user.id);
  const isOwner = currentMember?.role === 'owner';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Invite and manage team members
          </p>
        </div>
        {(isOwner || currentMember?.role === 'admin') && (
          <InviteMemberDialog />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team
          </CardTitle>
          <CardDescription>
            {members.length} member{members.length !== 1 ? 's' : ''}
            {invites.length > 0 && ` · ${invites.length} pending invite${invites.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMemberList
            members={members}
            invites={invites}
            currentUserId={user.id}
            isOwner={isOwner}
          />
        </CardContent>
      </Card>
    </div>
  );
}
