/**
 * Dashboard Layout
 * Authenticated layout with sidebar navigation
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    redirect('/onboarding');
  }

  // Get organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.organization_id)
    .single();

  if (orgError || !organization) {
    redirect('/onboarding');
  }

  return (
    <>
      <DashboardShell
        organizationName={organization.name}
        user={{
          fullName: profile.full_name,
          email: profile.email,
          avatarUrl: profile.avatar_url,
        }}
      >
        {children}
      </DashboardShell>
      <Toaster />
    </>
  );
}
