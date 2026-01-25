/**
 * New Recipe Page
 * Form to create a new recipe
 */

import { RecipeForm } from '@/components/recipes';

export const metadata = {
  title: 'Create Recipe | BatchTrack',
  description: 'Create a new recipe with ingredients',
};

export default function NewRecipePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Recipe</h1>
        <p className="text-muted-foreground">
          Define a new recipe with ingredients and quantities
        </p>
      </div>

      <RecipeForm />
    </div>
  );
}
