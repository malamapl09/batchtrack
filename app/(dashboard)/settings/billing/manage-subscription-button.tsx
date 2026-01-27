/**
 * Manage Subscription Button
 * Opens Paddle's customer portal for subscription management
 */

'use client';

import { Button } from '@/components/ui/button';
import { usePaddle } from '@/components/billing';
import { ExternalLink, Loader2 } from 'lucide-react';

interface ManageSubscriptionButtonProps {
  subscriptionId: string;
}

export function ManageSubscriptionButton({
  subscriptionId,
}: ManageSubscriptionButtonProps) {
  const { paddle, isLoaded } = usePaddle();

  const handleManageSubscription = () => {
    if (!paddle) {
      console.error('Paddle not initialized');
      return;
    }

    // Open Paddle's customer portal
    // The portal allows customers to update payment, cancel, etc.
    window.open(
      `https://customer.paddle.com/subscriptions/${subscriptionId}`,
      '_blank'
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleManageSubscription}
      disabled={!isLoaded}
    >
      {!isLoaded ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="mr-2 h-4 w-4" />
      )}
      Manage Subscription
    </Button>
  );
}
