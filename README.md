# BatchTrack

Inventory management for small production businesses. Track ingredients, build recipes, manage batch production, and understand your true Cost of Goods Sold (COGS).

## Features

- **Ingredient Management** - Track raw materials with unit conversion (purchase → usage units)
- **Recipe Builder** - Create recipes with real-time cost calculation
- **Batch Production** - Record production runs with automatic inventory decrement
- **Waste Tracking** - Log waste by category (dropped, expired, defective)
- **Dashboard** - Stock value, low-stock alerts, cost trends
- **Reports** - Usage analytics, cost history, production summaries
- **CSV Import** - Bulk import ingredients and recipes

## Tech Stack

- Next.js 14 (App Router)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + shadcn/ui
- Recharts for visualizations

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project

### Setup

1. Clone the repo:
```bash
git clone https://github.com/malamapl09/batchtrack.git
cd batchtrack
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Apply database migrations:
```bash
# Via Supabase CLI or dashboard
supabase db push
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app
  /(auth)           # Sign in, sign up, onboarding
  /(dashboard)
    /ingredients    # Raw material management
    /recipes        # Recipe/BOM builder
    /production     # Batch tracking
    /reports        # Analytics
    /settings       # Import, preferences
/components
  /ui               # shadcn components
  /ingredients      # Ingredient-specific
  /recipes          # Recipe-specific
  /production       # Batch-specific
  /dashboard        # Dashboard widgets
/lib
  /actions          # Server actions
  /utils            # Unit conversion, calculations
  /supabase         # Client, server, middleware
```

## Database Schema

```
organizations
├── users
├── suppliers
├── ingredients
│   └── ingredient_purchases (cost history)
├── recipes
│   └── recipe_ingredients (BOM)
├── batches
│   ├── batch_ingredients (actual usage)
│   └── waste_logs
└── subscriptions (future: Stripe)
```

## Deployment

Deployed on Vercel with Supabase backend.

## License

Private - All rights reserved.
