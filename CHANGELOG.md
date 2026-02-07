# Changelog

All notable changes to BatchTrack.

## [Unreleased]

### Added

- **Paddle Billing**: Subscription payments via Paddle (Merchant of Record)
  - Pricing tiers: Free (10 ingredients, 5 recipes), Starter ($39/mo), Pro ($89/mo)
  - Annual billing with 2 months free discount
  - Webhook handler for subscription lifecycle events
  - Customer billing portal at `/settings/billing`
- **Plan Limit Enforcement**: Server-side limit checks on ingredient/recipe creation
  - Upgrade prompt dialogs when limits are hit
  - Limit warnings on list pages when approaching capacity
  - Usage progress bars in billing settings
- **Supplier Management UI**: Full CRUD pages at `/suppliers`
  - List with search, detail view with linked ingredients, create/edit forms
  - Sidebar navigation added for all users
- **CSV Export** (Pro): Export ingredients and recipes as CSV files
  - Export buttons on ingredients/recipes list pages
  - Proper CSV escaping and browser download
- **Team Management** (Pro): Invite-based team member system at `/settings/team`
  - Email invitations with 7-day expiry tokens
  - Role-based access (owner/admin/member)
  - Invite acceptance flow at `/invite/[token]`
  - `invites` table with RLS policies
- **Advanced Analytics** (Pro): New Analytics tab on Reports page
  - Cost breakdown by ingredient category (pie chart)
  - Recipe cost comparison (bar chart)
  - Gated behind `ProFeatureGate` component with blur overlay
- **Email Triggers**: Welcome email on signup, low stock alerts on dashboard
  - 24-hour dedup for low stock alerts via localStorage
  - Team invite email template
- **Pricing Page**: Dedicated `/pricing` page with plan comparison table and FAQ
- **Sentry Logging**: Structured logging with `enableLogs` and console integration
  - `lib/sentry` utilities for error capture, spans, and tracing

### Changed

- **Pricing UI**: Home page pricing section with monthly/yearly toggle
- **Pricing Table**: Added Supplier Management and Team Management rows
- **Settings Page**: Added Team, Export Data, and Billing cards with Pro badges
- **Plan Features**: Updated feature lists in `plans.ts` to reflect all built features
- **Database Schema**: Added `subscriptions` and `invites` tables, updated `organizations.plan` to include 'free' tier

### Fixed

- **RLS Policy**: Restored `auth.organization_id()` in Paddle migration (was incorrectly changed to non-existent function)
- **TypeScript Types**: Added `invites` table to `database.types.ts`, fixed Recharts pie chart label type
- **Organization Type**: Added `'free'` to plan union, replaced Stripe fields with Paddle fields

### Removed

- **Stripe References**: Replaced with Paddle billing (removed `stripe_customer_id`, `stripe_subscription_id`)
- **Stale PLAN_LIMITS**: Removed duplicate constant from `types/index.ts` (canonical source is `lib/billing/plans.ts`)

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
