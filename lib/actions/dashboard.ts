'use server';

/**
 * Dashboard Server Actions
 * Fetch dashboard data and analytics
 */

import { createClient, getUserWithOrganization } from '@/lib/supabase/server';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Get total stock value and low stock count
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('stock_quantity, cost_per_unit, low_stock_threshold')
    .eq('organization_id', organization.id);

  if (ingError) throw ingError;

  const totalStockValue = ingredients.reduce(
    (sum, ing) => sum + ing.stock_quantity * ing.cost_per_unit,
    0
  );

  const lowStockCount = ingredients.filter(
    (ing) =>
      ing.low_stock_threshold !== null &&
      ing.stock_quantity <= ing.low_stock_threshold
  ).length;

  // Get active batches count
  const { count: activeBatches, error: batchError } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organization.id)
    .eq('status', 'in_progress');

  if (batchError) throw batchError;

  // Get today's completed batches
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayProduction, error: todayError } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', today.toISOString());

  if (todayError) throw todayError;

  return {
    totalStockValue,
    lowStockCount,
    activeBatches: activeBatches || 0,
    todayProduction: todayProduction || 0,
  };
}

/**
 * Get top ingredients by value
 */
export async function getTopIngredientsByValue(limit: number = 5) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, stock_quantity, cost_per_unit, usage_unit')
    .eq('organization_id', organization.id)
    .order('stock_quantity', { ascending: false });

  if (error) throw error;

  // Calculate value and sort
  const withValue = data.map((ing) => ({
    ...ing,
    totalValue: ing.stock_quantity * ing.cost_per_unit,
  }));

  withValue.sort((a, b) => b.totalValue - a.totalValue);

  return withValue.slice(0, limit);
}

/**
 * Get low stock ingredients for dashboard alerts
 */
export async function getDashboardLowStockAlerts() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, stock_quantity, low_stock_threshold, usage_unit')
    .eq('organization_id', organization.id)
    .not('low_stock_threshold', 'is', null);

  if (error) throw error;

  // Filter and sort by severity
  const lowStock = data.filter(
    (ing) => ing.stock_quantity <= (ing.low_stock_threshold || 0)
  );

  lowStock.sort((a, b) => {
    const aPercent = a.stock_quantity / (a.low_stock_threshold || 1);
    const bPercent = b.stock_quantity / (b.low_stock_threshold || 1);
    return aPercent - bPercent;
  });

  return lowStock;
}

/**
 * Get recent batches with recipe names
 */
export async function getRecentBatches(limit: number = 5) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Fetch batches
  const { data: batches, error: batchError } = await supabase
    .from('batches')
    .select('*')
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (batchError) throw batchError;

  // Fetch recipes for these batches
  const recipeIds = [...new Set(batches.map((b) => b.recipe_id))];
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('id, name')
    .in('id', recipeIds);

  if (recipeError) throw recipeError;

  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  // Combine data
  return batches.map((batch) => ({
    ...batch,
    recipe: recipeMap.get(batch.recipe_id) || null,
  }));
}
