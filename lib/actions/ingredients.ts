'use server';

/**
 * Ingredient Server Actions
 * CRUD operations for ingredients with proper authorization
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { calculateCostPerUsageUnit, purchaseToStock } from '@/lib/utils/conversions';
import { checkIngredientLimit } from '@/lib/billing/check-limits';
import type { IngredientFormData } from '@/types';

/**
 * Get all ingredients for the current organization
 */
export async function getIngredients(options?: {
  search?: string;
  category?: string;
  lowStockOnly?: boolean;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  let query = supabase
    .from('ingredients')
    .select('*')
    .eq('organization_id', organization.id)
    .order('name');

  // Apply filters
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,sku.ilike.%${options.search}%`);
  }

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.lowStockOnly) {
    query = query.lte('stock_quantity', 'low_stock_threshold');
  }

  const { data: ingredients, error } = await query;
  if (error) throw error;

  // Fetch suppliers for ingredients that have one
  const supplierIds = [...new Set(ingredients.filter(i => i.supplier_id).map(i => i.supplier_id!))];

  let supplierMap = new Map<string, { id: string; name: string }>();
  if (supplierIds.length > 0) {
    const { data: suppliers, error: supplierError } = await supabase
      .from('suppliers')
      .select('id, name')
      .in('id', supplierIds);

    if (supplierError) throw supplierError;
    supplierMap = new Map(suppliers.map(s => [s.id, s]));
  }

  return ingredients.map(ing => ({
    ...ing,
    supplier: ing.supplier_id ? supplierMap.get(ing.supplier_id) || null : null,
  }));
}

/**
 * Get a single ingredient by ID
 */
export async function getIngredient(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data: ingredient, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  // Fetch supplier if exists
  let supplier: { id: string; name: string } | null = null;
  if (ingredient.supplier_id) {
    const { data: supplierData, error: supplierError } = await supabase
      .from('suppliers')
      .select('id, name')
      .eq('id', ingredient.supplier_id)
      .single();

    if (!supplierError && supplierData) {
      supplier = supplierData;
    }
  }

  return {
    ...ingredient,
    supplier,
  };
}

/**
 * Create a new ingredient
 */
export async function createIngredient(formData: IngredientFormData) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Check plan limits before creating
  const limitCheck = await checkIngredientLimit();
  if (!limitCheck.allowed) {
    return {
      error: 'limit_exceeded' as const,
      resource: 'ingredients' as const,
      ...limitCheck,
    };
  }

  const { data, error } = await supabase
    .from('ingredients')
    .insert({
      organization_id: organization.id,
      name: formData.name,
      description: formData.description || null,
      sku: formData.sku || null,
      purchase_unit: formData.purchase_unit,
      usage_unit: formData.usage_unit,
      units_per_purchase: formData.units_per_purchase,
      cost_per_unit: formData.cost_per_unit,
      stock_quantity: formData.stock_quantity,
      low_stock_threshold: formData.low_stock_threshold || null,
      supplier_id: formData.supplier_id || null,
      category: formData.category || null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/ingredients');
  return data;
}

/**
 * Update an existing ingredient
 */
export async function updateIngredient(id: string, formData: Partial<IngredientFormData>) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data, error } = await supabase
    .from('ingredients')
    .update({
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      purchase_unit: formData.purchase_unit,
      usage_unit: formData.usage_unit,
      units_per_purchase: formData.units_per_purchase,
      cost_per_unit: formData.cost_per_unit,
      stock_quantity: formData.stock_quantity,
      low_stock_threshold: formData.low_stock_threshold,
      supplier_id: formData.supplier_id,
      category: formData.category,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/ingredients');
  revalidatePath(`/ingredients/${id}`);
  return data;
}

/**
 * Delete an ingredient
 */
export async function deleteIngredient(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/ingredients');
}

/**
 * Adjust stock quantity (add or subtract)
 */
export async function adjustStock(
  ingredientId: string,
  adjustment: number,
  reason: string
) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Get current stock
  const { data: ingredient, error: fetchError } = await supabase
    .from('ingredients')
    .select('stock_quantity')
    .eq('id', ingredientId)
    .single();

  if (fetchError) throw fetchError;

  const newQuantity = ingredient.stock_quantity + adjustment;

  if (newQuantity < 0) {
    throw new Error('Cannot reduce stock below zero');
  }

  // Update stock
  const { error: updateError } = await supabase
    .from('ingredients')
    .update({ stock_quantity: newQuantity })
    .eq('id', ingredientId);

  if (updateError) throw updateError;

  // If adjustment is negative, log as waste
  if (adjustment < 0) {
    await supabase.from('waste_logs').insert({
      organization_id: organization.id,
      ingredient_id: ingredientId,
      quantity: Math.abs(adjustment),
      reason: 'other',
      notes: reason,
    });
  }

  revalidatePath('/ingredients');
  revalidatePath(`/ingredients/${ingredientId}`);
}

/**
 * Record a purchase and update stock
 */
export async function recordPurchase(data: {
  ingredientId: string;
  purchaseQuantity: number; // In purchase units
  unitCost: number; // Cost per purchase unit
  purchaseDate?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  // Get ingredient for conversion
  const { data: ingredient, error: fetchError } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', data.ingredientId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new values
  const stockToAdd = purchaseToStock(data.purchaseQuantity, ingredient.units_per_purchase);
  const totalCost = data.purchaseQuantity * data.unitCost;
  const newCostPerUnit = calculateCostPerUsageUnit(data.unitCost, ingredient.units_per_purchase);

  // Start a transaction by doing sequential updates
  // Record the purchase
  const { error: purchaseError } = await supabase.from('ingredient_purchases').insert({
    ingredient_id: data.ingredientId,
    organization_id: organization.id,
    quantity: data.purchaseQuantity,
    unit_cost: data.unitCost,
    total_cost: totalCost,
    purchase_date: data.purchaseDate || new Date().toISOString().split('T')[0],
    notes: data.notes || null,
  });

  if (purchaseError) throw purchaseError;

  // Update ingredient stock and cost
  const { error: updateError } = await supabase
    .from('ingredients')
    .update({
      stock_quantity: ingredient.stock_quantity + stockToAdd,
      cost_per_unit: newCostPerUnit, // Update to latest cost
    })
    .eq('id', data.ingredientId);

  if (updateError) throw updateError;

  revalidatePath('/ingredients');
  revalidatePath(`/ingredients/${data.ingredientId}`);
}

/**
 * Get low stock ingredients
 */
export async function getLowStockIngredients() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('organization_id', organization.id)
    .not('low_stock_threshold', 'is', null)
    .filter('stock_quantity', 'lte', 'low_stock_threshold')
    .order('stock_quantity');

  if (error) throw error;
  return data;
}

/**
 * Get ingredient categories for the organization
 */
export async function getIngredientCategories() {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('ingredients')
    .select('category')
    .eq('organization_id', organization.id)
    .not('category', 'is', null);

  if (error) throw error;

  // Extract unique categories
  const categories = [...new Set(data.map((d) => d.category).filter(Boolean))];
  return categories as string[];
}

/**
 * Get purchase/cost history for an ingredient
 */
export async function getIngredientCostHistory(ingredientId: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data, error } = await supabase
    .from('ingredient_purchases')
    .select('*')
    .eq('ingredient_id', ingredientId)
    .order('purchase_date', { ascending: true });

  if (error) throw error;

  return data.map((purchase) => ({
    date: purchase.purchase_date,
    cost: purchase.unit_cost,
    quantity: purchase.quantity,
    totalCost: purchase.total_cost,
    notes: purchase.notes,
  }));
}
