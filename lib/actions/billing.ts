'use server';

/**
 * Billing Server Actions
 * Create Paddle transactions server-side for checkout
 */

import { getUserWithOrganization } from '@/lib/supabase/server';
import { type PlanId, type BillingInterval } from '@/lib/billing/plans';

const PADDLE_API_URL = (process.env.PADDLE_ENVIRONMENT || process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT) === 'production'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

/**
 * Static price ID mapping — same as webhook handler
 * Env vars are unreliable at runtime on Vercel for NEXT_PUBLIC_ values
 */
const PRICE_IDS: Record<string, Record<string, string>> = {
  starter: {
    monthly: 'pri_01kkpfr1fcjxwfce07eezyym7e',
    yearly: 'pri_01kkpfr3vvx600cxz96ms26c1w',
  },
  pro: {
    monthly: 'pri_01kkpfrfwvacnwbc6rsq22eghm',
    yearly: 'pri_01kkpfrj78kbesbxbsrq00qny5',
  },
};

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

  const priceId = PRICE_IDS[planId]?.[interval];
  if (!priceId) {
    return { error: `No price configured for ${planId} ${interval}` };
  }

  try {
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
      const errorData = await response.json();
      console.error('Paddle transaction creation failed:', JSON.stringify(errorData));
      return { error: `Paddle error: ${errorData?.error?.detail || response.statusText}` };
    }

    const data = await response.json();
    return { transactionId: data.data.id };
  } catch (err) {
    console.error('Paddle fetch error:', err);
    return { error: 'Network error connecting to Paddle' };
  }
}
