-- Paddle Subscriptions Migration
-- Adds subscriptions table and updates organizations for Paddle billing

-- =============================================================================
-- Subscriptions Table
-- =============================================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    paddle_customer_id TEXT NOT NULL,
    paddle_subscription_id TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro')),
    status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'paused', 'canceled')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Updated at trigger
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Update Organizations Table
-- =============================================================================

-- Update plan constraint to include 'free'
ALTER TABLE organizations DROP CONSTRAINT organizations_plan_check;
ALTER TABLE organizations ADD CONSTRAINT organizations_plan_check CHECK (plan IN ('free', 'starter', 'pro'));

-- Update default plan to 'free'
ALTER TABLE organizations ALTER COLUMN plan SET DEFAULT 'free';

-- Add Paddle customer ID column (optional, for quick lookups)
ALTER TABLE organizations ADD COLUMN paddle_customer_id TEXT;

-- Remove Stripe columns (no longer needed)
ALTER TABLE organizations DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE organizations DROP COLUMN IF EXISTS stripe_subscription_id;

-- =============================================================================
-- Row Level Security for Subscriptions
-- =============================================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their organization's subscription
CREATE POLICY "Users can view their organization subscription"
    ON subscriptions FOR SELECT
    USING (organization_id = auth.organization_id());

-- Only service role can insert/update subscriptions (via webhook)
-- No user-facing policies for INSERT/UPDATE/DELETE

-- =============================================================================
-- Service Role Access for Webhooks
-- =============================================================================
-- Grant service role full access (webhooks use service role key)
GRANT ALL ON subscriptions TO service_role;
