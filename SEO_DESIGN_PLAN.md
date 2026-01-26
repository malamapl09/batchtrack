# SEO & Design Improvements Plan

**Overall Progress:** `100%`

## TLDR
Improve BatchTrack's SEO foundation and visual design to attract customers. Add warm amber color palette, SEO meta files (robots, sitemap, OG images), favicon, expanded footer, dashboard mockup in hero, and legal pages (Privacy Policy, Terms of Service).

## Critical Decisions
- **Color palette** - Amber/warm tones (`#f59e0b` primary) to evoke bakeries, breweries, food industry warmth
- **Hero visual** - Dashboard mockup component (consistent with features page style)
- **Legal pages** - Standard SaaS boilerplate (not lawyer-reviewed, basic protection)
- **No domain yet** - Sitemap will use relative URLs, update later when domain is set

## Tasks

- [x] 🟩 **Step 1: Apply Amber Color Palette**
  - [x] 🟩 Update CSS variables in `app/globals.css` (primary, secondary, muted, backgrounds)
  - [x] 🟩 Verify components render correctly with new colors

- [x] 🟩 **Step 2: Add Favicon**
  - [x] 🟩 Create `app/icon.svg` (BatchTrack logo mark using Package icon style)
  - [x] 🟩 Create `app/icon.tsx` and `app/apple-icon.tsx` for dynamic generation

- [x] 🟩 **Step 3: SEO Meta Files**
  - [x] 🟩 Create `app/robots.ts` (allow all crawlers, reference sitemap)
  - [x] 🟩 Create `app/sitemap.ts` (list all public marketing pages)
  - [x] 🟩 Create `app/opengraph-image.tsx` (dynamic OG image with brand)
  - [x] 🟩 Update root `layout.tsx` with enhanced metadata (twitter, theme-color, etc.)

- [x] 🟩 **Step 4: Hero Dashboard Mockup**
  - [x] 🟩 Create `components/marketing/dashboard-mockup.tsx` (styled preview of dashboard)
  - [x] 🟩 Add mockup to home page hero section

- [x] 🟩 **Step 5: Expand Footer**
  - [x] 🟩 Create shared footer component `components/marketing/footer.tsx`
  - [x] 🟩 Add product links (Features, Pricing)
  - [x] 🟩 Add legal links (Privacy Policy, Terms of Service)
  - [x] 🟩 Update home page and features page to use shared footer

- [x] 🟩 **Step 6: Legal Pages**
  - [x] 🟩 Create `app/(marketing)/privacy/page.tsx` with standard Privacy Policy
  - [x] 🟩 Create `app/(marketing)/terms/page.tsx` with standard Terms of Service
  - [x] 🟩 Add proper metadata to both pages

- [x] 🟩 **Step 7: Home Page Metadata**
  - [x] 🟩 Add exported metadata to `app/page.tsx` (title, description, keywords)
