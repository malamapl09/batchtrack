/**
 * Paddle Webhook Handler
 * Processes subscription lifecycle events from Paddle
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Lazy initialization of Supabase admin client
let supabaseAdminClient: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Supabase configuration missing');
    }

    supabaseAdminClient = createClient(url, key);
  }
  return supabaseAdminClient;
}

/**
 * Verify Paddle webhook signature
 */
function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const ts = signature.split(';').find((s) => s.startsWith('ts='))?.split('=')[1];
  const h1 = signature.split(';').find((s) => s.startsWith('h1='))?.split('=')[1];

  if (!ts || !h1) {
    return false;
  }

  const signedPayload = `${ts}:${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expectedSignature));
}

/**
 * Map Paddle plan to our plan IDs
 */
function mapPaddlePlanToId(priceId: string): 'starter' | 'pro' | null {
  const starterMonthly = process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY;
  const starterYearly = process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY;
  const proMonthly = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY;
  const proYearly = process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY;

  if (priceId === starterMonthly || priceId === starterYearly) {
    return 'starter';
  }
  if (priceId === proMonthly || priceId === proYearly) {
    return 'pro';
  }
  return null;
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(data: any) {
  const { id: subscriptionId, customer_id, items, custom_data, status, current_billing_period } = data;

  const organizationId = custom_data?.organizationId;
  if (!organizationId) {
    console.error('No organizationId in custom_data');
    return;
  }

  const priceId = items?.[0]?.price?.id;
  const planId = mapPaddlePlanToId(priceId);

  if (!planId) {
    console.error('Unknown price ID:', priceId);
    return;
  }

  const supabase = getSupabaseAdmin();

  // Upsert subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .upsert({
      id: subscriptionId,
      organization_id: organizationId,
      paddle_customer_id: customer_id,
      paddle_subscription_id: subscriptionId,
      plan: planId,
      status: status,
      current_period_start: current_billing_period?.starts_at,
      current_period_end: current_billing_period?.ends_at,
      updated_at: new Date().toISOString(),
    });

  if (subscriptionError) {
    console.error('Error upserting subscription:', subscriptionError);
    return;
  }

  // Update organization plan
  const { error: orgError } = await supabase
    .from('organizations')
    .update({ plan: planId })
    .eq('id', organizationId);

  if (orgError) {
    console.error('Error updating organization plan:', orgError);
  }

  console.log(`Subscription created: ${subscriptionId} for org ${organizationId}, plan: ${planId}`);
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(data: any) {
  const { id: subscriptionId, items, status, current_billing_period, scheduled_change } = data;

  const priceId = items?.[0]?.price?.id;
  const planId = mapPaddlePlanToId(priceId);

  const supabase = getSupabaseAdmin();

  // Get existing subscription to find organization
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('paddle_subscription_id', subscriptionId)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscriptionId);
    return;
  }

  // Update subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .update({
      plan: planId,
      status: status,
      current_period_start: current_billing_period?.starts_at,
      current_period_end: current_billing_period?.ends_at,
      cancel_at: scheduled_change?.action === 'cancel' ? scheduled_change.effective_at : null,
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', subscriptionId);

  if (subscriptionError) {
    console.error('Error updating subscription:', subscriptionError);
    return;
  }

  // Update organization plan if changed
  if (planId) {
    const { error: orgError } = await supabase
      .from('organizations')
      .update({ plan: planId })
      .eq('id', subscription.organization_id);

    if (orgError) {
      console.error('Error updating organization plan:', orgError);
    }
  }

  console.log(`Subscription updated: ${subscriptionId}, status: ${status}, plan: ${planId}`);
}

/**
 * Handle subscription canceled event
 */
async function handleSubscriptionCanceled(data: any) {
  const { id: subscriptionId } = data;

  const supabase = getSupabaseAdmin();

  // Get subscription to find organization
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('paddle_subscription_id', subscriptionId)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscriptionId);
    return;
  }

  // Update subscription status
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', subscriptionId);

  if (subscriptionError) {
    console.error('Error updating subscription:', subscriptionError);
    return;
  }

  // Downgrade organization to free plan
  const { error: orgError } = await supabase
    .from('organizations')
    .update({ plan: 'free' })
    .eq('id', subscription.organization_id);

  if (orgError) {
    console.error('Error downgrading organization:', orgError);
  }

  console.log(`Subscription canceled: ${subscriptionId}`);
}

/**
 * Handle subscription past due event
 */
async function handleSubscriptionPastDue(data: any) {
  const { id: subscriptionId } = data;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription to past_due:', error);
  }

  console.log(`Subscription past due: ${subscriptionId}`);
}

/**
 * POST handler for Paddle webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('paddle-signature');
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

    // Verify signature in production
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !webhookSecret) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const { event_type, data } = event;

    console.log(`Paddle webhook received: ${event_type}`);

    switch (event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(data);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription.canceled':
        await handleSubscriptionCanceled(data);
        break;
      case 'subscription.past_due':
        await handleSubscriptionPastDue(data);
        break;
      default:
        console.log(`Unhandled event type: ${event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
