'use server';

/**
 * Data Import Server Actions
 * CSV import for ingredients and recipes
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

export interface IngredientImportRow {
  name: string;
  description?: string;
  sku?: string;
  purchase_unit: string;
  usage_unit: string;
  units_per_purchase: string;
  cost_per_unit: string;
  stock_quantity?: string;
  low_stock_threshold?: string;
  category?: string;
}

export interface RecipeImportRow {
  name: string;
  description?: string;
  category?: string;
  yield_quantity: string;
  yield_unit: string;
}

/**
 * Parse CSV string into rows
 */
function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split('\n');
  return lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/**
 * Validate ingredient row
 */
function validateIngredientRow(row: Record<string, string>, rowNum: number): string | null {
  if (!row.name?.trim()) {
    return `Row ${rowNum}: Name is required`;
  }
  if (!row.purchase_unit?.trim()) {
    return `Row ${rowNum}: Purchase unit is required`;
  }
  if (!row.usage_unit?.trim()) {
    return `Row ${rowNum}: Usage unit is required`;
  }
  const unitsPerPurchase = parseFloat(row.units_per_purchase);
  if (isNaN(unitsPerPurchase) || unitsPerPurchase <= 0) {
    return `Row ${rowNum}: Units per purchase must be a positive number`;
  }
  const costPerUnit = parseFloat(row.cost_per_unit);
  if (isNaN(costPerUnit) || costPerUnit < 0) {
    return `Row ${rowNum}: Cost per unit must be a non-negative number`;
  }
  return null;
}

/**
 * Import ingredients from CSV
 */
export async function importIngredients(csvContent: string): Promise<ImportResult> {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return { success: false, imported: 0, errors: [{ row: 0, message: 'CSV must have a header row and at least one data row' }] };
  }

  // Get headers
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const dataRows = rows.slice(1);

  const errors: { row: number; message: string }[] = [];
  const toInsert: {
    organization_id: string;
    name: string;
    description: string | null;
    sku: string | null;
    purchase_unit: string;
    usage_unit: string;
    units_per_purchase: number;
    cost_per_unit: number;
    stock_quantity: number;
    low_stock_threshold: number | null;
    category: string | null;
  }[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const rowData = dataRows[i];
    const rowNum = i + 2; // Account for header and 1-based indexing

    // Skip empty rows
    if (rowData.every((cell) => !cell.trim())) continue;

    // Map row to object
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = rowData[idx] || '';
    });

    // Validate
    const error = validateIngredientRow(row, rowNum);
    if (error) {
      errors.push({ row: rowNum, message: error });
      continue;
    }

    toInsert.push({
      organization_id: organization.id,
      name: row.name.trim(),
      description: row.description?.trim() || null,
      sku: row.sku?.trim() || null,
      purchase_unit: row.purchase_unit.trim(),
      usage_unit: row.usage_unit.trim(),
      units_per_purchase: parseFloat(row.units_per_purchase),
      cost_per_unit: parseFloat(row.cost_per_unit),
      stock_quantity: row.stock_quantity ? parseFloat(row.stock_quantity) : 0,
      low_stock_threshold: row.low_stock_threshold ? parseFloat(row.low_stock_threshold) : null,
      category: row.category?.trim() || null,
    });
  }

  // Insert valid rows
  if (toInsert.length > 0) {
    const { error } = await supabase.from('ingredients').insert(toInsert);
    if (error) {
      return { success: false, imported: 0, errors: [{ row: 0, message: `Database error: ${error.message}` }] };
    }
  }

  revalidatePath('/ingredients');

  return {
    success: errors.length === 0,
    imported: toInsert.length,
    errors,
  };
}

/**
 * Validate recipe row
 */
function validateRecipeRow(row: Record<string, string>, rowNum: number): string | null {
  if (!row.name?.trim()) {
    return `Row ${rowNum}: Name is required`;
  }
  const yieldQuantity = parseFloat(row.yield_quantity);
  if (isNaN(yieldQuantity) || yieldQuantity <= 0) {
    return `Row ${rowNum}: Yield quantity must be a positive number`;
  }
  if (!row.yield_unit?.trim()) {
    return `Row ${rowNum}: Yield unit is required`;
  }
  return null;
}

/**
 * Import recipes from CSV (basic recipe info only, ingredients added separately)
 */
export async function importRecipes(csvContent: string): Promise<ImportResult> {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return { success: false, imported: 0, errors: [{ row: 0, message: 'CSV must have a header row and at least one data row' }] };
  }

  // Get headers
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const dataRows = rows.slice(1);

  const errors: { row: number; message: string }[] = [];
  const toInsert: {
    organization_id: string;
    name: string;
    description: string | null;
    category: string | null;
    yield_quantity: number;
    yield_unit: string;
    total_cost: number;
    cost_per_unit: number;
  }[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const rowData = dataRows[i];
    const rowNum = i + 2;

    // Skip empty rows
    if (rowData.every((cell) => !cell.trim())) continue;

    // Map row to object
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = rowData[idx] || '';
    });

    // Validate
    const error = validateRecipeRow(row, rowNum);
    if (error) {
      errors.push({ row: rowNum, message: error });
      continue;
    }

    toInsert.push({
      organization_id: organization.id,
      name: row.name.trim(),
      description: row.description?.trim() || null,
      category: row.category?.trim() || null,
      yield_quantity: parseFloat(row.yield_quantity),
      yield_unit: row.yield_unit.trim(),
      total_cost: 0, // Will be calculated when ingredients are added
      cost_per_unit: 0,
    });
  }

  // Insert valid rows
  if (toInsert.length > 0) {
    const { error } = await supabase.from('recipes').insert(toInsert);
    if (error) {
      return { success: false, imported: 0, errors: [{ row: 0, message: `Database error: ${error.message}` }] };
    }
  }

  revalidatePath('/recipes');

  return {
    success: errors.length === 0,
    imported: toInsert.length,
    errors,
  };
}

/**
 * Generate sample CSV template for ingredients
 */
export async function getIngredientCSVTemplate(): Promise<string> {
  const headers = [
    'name',
    'description',
    'sku',
    'purchase_unit',
    'usage_unit',
    'units_per_purchase',
    'cost_per_unit',
    'stock_quantity',
    'low_stock_threshold',
    'category',
  ];

  const sampleRow = [
    'All-Purpose Flour',
    'General baking flour',
    'FLOUR-AP-001',
    'bag',
    'g',
    '25000',
    '0.0008',
    '50000',
    '10000',
    'Dry Goods',
  ];

  return [headers.join(','), sampleRow.join(',')].join('\n');
}

/**
 * Generate sample CSV template for recipes
 */
export async function getRecipeCSVTemplate(): Promise<string> {
  const headers = ['name', 'description', 'category', 'yield_quantity', 'yield_unit'];
  const sampleRow = ['Sourdough Bread', 'Classic sourdough loaf', 'Breads', '2', 'loaves'];

  return [headers.join(','), sampleRow.join(',')].join('\n');
}
