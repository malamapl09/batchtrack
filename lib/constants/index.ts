/**
 * Application Constants
 * Central export for all constants
 */

export * from './units';

// Application metadata
export const APP_NAME = 'BatchTrack';
export const APP_DESCRIPTION = 'Inventory management for small production businesses';

// Batch status configuration
export const BATCH_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
  },
} as const;

// Waste reasons
export const WASTE_REASONS = {
  dropped: 'Dropped / Spilled',
  expired: 'Expired',
  defective: 'Defective / Quality Issue',
  spillage: 'Spillage During Use',
  other: 'Other',
} as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;

// Stock alert thresholds
export const STOCK_ALERT_LEVELS = {
  critical: 0.1, // 10% of threshold
  low: 0.25, // 25% of threshold
  warning: 0.5, // 50% of threshold
} as const;

// Ingredient categories (default suggestions)
export const DEFAULT_INGREDIENT_CATEGORIES = [
  'Flours & Grains',
  'Sugars & Sweeteners',
  'Dairy',
  'Fats & Oils',
  'Leaveners',
  'Flavorings & Extracts',
  'Fruits & Vegetables',
  'Nuts & Seeds',
  'Spices',
  'Other',
] as const;

// Recipe categories (default suggestions)
export const DEFAULT_RECIPE_CATEGORIES = [
  'Breads',
  'Pastries',
  'Cakes',
  'Cookies',
  'Beverages',
  'Sauces',
  'Other',
] as const;
