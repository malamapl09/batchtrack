'use server';

/**
 * Recipe Server Actions
 * CRUD operations for recipes and bill of materials
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { checkRecipeLimit } from '@/lib/billing/check-limits';
import type { RecipeFormData } from '@/types';

/**
 * Calculate recipe cost from ingredients
 */
function calculateRecipeCost(
  ingredients: { quantity: number; cost_per_unit: number }[]
): number {
  return ingredients.reduce((total, ing) => total + ing.quantity * ing.cost_per_unit, 0);
}

/**
 * Get all recipes for the current organization
 */
export async function getRecipes(options?: {
  search?: string;
  category?: string;
  activeOnly?: boolean;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  let query = supabase
    .from('recipes')
    .select('*')
    .eq('organization_id', organization.id)
    .order('name');

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get a single recipe with its ingredients
 */
export async function getRecipe(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (recipeError) throw recipeError;

  // Get recipe ingredients
  const { data: recipeIngredients, error: riError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', id);

  if (riError) throw riError;

  // Get ingredient details
  const ingredientIds = recipeIngredients.map((ri) => ri.ingredient_id);
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .in('id', ingredientIds);

  if (ingredientsError) throw ingredientsError;
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  return {
    ...recipe,
    ingredients: recipeIngredients.map((ri) => ({
      ...ri,
      ingredient: ingredientMap.get(ri.ingredient_id) || null,
    })),
  };
}

/**
 * Create a new recipe
 */
export async function createRecipe(formData: RecipeFormData) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Check plan limits before creating
  const limitCheck = await checkRecipeLimit();
  if (!limitCheck.allowed) {
    return {
      error: 'limit_exceeded' as const,
      resource: 'recipes' as const,
      ...limitCheck,
    };
  }

  // Get ingredient costs for calculation
  const ingredientIds = formData.ingredients.map((i) => i.ingredient_id);
  const { data: ingredientData, error: fetchError } = await supabase
    .from('ingredients')
    .select('id, cost_per_unit')
    .in('id', ingredientIds);

  if (fetchError) throw fetchError;

  // Create cost map
  const costMap = new Map(ingredientData.map((i) => [i.id, i.cost_per_unit]));

  // Calculate total cost
  const totalCost = formData.ingredients.reduce((sum, ing) => {
    const costPerUnit = costMap.get(ing.ingredient_id) || 0;
    return sum + ing.quantity * costPerUnit;
  }, 0);

  const costPerUnit = totalCost / formData.yield_quantity;

  // Create recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      organization_id: organization.id,
      name: formData.name,
      description: formData.description || null,
      category: formData.category || null,
      yield_quantity: formData.yield_quantity,
      yield_unit: formData.yield_unit,
      total_cost: totalCost,
      cost_per_unit: costPerUnit,
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  // Create recipe ingredients
  const recipeIngredientsData = formData.ingredients.map((ing) => ({
    recipe_id: recipe.id,
    ingredient_id: ing.ingredient_id,
    quantity: ing.quantity,
    notes: ing.notes || null,
  }));

  const { error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .insert(recipeIngredientsData);

  if (ingredientsError) {
    // Cleanup: delete the recipe we just created
    await supabase.from('recipes').delete().eq('id', recipe.id);
    throw ingredientsError;
  }

  revalidatePath('/recipes');
  return recipe;
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(id: string, formData: RecipeFormData) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  // Get ingredient costs for calculation
  const ingredientIds = formData.ingredients.map((i) => i.ingredient_id);
  const { data: ingredientData, error: fetchError } = await supabase
    .from('ingredients')
    .select('id, cost_per_unit')
    .in('id', ingredientIds);

  if (fetchError) throw fetchError;

  // Create cost map
  const costMap = new Map(ingredientData.map((i) => [i.id, i.cost_per_unit]));

  // Calculate total cost
  const totalCost = formData.ingredients.reduce((sum, ing) => {
    const costPerUnit = costMap.get(ing.ingredient_id) || 0;
    return sum + ing.quantity * costPerUnit;
  }, 0);

  const costPerUnit = totalCost / formData.yield_quantity;

  // Update recipe
  const { error: recipeError } = await supabase
    .from('recipes')
    .update({
      name: formData.name,
      description: formData.description || null,
      category: formData.category || null,
      yield_quantity: formData.yield_quantity,
      yield_unit: formData.yield_unit,
      total_cost: totalCost,
      cost_per_unit: costPerUnit,
    })
    .eq('id', id);

  if (recipeError) throw recipeError;

  // Delete existing recipe ingredients
  const { error: deleteError } = await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', id);

  if (deleteError) throw deleteError;

  // Insert new recipe ingredients
  const recipeIngredientsData = formData.ingredients.map((ing) => ({
    recipe_id: id,
    ingredient_id: ing.ingredient_id,
    quantity: ing.quantity,
    notes: ing.notes || null,
  }));

  const { error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .insert(recipeIngredientsData);

  if (ingredientsError) throw ingredientsError;

  revalidatePath('/recipes');
  revalidatePath(`/recipes/${id}`);
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase.from('recipes').delete().eq('id', id);

  if (error) throw error;

  revalidatePath('/recipes');
}

/**
 * Toggle recipe active status
 */
export async function toggleRecipeActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase
    .from('recipes')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/recipes');
  revalidatePath(`/recipes/${id}`);
}

/**
 * Recalculate all recipe costs
 * Call this when ingredient prices change
 */
export async function recalculateRecipeCosts() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Get all recipes with their ingredients
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, yield_quantity')
    .eq('organization_id', organization.id);

  if (recipesError) throw recipesError;

  for (const recipe of recipes) {
    // Get recipe ingredients
    const { data: recipeIngredients, error: riError } = await supabase
      .from('recipe_ingredients')
      .select('quantity, ingredient_id')
      .eq('recipe_id', recipe.id);

    if (riError) continue;

    // Get ingredient costs
    const ingredientIds = recipeIngredients.map((ri) => ri.ingredient_id);
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('id, cost_per_unit')
      .in('id', ingredientIds);

    if (ingError) continue;
    const costMap = new Map(ingredients.map((i) => [i.id, i.cost_per_unit]));

    // Calculate new total cost
    const totalCost = recipeIngredients.reduce((sum, ri) => {
      const cost = costMap.get(ri.ingredient_id) || 0;
      return sum + ri.quantity * cost;
    }, 0);

    const costPerUnit = totalCost / recipe.yield_quantity;

    // Update recipe
    await supabase
      .from('recipes')
      .update({ total_cost: totalCost, cost_per_unit: costPerUnit })
      .eq('id', recipe.id);
  }

  revalidatePath('/recipes');
}

/**
 * Get recipe categories for the organization
 */
export async function getRecipeCategories() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('recipes')
    .select('category')
    .eq('organization_id', organization.id)
    .not('category', 'is', null);

  if (error) throw error;

  const categories = [...new Set(data.map((d) => d.category).filter(Boolean))];
  return categories as string[];
}
