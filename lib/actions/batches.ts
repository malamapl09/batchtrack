'use server';

/**
 * Batch Production Server Actions
 * CRUD operations for production batches with inventory management
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization, getUser } from '@/lib/supabase/server';
import { generateBatchNumber } from '@/lib/utils';
import type { BatchStatus } from '@/types';

/**
 * Get all batches for the current organization
 */
export async function getBatches(options?: {
  status?: BatchStatus;
  recipeId?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  let query = supabase
    .from('batches')
    .select('*')
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.recipeId) {
    query = query.eq('recipe_id', options.recipeId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: batches, error } = await query;
  if (error) throw error;

  // Fetch recipes for batches
  const recipeIds = [...new Set(batches.map((b) => b.recipe_id))];
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('id, name')
    .in('id', recipeIds);

  if (recipeError) throw recipeError;
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  return batches.map((batch) => ({
    ...batch,
    recipe: recipeMap.get(batch.recipe_id) || null,
  }));
}

/**
 * Get a single batch with details
 */
export async function getBatch(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data: batch, error: batchError } = await supabase
    .from('batches')
    .select('*')
    .eq('id', id)
    .single();

  if (batchError) throw batchError;

  // Get recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', batch.recipe_id)
    .single();

  if (recipeError) throw recipeError;

  // Get batch ingredients
  const { data: batchIngredients, error: biError } = await supabase
    .from('batch_ingredients')
    .select('*')
    .eq('batch_id', id);

  if (biError) throw biError;

  // Get ingredients for batch ingredients
  const ingredientIds = batchIngredients.map((bi) => bi.ingredient_id);
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .in('id', ingredientIds);

  if (ingredientsError) throw ingredientsError;

  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  return {
    ...batch,
    recipe,
    batch_ingredients: batchIngredients.map((bi) => ({
      ...bi,
      ingredient: ingredientMap.get(bi.ingredient_id) || null,
    })),
  };
}

/**
 * Create a new batch (draft or in_progress)
 */
export async function createBatch(data: {
  recipeId: string;
  multiplier: number;
  notes?: string;
  startImmediately?: boolean;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();
  const user = await getUser();

  // Get recipe with ingredients
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', data.recipeId)
    .single();

  if (recipeError) throw recipeError;

  // Get recipe ingredients
  const { data: recipeIngredients, error: riError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', data.recipeId);

  if (riError) throw riError;

  // Get ingredients for the recipe
  const ingredientIds = recipeIngredients.map((ri) => ri.ingredient_id);
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('*')
    .in('id', ingredientIds);

  if (ingError) throw ingError;
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  // Generate batch number
  const batchNumber = generateBatchNumber();

  // Calculate total cost
  const totalCost = recipeIngredients.reduce((sum, ri) => {
    const ingredient = ingredientMap.get(ri.ingredient_id);
    if (!ingredient) return sum;
    return sum + ri.quantity * data.multiplier * ingredient.cost_per_unit;
  }, 0);

  const status = data.startImmediately ? 'in_progress' : 'draft';

  // Create batch
  const { data: batch, error: batchError } = await supabase
    .from('batches')
    .insert({
      organization_id: organization.id,
      recipe_id: data.recipeId,
      batch_number: batchNumber,
      status,
      multiplier: data.multiplier,
      total_cost: totalCost,
      notes: data.notes || null,
      started_at: data.startImmediately ? new Date().toISOString() : null,
      created_by: user.id,
    })
    .select()
    .single();

  if (batchError) throw batchError;

  // Create batch ingredients
  const batchIngredientsData = recipeIngredients.map((ri) => {
    const ingredient = ingredientMap.get(ri.ingredient_id);
    const plannedQuantity = ri.quantity * data.multiplier;
    return {
      batch_id: batch.id,
      ingredient_id: ri.ingredient_id,
      planned_quantity: plannedQuantity,
      actual_quantity: plannedQuantity, // Default to planned
      cost_at_time: ingredient?.cost_per_unit || 0,
    };
  });

  const { error: biError } = await supabase
    .from('batch_ingredients')
    .insert(batchIngredientsData);

  if (biError) {
    // Cleanup
    await supabase.from('batches').delete().eq('id', batch.id);
    throw biError;
  }

  // If starting immediately, decrement inventory
  if (data.startImmediately) {
    await decrementInventoryForBatch(batch.id);
  }

  revalidatePath('/production');
  revalidatePath('/ingredients');
  return batch;
}

/**
 * Start a batch (move from draft to in_progress)
 */
export async function startBatch(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  // Get batch
  const { data: batch, error: fetchError } = await supabase
    .from('batches')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  if (batch.status !== 'draft') {
    throw new Error('Can only start batches in draft status');
  }

  // Update status
  const { error: updateError } = await supabase
    .from('batches')
    .update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) throw updateError;

  // Decrement inventory
  await decrementInventoryForBatch(id);

  revalidatePath('/production');
  revalidatePath(`/production/${id}`);
  revalidatePath('/ingredients');
}

/**
 * Complete a batch
 */
export async function completeBatch(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase
    .from('batches')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/production');
  revalidatePath(`/production/${id}`);
}

/**
 * Cancel a batch
 */
export async function cancelBatch(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  // Get batch
  const { data: batch, error: fetchError } = await supabase
    .from('batches')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // If in_progress, we need to restore inventory
  if (batch.status === 'in_progress') {
    await restoreInventoryForBatch(id);
  }

  const { error: updateError } = await supabase
    .from('batches')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (updateError) throw updateError;

  revalidatePath('/production');
  revalidatePath(`/production/${id}`);
  revalidatePath('/ingredients');
}

/**
 * Update actual quantity used for a batch ingredient
 */
export async function updateBatchIngredientQuantity(
  batchId: string,
  ingredientId: string,
  actualQuantity: number
) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase
    .from('batch_ingredients')
    .update({ actual_quantity: actualQuantity })
    .eq('batch_id', batchId)
    .eq('ingredient_id', ingredientId);

  if (error) throw error;

  revalidatePath(`/production/${batchId}`);
}

