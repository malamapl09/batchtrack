'use server';

/**
 * Reports Server Actions
 * Fetch analytics and reporting data
 */

import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { getOrganizationPlan } from '@/lib/billing/check-limits';

/**
 * Get ingredient usage over time (last N days)
 */
export async function getIngredientUsageOverTime(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get batch ingredients from completed batches
  const { data: batches, error: batchError } = await supabase
    .from('batches')
    .select('id, completed_at')
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', startDate.toISOString())
    .order('completed_at');

  if (batchError) throw batchError;

  if (batches.length === 0) {
    return [];
  }

  const batchIds = batches.map((b) => b.id);

  // Get batch ingredients
  const { data: batchIngredients, error: biError } = await supabase
    .from('batch_ingredients')
    .select('batch_id, actual_quantity, cost_at_time')
    .in('batch_id', batchIds);

  if (biError) throw biError;

  // Group by date
  const batchDateMap = new Map(
    batches.map((b) => [b.id, b.completed_at?.split('T')[0] || ''])
  );

  const dailyUsage: Record<string, { date: string; quantity: number; cost: number }> = {};

  for (const bi of batchIngredients) {
    const date = batchDateMap.get(bi.batch_id) || '';
    if (!date) continue;

    if (!dailyUsage[date]) {
      dailyUsage[date] = { date, quantity: 0, cost: 0 };
    }
    dailyUsage[date].quantity += bi.actual_quantity;
    dailyUsage[date].cost += bi.actual_quantity * bi.cost_at_time;
  }

  // Fill in missing dates
  const result: { date: string; quantity: number; cost: number }[] = [];
  const current = new Date(startDate);
  const end = new Date();

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    result.push(dailyUsage[dateStr] || { date: dateStr, quantity: 0, cost: 0 });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Get production cost trends over time
 */
export async function getCostTrends(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get completed batches with costs
  const { data: batches, error } = await supabase
    .from('batches')
    .select('total_cost, completed_at')
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', startDate.toISOString())
    .order('completed_at');

  if (error) throw error;

  // Group by date
  const dailyCosts: Record<string, { date: string; cost: number; batches: number }> = {};

  for (const batch of batches) {
    const date = batch.completed_at?.split('T')[0] || '';
    if (!date) continue;

    if (!dailyCosts[date]) {
      dailyCosts[date] = { date, cost: 0, batches: 0 };
    }
    dailyCosts[date].cost += batch.total_cost;
    dailyCosts[date].batches += 1;
  }

  // Fill in missing dates
  const result: { date: string; cost: number; batches: number }[] = [];
  const current = new Date(startDate);
  const end = new Date();

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    result.push(dailyCosts[dateStr] || { date: dateStr, cost: 0, batches: 0 });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Get waste analytics summary
 */
export async function getWasteAnalytics(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get waste logs
  const { data: wasteLogs, error } = await supabase
    .from('waste_logs')
    .select('quantity, reason, ingredient_id, created_at')
    .eq('organization_id', organization.id)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  if (wasteLogs.length === 0) {
    return {
      totalWaste: 0,
      totalCost: 0,
      byReason: [],
      byIngredient: [],
      overTime: [],
    };
  }

  // Get ingredient costs
  const ingredientIds = [...new Set(wasteLogs.map((w) => w.ingredient_id))];
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('id, name, cost_per_unit')
    .in('id', ingredientIds);

  if (ingError) throw ingError;

  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  // Calculate totals by reason
  const byReason: Record<string, { reason: string; quantity: number; cost: number }> = {};
  const byIngredient: Record<string, { name: string; quantity: number; cost: number }> = {};
  const byDate: Record<string, { date: string; quantity: number; cost: number }> = {};

  let totalWaste = 0;
  let totalCost = 0;

  for (const log of wasteLogs) {
    const ingredient = ingredientMap.get(log.ingredient_id);
    const cost = log.quantity * (ingredient?.cost_per_unit || 0);
    const date = log.created_at.split('T')[0];

    totalWaste += log.quantity;
    totalCost += cost;

    // By reason
    if (!byReason[log.reason]) {
      byReason[log.reason] = { reason: log.reason, quantity: 0, cost: 0 };
    }
    byReason[log.reason].quantity += log.quantity;
    byReason[log.reason].cost += cost;

    // By ingredient
    const ingName = ingredient?.name || 'Unknown';
    if (!byIngredient[ingName]) {
      byIngredient[ingName] = { name: ingName, quantity: 0, cost: 0 };
    }
    byIngredient[ingName].quantity += log.quantity;
    byIngredient[ingName].cost += cost;

    // By date
    if (!byDate[date]) {
      byDate[date] = { date, quantity: 0, cost: 0 };
    }
    byDate[date].quantity += log.quantity;
    byDate[date].cost += cost;
  }

  // Fill in missing dates for timeline
  const overTime: { date: string; quantity: number; cost: number }[] = [];
  const current = new Date(startDate);
  const end = new Date();

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    overTime.push(byDate[dateStr] || { date: dateStr, quantity: 0, cost: 0 });
    current.setDate(current.getDate() + 1);
  }

  return {
    totalWaste,
    totalCost,
    byReason: Object.values(byReason).sort((a, b) => b.cost - a.cost),
    byIngredient: Object.values(byIngredient).sort((a, b) => b.cost - a.cost).slice(0, 10),
    overTime,
  };
}

/**
 * Get production summary statistics
 */
export async function getProductionSummary(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all batches in period
  const { data: batches, error } = await supabase
    .from('batches')
    .select('status, total_cost, multiplier, recipe_id')
    .eq('organization_id', organization.id)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  // Get recipes for these batches
  const recipeIds = [...new Set(batches.map((b) => b.recipe_id))];
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('id, name')
    .in('id', recipeIds);

  if (recipeError) throw recipeError;
  const recipeMap = new Map(recipes.map((r) => [r.id, r.name]));

  // Calculate stats
  const totalBatches = batches.length;
  const completedBatches = batches.filter((b) => b.status === 'completed').length;
  const cancelledBatches = batches.filter((b) => b.status === 'cancelled').length;
  const totalCost = batches
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.total_cost, 0);

  // Count by recipe
  const byRecipe: Record<string, { name: string; count: number; cost: number }> = {};
  for (const batch of batches.filter((b) => b.status === 'completed')) {
    const recipeName = recipeMap.get(batch.recipe_id) || 'Unknown';
    if (!byRecipe[recipeName]) {
      byRecipe[recipeName] = { name: recipeName, count: 0, cost: 0 };
    }
    byRecipe[recipeName].count += 1;
    byRecipe[recipeName].cost += batch.total_cost;
  }

  return {
    totalBatches,
    completedBatches,
    cancelledBatches,
    completionRate: totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0,
    totalCost,
    averageCost: completedBatches > 0 ? totalCost / completedBatches : 0,
    byRecipe: Object.values(byRecipe).sort((a, b) => b.count - a.count),
  };
}

