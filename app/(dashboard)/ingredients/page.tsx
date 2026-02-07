/**
 * Ingredients List Page
 * Displays all ingredients with search and filtering
 */

import Link from 'next/link';
import { getIngredients } from '@/lib/actions/ingredients';
import { exportIngredientsCsv } from '@/lib/actions/export';
import { checkIngredientLimit, getOrganizationPlan } from '@/lib/billing/check-limits';
import { IngredientTable } from '@/components/ingredients';
import { UpgradePromptCard, LimitWarning } from '@/components/billing';
import { ExportButton } from '@/components/export-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export const metadata = {
  title: 'Ingredients | BatchTrack',
  description: 'Manage your raw materials and inventory',
};

interface IngredientsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function IngredientsPage({ searchParams }: IngredientsPageProps) {
  const params = await searchParams;
  const [ingredients, limitCheck, planId] = await Promise.all([
    getIngredients({
      search: params.search,
      category: params.category,
    }),
    checkIngredientLimit(),
    getOrganizationPlan(),
  ]);

  // Calculate totals
  const totalValue = ingredients.reduce(
    (sum, ing) => sum + ing.stock_quantity * ing.cost_per_unit,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ingredients</h1>
          <p className="text-muted-foreground">
            {ingredients.length} items · ${totalValue.toFixed(2)} total value
          </p>
          {limitCheck.allowed && (
            <LimitWarning
              resource="ingredients"
              remaining={limitCheck.remaining}
              limit={limitCheck.limit}
            />
          )}
        </div>
        {limitCheck.allowed ? (
          <div className="flex items-center gap-2">
            {planId === 'pro' && (
              <ExportButton exportAction={exportIngredientsCsv} label="Export CSV" />
            )}
            <Button asChild>
              <Link href="/ingredients/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Ingredient
              </Link>
            </Button>
          </div>
        ) : (
          <UpgradePromptCard
            resource="ingredients"
            currentCount={limitCheck.currentCount}
            limit={limitCheck.limit}
            planId={limitCheck.planId}
          />
        )}
      </div>

      {/* Search */}
      <form className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search ingredients..."
            defaultValue={params.search}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {/* Table */}
      <IngredientTable ingredients={ingredients} />
    </div>
  );
}
