/**
 * Reports Page
 * Analytics and reporting dashboard
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Trash2, Factory, DollarSign, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import {
  getIngredientUsageOverTime,
  getCostTrends,
  getWasteAnalytics,
  getProductionSummary,
  getCostBreakdownByCategory,
  getRecipeCostComparison,
} from '@/lib/actions/reports';
import { getOrganizationPlan } from '@/lib/billing/check-limits';
import { formatCurrency } from '@/lib/utils/conversions';
import {
  CostTrendChart,
  UsageChart,
  WasteByReasonChart,
  ProductionByRecipeChart,
  WasteOverTimeChart,
  CostByCategoryChart,
  RecipeCostComparisonChart,
} from '@/components/reports/charts';
import { ProFeatureGate } from '@/components/billing';

export const metadata = {
  title: 'Reports | BatchTrack',
  description: 'View analytics and reports',
};

export default async function ReportsPage() {
  const [usageData, costData, wasteData, productionData, planId] = await Promise.all([
    getIngredientUsageOverTime(30),
    getCostTrends(30),
    getWasteAnalytics(30),
    getProductionSummary(30),
    getOrganizationPlan(),
  ]);

  // Fetch Pro-only data if on Pro plan
  const [categoryData, recipeCostData] = planId === 'pro'
    ? await Promise.all([
        getCostBreakdownByCategory(30),
        getRecipeCostComparison(30),
      ])
    : [[], []];

  const totalProductionCost = costData.reduce((sum, d) => sum + d.cost, 0);
  const totalBatches = costData.reduce((sum, d) => sum + d.batches, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Analytics and insights for the last 30 days
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Production Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProductionCost)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Batches</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionData.completedBatches}</div>
            <p className="text-xs text-muted-foreground">
              {productionData.completionRate.toFixed(0)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Batch Cost</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(productionData.averageCost)}</div>
            <p className="text-xs text-muted-foreground">Per completed batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waste Cost</CardTitle>
            <Trash2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wasteData.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              {wasteData.totalCost > 0 && totalProductionCost > 0
                ? `${((wasteData.totalCost / totalProductionCost) * 100).toFixed(1)}% of production`
                : 'No waste recorded'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="costs" className="space-y-4">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 sm:w-auto sm:flex-nowrap sm:h-10">
          <TabsTrigger value="costs" className="flex-1 sm:flex-none">Cost Trends</TabsTrigger>
          <TabsTrigger value="usage" className="flex-1 sm:flex-none">Usage</TabsTrigger>
          <TabsTrigger value="waste" className="flex-1 sm:flex-none">Waste</TabsTrigger>
          <TabsTrigger value="production" className="flex-1 sm:flex-none">Production</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 sm:flex-none">
            <Sparkles className="mr-1 h-3 w-3" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Cost Trends Tab */}
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daily Production Costs
              </CardTitle>
              <CardDescription>
                Total cost of completed batches per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {costData.some((d) => d.cost > 0) ? (
                <CostTrendChart data={costData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No production data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Ingredient Usage Over Time
              </CardTitle>
              <CardDescription>
                Total quantity and cost of ingredients used daily
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usageData.some((d) => d.quantity > 0) ? (
                <UsageChart data={usageData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No usage data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Tab */}
        <TabsContent value="waste" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Waste by Reason
                </CardTitle>
                <CardDescription>
                  Distribution of waste cost by reason
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wasteData.byReason.length > 0 ? (
                  <WasteByReasonChart data={wasteData.byReason} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No waste recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Over Time</CardTitle>
                <CardDescription>Daily waste costs</CardDescription>
              </CardHeader>
              <CardContent>
                {wasteData.overTime.some((d) => d.cost > 0) ? (
                  <WasteOverTimeChart data={wasteData.overTime} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No waste recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Wasted Ingredients */}
          {wasteData.byIngredient.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Wasted Ingredients</CardTitle>
                <CardDescription>Ingredients with highest waste cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteData.byIngredient.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-destructive">
                        {formatCurrency(item.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{productionData.completedBatches}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold">{productionData.cancelledBatches}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{productionData.totalBatches}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Production by Recipe
              </CardTitle>
              <CardDescription>
                Number of batches completed per recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productionData.byRecipe.length > 0 ? (
                <ProductionByRecipeChart data={productionData.byRecipe} />
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No production data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab (Pro) */}
        <TabsContent value="analytics" className="space-y-4">
          <ProFeatureGate planId={planId}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Cost by Category
                  </CardTitle>
                  <CardDescription>
                    Production cost breakdown by ingredient category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <CostByCategoryChart data={categoryData} />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Recipe Cost Comparison
                  </CardTitle>
                  <CardDescription>
                    Average cost per batch for each recipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recipeCostData.length > 0 ? (
                    <RecipeCostComparisonChart data={recipeCostData} />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ProFeatureGate>
        </TabsContent>
      </Tabs>
    </div>
  );
}