/**
 * Get cost breakdown by ingredient category (Pro only)
 */
export async function getCostBreakdownByCategory(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get completed batches
  const { data: batches, error: batchError } = await supabase
    .from('batches')
    .select('id')
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', startDate.toISOString());

  if (batchError) throw batchError;
  if (batches.length === 0) return [];

  const batchIds = batches.map((b) => b.id);

  // Get batch ingredients with costs
  const { data: batchIngredients, error: biError } = await supabase
    .from('batch_ingredients')
    .select('ingredient_id, actual_quantity, cost_at_time')
    .in('batch_id', batchIds);

  if (biError) throw biError;

  // Get ingredient categories
  const ingredientIds = [...new Set(batchIngredients.map((bi) => bi.ingredient_id))];
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('id, category')
    .in('id', ingredientIds);

  if (ingError) throw ingError;
  const categoryMap = new Map(ingredients.map((i) => [i.id, i.category || 'Uncategorized']));

  // Group by category
  const byCategory: Record<string, { category: string; cost: number }> = {};

  for (const bi of batchIngredients) {
    const category = categoryMap.get(bi.ingredient_id) || 'Uncategorized';
    const cost = bi.actual_quantity * bi.cost_at_time;

    if (!byCategory[category]) {
      byCategory[category] = { category, cost: 0 };
    }
    byCategory[category].cost += cost;
  }

  return Object.values(byCategory).sort((a, b) => b.cost - a.cost);
}

/**
 * Get recipe cost comparison (Pro only)
 */
export async function getRecipeCostComparison(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get completed batches with recipe info
  const { data: batches, error } = await supabase
    .from('batches')
    .select('recipe_id, total_cost, multiplier')
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', startDate.toISOString());

  if (error) throw error;
  if (batches.length === 0) return [];

  // Get recipe details
  const recipeIds = [...new Set(batches.map((b) => b.recipe_id))];
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('id, name, yield_quantity, yield_unit')
    .in('id', recipeIds);

  if (recipeError) throw recipeError;
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  // Calculate avg cost per unit for each recipe
  const recipeStats: Record<string, {
    name: string;
    avgCostPerUnit: number;
    totalBatches: number;
    totalCost: number;
    yieldUnit: string;
  }> = {};

  for (const batch of batches) {
    const recipe = recipeMap.get(batch.recipe_id);
    if (!recipe) continue;

    if (!recipeStats[recipe.id]) {
      recipeStats[recipe.id] = {
        name: recipe.name,
        avgCostPerUnit: 0,
        totalBatches: 0,
        totalCost: 0,
        yieldUnit: recipe.yield_unit,
      };
    }

    recipeStats[recipe.id].totalBatches += 1;
    recipeStats[recipe.id].totalCost += batch.total_cost;
  }

  // Calculate averages
  return Object.values(recipeStats)
    .map((stat) => ({
      ...stat,
      avgCostPerUnit: stat.totalCost / stat.totalBatches,
    }))
    .sort((a, b) => b.totalCost - a.totalCost);
}
