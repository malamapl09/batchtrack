/**
 * BatchTrack TypeScript Type Definitions
 * Central type definitions for the application
 */

// =============================================================================
// Database Types (maps to Supabase schema)
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro';
  paddle_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  sku: string | null;
  // Stock tracking
  stock_quantity: number; // In usage units
  low_stock_threshold: number | null;
  // Unit configuration
  purchase_unit: string; // e.g., "bag", "case"
  usage_unit: UnitType; // e.g., "g", "ml", "unit"
  units_per_purchase: number; // e.g., 50000 (50kg bag = 50000g)
  // Cost tracking (cost per usage unit)
  cost_per_unit: number;
  // Relations
  supplier_id: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface IngredientPurchase {
  id: string;
  ingredient_id: string;
  organization_id: string;
  quantity: number; // In purchase units
  unit_cost: number; // Cost per purchase unit
  total_cost: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
}

export interface Recipe {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  category: string | null;
  yield_quantity: number; // How many units this recipe produces
  yield_unit: string; // e.g., "loaves", "liters", "units"
  // Computed fields
  total_cost: number;
  cost_per_unit: number; // total_cost / yield_quantity
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number; // In the ingredient's usage unit
  notes: string | null;
  // Joined data (not stored)
  ingredient?: Ingredient;
}

export interface Batch {
  id: string;
  organization_id: string;
  recipe_id: string;
  // Batch details
  batch_number: string; // Auto-generated: YYYYMMDD-XXX
  status: BatchStatus;
  multiplier: number; // Scale factor (1 = single batch)
  // Cost tracking
  total_cost: number;
  // Timestamps
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  recipe?: Recipe;
  batch_ingredients?: BatchIngredient[];
}

export interface BatchIngredient {
  id: string;
  batch_id: string;
  ingredient_id: string;
  // Planned vs actual
  planned_quantity: number;
  actual_quantity: number;
  cost_at_time: number; // Snapshot of cost when batch was created
  // Joined data
  ingredient?: Ingredient;
}

export interface WasteLog {
  id: string;
  organization_id: string;
  ingredient_id: string;
  batch_id: string | null;
  quantity: number;
  reason: WasteReason;
  notes: string | null;
  logged_by: string; // User ID
  created_at: string;
  // Joined data
  ingredient?: Ingredient;
}

// =============================================================================
// Enums and Constants
// =============================================================================

export type UnitType =
  // Weight
  | 'g' | 'kg' | 'oz' | 'lb'
  // Volume
  | 'ml' | 'l' | 'fl_oz' | 'cup' | 'gal'
  // Count
  | 'unit' | 'dozen';

export type BatchStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export type WasteReason = 'dropped' | 'expired' | 'defective' | 'spillage' | 'other';

// =============================================================================
// Form Types
// =============================================================================

export interface IngredientFormData {
  name: string;
  description?: string;
  sku?: string;
  purchase_unit: string;
  usage_unit: UnitType;
  units_per_purchase: number;
  cost_per_unit: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  supplier_id?: string;
  category?: string;
}

export interface RecipeFormData {
  name: string;
  description?: string;
  category?: string;
  yield_quantity: number;
  yield_unit: string;
  ingredients: {
    ingredient_id: string;
    quantity: number;
    notes?: string;
  }[];
}

export interface BatchFormData {
  recipe_id: string;
  multiplier: number;
  notes?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface DashboardStats {
  totalStockValue: number;
  lowStockCount: number;
  activeBatches: number;
  todayProduction: number;
}

export interface TopIngredient {
  id: string;
  name: string;
  totalValue: number;
  stockQuantity: number;
  usageUnit: UnitType;
}

