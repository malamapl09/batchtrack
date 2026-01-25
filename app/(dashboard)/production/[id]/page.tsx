/**
 * Batch Detail Page
 * View and manage a single production batch
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBatch } from '@/lib/actions/batches';
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
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { formatCurrency, formatQuantity } from '@/lib/utils/conversions';
import { BATCH_STATUS_CONFIG, UNIT_SHORT_LABELS } from '@/lib/constants';
import type { UnitType } from '@/types';
import { BatchActions } from './batch-actions';

interface BatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BatchDetailPageProps) {
  const { id } = await params;
  try {
    const batch = await getBatch(id);
    return { title: `Batch ${batch.batch_number} | BatchTrack` };
  } catch {
    return { title: 'Batch | BatchTrack' };
  }
}

export default async function BatchDetailPage({ params }: BatchDetailPageProps) {
  const { id } = await params;

  let batch;
  try {
    batch = await getBatch(id);
  } catch {
    notFound();
  }

  const statusConfig = BATCH_STATUS_CONFIG[batch.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/production">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{batch.batch_number}</h1>
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            </div>
            <p className="text-muted-foreground">{batch.recipe?.name}</p>
          </div>
        </div>
        <BatchActions batch={batch} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Multiplier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batch.multiplier}x</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(batch.total_cost)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batch.recipe ? batch.recipe.yield_quantity * batch.multiplier : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {batch.recipe?.yield_unit}
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
              {batch.recipe
                ? formatCurrency(batch.total_cost / (batch.recipe.yield_quantity * batch.multiplier))
                : '$0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(batch.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {batch.started_at && (
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Started</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(batch.started_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {batch.completed_at && (
              <div className="flex items-center gap-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(batch.completed_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ingredients Used */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients Used</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Line Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.batch_ingredients.map((bi) => {
                if (!bi.ingredient) return null;
                const usageUnit = bi.ingredient.usage_unit as UnitType;
                const lineCost = bi.actual_quantity * bi.cost_at_time;

                return (
                  <TableRow key={bi.id}>
                    <TableCell>
                      <Link
                        href={`/ingredients/${bi.ingredient.id}`}
                        className="font-medium hover:underline"
                      >
                        {bi.ingredient.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatQuantity(bi.planned_quantity, usageUnit)}{' '}
                      {UNIT_SHORT_LABELS[usageUnit]}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatQuantity(bi.actual_quantity, usageUnit)}{' '}
                      {UNIT_SHORT_LABELS[usageUnit]}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(bi.cost_at_time)}/{UNIT_SHORT_LABELS[usageUnit]}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lineCost)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={4} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(batch.total_cost)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {batch.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{batch.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
