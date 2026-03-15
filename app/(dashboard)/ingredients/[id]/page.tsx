/**
 * Ingredient Detail Page
 * View and manage a single ingredient
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIngredient, getIngredientCostHistory } from '@/lib/actions/ingredients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatQuantity, formatCostPerUnit, isLowStock, formatCurrency } from '@/lib/utils/conversions';
import { UNIT_LABELS, UNIT_SHORT_LABELS } from '@/lib/constants';
import { IngredientCostHistoryChart } from '@/components/reports/charts';
import { LogWasteDialog } from '@/components/ingredients/log-waste-dialog';
import type { UnitType } from '@/types';

interface IngredientDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IngredientDetailPageProps) {
  const { id } = await params;
  try {
    const ingredient = await getIngredient(id);
    return { title: `${ingredient.name} | BatchTrack` };
  } catch {
    return { title: 'Ingredient | BatchTrack' };
  }
}

export default async function IngredientDetailPage({ params }: IngredientDetailPageProps) {
  const { id } = await params;

  let ingredient;
  let costHistory;
  try {
    [ingredient, costHistory] = await Promise.all([
      getIngredient(id),
      getIngredientCostHistory(id),
    ]);
  } catch {
    notFound();
  }

  const usageUnit = ingredient.usage_unit as UnitType;
  const lowStock = isLowStock(ingredient as never);
  const stockValue = ingredient.stock_quantity * ingredient.cost_per_unit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/ingredients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{ingredient.name}</h1>
              {lowStock && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Low Stock
                </Badge>
              )}
            </div>
            {ingredient.sku && (
              <p className="text-muted-foreground">SKU: {ingredient.sku}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <LogWasteDialog
            ingredientId={id}
            ingredientName={ingredient.name}
            usageUnit={UNIT_SHORT_LABELS[usageUnit] || usageUnit}
            currentStock={ingredient.stock_quantity}
          />
          <Button asChild>
            <Link href={`/ingredients/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatQuantity(ingredient.stock_quantity, usageUnit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {UNIT_LABELS[usageUnit]}
            </p>
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
              {formatCostPerUnit(ingredient.cost_per_unit)}
            </div>
            <p className="text-xs text-muted-foreground">
              per {UNIT_SHORT_LABELS[usageUnit]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stockValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">total value on hand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ingredient.low_stock_threshold
                ? formatQuantity(ingredient.low_stock_threshold, usageUnit)
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {ingredient.low_stock_threshold
                ? UNIT_LABELS[usageUnit]
                : 'No alert set'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredient.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{ingredient.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p>{ingredient.category || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Supplier</p>
              <p>{ingredient.supplier?.name || '—'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unit Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Purchase Unit</p>
              <p>{ingredient.purchase_unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usage Unit</p>
              <p>{UNIT_LABELS[usageUnit]}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Units per Purchase</p>
              <p>
                1 {ingredient.purchase_unit} = {ingredient.units_per_purchase.toLocaleString()}{' '}
                {UNIT_SHORT_LABELS[usageUnit]}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cost History
          </CardTitle>
          <CardDescription>
            Track cost per unit changes from purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {costHistory.length > 0 ? (
            <div className="space-y-4">
              <IngredientCostHistoryChart data={costHistory} />
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Date</th>
                      <th className="px-4 py-2 text-right font-medium">Cost/Unit</th>
                      <th className="px-4 py-2 text-right font-medium hidden sm:table-cell">Quantity</th>
                      <th className="px-4 py-2 text-right font-medium hidden sm:table-cell">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costHistory.slice().reverse().slice(0, 10).map((entry, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          {formatCurrency(entry.cost)}
                        </td>
                        <td className="px-4 py-2 text-right hidden sm:table-cell">
                          {entry.quantity}
                        </td>
                        <td className="px-4 py-2 text-right hidden sm:table-cell">
                          {formatCurrency(entry.totalCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {costHistory.length > 10 && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center border-t">
                    Showing latest 10 of {costHistory.length} purchases
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No purchase history yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Record purchases to track cost changes over time
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
