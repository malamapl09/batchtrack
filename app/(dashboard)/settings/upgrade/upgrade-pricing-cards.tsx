'use client';

/**
 * Upgrade Pricing Cards
 * Pricing cards with Paddle checkout integration for authenticated users
 */

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutButton } from '@/components/billing/checkout-button';
import {
  PLANS,
  type PlanId,
  type BillingInterval,
  getYearlySavings,
} from '@/lib/billing/plans';

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

interface UpgradePricingCardsProps {
  currentPlanId: PlanId;
  email: string;
  organizationId: string;
}

export function UpgradePricingCards({
  currentPlanId,
  email,
  organizationId,
}: UpgradePricingCardsProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  const planIds: PlanId[] = ['free', 'starter', 'pro'];

  return (
    <div>
      <BillingToggle interval={interval} onChange={setInterval} />
      <div className="grid gap-8 md:grid-cols-3">
        {planIds.map((planId) => {
          const plan = PLANS[planId];
          const price = interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const savings = getYearlySavings(planId);
          const isCurrent = planId === currentPlanId;
          const isUpgrade = planIds.indexOf(planId) > planIds.indexOf(currentPlanId);

          return (
            <Card
              key={planId}
              className={`flex flex-col ${plan.highlighted ? 'border-primary border-2' : ''} ${
                isCurrent ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                  {plan.badge && !isCurrent && (
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
                {isCurrent ? (
                  <Button className="w-full mt-6" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : isUpgrade && planId !== 'free' ? (
                  <CheckoutButton
                    className="w-full mt-6"
                    planId={planId as Exclude<PlanId, 'free'>}
                    interval={interval}
                    email={email}
                    organizationId={organizationId}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Upgrade to {plan.name}
                  </CheckoutButton>
                ) : (
                  <Button className="w-full mt-6" variant="outline" disabled>
                    {planId === 'free' ? 'Free Plan' : plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
