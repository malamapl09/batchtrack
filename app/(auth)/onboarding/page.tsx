/**
 * Onboarding Page
 * Organization setup for new users
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from './onboarding-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Setup Your Organization | BatchTrack',
  description: 'Complete your BatchTrack setup',
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if user already has an organization
  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (profile?.organization_id) {
    redirect('/dashboard');
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Set up your organization</CardTitle>
        <CardDescription>
          Tell us about your business to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OnboardingForm userId={user.id} userEmail={user.email!} />
      </CardContent>
    </Card>
  );
}
