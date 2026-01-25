# BatchTrack Implementation Plan

**Overall Progress:** `95%`

## TLDR
Building a Vertical SaaS inventory management system for small production businesses (bakeries, micro-breweries). Core value: helping owners understand their true **Cost of Goods Sold (COGS)** through unit conversion tracking, recipe costing, and batch production management.

## Critical Decisions

- **Framework:** Next.js 14 App Router with Server Actions - SSR for SEO, server actions for data mutations
- **Database:** PostgreSQL via Supabase - relational integrity essential for inventory math
- **UI:** Tailwind CSS + shadcn/ui - professional "pro-tool" aesthetic
- **Auth:** Supabase Auth - unified with database, simpler setup
- **Payments:** Stripe Billing - industry standard for SaaS subscriptions
- **Unit System:** Decimal precision with explicit unit types - critical for accurate COGS calculations

---

## Phase 1: Foundation & Infrastructure

- [x] 🟩 **Step 1: Project Setup**
  - [x] 🟩 Initialize Next.js 14 project with TypeScript
  - [x] 🟩 Configure Tailwind CSS and shadcn/ui
  - [x] 🟩 Set up ESLint and Prettier
  - [x] 🟩 Create folder structure (app, components, lib, types)

- [x] 🟩 **Step 2: Database Setup**
  - [x] 🟩 Initialize Supabase project
  - [x] 🟩 Create initial schema migration (organizations, users)
  - [x] 🟩 Set up Row Level Security (RLS) policies
  - [x] 🟩 Generate TypeScript types from schema

- [x] 🟩 **Step 3: Authentication**
  - [x] 🟩 Configure Supabase Auth
  - [x] 🟩 Build sign-up / sign-in pages
  - [x] 🟩 Create auth middleware for protected routes
  - [x] 🟩 Build organization onboarding flow

---

## Phase 2: Raw Material Management

- [x] 🟩 **Step 4: Ingredients Database Schema**
  - [x] 🟩 Create `ingredients` table with unit conversion fields
  - [x] 🟩 Create `suppliers` table
  - [x] 🟩 Create `ingredient_purchases` table for cost history
  - [x] 🟩 Add RLS policies

- [x] 🟩 **Step 5: Unit Conversion Engine**
  - [x] 🟩 Define unit types (weight, volume, count)
  - [x] 🟩 Build conversion utility functions (purchase unit → usage unit)
  - [x] 🟩 Create cost-per-usage-unit calculator

- [x] 🟩 **Step 6: Ingredients CRUD UI**
  - [x] 🟩 Build ingredients list page with search/filter
  - [x] 🟩 Create ingredient form (add/edit) with unit configuration
  - [x] 🟩 Build supplier management UI
  - [x] 🟩 Add stock adjustment interface

- [x] 🟩 **Step 7: Low-Stock Alerts**
  - [x] 🟩 Add `low_stock_threshold` field to ingredients
  - [x] 🟩 Create alert checking logic
  - [x] 🟩 Build notifications UI component
  - [ ] 🟥 Set up email notifications (Resend or Supabase Edge Functions)

---

## Phase 3: Recipe / Bill of Materials

- [x] 🟩 **Step 8: Recipe Database Schema**
  - [x] 🟩 Create `recipes` table
  - [x] 🟩 Create `recipe_ingredients` junction table
  - [x] 🟩 Add computed `total_batch_cost` logic
  - [x] 🟩 Add RLS policies

- [x] 🟩 **Step 9: Recipe Builder UI**
  - [x] 🟩 Build recipe list page
  - [x] 🟩 Create recipe form with ingredient selector
  - [x] 🟩 Build ingredient quantity input with unit display
  - [x] 🟩 Show real-time cost calculation as ingredients are added

- [x] 🟩 **Step 10: Dynamic Costing**
  - [x] 🟩 Create cost recalculation function (triggered on ingredient price change)
  - [x] 🟩 Build recipe cost breakdown view
  - [x] 🟩 Add cost history tracking

