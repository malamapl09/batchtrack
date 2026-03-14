/**
 * Data Import Page
 * CSV import for ingredients and recipes (Starter+ only)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportForm } from './import-form';
import { getOrganizationPlan } from '@/lib/billing/check-limits';
import { UpgradePromptCard } from '@/components/billing/upgrade-prompt';

export const metadata = {
  title: 'Import Data | BatchTrack',
  description: 'Import ingredients and recipes from CSV',
};

export default async function ImportPage() {
  const planId = await getOrganizationPlan();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import Data</h1>
        <p className="text-muted-foreground">
          Import ingredients and recipes from CSV files
        </p>
      </div>

      {planId === 'free' ? (
        <UpgradePromptCard
          resource="ingredients"
          currentCount={0}
          limit={0}
          planId={planId}
        />
      ) : (
        <>
          <ImportForm />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>CSV Format Requirements</CardTitle>
              <CardDescription>
                Follow these guidelines for successful imports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Ingredients CSV Columns</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><code className="bg-muted px-1 rounded">name</code> - Required. Ingredient name</li>
                  <li><code className="bg-muted px-1 rounded">description</code> - Optional. Description</li>
                  <li><code className="bg-muted px-1 rounded">sku</code> - Optional. Stock keeping unit</li>
                  <li><code className="bg-muted px-1 rounded">purchase_unit</code> - Required. Unit when buying (e.g., bag, bottle)</li>
                  <li><code className="bg-muted px-1 rounded">usage_unit</code> - Required. Unit when using (e.g., g, ml)</li>
                  <li><code className="bg-muted px-1 rounded">units_per_purchase</code> - Required. Usage units per purchase unit</li>
                  <li><code className="bg-muted px-1 rounded">cost_per_unit</code> - Required. Cost per usage unit</li>
                  <li><code className="bg-muted px-1 rounded">stock_quantity</code> - Optional. Current stock in usage units</li>
                  <li><code className="bg-muted px-1 rounded">low_stock_threshold</code> - Optional. Alert threshold</li>
                  <li><code className="bg-muted px-1 rounded">category</code> - Optional. Category name</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recipes CSV Columns</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><code className="bg-muted px-1 rounded">name</code> - Required. Recipe name</li>
                  <li><code className="bg-muted px-1 rounded">description</code> - Optional. Description</li>
                  <li><code className="bg-muted px-1 rounded">category</code> - Optional. Category name</li>
                  <li><code className="bg-muted px-1 rounded">yield_quantity</code> - Required. Number of units produced</li>
                  <li><code className="bg-muted px-1 rounded">yield_unit</code> - Required. Unit of yield (e.g., loaves, liters)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Note: Recipe ingredients must be added separately after import.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
