/**
 * Pricing Cards Component
 * Displays plan options with monthly/yearly toggle
 * Used on home page and dedicated pricing page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANS, type PlanId, type BillingInterval, getYearlySavings } from '@/lib/billing/plans';

/**
 * Billing interval toggle component
 */
function BillingToggle({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span
        className={`text-sm font-medium ${
          interval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => onChange(interval === 'monthly' ? 'yearly' : 'monthly')}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          interval === 'yearly' ? 'bg-primary' : 'bg-muted'
        }`}
        aria-label="Toggle billing interval"
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
            interval === 'yearly' ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium ${
          interval === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        Yearly
        <span className="ml-1 text-xs text-primary font-normal">(2 months free)</span>
      </span>
    </div>
  );
}

/**
 * Individual pricing card
 */
function PricingCard({
  planId,
  interval,
}: {
  planId: PlanId;
  interval: BillingInterval;
}) {
  const plan = PLANS[planId];
  const price = interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const savings = getYearlySavings(planId);

  return (
    <Card className={`flex flex-col ${plan.highlighted ? 'border-primary border-2' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {plan.badge && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
              {plan.badge}
            </span>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          {price === 0 ? (
            <span className="text-4xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${price}</span>
              <span className="text-muted-foreground">
                /{interval === 'yearly' ? 'year' : 'month'}
              </span>
            </>
          )}
        </div>
        {interval === 'yearly' && savings > 0 && (
          <p className="text-sm text-green-600 mt-1">Save ${savings}/year</p>
        )}
        {interval === 'yearly' && price > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            ${Math.round(price / 12)}/month billed annually
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full mt-6"
          variant={plan.highlighted ? 'default' : 'outline'}
          asChild
        >
          <Link href="/sign-up">
            {price === 0 ? 'Get Started' : 'Start Free Trial'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Pricing Cards Grid
 * Displays all plans with billing toggle
 */
export function PricingCards() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <div>
      <BillingToggle interval={interval} onChange={setInterval} />
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        <PricingCard planId="free" interval={interval} />
        <PricingCard planId="starter" interval={interval} />
        <PricingCard planId="pro" interval={interval} />
      </div>
    </div>
  );
}

/**
 * Compact pricing section for home page
 * Shows only Starter and Pro with Free mentioned
 */
export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Simple Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you need more
          </p>
        </div>

        <BillingToggle interval={interval} onChange={setInterval} />

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <PricingCard planId="free" interval={interval} />
          <PricingCard planId="starter" interval={interval} />
          <PricingCard planId="pro" interval={interval} />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All paid plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
