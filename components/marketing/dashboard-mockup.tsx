/**
 * Dashboard Mockup Component
 * Styled preview of the BatchTrack dashboard for the landing page hero
 * Shows a simplified version of the actual dashboard UI
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  DollarSign,
  AlertTriangle,
  Factory,
  TrendingUp,
} from 'lucide-react';

/**
 * Mini KPI Card for the mockup
 */
function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  iconColor = 'text-muted-foreground',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  iconColor?: string;
}) {
  return (
    <div className="bg-card rounded-lg border p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{subtext}</p>
    </div>
  );
}

/**
 * Dashboard Mockup
 * Displays a stylized version of the dashboard with sample data
 */
export function DashboardMockup() {
  // Mock chart bars
  const chartBars = [35, 52, 48, 61, 45, 72, 58];
  const maxBar = Math.max(...chartBars);

  return (
    <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="bg-muted/50 px-4 py-2.5 border-b flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-background/80 rounded px-3 py-0.5 text-xs text-muted-foreground">
            app.batchtrack.com/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard header */}
      <div className="px-4 py-3 border-b bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-semibold">BatchTrack</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Demo
          </Badge>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 space-y-4 bg-muted/30">
        {/* Page title */}
        <div>
          <h3 className="font-semibold text-sm">Dashboard</h3>
          <p className="text-[10px] text-muted-foreground">Your inventory at a glance</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-2">
          <KpiCard
            icon={DollarSign}
            label="Stock Value"
            value="$12,458"
            subtext="Total inventory"
          />
          <KpiCard
            icon={AlertTriangle}
            label="Low Stock"
            value="3"
            subtext="Items to reorder"
            iconColor="text-amber-500"
          />
          <KpiCard
            icon={Factory}
            label="Active Batches"
            value="2"
            subtext="In production"
          />
          <KpiCard
            icon={TrendingUp}
            label="Today"
            value="5"
            subtext="Batches completed"
            iconColor="text-green-500"
          />
        </div>

        {/* Mini chart */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Weekly Production Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-end justify-between h-16 gap-1">
              {chartBars.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/80 rounded-t"
                    style={{ height: `${(value / maxBar) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-[8px] text-muted-foreground flex-1 text-center">
                  {day}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity preview */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-medium">Recent Batches</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: 'Sourdough Bread', status: 'Completed', cost: '$24.50' },
                { name: 'Chocolate Cookies', status: 'In Progress', cost: '$18.30' },
              ].map((batch, i) => (
                <div key={i} className="px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{batch.name}</p>
                    <Badge
                      variant="secondary"
                      className={`text-[8px] mt-0.5 ${
                        batch.status === 'Completed'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {batch.status}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium">{batch.cost}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
