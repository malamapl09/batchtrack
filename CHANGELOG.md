# Changelog

All notable changes to BatchTrack.

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