---

## Phase 4: Batch Production

- [x] 🟩 **Step 11: Production Database Schema**
  - [x] 🟩 Create `batches` table (status, timestamp, notes)
  - [x] 🟩 Create `batch_ingredients` table (actual quantities used)
  - [x] 🟩 Create `waste_logs` table
  - [x] 🟩 Add RLS policies

- [x] 🟩 **Step 12: Batch Production UI**
  - [x] 🟩 Build "Start Batch" flow - select recipe, confirm quantities
  - [x] 🟩 Create inventory decrement logic (transactional)
  - [x] 🟩 Build active batch view with ingredient checklist
  - [x] 🟩 Add batch completion flow

- [x] 🟩 **Step 13: Waste Tracking**
  - [x] 🟩 Build waste logging interface
  - [x] 🟩 Create waste categorization (dropped, expired, defective)
  - [x] 🟩 Update inventory on waste entry

- [x] 🟩 **Step 14: Production History**
  - [x] 🟩 Build batch history list with filters
  - [x] 🟩 Create batch detail view (ingredients used, cost, waste)

---

## Phase 5: Dashboard & Analytics

- [x] 🟩 **Step 15: Main Dashboard**
  - [x] 🟩 Build current stock value card (total $ on shelves)
  - [x] 🟩 Create top 5 most expensive ingredients widget
  - [x] 🟩 Add low-stock alerts widget
  - [x] 🟩 Show recent batch activity

- [x] 🟩 **Step 16: Basic Reports**
  - [x] 🟩 Build ingredient usage over time chart
  - [x] 🟩 Create cost trends visualization
  - [x] 🟩 Add waste analytics summary

---

## Phase 6: Polish & Launch

- [x] 🟩 **Step 17: Data Import**
  - [x] 🟩 Build CSV import for ingredients
  - [x] 🟩 Build CSV import for recipes
  - [x] 🟩 Add validation and error handling
  - [x] 🟩 Create import preview UI

- [ ] 🟥 **Step 18: Stripe Integration**
  - [ ] 🟥 Set up Stripe products (Starter $39/mo, Pro $89/mo)
  - [ ] 🟥 Build subscription checkout flow
  - [ ] 🟥 Implement plan limits (ingredients, recipes, users)
  - [ ] 🟥 Create billing management portal

- [x] 🟩 **Step 19: Mobile Responsiveness**
  - [x] 🟩 Audit all pages for mobile breakpoints
  - [x] 🟩 Optimize touch targets and navigation
  - [ ] 🟥 Test on actual devices

- [ ] 🟨 **Step 20: Landing Page & Deployment**
  - [x] 🟩 Build marketing landing page
  - [ ] 🟥 Configure Vercel deployment
  - [ ] 🟥 Set up production environment variables
  - [ ] 🟥 Configure custom domain

---

## Database Schema Overview

```
organizations
├── users (team members)
├── suppliers
├── ingredients
│   └── ingredient_purchases (cost history)
├── recipes
│   └── recipe_ingredients (BOM)
├── batches
│   ├── batch_ingredients (actual usage)
│   └── waste_logs
└── subscriptions (Stripe)
```

## File Structure

```
/app
  /(auth)           # Sign in, sign up, onboarding
  /(dashboard)
    /ingredients    # Raw material management
    /recipes        # Recipe/BOM builder
    /production     # Batch tracking
    /reports        # Analytics
    /settings       # Account, billing, team
  /api              # Webhooks (Stripe)
/components
  /ui               # shadcn components
  /ingredients      # Ingredient-specific components
  /recipes          # Recipe-specific components
  /production       # Batch-specific components
  /dashboard        # Dashboard widgets
/lib
  /actions          # Server actions
  /utils            # Unit conversion, calculations
  /supabase         # Client, server, middleware
/types              # TypeScript definitions
```
