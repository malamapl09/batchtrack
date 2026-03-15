'use server';

/**
 * Billing Server Actions
 * Create Paddle transactions server-side for checkout
 */

import { getUserWithOrganization } from '@/lib/supabase/server';
import { PADDLE_PRICE_IDS, type PlanId, type BillingInterval } from '@/lib/billing/plans';

const PADDLE_API_URL = (process.env.PADDLE_ENVIRONMENT || process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT) === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

/**
 * Create a Paddle transaction for checkout
 * Returns the transaction ID that can be used with Paddle.Checkout.open()
 */
export async function createCheckoutTransaction(
  planId: Exclude<PlanId, 'free'>,
  interval: BillingInterval,
  email: string,
): Promise<{ transactionId?: string; error?: string }> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    return { error: 'Paddle API key not configured' };
  }

  const { organization } = await getUserWithOrganization();

  const priceId = PADDLE_PRICE_IDS[planId][interval];
  if (!priceId) {
    return { error: `No price configured for ${planId} ${interval}` };
  }

  const response = await fetch(`${PADDLE_API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      customer: { email },
      custom_data: { organizationId: organization.id },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Paddle transaction creation failed:', error);
    return { error: 'Failed to create checkout session' };
  }

  const data = await response.json();
  return { transactionId: data.data.id };
}
