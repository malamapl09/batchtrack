/**
 * Checkout Button Component
 * Triggers Paddle checkout for a specific plan
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { usePaddle } from './paddle-provider';
import { PADDLE_PRICE_IDS, type PlanId, type BillingInterval } from '@/lib/billing/plans';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  planId: Exclude<PlanId, 'free'>;
  interval: BillingInterval;
  email?: string;
  organizationId?: string;
  children: React.ReactNode;
}

/**
 * CheckoutButton Component
 * Opens Paddle checkout overlay for the specified plan
 */
export function CheckoutButton({
  planId,
  interval,
  email,
  organizationId,
  children,
  disabled,
  ...props
}: CheckoutButtonProps) {
  const { openCheckout, isLoaded } = usePaddle();

  const handleClick = () => {
    const priceId = PADDLE_PRICE_IDS[planId][interval];

    if (!priceId) {
      console.error(`No price ID configured for ${planId} ${interval}`);
      return;
    }

    openCheckout(priceId, {
      email,
      customData: organizationId ? { organizationId } : undefined,
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !isLoaded}
      {...props}
    >
      {!isLoaded ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/**
 * Upgrade Button Component
 * Simplified button for upgrade prompts within the app
 */
export function UpgradeButton({
  className,
  children = 'Upgrade Plan',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Button className={className} asChild>
      <a href="/pricing">{children}</a>
    </Button>
  );
}
