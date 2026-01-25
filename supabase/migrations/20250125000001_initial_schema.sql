-- BatchTrack Initial Schema
-- Creates the core tables for multi-tenant inventory management

-- =============================================================================
-- Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Organizations (Tenants)
-- =============================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for slug lookups
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- =============================================================================
-- Users (linked to Supabase Auth)
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for organization lookups
CREATE INDEX idx_users_organization_id ON users(organization_id);

-- =============================================================================
-- Suppliers
-- =============================================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_suppliers_organization_id ON suppliers(organization_id);

-- =============================================================================
-- Ingredients
-- =============================================================================
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    -- Stock tracking (in usage units)
    stock_quantity DECIMAL(15,4) NOT NULL DEFAULT 0,
    low_stock_threshold DECIMAL(15,4),
    -- Unit configuration
    purchase_unit TEXT NOT NULL,           -- e.g., "bag", "case"
    usage_unit TEXT NOT NULL,              -- e.g., "g", "ml", "unit"
    units_per_purchase DECIMAL(15,4) NOT NULL, -- e.g., 50000 (50kg = 50000g)
    -- Cost tracking (cost per usage unit)
    cost_per_unit DECIMAL(15,6) NOT NULL DEFAULT 0,
    -- Relations
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraints
    CONSTRAINT positive_stock CHECK (stock_quantity >= 0),
    CONSTRAINT positive_units_per_purchase CHECK (units_per_purchase > 0),
    CONSTRAINT positive_cost CHECK (cost_per_unit >= 0)
);

CREATE INDEX idx_ingredients_organization_id ON ingredients(organization_id);
CREATE INDEX idx_ingredients_supplier_id ON ingredients(supplier_id);
CREATE INDEX idx_ingredients_category ON ingredients(organization_id, category);
CREATE INDEX idx_ingredients_low_stock ON ingredients(organization_id, stock_quantity, low_stock_threshold);

-- =============================================================================
-- Ingredient Purchases (cost history)
-- =============================================================================
CREATE TABLE ingredient_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    quantity DECIMAL(15,4) NOT NULL,       -- In purchase units
    unit_cost DECIMAL(15,4) NOT NULL,      -- Cost per purchase unit
    total_cost DECIMAL(15,2) NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_purchase_quantity CHECK (quantity > 0),
    CONSTRAINT positive_unit_cost CHECK (unit_cost > 0)
);

CREATE INDEX idx_ingredient_purchases_ingredient_id ON ingredient_purchases(ingredient_id);
CREATE INDEX idx_ingredient_purchases_organization_id ON ingredient_purchases(organization_id);
CREATE INDEX idx_ingredient_purchases_date ON ingredient_purchases(organization_id, purchase_date);

-- =============================================================================
-- Recipes
-- =============================================================================
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    yield_quantity DECIMAL(15,4) NOT NULL DEFAULT 1,
    yield_unit TEXT NOT NULL DEFAULT 'unit',
    -- Computed cost fields
    total_cost DECIMAL(15,4) NOT NULL DEFAULT 0,
    cost_per_unit DECIMAL(15,4) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_yield CHECK (yield_quantity > 0)
);

CREATE INDEX idx_recipes_organization_id ON recipes(organization_id);
CREATE INDEX idx_recipes_category ON recipes(organization_id, category);
CREATE INDEX idx_recipes_active ON recipes(organization_id, is_active);

-- =============================================================================
-- Recipe Ingredients (Bill of Materials)
-- =============================================================================
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity DECIMAL(15,4) NOT NULL,       -- In ingredient's usage unit
    notes TEXT,
    CONSTRAINT positive_recipe_quantity CHECK (quantity > 0),
    UNIQUE(recipe_id, ingredient_id)
);

CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);

-- =============================================================================
-- Batches (Production runs)
-- =============================================================================
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE RESTRICT,
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')),
    multiplier DECIMAL(10,4) NOT NULL DEFAULT 1,
    total_cost DECIMAL(15,4) NOT NULL DEFAULT 0,
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_multiplier CHECK (multiplier > 0)
);

CREATE INDEX idx_batches_organization_id ON batches(organization_id);
CREATE INDEX idx_batches_recipe_id ON batches(recipe_id);
CREATE INDEX idx_batches_status ON batches(organization_id, status);
CREATE INDEX idx_batches_created_at ON batches(organization_id, created_at);

-- =============================================================================
-- Batch Ingredients (actual usage per batch)
-- =============================================================================
CREATE TABLE batch_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    planned_quantity DECIMAL(15,4) NOT NULL,
    actual_quantity DECIMAL(15,4) NOT NULL,
    cost_at_time DECIMAL(15,6) NOT NULL,   -- Snapshot of cost_per_unit when batch was created
    UNIQUE(batch_id, ingredient_id)
);

