/**
 * Edit Recipe Page
 * Form to edit an existing recipe
 */

import { notFound } from 'next/navigation';
import { getRecipe } from '@/lib/actions/recipes';
import { RecipeForm } from '@/components/recipes';

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditRecipePageProps) {
  const { id } = await params;
  try {
    const recipe = await getRecipe(id);
    return { title: `Edit ${recipe.name} | BatchTrack` };
  } catch {
    return { title: 'Edit Recipe | BatchTrack' };
  }
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;

  let recipe;
  try {
    recipe = await getRecipe(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Recipe</h1>
        <p className="text-muted-foreground">
          Update {recipe.name}
        </p>
      </div>

      <RecipeForm recipe={recipe as never} />
    </div>
  );
}
