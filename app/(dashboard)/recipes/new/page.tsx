/**
 * New Recipe Page
 * Form to create a new recipe with plan limit checking
 */

import { RecipeForm } from '@/components/recipes';
import { UpgradePromptCard, LimitWarning } from '@/components/billing';
import { checkRecipeLimit } from '@/lib/billing/check-limits';

export const metadata = {
  title: 'Create Recipe | BatchTrack',
  description: 'Create a new recipe with ingredients',
};

export default async function NewRecipePage() {
  const limitCheck = await checkRecipeLimit();

  // If limit reached, show upgrade prompt
  if (!limitCheck.allowed) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Recipe</h1>
          <p className="text-muted-foreground">
            Define a new recipe with ingredients and quantities
          </p>
        </div>

        <UpgradePromptCard
          resource="recipes"
          currentCount={limitCheck.currentCount}
          limit={limitCheck.limit}
          planId={limitCheck.planId}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Recipe</h1>
        <p className="text-muted-foreground">
          Define a new recipe with ingredients and quantities
        </p>
        <LimitWarning
          resource="recipes"
          remaining={limitCheck.remaining}
          limit={limitCheck.limit}
        />
      </div>

      <RecipeForm />
    </div>
  );
}
