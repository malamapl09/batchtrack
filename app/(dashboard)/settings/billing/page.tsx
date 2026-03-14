/**
 * Billing Settings Page
 * Subscription management and usage overview
 */

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUsageSummary } from '@/lib/billing/check-limits';
import { PLANS } from '@/lib/billing/plans';
import {
  CreditCard,
  Package,
  BookOpen,
  Users,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ManageSubscriptionButton } from './manage-subscription-button';

export const metadata = {
  title: 'Billing | BatchTrack',
  description: 'Manage your subscription and view usage',
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get usage summary
  const usage = await getUsageSummary();
  const plan = PLANS[usage.planId];

  // Get subscription details if exists
  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  let subscription = null;
  let organization = null;

  if (profile?.organization_id) {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();
    organization = orgData;

    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .single();
    subscription = subData;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'trialing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'past_due':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view usage
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/settings">Back to Settings</Link>
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Current Plan</CardTitle>
              {subscription && (
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status === 'active' && (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  )}
                  {subscription.status === 'past_due' && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1).replace('_', ' ')}
                </Badge>
              )}
            </div>
            {usage.planId !== 'pro' && (
              <Button asChild>
                <Link href="/settings/upgrade">
                  Upgrade Plan
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <CardDescription>
            {plan.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <p className="text-2xl font-bold">{plan.name}</p>
              {plan.monthlyPrice > 0 && (
                <p className="text-sm text-muted-foreground">
                  ${plan.monthlyPrice}/month
                </p>
              )}
            </div>
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>

          {subscription && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Current period ends:</span>
              </div>
              <span className="font-medium">
                {formatDate(subscription.current_period_end)}
              </span>

              {subscription.cancel_at && (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">
                      Cancels on:
                    </span>
                  </div>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {formatDate(subscription.cancel_at)}
                  </span>
                </>
              )}
            </div>
          )}

          {subscription && (
            <ManageSubscriptionButton
              subscriptionId={subscription.paddle_subscription_id}
            />
          )}
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Current usage for this billing period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>Ingredients</span>
              </div>
              <span className="font-medium">
                {usage.ingredients.current}
                {usage.ingredients.limit !== Infinity && (
                  <span className="text-muted-foreground">
                    {' '}/ {usage.ingredients.limit}
                  </span>
                )}
                {usage.ingredients.limit === Infinity && (
                  <span className="text-muted-foreground"> (Unlimited)</span>
                )}
              </span>
            </div>
            {usage.ingredients.limit !== Infinity && (
              <Progress
                value={(usage.ingredients.current / usage.ingredients.limit) * 100}
                className="h-2"
              />
            )}
          </div>

          {/* Recipes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Recipes</span>
              </div>
              <span className="font-medium">
                {usage.recipes.current}
                {usage.recipes.limit !== Infinity && (
                  <span className="text-muted-foreground">
                    {' '}/ {usage.recipes.limit}
                  </span>
                )}
                {usage.recipes.limit === Infinity && (
                  <span className="text-muted-foreground"> (Unlimited)</span>
                )}
              </span>
            </div>
            {usage.recipes.limit !== Infinity && (
              <Progress
                value={(usage.recipes.current / usage.recipes.limit) * 100}
                className="h-2"
              />
            )}
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Team Members</span>
              </div>
              <span className="font-medium">
                {usage.users.current}
                <span className="text-muted-foreground">
                  {' '}/ {usage.users.limit}
                </span>
              </span>
            </div>
            <Progress
              value={(usage.users.current / usage.users.limit) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            What&apos;s included in your {plan.name} plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Questions about billing or your subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Contact our support team at{' '}
            <a
              href="mailto:support@batchtrack.app"
              className="text-primary underline"
            >
              support@batchtrack.app
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
