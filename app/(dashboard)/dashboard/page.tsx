/**
 * Dashboard Page
 * Main dashboard with KPI cards and widgets
 */

import Link from 'next/link';
import {
  getDashboardStats,
  getTopIngredientsByValue,
  getDashboardLowStockAlerts,
  getRecentBatches,
} from '@/lib/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  DollarSign,
  AlertTriangle,
  Factory,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatQuantity } from '@/lib/utils/conversions';
import { UNIT_SHORT_LABELS, BATCH_STATUS_CONFIG } from '@/lib/constants';
import { LowStockAlertTrigger } from '@/components/dashboard';
import type { UnitType } from '@/types';

export const metadata = {
  title: 'Dashboard | BatchTrack',
  description: 'Your inventory and production overview',
};

export default async function DashboardPage() {
  const [stats, topIngredients, lowStockIngredients, recentBatches] = await Promise.all([
    getDashboardStats(),
    getTopIngredientsByValue(5),
    getDashboardLowStockAlerts(),
    getRecentBatches(5),
  ]);

  return (
    <div className="space-y-6">
      <LowStockAlertTrigger />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your inventory and production at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalStockValue)}
            </div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBatches}</div>
            <p className="text-xs text-muted-foreground">In production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayProduction}</div>
            <p className="text-xs text-muted-foreground">Batches completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Ingredients by Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Ingredients by Value</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ingredients">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topIngredients.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No ingredients yet
              </p>
            ) : (
              <div className="space-y-4">
                {topIngredients.map((ing) => (
                  <div key={ing.id} className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/ingredients/${ing.id}`}
                        className="font-medium hover:underline"
                      >
                        {ing.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatQuantity(ing.stock_quantity, ing.usage_unit as UnitType)}{' '}
                        {UNIT_SHORT_LABELS[ing.usage_unit as UnitType]}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(ing.totalValue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ingredients?lowStock=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockIngredients.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                All stock levels are healthy
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockIngredients.slice(0, 5).map((ing) => {
                  const percentage = (ing.stock_quantity / (ing.low_stock_threshold || 1)) * 100;
                  return (
                    <div key={ing.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/ingredients/${ing.id}`}
                          className="font-medium hover:underline"
                        >
                          {ing.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {formatQuantity(ing.stock_quantity, ing.usage_unit as UnitType)} /{' '}
                          {formatQuantity(ing.low_stock_threshold || 0, ing.usage_unit as UnitType)}{' '}
                          {UNIT_SHORT_LABELS[ing.usage_unit as UnitType]}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${
                            percentage < 25 ? 'bg-destructive' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Production</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/production">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No production batches yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentBatches.map((batch) => {
                const statusConfig = BATCH_STATUS_CONFIG[batch.status];
                return (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <Link
                          href={`/production/${batch.id}`}
                          className="font-medium hover:underline"
                        >
                          {batch.batch_number}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {batch.recipe?.name || 'Unknown Recipe'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {formatCurrency(batch.total_cost)}
                      </span>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
