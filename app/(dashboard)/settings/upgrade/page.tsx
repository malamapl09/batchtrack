/**
 * Upgrade Plan Page (Dashboard)
 * Shows pricing with Paddle checkout buttons for authenticated users
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrganizationPlan } from '@/lib/billing/check-limits';
import { UpgradePricingCards } from './upgrade-pricing-cards';

export const metadata = {
  title: 'Upgrade Plan | BatchTrack',
  description: 'Choose a plan to unlock more features',
};

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const planId = await getOrganizationPlan();

  // Get organization ID for Paddle custom data
  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upgrade Your Plan</h1>
        <p className="text-muted-foreground">
          Choose a plan to unlock more features for your business
        </p>
      </div>

      <UpgradePricingCards
        currentPlanId={planId}
        email={user.email || ''}
        organizationId={profile?.organization_id || ''}
      />
    </div>
  );
}
