/**
 * New Ingredient Page
 * Form to create a new ingredient with plan limit checking
 */

import { IngredientForm } from '@/components/ingredients';
import { UpgradePromptCard, LimitWarning } from '@/components/billing';
import { checkIngredientLimit } from '@/lib/billing/check-limits';

export const metadata = {
  title: 'Add Ingredient | BatchTrack',
  description: 'Add a new ingredient to your inventory',
};

export default async function NewIngredientPage() {
  const limitCheck = await checkIngredientLimit();

  // If limit reached, show upgrade prompt
  if (!limitCheck.allowed) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add Ingredient</h1>
          <p className="text-muted-foreground">
            Add a new raw material to track in your inventory
          </p>
        </div>

        <UpgradePromptCard
          resource="ingredients"
          currentCount={limitCheck.currentCount}
          limit={limitCheck.limit}
          planId={limitCheck.planId}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Ingredient</h1>
        <p className="text-muted-foreground">
          Add a new raw material to track in your inventory
        </p>
        <LimitWarning
          resource="ingredients"
          remaining={limitCheck.remaining}
          limit={limitCheck.limit}
        />
      </div>

      <IngredientForm />
    </div>
  );
}
