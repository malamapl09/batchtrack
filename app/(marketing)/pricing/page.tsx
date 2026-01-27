/**
 * Pricing Page
 * Dedicated page for plan comparison and pricing details
 */

import Link from 'next/link';
import { Package, ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/marketing/footer';
import { PricingCards } from '@/components/billing/pricing-cards';

export const metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for BatchTrack. Start free, upgrade when you need more. Plans for bakeries, breweries, and food producers of all sizes.',
};

const faqs = [
  {
    question: 'Can I try BatchTrack for free?',
    answer:
      'Yes! You can start with our Free plan which includes 10 ingredients and 5 recipes. Paid plans also include a 14-day free trial with no credit card required.',
  },
  {
    question: 'What happens when I hit my plan limits?',
    answer:
      "You'll see a notification when you're approaching your limits. You can upgrade anytime to get more capacity, or remove unused items to stay within your current plan.",
  },
  {
    question: 'Can I change plans later?',
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at your next billing date.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and in some regions, local payment methods. All payments are processed securely through Paddle.',
  },
  {
    question: 'Is there a discount for annual billing?',
    answer:
      'Yes! When you pay annually, you get 2 months free - that\'s a 17% discount compared to monthly billing.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
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

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <PricingCards />
        <p className="text-center text-sm text-muted-foreground mt-8">
          All paid plans include a 14-day free trial. No credit card required.
        </p>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium">Starter</th>
                  <th className="text-center py-4 px-4 font-medium bg-primary/5">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-4">Ingredients</td>
                  <td className="text-center py-4 px-4">10</td>
                  <td className="text-center py-4 px-4">100</td>
                  <td className="text-center py-4 px-4 bg-primary/5">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Recipes</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">50</td>
                  <td className="text-center py-4 px-4 bg-primary/5">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Team Members</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4 bg-primary/5">5</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Batch Production</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Waste Tracking</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Low Stock Alerts</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Basic Reports</td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Advanced Analytics</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">CSV Import/Export</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Priority Support</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-6">
                <h3 className="font-medium flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="mt-2 text-muted-foreground pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg opacity-90">
            Join bakeries and breweries already saving with BatchTrack.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/sign-up">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
