/**
 * Recipe Detail Page
 * View and manage a single recipe with cost breakdown
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecipe } from '@/lib/actions/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, ArrowLeft, Play } from 'lucide-react';
import { formatCurrency, formatQuantity } from '@/lib/utils/conversions';
import { UNIT_SHORT_LABELS } from '@/lib/constants';
import type { UnitType } from '@/types';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  try {
    const recipe = await getRecipe(id);
    return { title: `${recipe.name} | BatchTrack` };
  } catch {
    return { title: 'Recipe | BatchTrack' };
  }
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;

  let recipe;
  try {
    recipe = await getRecipe(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/recipes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{recipe.name}</h1>
              <Badge variant={recipe.is_active ? 'default' : 'secondary'}>
                {recipe.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {recipe.category && (
              <p className="text-muted-foreground">{recipe.category}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/recipes/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/production/new?recipe=${id}`}>
              <Play className="mr-2 h-4 w-4" />
              Start Batch
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recipe.yield_quantity}
            </div>
            <p className="text-xs text-muted-foreground">
              {recipe.yield_unit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(recipe.total_cost)}
            </div>
            <p className="text-xs text-muted-foreground">per batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost per Unit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(recipe.cost_per_unit)}
            </div>
            <p className="text-xs text-muted-foreground">
              per {recipe.yield_unit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recipe.ingredients.length}
            </div>
            <p className="text-xs text-muted-foreground">items</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {recipe.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{recipe.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bill of Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Line Cost</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients.map((ri) => {
                if (!ri.ingredient) return null;
                const usageUnit = ri.ingredient.usage_unit as UnitType;
                const lineCost = ri.quantity * ri.ingredient.cost_per_unit;
                const percentage = (lineCost / recipe.total_cost) * 100;

                return (
                  <TableRow key={ri.id}>
                    <TableCell>
                      <Link
                        href={`/ingredients/${ri.ingredient.id}`}
                        className="font-medium hover:underline"
                      >
                        {ri.ingredient.name}
                      </Link>
                      {ri.notes && (
                        <p className="text-xs text-muted-foreground">{ri.notes}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatQuantity(ri.quantity, usageUnit)}{' '}
                      {UNIT_SHORT_LABELS[usageUnit]}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(ri.ingredient.cost_per_unit)}/{UNIT_SHORT_LABELS[usageUnit]}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lineCost)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(recipe.total_cost)}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
