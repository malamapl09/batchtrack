'use server';

/**
 * Waste Log Server Actions
 * Track and manage ingredient waste
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization, getUser } from '@/lib/supabase/server';
import type { WasteReason } from '@/types';

/**
 * Get waste logs for the organization
 */
export async function getWasteLogs(options?: {
  ingredientId?: string;
  batchId?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  let query = supabase
    .from('waste_logs')
    .select('*')
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  if (options?.ingredientId) {
    query = query.eq('ingredient_id', options.ingredientId);
  }

  if (options?.batchId) {
    query = query.eq('batch_id', options.batchId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: wasteLogs, error } = await query;
  if (error) throw error;

  // Fetch ingredients for the waste logs
  const ingredientIds = [...new Set(wasteLogs.map((w) => w.ingredient_id))];
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('id, name, usage_unit')
    .in('id', ingredientIds);

  if (ingError) throw ingError;
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  return wasteLogs.map((log) => ({
    ...log,
    ingredient: ingredientMap.get(log.ingredient_id) || null,
  }));
}

/**
 * Log waste for an ingredient
 */
export async function logWaste(data: {
  ingredientId: string;
  quantity: number;
  reason: WasteReason;
  batchId?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();
  const user = await getUser();

  // Get current stock
  const { data: ingredient, error: fetchError } = await supabase
    .from('ingredients')
    .select('stock_quantity')
    .eq('id', data.ingredientId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new stock (cannot go below 0)
  const newStock = Math.max(0, ingredient.stock_quantity - data.quantity);

  // Create waste log
  const { error: logError } = await supabase.from('waste_logs').insert({
    organization_id: organization.id,
    ingredient_id: data.ingredientId,
    batch_id: data.batchId || null,
    quantity: data.quantity,
    reason: data.reason,
    notes: data.notes || null,
    logged_by: user.id,
  });

  if (logError) throw logError;

  // Update ingredient stock
  const { error: updateError } = await supabase
    .from('ingredients')
    .update({ stock_quantity: newStock })
    .eq('id', data.ingredientId);

  if (updateError) throw updateError;

  revalidatePath('/ingredients');
  revalidatePath(`/ingredients/${data.ingredientId}`);
  revalidatePath('/production');
  if (data.batchId) {
    revalidatePath(`/production/${data.batchId}`);
  }
}

/**
 * Get waste summary for the organization
 */
export async function getWasteSummary(days: number = 30) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: wasteLogs, error } = await supabase
    .from('waste_logs')
    .select('quantity, reason, ingredient_id')
    .eq('organization_id', organization.id)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  // Fetch ingredients for cost calculation
  const ingredientIds = [...new Set(wasteLogs.map((w) => w.ingredient_id))];
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('id, cost_per_unit')
    .in('id', ingredientIds);

  if (ingError) throw ingError;
  const costMap = new Map(ingredients.map((i) => [i.id, i.cost_per_unit]));

  // Calculate totals by reason
  const byReason: Record<string, number> = {};
  let totalCost = 0;

  for (const log of wasteLogs) {
    const cost = log.quantity * (costMap.get(log.ingredient_id) || 0);
    totalCost += cost;
    byReason[log.reason] = (byReason[log.reason] || 0) + cost;
  }

  return {
    totalCost,
    byReason,
    logCount: wasteLogs.length,
  };
}
