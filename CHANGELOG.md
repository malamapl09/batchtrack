# Changelog

All notable changes to BatchTrack.

## [Unreleased]

### Added

- **Paddle Billing**: Subscription payments via Paddle (Merchant of Record)
  - Pricing tiers: Free (10 ingredients, 5 recipes), Starter ($39/mo), Pro ($89/mo)
  - Annual billing with 2 months free discount
  - Webhook handler for subscription lifecycle events
  - Customer billing portal at `/settings/billing`
- **Plan Limits**: Enforced limits on ingredients, recipes, and users per plan
  - Upgrade prompts when limits reached
  - Usage progress bars in billing settings
- **Pricing Page**: Dedicated `/pricing` page with plan comparison table and FAQ
- **Sentry Logging**: Structured logging with `enableLogs` and console integration
  - `lib/sentry` utilities for error capture, spans, and tracing

### Changed

- **Pricing UI**: Home page pricing section with monthly/yearly toggle
- **Database Schema**: Added `subscriptions` table, updated `organizations.plan` to include 'free' tier
- **Environment Variables**: Updated `.env.local.example` with all required vars (Paddle, Resend, Sentry)

### Removed

- **Stripe References**: Replaced with Paddle billing (removed `stripe_customer_id`, `stripe_subscription_id`)

---

## Previous Changes

### Added

- **Features Page**: Dedicated `/features` page with detailed marketing content for all 6 product features, mockup UI previews, and anchor navigation
- **How It Works Section**: 3-step guide on home page (Add Ingredients → Build Recipes → Track Production)
- **Feature Deep Links**: "Learn more" links on home page feature cards linking to `/features#[section]`
- **SEO Meta Files**: `robots.ts`, `sitemap.ts`, dynamic OG/Twitter images for social sharing
- **Favicons**: SVG favicon, dynamic PNG icon, Apple touch icon with amber brand color
- **Hero Dashboard Mockup**: Interactive dashboard preview in home page hero section
- **Legal Pages**: Privacy Policy (`/privacy`) and Terms of Service (`/terms`)
- **Shared Footer**: Expanded footer with product links and legal links
- **Google Analytics 4**: Usage tracking with gtag integration
- **Sentry Error Monitoring**: Client/server error tracking with global error boundary
- **Email System**: Resend integration with Welcome and Low Stock Alert templates

### Changed

- **Privacy Policy**: Comprehensive rewrite with GDPR/CCPA compliance, data processors, cookies, retention schedule, breach notification
- **Terms of Service**: Comprehensive rewrite with SLA (99.9% uptime), acceptable use policy, DMCA, dispute resolution, force majeure

### Infrastructure

- **Color Palette**: Warm amber tones (`#f59e0b` primary) replacing grayscale for food industry branding
- **Home Page Layout**: Two-column hero with text and dashboard mockup
- **Root Metadata**: Enhanced with keywords, viewport theme-color, Open Graph, and Twitter cards

## [0.1.0] - 2025-01-26

### Added

- **Authentication**: Sign up, sign in, organization onboarding via Supabase Auth
- **Ingredients**: CRUD with unit conversion (purchase → usage), supplier assignment, low-stock alerts
- **Recipes**: Builder with ingredient selector, real-time cost calculation, cost breakdown view
- **Batch Production**: Start batch from recipe, ingredient checklist, completion flow, inventory auto-decrement
- **Waste Tracking**: Log waste by category (dropped, expired, defective, spillage), inventory adjustment
- **Dashboard**: Stock value card, top expensive ingredients, low-stock alerts, recent batches
- **Reports**: Cost trends, ingredient usage over time, waste analytics, production by recipe
- **CSV Import**: Bulk import for ingredients and recipes with validation preview
- **Cost History**: Track ingredient cost changes from purchases with chart visualization
- **Mobile Responsive**: Full mobile support with collapsible sidebar, touch-optimized tables
- **Database**: PostgreSQL schema with 10 tables, RLS policies for multi-tenant security
