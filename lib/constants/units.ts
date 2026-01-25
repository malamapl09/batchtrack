/**
 * Unit System Constants
 * Defines all supported units and conversion factors
 */

import type { UnitType } from '@/types';

// Unit categories for grouping in UI
export const UNIT_CATEGORIES = {
  weight: ['g', 'kg', 'oz', 'lb'] as const,
  volume: ['ml', 'l', 'fl_oz', 'cup', 'gal'] as const,
  count: ['unit', 'dozen'] as const,
} as const;

// Human-readable unit labels
export const UNIT_LABELS: Record<UnitType, string> = {
  // Weight
  g: 'Grams',
  kg: 'Kilograms',
  oz: 'Ounces',
  lb: 'Pounds',
  // Volume
  ml: 'Milliliters',
  l: 'Liters',
  fl_oz: 'Fluid Ounces',
  cup: 'Cups',
  gal: 'Gallons',
  // Count
  unit: 'Units',
  dozen: 'Dozens',
};

// Short labels for display
export const UNIT_SHORT_LABELS: Record<UnitType, string> = {
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lb: 'lb',
  ml: 'mL',
  l: 'L',
  fl_oz: 'fl oz',
  cup: 'cup',
  gal: 'gal',
  unit: 'unit',
  dozen: 'doz',
};

/**
 * Conversion factors to base units
 * Weight base: grams (g)
 * Volume base: milliliters (ml)
 * Count base: units
 */
export const CONVERSION_TO_BASE: Record<UnitType, number> = {
  // Weight -> grams
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  // Volume -> milliliters
  ml: 1,
  l: 1000,
  fl_oz: 29.5735,
  cup: 236.588,
  gal: 3785.41,
  // Count -> units
  unit: 1,
  dozen: 12,
};

/**
 * Get the base unit for a given unit type
 */
export function getBaseUnit(unit: UnitType): UnitType {
  if (UNIT_CATEGORIES.weight.includes(unit as typeof UNIT_CATEGORIES.weight[number])) {
    return 'g';
  }
  if (UNIT_CATEGORIES.volume.includes(unit as typeof UNIT_CATEGORIES.volume[number])) {
    return 'ml';
  }
  return 'unit';
}

/**
 * Check if two units are compatible (same category)
 */
export function areUnitsCompatible(unit1: UnitType, unit2: UnitType): boolean {
  return getBaseUnit(unit1) === getBaseUnit(unit2);
}

/**
 * Get all units in the same category
 */
export function getCompatibleUnits(unit: UnitType): readonly UnitType[] {
  if (UNIT_CATEGORIES.weight.includes(unit as typeof UNIT_CATEGORIES.weight[number])) {
    return UNIT_CATEGORIES.weight;
  }
  if (UNIT_CATEGORIES.volume.includes(unit as typeof UNIT_CATEGORIES.volume[number])) {
    return UNIT_CATEGORIES.volume;
  }
  return UNIT_CATEGORIES.count;
}

/**
 * Get category label for a unit
 */
export function getUnitCategory(unit: UnitType): 'weight' | 'volume' | 'count' {
  if (UNIT_CATEGORIES.weight.includes(unit as typeof UNIT_CATEGORIES.weight[number])) {
    return 'weight';
  }
  if (UNIT_CATEGORIES.volume.includes(unit as typeof UNIT_CATEGORIES.volume[number])) {
    return 'volume';
  }
  return 'count';
}
