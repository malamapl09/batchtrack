# Features Page Implementation Plan

**Overall Progress:** `100%`

## TLDR
Create a polished `/features` page with detailed marketing content for all 6 product features, including mockup-style UI previews and bullet lists. Update home page with "Learn more" links on feature cards and add a "How It Works" section.

## Critical Decisions
- **Single page with anchors** - All 6 features on one `/features` page with anchor links for deep linking
- **Mockup-style placeholders** - Create styled div components that mimic actual UI (no real screenshots needed)
- **Marketing-focused** - Extended descriptions with some functional detail, not pure documentation
- **No social proof** - Skip testimonials/stats section for now

## Tasks

- [x] 🟩 **Step 1: Create Feature Mockup Components**
  - [x] 🟩 Create `components/marketing/feature-mockups.tsx` with 6 mockup components:
    - IngredientsMockup (table with unit conversion display)
    - RecipesMockup (recipe card with cost breakdown)
    - ProductionMockup (batch checklist view)
    - WasteMockup (waste log form)
    - AlertsMockup (low stock notification cards)
    - AnalyticsMockup (chart/KPI preview)

- [x] 🟩 **Step 2: Create Features Page**
  - [x] 🟩 Create `app/features/page.tsx` with:
    - Sticky navigation bar with anchor links
    - 6 vertical sections (alternating layout: text-left/mockup-right, then reversed)
    - Each section: icon, title, 2-3 paragraph description, bullet list, mockup component
  - [x] 🟩 Add metadata for SEO

- [x] 🟩 **Step 3: Update Home Page - Feature Cards**
  - [x] 🟩 Add "Learn more →" link to each of the 6 feature cards
  - [x] 🟩 Link to `/features#ingredients`, `/features#recipes`, etc.
  - [x] 🟩 Update main "Learn More" button to link to `/features`

- [x] 🟩 **Step 4: Update Home Page - How It Works Section**
  - [x] 🟩 Add new section between Hero and Features
  - [x] 🟩 3 steps with icons: Add Ingredients → Build Recipes → Track Production
  - [x] 🟩 Brief description for each step

- [x] 🟩 **Step 5: Polish & Test**
  - [x] 🟩 Verify all anchor links work correctly
  - [x] 🟩 Test responsive layout on mobile
  - [x] 🟩 Ensure consistent styling with existing landing page