/**
 * Internal: Decrement inventory when batch starts
 */
async function decrementInventoryForBatch(batchId: string) {
  const supabase = await createClient();

  // Get batch ingredients
  const { data: batchIngredients, error } = await supabase
    .from('batch_ingredients')
    .select('ingredient_id, actual_quantity')
    .eq('batch_id', batchId);

  if (error) throw error;

  // Decrement each ingredient
  for (const bi of batchIngredients) {
    const { data: ingredient, error: ingError } = await supabase
      .from('ingredients')
      .select('stock_quantity')
      .eq('id', bi.ingredient_id)
      .single();

    if (ingError) continue;

    const newQuantity = Math.max(0, ingredient.stock_quantity - bi.actual_quantity);

    await supabase
      .from('ingredients')
      .update({ stock_quantity: newQuantity })
      .eq('id', bi.ingredient_id);
  }
}

/**
 * Internal: Restore inventory when batch is cancelled
 */
async function restoreInventoryForBatch(batchId: string) {
  const supabase = await createClient();

  // Get batch ingredients
  const { data: batchIngredients, error } = await supabase
    .from('batch_ingredients')
    .select('ingredient_id, actual_quantity')
    .eq('batch_id', batchId);

  if (error) throw error;

  // Restore each ingredient
  for (const bi of batchIngredients) {
    const { data: ingredient, error: ingError } = await supabase
      .from('ingredients')
      .select('stock_quantity')
      .eq('id', bi.ingredient_id)
      .single();

    if (ingError) continue;

    const newQuantity = ingredient.stock_quantity + bi.actual_quantity;

    await supabase
      .from('ingredients')
      .update({ stock_quantity: newQuantity })
      .eq('id', bi.ingredient_id);
  }
}

/**
 * Get active batches count
 */
export async function getActiveBatchesCount() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { count, error } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organization.id)
    .eq('status', 'in_progress');

  if (error) throw error;
  return count || 0;
}

/**
 * Get today's completed batches
 */
export async function getTodayCompletedBatches() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('organization_id', organization.id)
    .eq('status', 'completed')
    .gte('completed_at', today.toISOString());

  if (error) throw error;
  return data;
}
