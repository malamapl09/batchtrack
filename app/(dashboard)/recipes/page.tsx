/**
 * Recipes List Page
 * Displays all recipes with search and filtering
 */

import Link from 'next/link';
import { getRecipes } from '@/lib/actions/recipes';
import { exportRecipesCsv } from '@/lib/actions/export';
import { checkRecipeLimit, getOrganizationPlan } from '@/lib/billing/check-limits';
import { RecipeTable } from '@/components/recipes';
import { UpgradePromptCard, LimitWarning } from '@/components/billing';
import { ExportButton } from '@/components/export-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export const metadata = {
  title: 'Recipes | BatchTrack',
  description: 'Manage your recipes and bill of materials',
};

interface RecipesPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const [recipes, limitCheck, planId] = await Promise.all([
    getRecipes({
      search: params.search,
      category: params.category,
    }),
    checkRecipeLimit(),
    getOrganizationPlan(),
  ]);

  // Calculate totals
  const activeRecipes = recipes.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-muted-foreground">
            {recipes.length} recipes · {activeRecipes} active
          </p>
          {limitCheck.allowed && (
            <LimitWarning
              resource="recipes"
              remaining={limitCheck.remaining}
              limit={limitCheck.limit}
            />
          )}
        </div>
        {limitCheck.allowed ? (
          <div className="flex items-center gap-2">
            {planId === 'pro' && (
              <ExportButton exportAction={exportRecipesCsv} label="Export CSV" />
            )}
            <Button asChild>
              <Link href="/recipes/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Recipe
              </Link>
            </Button>
          </div>
        ) : (
          <UpgradePromptCard
            resource="recipes"
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
            placeholder="Search recipes..."
            defaultValue={params.search}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {/* Table */}
      <RecipeTable recipes={recipes} />
    </div>
  );
}
