'use client';

/**
 * Ingredient Form Component
 * Add/Edit form for ingredients with unit configuration
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createIngredient, updateIngredient } from '@/lib/actions/ingredients';
import { getSuppliers } from '@/lib/actions/suppliers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UNIT_LABELS, UNIT_CATEGORIES, DEFAULT_INGREDIENT_CATEGORIES } from '@/lib/constants';
import { UpgradePromptDialog } from '@/components/billing/upgrade-prompt';
import type { PlanId } from '@/lib/billing/plans';
import type { UnitType, Ingredient } from '@/types';
import type { Tables } from '@/types/database.types';

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onSuccess?: () => void;
}

export function IngredientForm({ ingredient, onSuccess }: IngredientFormProps) {
  const router = useRouter();
  const isEditing = !!ingredient;

  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Tables<'suppliers'>[]>([]);
  const [limitDialog, setLimitDialog] = useState<{
    open: boolean;
    currentCount: number;
    limit: number;
    planId: PlanId;
  }>({ open: false, currentCount: 0, limit: 0, planId: 'free' });

  // Form state
  const [name, setName] = useState(ingredient?.name || '');
  const [description, setDescription] = useState(ingredient?.description || '');
  const [sku, setSku] = useState(ingredient?.sku || '');
  const [category, setCategory] = useState(ingredient?.category || '');
  const [purchaseUnit, setPurchaseUnit] = useState(ingredient?.purchase_unit || '');
  const [usageUnit, setUsageUnit] = useState<UnitType>((ingredient?.usage_unit as UnitType) || 'g');
  const [unitsPerPurchase, setUnitsPerPurchase] = useState(
    ingredient?.units_per_purchase?.toString() || ''
  );
  const [costPerUnit, setCostPerUnit] = useState(
    ingredient?.cost_per_unit?.toString() || ''
  );
  const [stockQuantity, setStockQuantity] = useState(
    ingredient?.stock_quantity?.toString() || '0'
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    ingredient?.low_stock_threshold?.toString() || ''
  );
  const [supplierId, setSupplierId] = useState(ingredient?.supplier_id || '');

  // Load suppliers
  useEffect(() => {
    async function loadSuppliers() {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch {
        toast.error('Failed to load suppliers');
      }
    }
    loadSuppliers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = {
        name,
        description: description || undefined,
        sku: sku || undefined,
        category: category || undefined,
        purchase_unit: purchaseUnit,
        usage_unit: usageUnit,
        units_per_purchase: parseFloat(unitsPerPurchase),
        cost_per_unit: parseFloat(costPerUnit),
        stock_quantity: parseFloat(stockQuantity),
        low_stock_threshold: lowStockThreshold ? parseFloat(lowStockThreshold) : undefined,
        supplier_id: supplierId && supplierId !== 'none' ? supplierId : undefined,
      };

      if (isEditing) {
        await updateIngredient(ingredient.id, formData);
        toast.success('Ingredient updated');
      } else {
        const result = await createIngredient(formData);
        if (result && 'error' in result && result.error === 'limit_exceeded') {
          setLimitDialog({
            open: true,
            currentCount: result.currentCount,
            limit: result.limit,
            planId: result.planId,
          });
          setIsLoading(false);
          return;
        }
        toast.success('Ingredient created');
      }

      onSuccess?.();
      router.push('/ingredients');
      router.refresh();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update ingredient' : 'Failed to create ingredient');
    } finally {
      setIsLoading(false);
    }
  }

  const allUnits = [
    ...UNIT_CATEGORIES.weight,
    ...UNIT_CATEGORIES.volume,
    ...UNIT_CATEGORIES.count,
  ];

  return (
    <>
    <UpgradePromptDialog
      resource="ingredients"
      currentCount={limitDialog.currentCount}
      limit={limitDialog.limit}
      planId={limitDialog.planId}
      open={limitDialog.open}
      onOpenChange={(open) => setLimitDialog((prev) => ({ ...prev, open }))}
    />
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="All-Purpose Flour"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="FLOUR-001"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_INGREDIENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={supplierId} onValueChange={setSupplierId} disabled={isLoading}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No supplier</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="purchaseUnit">Purchase Unit *</Label>
              <Input
                id="purchaseUnit"
                value={purchaseUnit}
                onChange={(e) => setPurchaseUnit(e.target.value)}
                placeholder="bag, case, bottle"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">How you buy it</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageUnit">Usage Unit *</Label>
              <Select
                value={usageUnit}
                onValueChange={(v) => setUsageUnit(v as UnitType)}
                disabled={isLoading}
              >
                <SelectTrigger id="usageUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {UNIT_LABELS[unit]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How you use it in recipes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsPerPurchase">Units per Purchase *</Label>
              <Input
                id="unitsPerPurchase"
                type="number"
                step="any"
                min="0.0001"
                value={unitsPerPurchase}
                onChange={(e) => setUnitsPerPurchase(e.target.value)}
                placeholder="50000"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Usage units in one purchase unit
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm">
              Example: A 50kg bag of flour contains <strong>50,000 grams</strong>.
              Enter &quot;bag&quot; as purchase unit, &quot;Grams&quot; as usage unit, and &quot;50000&quot; as units per purchase.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stock & Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Stock & Cost</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Current Stock *</Label>
              <div className="flex gap-2">
                <Input
                  id="stockQuantity"
                  type="number"
                  step="any"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                  {UNIT_LABELS[usageUnit]}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
              <div className="flex gap-2">
                <Input
                  id="lowStockThreshold"
                  type="number"
                  step="any"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="Optional"
                  disabled={isLoading}
                />
                <span className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                  {UNIT_LABELS[usageUnit]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costPerUnit">Cost per Usage Unit *</Label>
            <div className="flex gap-2">
              <span className="flex items-center text-sm text-muted-foreground">$</span>
              <Input
                id="costPerUnit"
                type="number"
                step="any"
                min="0"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                placeholder="0.001"
                required
                disabled={isLoading}
                className="max-w-[200px]"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                per {UNIT_LABELS[usageUnit].toLowerCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be updated automatically when you record purchases
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Ingredient' : 'Create Ingredient'}
        </Button>
      </div>
    </form>
    </>
  );
}
