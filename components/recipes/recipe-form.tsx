'use client';

/**
 * Recipe Form Component
 * Add/Edit form for recipes with ingredient builder
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createRecipe, updateRecipe } from '@/lib/actions/recipes';
import { getIngredients } from '@/lib/actions/ingredients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCostPerUnit } from '@/lib/utils/conversions';
import { UNIT_SHORT_LABELS, DEFAULT_RECIPE_CATEGORIES } from '@/lib/constants';
import { UpgradePromptDialog } from '@/components/billing/upgrade-prompt';
import type { PlanId } from '@/lib/billing/plans';
import type { Tables } from '@/types/database.types';
import type { UnitType } from '@/types';

type RecipeWithIngredients = Tables<'recipes'> & {
  ingredients: (Tables<'recipe_ingredients'> & {
    ingredient: Tables<'ingredients'>;
  })[];
};

interface RecipeFormProps {
  recipe?: RecipeWithIngredients | null;
  onSuccess?: () => void;
}

interface RecipeIngredientInput {
  ingredient_id: string;
  quantity: string;
  notes: string;
}

export function RecipeForm({ recipe, onSuccess }: RecipeFormProps) {
  const router = useRouter();
  const isEditing = !!recipe;

  const [isLoading, setIsLoading] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState<Tables<'ingredients'>[]>([]);
  const [limitDialog, setLimitDialog] = useState<{
    open: boolean;
    currentCount: number;
    limit: number;
    planId: PlanId;
  }>({ open: false, currentCount: 0, limit: 0, planId: 'free' });

  // Form state
  const [name, setName] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [category, setCategory] = useState(recipe?.category || '');
  const [yieldQuantity, setYieldQuantity] = useState(recipe?.yield_quantity?.toString() || '1');
  const [yieldUnit, setYieldUnit] = useState(recipe?.yield_unit || 'unit');

  // Recipe ingredients
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientInput[]>(
    recipe?.ingredients.map((ri) => ({
      ingredient_id: ri.ingredient_id,
      quantity: ri.quantity.toString(),
      notes: ri.notes || '',
    })) || []
  );

  // Load available ingredients
  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();
        setAvailableIngredients(data);
      } catch {
        toast.error('Failed to load ingredients');
      }
    }
    loadIngredients();
  }, []);

  // Calculate total cost
  const totalCost = recipeIngredients.reduce((sum, ri) => {
    const ingredient = availableIngredients.find((i) => i.id === ri.ingredient_id);
    if (!ingredient || !ri.quantity) return sum;
    return sum + parseFloat(ri.quantity) * ingredient.cost_per_unit;
  }, 0);

  const costPerUnit = yieldQuantity ? totalCost / parseFloat(yieldQuantity) : 0;

  function addIngredient() {
    setRecipeIngredients([...recipeIngredients, { ingredient_id: '', quantity: '', notes: '' }]);
  }

  function removeIngredient(index: number) {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof RecipeIngredientInput, value: string) {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // Validate at least one ingredient
    const validIngredients = recipeIngredients.filter(
      (ri) => ri.ingredient_id && parseFloat(ri.quantity) > 0
    );

    if (validIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      setIsLoading(false);
      return;
    }

    try {
      const formData = {
        name,
        description: description || undefined,
        category: category || undefined,
        yield_quantity: parseFloat(yieldQuantity),
        yield_unit: yieldUnit,
        ingredients: validIngredients.map((ri) => ({
          ingredient_id: ri.ingredient_id,
          quantity: parseFloat(ri.quantity),
          notes: ri.notes || undefined,
        })),
      };

      if (isEditing) {
        await updateRecipe(recipe.id, formData);
        toast.success('Recipe updated');
      } else {
        const result = await createRecipe(formData);
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
        toast.success('Recipe created');
      }

      onSuccess?.();
      router.push('/recipes');
      router.refresh();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update recipe' : 'Failed to create recipe');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <UpgradePromptDialog
      resource="recipes"
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
              <Label htmlFor="name">Recipe Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sourdough Bread"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_RECIPE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description or notes..."
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="yieldQuantity">Yield Quantity *</Label>
              <Input
                id="yieldQuantity"
                type="number"
                step="any"
                min="0.01"
                value={yieldQuantity}
                onChange={(e) => setYieldQuantity(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yieldUnit">Yield Unit *</Label>
              <Input
                id="yieldUnit"
                value={yieldUnit}
                onChange={(e) => setYieldUnit(e.target.value)}
                placeholder="loaves, liters, units"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ingredients</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="mr-2 h-4 w-4" />
            Add Ingredient
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipeIngredients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No ingredients added yet. Click &quot;Add Ingredient&quot; to start building your recipe.
            </p>
          ) : (
            <div className="space-y-4">
              {recipeIngredients.map((ri, index) => {
                const ingredient = availableIngredients.find((i) => i.id === ri.ingredient_id);
                const lineCost = ingredient && ri.quantity
                  ? parseFloat(ri.quantity) * ingredient.cost_per_unit
                  : 0;

                return (
                  <div
                    key={index}
                    className="grid gap-4 md:grid-cols-[1fr,150px,1fr,80px,40px] items-end p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label>Ingredient *</Label>
                      <Select
                        value={ri.ingredient_id}
                        onValueChange={(v) => updateIngredient(index, 'ingredient_id', v)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIngredients.map((ing) => (
                            <SelectItem key={ing.id} value={ing.id}>
                              {ing.name} ({UNIT_SHORT_LABELS[ing.usage_unit as UnitType]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          value={ri.quantity}
                          onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                          disabled={isLoading}
                        />
                        {ingredient && (
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {UNIT_SHORT_LABELS[ingredient.usage_unit as UnitType]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Input
                        value={ri.notes}
                        onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                        placeholder="Optional"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cost</Label>
                      <div className="h-10 flex items-center text-sm font-medium">
                        ${lineCost.toFixed(2)}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cost Summary */}
          {recipeIngredients.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Recipe Cost:</span>
                <span className="text-xl font-bold">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Cost per {yieldUnit}:</span>
                <span>{formatCostPerUnit(costPerUnit)}</span>
              </div>
            </div>
          )}
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
          {isEditing ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
    </>
  );
}
