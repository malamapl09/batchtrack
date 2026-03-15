/**
 * Checkout Button Component
 * Creates a Paddle transaction server-side, then opens checkout overlay
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePaddle } from './paddle-provider';
import { createCheckoutTransaction } from '@/lib/actions/billing';
import { type PlanId, type BillingInterval } from '@/lib/billing/plans';
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
 * Creates a server-side transaction then opens Paddle checkout overlay
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
  const { openCheckoutWithTransaction, isLoaded } = usePaddle();
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    if (!email) {
      console.error('Email is required for checkout');
      return;
    }

    setIsCreating(true);

    try {
      const result = await createCheckoutTransaction(planId, interval, email);

      if (result.error || !result.transactionId) {
        console.error('Failed to create transaction:', result.error);
        setIsCreating(false);
        return;
      }

      openCheckoutWithTransaction(result.transactionId);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !isLoaded || isCreating}
      {...props}
    >
      {!isLoaded || isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isCreating ? 'Preparing...' : 'Loading...'}
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
      <a href="/settings/upgrade">{children}</a>
    </Button>
  );
}
