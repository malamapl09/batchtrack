'use server';

/**
 * CSV Export Server Actions
 * Generate CSV exports for ingredients and recipes (Pro only)
 */

import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { getOrganizationPlan } from '@/lib/billing/check-limits';

/**
 * Export ingredients as CSV string
 * Gated behind Pro plan
 */
export async function exportIngredientsCsv(): Promise<{
  data?: string;
  error?: string;
  filename?: string;
}> {
  const planId = await getOrganizationPlan();
  if (planId !== 'pro') {
    return { error: 'CSV export is available on the Pro plan.' };
  }

  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('name, description, sku, category, stock_quantity, usage_unit, cost_per_unit, purchase_unit, units_per_purchase, low_stock_threshold')
    .eq('organization_id', organization.id)
    .order('name');

  if (error) {
    return { error: 'Failed to fetch ingredients.' };
  }

  const headers = [
    'Name',
    'Description',
    'SKU',
    'Category',
    'Stock Quantity',
    'Usage Unit',
    'Cost Per Unit',
    'Purchase Unit',
    'Units Per Purchase',
    'Low Stock Threshold',
  ];

  const rows = ingredients.map((ing) => [
    escapeCsvField(ing.name),
    escapeCsvField(ing.description || ''),
    escapeCsvField(ing.sku || ''),
    escapeCsvField(ing.category || ''),
    ing.stock_quantity.toString(),
    ing.usage_unit,
    ing.cost_per_unit.toString(),
    escapeCsvField(ing.purchase_unit),
    ing.units_per_purchase.toString(),
    ing.low_stock_threshold?.toString() || '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return {
    data: csv,
    filename: `batchtrack-ingredients-${new Date().toISOString().split('T')[0]}.csv`,
  };
}

/**
 * Export recipes as CSV string
 * Gated behind Pro plan
 */
export async function exportRecipesCsv(): Promise<{
  data?: string;
  error?: string;
  filename?: string;
}> {
  const planId = await getOrganizationPlan();
  if (planId !== 'pro') {
    return { error: 'CSV export is available on the Pro plan.' };
  }

  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('name, description, category, yield_quantity, yield_unit, total_cost, cost_per_unit, is_active')
    .eq('organization_id', organization.id)
    .order('name');

  if (error) {
    return { error: 'Failed to fetch recipes.' };
  }

  const headers = [
    'Name',
    'Description',
    'Category',
    'Yield Quantity',
    'Yield Unit',
    'Total Cost',
    'Cost Per Unit',
    'Active',
  ];

  const rows = recipes.map((recipe) => [
    escapeCsvField(recipe.name),
    escapeCsvField(recipe.description || ''),
    escapeCsvField(recipe.category || ''),
    recipe.yield_quantity.toString(),
    escapeCsvField(recipe.yield_unit),
    recipe.total_cost.toString(),
    recipe.cost_per_unit.toString(),
    recipe.is_active ? 'Yes' : 'No',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  return {
    data: csv,
    filename: `batchtrack-recipes-${new Date().toISOString().split('T')[0]}.csv`,
  };
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
