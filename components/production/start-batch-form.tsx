'use client';

/**
 * Start Batch Form Component
 * Form to start a new production batch
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBatch } from '@/lib/actions/batches';
import { getRecipes } from '@/lib/actions/recipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/conversions';
import type { Tables } from '@/types/database.types';

export function StartBatchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRecipeId = searchParams.get('recipe');

  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Tables<'recipes'>[]>([]);

  // Form state
  const [recipeId, setRecipeId] = useState(preselectedRecipeId || '');
  const [multiplier, setMultiplier] = useState('1');
  const [notes, setNotes] = useState('');
  const [startImmediately, setStartImmediately] = useState(true);

  // Selected recipe
  const selectedRecipe = recipes.find((r) => r.id === recipeId);
  const estimatedCost = selectedRecipe
    ? selectedRecipe.total_cost * parseFloat(multiplier || '1')
    : 0;
  const estimatedYield = selectedRecipe
    ? selectedRecipe.yield_quantity * parseFloat(multiplier || '1')
    : 0;

  // Load recipes
  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes({ activeOnly: true });
        setRecipes(data);
      } catch {
        toast.error('Failed to load recipes');
      }
    }
    loadRecipes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!recipeId) {
      toast.error('Please select a recipe');
      return;
    }

    setIsLoading(true);

    try {
      const batch = await createBatch({
        recipeId,
        multiplier: parseFloat(multiplier),
        notes: notes || undefined,
        startImmediately,
      });

      toast.success(startImmediately ? 'Batch started' : 'Batch created as draft');
      router.push(`/production/${batch.id}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to create batch');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipe">Recipe *</Label>
            <Select value={recipeId} onValueChange={setRecipeId} disabled={isLoading}>
              <SelectTrigger id="recipe">
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((recipe) => (
                  <SelectItem key={recipe.id} value={recipe.id}>
                    {recipe.name} - {formatCurrency(recipe.total_cost)}/batch
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="multiplier">Batch Multiplier</Label>
            <Input
              id="multiplier"
              type="number"
              step="0.5"
              min="0.5"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Use 2 for double batch, 0.5 for half batch
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes..."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="startImmediately"
              checked={startImmediately}
              onCheckedChange={(checked) => setStartImmediately(checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="startImmediately" className="text-sm font-normal">
              Start batch immediately (will deduct ingredients from inventory)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimate */}
      {selectedRecipe && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Recipe</p>
                <p className="font-medium">{selectedRecipe.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Yield</p>
                <p className="font-medium">
                  {estimatedYield} {selectedRecipe.yield_unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-xl font-bold">{formatCurrency(estimatedCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button type="submit" disabled={isLoading || !recipeId}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {startImmediately ? 'Start Batch' : 'Create Draft'}
        </Button>
      </div>
    </form>
  );
}