CREATE INDEX idx_batch_ingredients_batch_id ON batch_ingredients(batch_id);
CREATE INDEX idx_batch_ingredients_ingredient_id ON batch_ingredients(ingredient_id);

-- =============================================================================
-- Waste Logs
-- =============================================================================
CREATE TABLE waste_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    quantity DECIMAL(15,4) NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('dropped', 'expired', 'defective', 'spillage', 'other')),
    notes TEXT,
    logged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_waste_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_waste_logs_organization_id ON waste_logs(organization_id);
CREATE INDEX idx_waste_logs_ingredient_id ON waste_logs(ingredient_id);
CREATE INDEX idx_waste_logs_batch_id ON waste_logs(batch_id);
CREATE INDEX idx_waste_logs_created_at ON waste_logs(organization_id, created_at);

-- =============================================================================
-- Updated At Trigger Function
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at
    BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
    BEFORE UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user's organization ID
CREATE OR REPLACE FUNCTION auth.organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their own organization"
    ON organizations FOR SELECT
    USING (id = auth.organization_id());

CREATE POLICY "Owners can update their organization"
    ON organizations FOR UPDATE
    USING (id = auth.organization_id())
    WITH CHECK (id = auth.organization_id());

-- Users: Can see users in same organization
CREATE POLICY "Users can view users in their organization"
    ON users FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert themselves during signup"
    ON users FOR INSERT
    WITH CHECK (id = auth.uid());

-- Suppliers: Organization-scoped CRUD
CREATE POLICY "Users can view suppliers in their organization"
    ON suppliers FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create suppliers in their organization"
    ON suppliers FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can update suppliers in their organization"
    ON suppliers FOR UPDATE
    USING (organization_id = auth.organization_id())
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete suppliers in their organization"
    ON suppliers FOR DELETE
    USING (organization_id = auth.organization_id());

-- Ingredients: Organization-scoped CRUD
CREATE POLICY "Users can view ingredients in their organization"
    ON ingredients FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create ingredients in their organization"
    ON ingredients FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can update ingredients in their organization"
    ON ingredients FOR UPDATE
    USING (organization_id = auth.organization_id())
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete ingredients in their organization"
    ON ingredients FOR DELETE
    USING (organization_id = auth.organization_id());

-- Ingredient Purchases: Organization-scoped CRUD
CREATE POLICY "Users can view purchases in their organization"
    ON ingredient_purchases FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create purchases in their organization"
    ON ingredient_purchases FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete purchases in their organization"
    ON ingredient_purchases FOR DELETE
    USING (organization_id = auth.organization_id());

-- Recipes: Organization-scoped CRUD
CREATE POLICY "Users can view recipes in their organization"
    ON recipes FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create recipes in their organization"
    ON recipes FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can update recipes in their organization"
    ON recipes FOR UPDATE
    USING (organization_id = auth.organization_id())
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete recipes in their organization"
    ON recipes FOR DELETE
    USING (organization_id = auth.organization_id());

-- Recipe Ingredients: Access through recipe
CREATE POLICY "Users can view recipe ingredients"
    ON recipe_ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM recipes r
            WHERE r.id = recipe_ingredients.recipe_id
            AND r.organization_id = auth.organization_id()
        )
    );

CREATE POLICY "Users can manage recipe ingredients"
    ON recipe_ingredients FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM recipes r
            WHERE r.id = recipe_ingredients.recipe_id
            AND r.organization_id = auth.organization_id()
        )
    );

-- Batches: Organization-scoped CRUD
CREATE POLICY "Users can view batches in their organization"
    ON batches FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create batches in their organization"
    ON batches FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can update batches in their organization"
    ON batches FOR UPDATE
    USING (organization_id = auth.organization_id())
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete batches in their organization"
    ON batches FOR DELETE
    USING (organization_id = auth.organization_id());

-- Batch Ingredients: Access through batch
CREATE POLICY "Users can view batch ingredients"
    ON batch_ingredients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM batches b
            WHERE b.id = batch_ingredients.batch_id
            AND b.organization_id = auth.organization_id()
        )
    );

CREATE POLICY "Users can manage batch ingredients"
    ON batch_ingredients FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM batches b
            WHERE b.id = batch_ingredients.batch_id
            AND b.organization_id = auth.organization_id()
        )
    );

-- Waste Logs: Organization-scoped CRUD
CREATE POLICY "Users can view waste logs in their organization"
    ON waste_logs FOR SELECT
    USING (organization_id = auth.organization_id());

CREATE POLICY "Users can create waste logs in their organization"
    ON waste_logs FOR INSERT
    WITH CHECK (organization_id = auth.organization_id());

CREATE POLICY "Users can delete waste logs in their organization"
    ON waste_logs FOR DELETE
    USING (organization_id = auth.organization_id());
