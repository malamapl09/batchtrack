/**
 * Upgrade Prompt Components
 * Displayed when users reach plan limits
 */

'use client';

import { AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLANS, type PlanId } from '@/lib/billing/plans';
import Link from 'next/link';

interface UpgradePromptProps {
  resource: 'ingredients' | 'recipes' | 'users';
  currentCount: number;
  limit: number;
  planId: PlanId;
}

/**
 * Inline upgrade prompt card
 */
export function UpgradePromptCard({
  resource,
  currentCount,
  limit,
  planId,
}: UpgradePromptProps) {
  const nextPlan = planId === 'free' ? PLANS.starter : PLANS.pro;
  const resourceLabel = resource === 'users' ? 'team members' : resource;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5" />
          {resource.charAt(0).toUpperCase() + resource.slice(1)} Limit Reached
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          You&apos;ve used {currentCount} of {limit} {resourceLabel} on the{' '}
          {PLANS[planId].name} plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Button asChild className="w-full">
          <Link href="/settings/upgrade">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to {nextPlan.name} for{' '}
            {nextPlan.limits[resource] === Infinity
              ? 'unlimited'
              : nextPlan.limits[resource]}{' '}
            {resourceLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Modal upgrade prompt
 */
export function UpgradePromptDialog({
  resource,
  currentCount,
  limit,
  planId,
  open,
  onOpenChange,
}: UpgradePromptProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const nextPlan = planId === 'free' ? PLANS.starter : PLANS.pro;
  const resourceLabel = resource === 'users' ? 'team members' : resource;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {resource.charAt(0).toUpperCase() + resource.slice(1)} Limit Reached
          </DialogTitle>
          <DialogDescription>
            You&apos;ve reached the maximum of {limit} {resourceLabel} on the{' '}
            {PLANS[planId].name} plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Upgrade to {nextPlan.name} to get{' '}
            {nextPlan.limits[resource] === Infinity ? (
              <span className="font-semibold text-foreground">
                unlimited {resourceLabel}
              </span>
            ) : (
              <span className="font-semibold text-foreground">
                up to {nextPlan.limits[resource]} {resourceLabel}
              </span>
            )}{' '}
            and unlock additional features:
          </p>

          <ul className="space-y-2 text-sm">
            {nextPlan.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Maybe Later
            </Button>
            <Button asChild className="flex-1">
              <Link href="/settings/upgrade">View Plans</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Small inline limit warning
 */
export function LimitWarning({
  resource,
  remaining,
  limit,
}: {
  resource: 'ingredients' | 'recipes' | 'users';
  remaining: number;
  limit: number;
}) {
  if (remaining > 3 || limit === Infinity) return null;

  const resourceLabel = resource === 'users' ? 'team member' : resource.slice(0, -1);

  return (
    <p className="text-sm text-amber-600 dark:text-amber-400">
      <AlertTriangle className="inline h-3 w-3 mr-1" />
      {remaining === 0
        ? `No ${resource} remaining on your plan.`
        : `Only ${remaining} ${resourceLabel}${remaining !== 1 ? 's' : ''} remaining on your plan.`}
      {' '}
      <Link href="/settings/upgrade" className="underline hover:no-underline">
        Upgrade
      </Link>
    </p>
  );
}
