'use client';

/**
 * Report Chart Components
 * Reusable chart components using Recharts
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/conversions';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Fallback colors if CSS variables aren't available
const FALLBACK_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface CostTrendData {
  date: string;
  cost: number;
  batches: number;
}

interface UsageData {
  date: string;
  quantity: number;
  cost: number;
}

interface WasteByReasonData {
  reason: string;
  cost: number;
  quantity: number;
}

interface ByRecipeData {
  name: string;
  count: number;
  cost: number;
}

interface CostHistoryData {
  date: string;
  cost: number;
  quantity: number;
}

/**
 * Format date for display
 */
function formatDate(label: unknown): string {
  if (typeof label !== 'string') return '';
  const date = new Date(label);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Cost Trend Line Chart
 */
export function CostTrendChart({ data }: { data: CostTrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Cost']}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke={FALLBACK_COLORS[0]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Ingredient Usage Line Chart
 */
export function UsageChart({ data }: { data: UsageData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'cost' ? formatCurrency(Number(value)) : Number(value).toFixed(2),
            name === 'cost' ? 'Cost' : 'Quantity',
          ]}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="quantity"
          name="Quantity"
          stroke={FALLBACK_COLORS[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cost"
          name="Cost"
          stroke={FALLBACK_COLORS[1]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Waste by Reason Pie Chart
 */
export function WasteByReasonChart({ data }: { data: WasteByReasonData[] }) {
  const REASON_LABELS: Record<string, string> = {
    dropped: 'Dropped',
    expired: 'Expired',
    defective: 'Defective',
    spillage: 'Spillage',
    other: 'Other',
  };

  const chartData = data.map((d) => ({
    ...d,
    name: REASON_LABELS[d.reason] || d.reason,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="cost"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Cost']}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Production by Recipe Bar Chart
 */
export function ProductionByRecipeChart({ data }: { data: ByRecipeData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          width={75}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'cost' ? formatCurrency(Number(value)) : value,
            name === 'cost' ? 'Total Cost' : 'Batches',
          ]}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Bar dataKey="count" name="Batches" fill={FALLBACK_COLORS[0]} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Waste Over Time Line Chart
 */
export function WasteOverTimeChart({ data }: { data: UsageData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Waste Cost']}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke={FALLBACK_COLORS[3]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Cost by Category Pie Chart (Pro)
 */
export function CostByCategoryChart({ data }: { data: { category: string; cost: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="cost"
          nameKey="category"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Cost']}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Recipe Cost Comparison Bar Chart (Pro)
 */
export function RecipeCostComparisonChart({
  data,
}: {
  data: { name: string; avgCostPerUnit: number; totalBatches: number; totalCost: number; yieldUnit: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          width={75}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'totalCost' ? formatCurrency(Number(value)) : formatCurrency(Number(value)),
            name === 'totalCost' ? 'Total Cost' : 'Avg Cost/Batch',
          ]}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Bar dataKey="avgCostPerUnit" name="Avg Cost/Batch" fill={FALLBACK_COLORS[1]} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Ingredient Cost History Line Chart
 * Shows purchase cost changes over time for an ingredient
 */
export function IngredientCostHistoryChart({ data }: { data: CostHistoryData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value, name) => [
            name === 'cost' ? formatCurrency(Number(value)) : Number(value).toFixed(2),
            name === 'cost' ? 'Cost per Unit' : 'Quantity',
          ]}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Line
          type="stepAfter"
          dataKey="cost"
          name="Cost"
          stroke={FALLBACK_COLORS[0]}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
