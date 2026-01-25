/**
 * Ingredients List Page
 * Displays all ingredients with search and filtering
 */

import Link from 'next/link';
import { getIngredients } from '@/lib/actions/ingredients';
import { IngredientTable } from '@/components/ingredients';
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
  const ingredients = await getIngredients({
    search: params.search,
    category: params.category,
  });

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
        </div>
        <Button asChild>
          <Link href="/ingredients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Ingredient
          </Link>
        </Button>
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
