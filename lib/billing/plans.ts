/**
 * Billing Plans Configuration
 * Defines plan tiers, limits, and pricing for BatchTrack
 */

export type PlanId = 'free' | 'starter' | 'pro';
export type BillingInterval = 'monthly' | 'yearly';

export interface PlanLimits {
  ingredients: number;
  recipes: number;
  users: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: PlanLimits;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

/**
 * Plan definitions with limits and features
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Get started with the basics',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: {
      ingredients: 10,
      recipes: 5,
      users: 1,
    },
    features: [
      'Up to 10 ingredients',
      'Up to 5 recipes',
      '1 user',
      'Basic reports',
      'Community support',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small operations',
    monthlyPrice: 39,
    yearlyPrice: 390, // 2 months free
    limits: {
      ingredients: 100,
      recipes: 50,
      users: 1,
    },
    features: [
      'Up to 100 ingredients',
      'Up to 50 recipes',
      '1 user',
      'Basic reports',
      'Email support',
      'Low stock alerts',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    monthlyPrice: 89,
    yearlyPrice: 890, // 2 months free
    limits: {
      ingredients: Infinity,
      recipes: Infinity,
      users: 5,
    },
    features: [
      'Unlimited ingredients',
      'Unlimited recipes',
      'Up to 5 users',
      'Advanced analytics',
      'CSV import/export',
      'Priority support',
      'Custom reports',
    ],
    highlighted: true,
    badge: 'Popular',
  },
};

/**
 * Get plan by ID
 */
export function getPlan(planId: PlanId): Plan {
  return PLANS[planId];
}

/**
 * Get price for a plan based on billing interval
 */
export function getPlanPrice(planId: PlanId, interval: BillingInterval): number {
  const plan = PLANS[planId];
  return interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

/**
 * Get monthly equivalent price (for displaying savings)
 */
export function getMonthlyEquivalent(planId: PlanId, interval: BillingInterval): number {
  const plan = PLANS[planId];
  if (interval === 'yearly') {
    return Math.round((plan.yearlyPrice / 12) * 100) / 100;
  }
  return plan.monthlyPrice;
}

/**
 * Calculate yearly savings
 */
export function getYearlySavings(planId: PlanId): number {
  const plan = PLANS[planId];
  const monthlyTotal = plan.monthlyPrice * 12;
  return monthlyTotal - plan.yearlyPrice;
}

/**
 * Check if user is within plan limits
 */
export function isWithinLimits(
  planId: PlanId,
  resource: keyof PlanLimits,
  currentCount: number
): boolean {
  const plan = PLANS[planId];
  return currentCount < plan.limits[resource];
}

/**
 * Get remaining quota for a resource
 */
export function getRemainingQuota(
  planId: PlanId,
  resource: keyof PlanLimits,
  currentCount: number
): number {
  const plan = PLANS[planId];
  const limit = plan.limits[resource];
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentCount);
}

/**
 * Paddle Price IDs (set via environment variables)
 * These are created in the Paddle dashboard
 */
export const PADDLE_PRICE_IDS = {
  starter: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_PADDLE_STARTER_YEARLY || '',
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY || '',
  },
} as const;
