/**
 * Feature Mockup Components
 * Styled placeholder components that visually represent each feature's UI
 * Used on the /features marketing page
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Factory,
} from 'lucide-react';

/**
 * Ingredients Mockup
 * Displays a mock table showing ingredient tracking with unit conversions
 */
export function IngredientsMockup() {
  const mockIngredients = [
    { name: 'All-Purpose Flour', stock: '45.2 kg', cost: '$0.89/kg', value: '$40.23' },
    { name: 'Butter (Unsalted)', stock: '12.5 kg', cost: '$8.50/kg', value: '$106.25' },
    { name: 'Vanilla Extract', stock: '850 ml', cost: '$0.12/ml', value: '$102.00' },
  ];

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Ingredients</span>
        </div>
        <Badge variant="secondary" className="text-xs">3 items</Badge>
      </div>

      {/* Table */}
      <div className="divide-y">
        {mockIngredients.map((ing, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{ing.name}</p>
              <p className="text-xs text-muted-foreground">{ing.cost}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{ing.stock}</p>
              <p className="text-xs text-muted-foreground">{ing.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-muted/30 px-4 py-2 border-t">
        <p className="text-xs text-muted-foreground text-right">
          Total Value: <span className="font-medium text-foreground">$248.48</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Recipes Mockup
 * Shows a recipe card with ingredient list and cost breakdown
 */
export function RecipesMockup() {
  const mockRecipe = {
    name: 'Chocolate Chip Cookies',
    yield: '48 cookies',
    ingredients: [
      { name: 'Flour', qty: '500g', cost: '$0.45' },
      { name: 'Butter', qty: '250g', cost: '$2.13' },
      { name: 'Sugar', qty: '200g', cost: '$0.24' },
      { name: 'Chocolate Chips', qty: '300g', cost: '$4.50' },
    ],
    totalCost: '$7.32',
    costPerUnit: '$0.15',
  };

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{mockRecipe.name}</h4>
          <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Yields: {mockRecipe.yield}</p>
      </div>

      {/* Ingredients */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ingredients</p>
        <div className="space-y-1">
          {mockRecipe.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{ing.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{ing.qty}</span>
                <span className="font-medium w-12 text-right">{ing.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-primary/5 px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Batch Cost</p>
            <p className="text-lg font-bold">{mockRecipe.totalCost}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cost per Cookie</p>
            <p className="text-lg font-bold text-primary">{mockRecipe.costPerUnit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Production Mockup
 * Displays a batch production checklist view
 */
export function ProductionMockup() {
  const mockBatch = {
    number: 'BATCH-2025-0142',
    recipe: 'Sourdough Bread',
    status: 'In Progress',
    ingredients: [
      { name: 'Bread Flour', qty: '2.5 kg', checked: true },
      { name: 'Water', qty: '1.8 L', checked: true },
      { name: 'Salt', qty: '50g', checked: true },
      { name: 'Starter', qty: '400g', checked: false },
    ],
  };

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm">{mockBatch.number}</span>
          </div>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
            {mockBatch.status}
          </Badge>
        </div>
        <p className="text-sm font-medium mt-1">{mockBatch.recipe}</p>
      </div>

      {/* Checklist */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Ingredient Checklist
        </p>
        <div className="space-y-2">
          {mockBatch.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                ing.checked
                  ? 'bg-green-500 border-green-500'
                  : 'border-muted-foreground/30'
              }`}>
                {ing.checked && <CheckCircle className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-sm flex-1 ${ing.checked ? 'text-muted-foreground line-through' : ''}`}>
                {ing.name}
              </span>
              <span className="text-sm text-muted-foreground">{ing.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">3 of 4 items</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Waste Mockup
 * Shows a waste logging interface preview
 */
export function WasteMockup() {
  const mockWasteLogs = [
    { ingredient: 'Milk', qty: '2.5 L', reason: 'Expired', cost: '$3.75' },
    { ingredient: 'Eggs', qty: '6 ct', reason: 'Dropped', cost: '$2.10' },
    { ingredient: 'Berries', qty: '500g', reason: 'Defective', cost: '$8.50' },
  ];

  const reasonColors: Record<string, string> = {
    Expired: 'bg-amber-500/10 text-amber-600 border-amber-200',
    Dropped: 'bg-red-500/10 text-red-600 border-red-200',
    Defective: 'bg-purple-500/10 text-purple-600 border-purple-200',
  };

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-sm">Waste Log</span>
        </div>
        <span className="text-xs text-muted-foreground">This Week</span>
      </div>

      {/* Logs */}
      <div className="divide-y">
        {mockWasteLogs.map((log, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={reasonColors[log.reason]}>
                {log.reason}
              </Badge>
              <div>
                <p className="text-sm font-medium">{log.ingredient}</p>
                <p className="text-xs text-muted-foreground">{log.qty}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-destructive">-{log.cost}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-destructive/5 px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Waste Cost</span>
          <span className="font-bold text-destructive">$14.35</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Alerts Mockup
 * Displays low stock notification cards
 */
export function AlertsMockup() {
  const mockAlerts = [
    { name: 'Vanilla Extract', current: '120 ml', threshold: '500 ml', urgency: 'critical' },
    { name: 'Bread Flour', current: '8 kg', threshold: '15 kg', urgency: 'warning' },
    { name: 'Yeast', current: '180g', threshold: '250g', urgency: 'warning' },
  ];

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-sm">Low Stock Alerts</span>
        </div>
        <Badge variant="destructive" className="text-xs">3 items</Badge>
      </div>

      {/* Alert Cards */}
      <div className="p-3 space-y-2">
        {mockAlerts.map((alert, i) => {
          const percentage = parseInt(alert.current) / parseInt(alert.threshold) * 100;
          return (
            <div
              key={i}
              className={`rounded-lg p-3 border ${
                alert.urgency === 'critical'
                  ? 'bg-destructive/5 border-destructive/20'
                  : 'bg-amber-500/5 border-amber-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{alert.name}</span>
                <span className={`text-xs font-medium ${
                  alert.urgency === 'critical' ? 'text-destructive' : 'text-amber-600'
                }`}>
                  {alert.current} / {alert.threshold}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full ${
                    alert.urgency === 'critical' ? 'bg-destructive' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Analytics Mockup
 * Shows a simplified chart and KPI preview
 */
export function AnalyticsMockup() {
  // Mock bar chart data
  const chartBars = [35, 52, 48, 61, 45, 72, 58];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...chartBars);

  return (
    <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Weekly Overview</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 divide-x border-b">
        <div className="p-3 text-center">
          <DollarSign className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-lg font-bold">$1,248</p>
          <p className="text-xs text-muted-foreground">Production</p>
        </div>
        <div className="p-3 text-center">
          <Factory className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-lg font-bold">24</p>
          <p className="text-xs text-muted-foreground">Batches</p>
        </div>
        <div className="p-3 text-center">
          <AlertTriangle className="h-4 w-4 mx-auto text-amber-500 mb-1" />
          <p className="text-lg font-bold">$42</p>
          <p className="text-xs text-muted-foreground">Waste</p>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Daily Production Cost</p>
        <div className="flex items-end justify-between h-20 gap-1">
          {chartBars.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/80 rounded-t"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
