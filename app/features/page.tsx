/**
 * Features Page
 * Detailed marketing page showcasing all BatchTrack features
 * with mockup previews and comprehensive descriptions
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Package,
  Calculator,
  Factory,
  Trash2,
  Bell,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import {
  IngredientsMockup,
  RecipesMockup,
  ProductionMockup,
  WasteMockup,
  AlertsMockup,
  AnalyticsMockup,
} from '@/components/marketing/feature-mockups';
import { Footer } from '@/components/marketing/footer';

export const metadata = {
  title: 'Features | BatchTrack',
  description:
    'Discover how BatchTrack helps bakeries, breweries, and food producers track inventory, manage recipes, and understand their true production costs.',
};

/**
 * Feature data configuration
 * Each feature includes: id, icon, title, description paragraphs, bullet points, and mockup
 */
const features = [
  {
    id: 'ingredients',
    icon: Package,
    title: 'Ingredient Management',
    description: [
      `Managing raw materials shouldn't require a spreadsheet degree. BatchTrack lets you track every ingredient with the precision your business needs—from bulk purchases to the exact cost per gram.`,
      `Our smart unit conversion system handles the math that trips up most inventory tools. Buy flour by the 25kg bag? Use it by the gram in recipes? BatchTrack automatically converts between purchase and usage units, so you always know your true cost per unit.`,
      `Keep your inventory accurate with simple stock adjustments, supplier tracking, and purchase history. Every price change is recorded, giving you a complete cost history for smarter purchasing decisions.`,
    ],
    bullets: [
      'Automatic unit conversion (purchase → usage units)',
      'Real-time cost per unit calculations',
      'Supplier management and purchase tracking',
      'Complete cost history with price change tracking',
      'Category organization and search',
      'SKU support for easy identification',
    ],
    Mockup: IngredientsMockup,
  },
  {
    id: 'recipes',
    icon: Calculator,
    title: 'Recipe Costing',
    description: [
      `Every recipe tells a story—and that story should include exactly how much it costs to produce. BatchTrack's recipe builder shows you real-time costs as you add ingredients, so there are no surprises when it's time to price your products.`,
      `Build your bill of materials with precision. Add ingredients, specify quantities, and watch the cost breakdown update instantly. Scale recipes up or down and see exactly how costs change with different batch sizes.`,
      `When ingredient prices change, your recipe costs update automatically. No more manual recalculations or outdated cost sheets. BatchTrack keeps everything in sync so you can make pricing decisions with confidence.`,
    ],
    bullets: [
      'Real-time cost calculation as you build recipes',
      'Detailed cost breakdown by ingredient',
      'Automatic cost updates when prices change',
      'Scale recipes to any batch size',
      'Cost per unit calculations (per cookie, per loaf, etc.)',
      'Active/inactive recipe status management',
    ],
    Mockup: RecipesMockup,
  },
  {
    id: 'production',
    icon: Factory,
    title: 'Batch Production',
    description: [
      `From recipe to finished product, BatchTrack guides your production process. Start a batch, confirm your ingredients, and let the system handle the inventory math. Your stock levels update automatically as you produce.`,
      `The ingredient checklist keeps your team on track. Mark off items as you measure them, add notes for the batch, and complete production with a single click. Every batch is recorded with its exact cost and the quantities actually used.`,
      `Production history gives you complete traceability. See what was made, when it was made, and exactly what went into it. Perfect for quality control, cost analysis, and understanding your most profitable products.`,
    ],
    bullets: [
      'One-click batch creation from any recipe',
      'Interactive ingredient checklist',
      'Automatic inventory deduction on completion',
      'Actual vs. expected quantity tracking',
      'Batch notes and status management',
      'Complete production history with full traceability',
    ],
    Mockup: ProductionMockup,
  },
  {
    id: 'waste',
    icon: Trash2,
    title: 'Waste Tracking',
    description: [
      `Waste is inevitable in production—but understanding it is the first step to reducing it. BatchTrack helps you log waste with the detail you need to spot patterns and make improvements.`,
      `Categorize waste by reason: dropped, expired, defective, spillage, or other. See exactly which ingredients are costing you money and why. Over time, these insights help you optimize ordering, storage, and handling procedures.`,
      `Every waste entry adjusts your inventory automatically and records the cost impact. Weekly and monthly summaries show you the true cost of waste, helping you set targets and track improvement over time.`,
    ],
    bullets: [
      'Categorized waste logging (dropped, expired, defective, spillage)',
      'Automatic inventory adjustment',
      'Cost tracking for every waste entry',
      'Waste analytics by ingredient and reason',
      'Trend analysis over time',
      'Identify high-waste items and patterns',
    ],
    Mockup: WasteMockup,
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Low Stock Alerts',
    description: [
      `Running out of a key ingredient mid-production is a nightmare. BatchTrack's low stock alerts help you stay ahead of shortages with customizable thresholds for every ingredient.`,
      `Set reorder points based on your actual usage patterns. When stock drops below your threshold, you'll see it immediately on your dashboard. Critical items are highlighted so you know what needs attention first.`,
      `The alerts system integrates with your daily workflow. Check your dashboard each morning to see what needs ordering, or filter your ingredients list to show only low-stock items. Never be caught off guard again.`,
    ],
    bullets: [
      'Customizable threshold per ingredient',
      'Dashboard alerts with urgency levels',
      'Visual stock level indicators',
      'Quick-filter to view all low-stock items',
      'Threshold vs. current stock comparison',
      'Prioritized by urgency (critical vs. warning)',
    ],
    Mockup: AlertsMockup,
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: [
      `Data drives better decisions. BatchTrack's reporting dashboard gives you visibility into your production costs, ingredient usage, and waste patterns—all in one place.`,
      `Track cost trends over time to understand seasonality and spot anomalies. See which recipes you're producing most and how costs vary between batches. Ingredient usage reports help you optimize ordering and reduce overstock.`,
      `Waste analytics show you exactly where money is being lost. Break down waste by reason, by ingredient, and over time. Use these insights to set reduction targets and measure your progress.`,
    ],
    bullets: [
      'Daily and weekly cost trend charts',
      'Production volume by recipe',
      'Ingredient usage over time',
      'Waste breakdown by reason and ingredient',
      'KPI cards for quick insights',
      '30-day rolling analytics window',
    ],
    Mockup: AnalyticsMockup,
  },
];

/**
 * Anchor navigation items for the sticky header
 */
const navItems = [
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'production', label: 'Production' },
  { id: 'waste', label: 'Waste' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'analytics', label: 'Analytics' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BatchTrack</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sticky Feature Navigation */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Everything You Need to
            <span className="text-primary"> Know Your Costs</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Powerful inventory and production management designed specifically
            for bakeries, breweries, and small food producers.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const Mockup = feature.Mockup;
        const isReversed = index % 2 === 1;

        return (
          <section
            key={feature.id}
            id={feature.id}
            className={`py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24 ${
              index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <div
                className={`grid gap-12 lg:gap-16 lg:grid-cols-2 items-center ${
                  isReversed ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Text Content */}
                <div className={isReversed ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{feature.title}</h2>
                  </div>

                  <div className="space-y-4 text-muted-foreground">
                    {feature.description.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {feature.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mockup */}
                <div className={isReversed ? 'lg:col-start-1' : ''}>
                  <div className="max-w-md mx-auto lg:max-w-none">
                    <Mockup />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Know Your True Costs?</h2>
          <p className="mt-4 text-lg opacity-90">
            Start your 14-day free trial. No credit card required.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
