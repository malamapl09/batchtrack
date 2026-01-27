# Paddle Billing Integration Plan

**Overall Progress:** `75%`

## TLDR
Implement Paddle Billing for subscriptions with updated pricing tiers: Free (limited), Starter ($39/mo), Pro ($89/mo), plus annual discounts. Includes checkout, webhooks, and customer portal.

## Pricing Structure

| Plan | Monthly | Annual | Ingredients | Recipes | Users | Features |
|------|---------|--------|-------------|---------|-------|----------|
| **Free** | $0 | $0 | 10 | 5 | 1 | Basic reports |
| **Starter** | $39 | $390 (2mo free) | 100 | 50 | 1 | Basic reports |
| **Pro** | $89 | $890 (2mo free) | Unlimited | Unlimited | 5 | Advanced analytics, CSV import/export, Priority support |

## Critical Decisions
- **Paddle Billing** - Merchant of Record handles tax compliance globally
- **Checkout Overlay** - Paddle's hosted checkout (no PCI compliance needed)
- **Client-side SDK** - Paddle.js for checkout initiation
- **Webhooks** - Server-side subscription lifecycle handling
- **Plan Limits** - Enforced in database/middleware, not just UI

## Tasks

- [x] 🟩 **Step 1: Update Pricing UI**
  - [x] 🟩 Update home page pricing section with new tiers (Free, Starter, Pro)
  - [x] 🟩 Add annual/monthly toggle
  - [x] 🟩 Update feature lists and limits
  - [x] 🟩 Create dedicated `/pricing` page

- [ ] 🟥 **Step 2: Paddle Setup** (Manual - Paddle Dashboard)
  - [ ] 🟥 Create products and prices in Paddle dashboard
  - [ ] 🟥 Get API keys and webhook secret
  - [ ] 🟥 Add env variables (PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)

- [x] 🟩 **Step 3: Paddle Client Integration**
  - [x] 🟩 Install `@paddle/paddle-js`
  - [x] 🟩 Create `components/billing/paddle-provider.tsx`
  - [x] 🟩 Create `components/billing/checkout-button.tsx`
  - [x] 🟩 Create `components/billing/pricing-cards.tsx` (with toggle)

- [x] 🟩 **Step 4: Webhook Handler**
  - [x] 🟩 Create `app/api/webhooks/paddle/route.ts`
  - [x] 🟩 Handle subscription.created event
  - [x] 🟩 Handle subscription.updated event
  - [x] 🟩 Handle subscription.canceled event
  - [x] 🟩 Handle subscription.past_due event

- [x] 🟩 **Step 5: Database Schema**
  - [x] 🟩 Add `subscriptions` table migration
  - [x] 🟩 Update `organizations.plan` constraint to include 'free'
  - [x] 🟩 Add Paddle columns, remove Stripe columns

- [x] 🟩 **Step 6: Plan Enforcement**
  - [x] 🟩 Create `lib/billing/plans.ts` with plan limits
  - [x] 🟩 Create `lib/billing/check-limits.ts` utility
  - [x] 🟩 Add limit checks to ingredient creation
  - [x] 🟩 Add limit checks to recipe creation
  - [x] 🟩 Create upgrade prompt components

- [x] 🟩 **Step 7: Customer Portal**
  - [x] 🟩 Create `app/(dashboard)/settings/billing/page.tsx`
  - [x] 🟩 Show current plan and usage
  - [x] 🟩 Add "Manage Subscription" link to Paddle portal
  - [x] 🟩 Update settings page to link to billing

- [ ] 🟥 **Step 8: Final Testing & Polish**
  - [ ] 🟥 Test checkout flow end-to-end
  - [ ] 🟥 Test webhook handling with Paddle simulator
  - [ ] 🟥 Verify plan enforcement works correctly
  - [ ] 🟥 Add success/error toast notifications

## Files Created/Modified

### New Files
- `lib/billing/plans.ts` - Plan definitions and helpers
- `lib/billing/check-limits.ts` - Server-side limit checking
- `components/billing/paddle-provider.tsx` - Paddle SDK wrapper
- `components/billing/checkout-button.tsx` - Checkout button
- `components/billing/pricing-cards.tsx` - Pricing UI components
- `components/billing/upgrade-prompt.tsx` - Upgrade prompts
- `components/billing/index.ts` - Barrel export
- `app/api/webhooks/paddle/route.ts` - Webhook handler
- `app/(marketing)/pricing/page.tsx` - Pricing page
- `app/(marketing)/layout.tsx` - Marketing layout with Paddle
- `app/(dashboard)/settings/billing/page.tsx` - Billing settings
- `app/(dashboard)/settings/billing/manage-subscription-button.tsx` - Manage button
- `supabase/migrations/20250126000001_add_paddle_subscriptions.sql` - DB migration

### Modified Files
- `app/page.tsx` - Uses PricingSection component
- `app/(dashboard)/layout.tsx` - Added PaddleProvider
- `app/(dashboard)/ingredients/new/page.tsx` - Added limit checks
- `app/(dashboard)/recipes/new/page.tsx` - Added limit checks
- `app/(dashboard)/settings/page.tsx` - Links to billing page
- `app/sitemap.ts` - Added /pricing
- `components/marketing/footer.tsx` - Updated pricing link

## Environment Variables

See `.env.local.example` for all required variables. Key ones for billing:

```bash
# Paddle Billing
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxxxxxxx
PADDLE_WEBHOOK_SECRET=pdl_whsec_xxxxxxxx

# Paddle Price IDs (create in Paddle dashboard)
NEXT_PUBLIC_PADDLE_STARTER_MONTHLY=pri_xxxxxxxx
NEXT_PUBLIC_PADDLE_STARTER_YEARLY=pri_xxxxxxxx
NEXT_PUBLIC_PADDLE_PRO_MONTHLY=pri_xxxxxxxx
NEXT_PUBLIC_PADDLE_PRO_YEARLY=pri_xxxxxxxx

# Supabase Service Role (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Paddle Dashboard Setup Required

1. Create Product: "BatchTrack Starter"
   - Price: $39/month (recurring)
   - Price: $390/year (recurring)

2. Create Product: "BatchTrack Pro"
   - Price: $89/month (recurring)
   - Price: $890/year (recurring)

3. Configure Webhook endpoint: `https://yourdomain.com/api/webhooks/paddle`

4. Get API credentials from Developer Tools

## Next Steps

1. **Set up Paddle Dashboard** (Step 2)
   - Create products and prices
   - Get API credentials
   - Configure webhook URL

2. **Add environment variables** to `.env.local` and Vercel

3. **Run database migration** on Supabase

4. **Test the flow** end-to-end
