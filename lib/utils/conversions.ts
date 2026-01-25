/**
 * Unit Conversion Engine
 * Core utility for converting between units and calculating costs
 */

import type { UnitType, Ingredient } from '@/types';
import { CONVERSION_TO_BASE, areUnitsCompatible, getBaseUnit } from '@/lib/constants/units';

/**
 * Convert a quantity from one unit to another
 * @throws Error if units are incompatible
 */
export function convertUnits(
  quantity: number,
  fromUnit: UnitType,
  toUnit: UnitType
): number {
  // Same unit, no conversion needed
  if (fromUnit === toUnit) {
    return quantity;
  }

  // Check compatibility
  if (!areUnitsCompatible(fromUnit, toUnit)) {
    throw new Error(
      `Cannot convert between ${fromUnit} and ${toUnit}: incompatible unit types`
    );
  }

  // Convert to base unit, then to target unit
  const baseQuantity = quantity * CONVERSION_TO_BASE[fromUnit];
  const result = baseQuantity / CONVERSION_TO_BASE[toUnit];

  return result;
}

/**
 * Calculate cost per usage unit from purchase information
 * @param purchaseUnitCost - Cost of one purchase unit (e.g., $50 for a bag)
 * @param unitsPerPurchase - Usage units per purchase unit (e.g., 50000g per bag)
 * @returns Cost per usage unit
 */
export function calculateCostPerUsageUnit(
  purchaseUnitCost: number,
  unitsPerPurchase: number
): number {
  if (unitsPerPurchase <= 0) {
    throw new Error('Units per purchase must be greater than 0');
  }
  return purchaseUnitCost / unitsPerPurchase;
}

/**
 * Calculate total stock value from ingredients
 */
export function calculateStockValue(ingredients: Ingredient[]): number {
  return ingredients.reduce((total, ingredient) => {
    return total + ingredient.stock_quantity * ingredient.cost_per_unit;
  }, 0);
}

/**
 * Calculate the cost of using a quantity of an ingredient
 */
export function calculateIngredientCost(
  ingredient: Ingredient,
  quantity: number
): number {
  return quantity * ingredient.cost_per_unit;
}

/**
 * Convert purchase units to stock units
 * Used when receiving inventory
 */
export function purchaseToStock(
  purchaseQuantity: number,
  unitsPerPurchase: number
): number {
  return purchaseQuantity * unitsPerPurchase;
}

/**
 * Format a quantity with appropriate precision
 * Small quantities (< 1) get more decimal places
 */
export function formatQuantity(quantity: number, unit: UnitType): string {
  const baseUnit = getBaseUnit(unit);

  // For weight/volume, show more precision for small amounts
  if (baseUnit === 'g' || baseUnit === 'ml') {
    if (quantity < 0.01) {
      return quantity.toFixed(4);
    }
    if (quantity < 1) {
      return quantity.toFixed(3);
    }
    if (quantity < 100) {
      return quantity.toFixed(2);
    }
    return quantity.toFixed(1);
  }

  // For count units
  if (Number.isInteger(quantity)) {
    return quantity.toString();
  }
  return quantity.toFixed(2);
}

/**
 * Format currency value
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format cost per unit with appropriate precision
 * Very small costs (e.g., $0.001/g) need more decimal places
 */
export function formatCostPerUnit(cost: number): string {
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`;
  }
  if (cost < 0.1) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * Check if ingredient is at or below low stock threshold
 */
export function isLowStock(ingredient: Ingredient): boolean {
  if (ingredient.low_stock_threshold === null) {
    return false;
  }
  return ingredient.stock_quantity <= ingredient.low_stock_threshold;
}

/**
 * Calculate stock percentage relative to threshold
 * Returns null if no threshold is set
 */
export function getStockPercentage(ingredient: Ingredient): number | null {
  if (ingredient.low_stock_threshold === null || ingredient.low_stock_threshold === 0) {
    return null;
  }
  return (ingredient.stock_quantity / ingredient.low_stock_threshold) * 100;
}
