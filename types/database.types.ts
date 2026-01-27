/**
 * Database Types
 * Auto-generated types should replace this file using:
 * npx supabase gen types typescript --linked > types/database.types.ts
 *
 * For now, these are manually defined to match the schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'free' | 'starter' | 'pro';
          paddle_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: 'free' | 'starter' | 'pro';
          paddle_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: 'free' | 'starter' | 'pro';
          paddle_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          paddle_customer_id: string;
          paddle_subscription_id: string;
          plan: 'starter' | 'pro';
          status: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          paddle_customer_id: string;
          paddle_subscription_id: string;
          plan: 'starter' | 'pro';
          status: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          paddle_customer_id?: string;
          paddle_subscription_id?: string;
          plan?: 'starter' | 'pro';
          status?: 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          organization_id: string | null;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      suppliers: {
        Row: {
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
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ingredients: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          sku: string | null;
          stock_quantity: number;
          low_stock_threshold: number | null;
          purchase_unit: string;
          usage_unit: string;
          units_per_purchase: number;
          cost_per_unit: number;
          supplier_id: string | null;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          purchase_unit: string;
          usage_unit: string;
          units_per_purchase: number;
          cost_per_unit?: number;
          supplier_id?: string | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          purchase_unit?: string;
          usage_unit?: string;
          units_per_purchase?: number;
          cost_per_unit?: number;
          supplier_id?: string | null;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ingredient_purchases: {
        Row: {
          id: string;
          ingredient_id: string;
          organization_id: string;
          quantity: number;
          unit_cost: number;
          total_cost: number;
          purchase_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ingredient_id: string;
          organization_id: string;
          quantity: number;
          unit_cost: number;
          total_cost: number;
          purchase_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ingredient_id?: string;
          organization_id?: string;
          quantity?: number;
          unit_cost?: number;
          total_cost?: number;
          purchase_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          category: string | null;
          yield_quantity: number;
          yield_unit: string;
          total_cost: number;
          cost_per_unit: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          yield_quantity?: number;
          yield_unit?: string;
          total_cost?: number;
          cost_per_unit?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          yield_quantity?: number;
          yield_unit?: string;
          total_cost?: number;
          cost_per_unit?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          ingredient_id?: string;
          quantity?: number;
          notes?: string | null;
        };
        Relationships: [];
      };
      batches: {
        Row: {
          id: string;
          organization_id: string;
          recipe_id: string;
          batch_number: string;
          status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
          multiplier: number;
          total_cost: number;
          notes: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          recipe_id: string;
          batch_number: string;
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled';
          multiplier?: number;
          total_cost?: number;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          recipe_id?: string;
          batch_number?: string;
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled';
          multiplier?: number;
          total_cost?: number;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      batch_ingredients: {
        Row: {
          id: string;
          batch_id: string;
          ingredient_id: string;
          planned_quantity: number;
          actual_quantity: number;
          cost_at_time: number;
        };
        Insert: {
          id?: string;
          batch_id: string;
          ingredient_id: string;
          planned_quantity: number;
          actual_quantity: number;
          cost_at_time: number;
        };
        Update: {
          id?: string;
          batch_id?: string;
          ingredient_id?: string;
          planned_quantity?: number;
          actual_quantity?: number;
          cost_at_time?: number;
        };
        Relationships: [];
      };
      waste_logs: {
        Row: {
          id: string;
          organization_id: string;
          ingredient_id: string;
          batch_id: string | null;
          quantity: number;
          reason: 'dropped' | 'expired' | 'defective' | 'spillage' | 'other';
          notes: string | null;
          logged_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          ingredient_id: string;
          batch_id?: string | null;
          quantity: number;
          reason: 'dropped' | 'expired' | 'defective' | 'spillage' | 'other';
          notes?: string | null;
          logged_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          ingredient_id?: string;
          batch_id?: string | null;
          quantity?: number;
          reason?: 'dropped' | 'expired' | 'defective' | 'spillage' | 'other';
          notes?: string | null;
          logged_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
