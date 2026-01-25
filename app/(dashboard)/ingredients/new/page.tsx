/**
 * New Ingredient Page
 * Form to create a new ingredient
 */

import { IngredientForm } from '@/components/ingredients';

export const metadata = {
  title: 'Add Ingredient | BatchTrack',
  description: 'Add a new ingredient to your inventory',
};

export default function NewIngredientPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Ingredient</h1>
        <p className="text-muted-foreground">
          Add a new raw material to track in your inventory
        </p>
      </div>

      <IngredientForm />
    </div>
  );
}
