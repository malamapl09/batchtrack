/**
 * Edit Ingredient Page
 * Form to edit an existing ingredient
 */

import { notFound } from 'next/navigation';
import { getIngredient } from '@/lib/actions/ingredients';
import { IngredientForm } from '@/components/ingredients';

interface EditIngredientPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditIngredientPageProps) {
  const { id } = await params;
  try {
    const ingredient = await getIngredient(id);
    return { title: `Edit ${ingredient.name} | BatchTrack` };
  } catch {
    return { title: 'Edit Ingredient | BatchTrack' };
  }
}

export default async function EditIngredientPage({ params }: EditIngredientPageProps) {
  const { id } = await params;

  let ingredient;
  try {
    ingredient = await getIngredient(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Ingredient</h1>
        <p className="text-muted-foreground">
          Update {ingredient.name}
        </p>
      </div>

      <IngredientForm ingredient={ingredient as never} />
    </div>
  );
}
