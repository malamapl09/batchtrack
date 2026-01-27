/**
 * Plan Limit Checking Utilities
 * Server-side functions to check and enforce plan limits
 */

import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId, type PlanLimits } from './plans';

export interface LimitCheckResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  planId: PlanId;
}

/**
 * Get the current organization's plan
 */
export async function getOrganizationPlan(): Promise<PlanId> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 'free';
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    return 'free';
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', userData.organization_id)
    .single();

  return (org?.plan as PlanId) || 'free';
}

/**
 * Check if organization can add more ingredients
 */
export async function checkIngredientLimit(): Promise<LimitCheckResult> {
  const supabase = await createClient();
  const planId = await getOrganizationPlan();
  const plan = PLANS[planId];

  const { count } = await supabase
    .from('ingredients')
    .select('*', { count: 'exact', head: true });

  const currentCount = count || 0;
  const limit = plan.limits.ingredients;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentCount);

  return {
    allowed: currentCount < limit,
    currentCount,
    limit,
    remaining,
    planId,
  };
}

/**
 * Check if organization can add more recipes
 */
export async function checkRecipeLimit(): Promise<LimitCheckResult> {
  const supabase = await createClient();
  const planId = await getOrganizationPlan();
  const plan = PLANS[planId];

  const { count } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true });

  const currentCount = count || 0;
  const limit = plan.limits.recipes;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentCount);

  return {
    allowed: currentCount < limit,
    currentCount,
    limit,
    remaining,
    planId,
  };
}

/**
 * Check if organization can add more users
 */
export async function checkUserLimit(): Promise<LimitCheckResult> {
  const supabase = await createClient();
  const planId = await getOrganizationPlan();
  const plan = PLANS[planId];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      allowed: false,
      currentCount: 0,
      limit: 1,
      remaining: 0,
      planId: 'free',
    };
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    return {
      allowed: false,
      currentCount: 0,
      limit: 1,
      remaining: 0,
      planId: 'free',
    };
  }

  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userData.organization_id);

  const currentCount = count || 0;
  const limit = plan.limits.users;
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentCount);

  return {
    allowed: currentCount < limit,
    currentCount,
    limit,
    remaining,
    planId,
  };
}

/**
 * Get all current usage for the organization
 */
export async function getUsageSummary(): Promise<{
  planId: PlanId;
  ingredients: { current: number; limit: number };
  recipes: { current: number; limit: number };
  users: { current: number; limit: number };
}> {
  const [ingredientCheck, recipeCheck, userCheck] = await Promise.all([
    checkIngredientLimit(),
    checkRecipeLimit(),
    checkUserLimit(),
  ]);

  return {
    planId: ingredientCheck.planId,
    ingredients: {
      current: ingredientCheck.currentCount,
      limit: ingredientCheck.limit,
    },
    recipes: {
      current: recipeCheck.currentCount,
      limit: recipeCheck.limit,
    },
    users: {
      current: userCheck.currentCount,
      limit: userCheck.limit,
    },
  };
}

/**
 * Error class for limit exceeded
 */
export class LimitExceededError extends Error {
  resource: keyof PlanLimits;
  currentCount: number;
  limit: number;
  planId: PlanId;

  constructor(
    resource: keyof PlanLimits,
    currentCount: number,
    limit: number,
    planId: PlanId
  ) {
    super(`${resource} limit exceeded. Current: ${currentCount}, Limit: ${limit}`);
    this.name = 'LimitExceededError';
    this.resource = resource;
    this.currentCount = currentCount;
    this.limit = limit;
    this.planId = planId;
  }
}
