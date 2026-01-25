'use client';

/**
 * Recipe Table Component
 * Displays recipes in a data table with actions
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteRecipe, toggleRecipeActive } from '@/lib/actions/recipes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, Play } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/conversions';
import type { Tables } from '@/types/database.types';

interface RecipeTableProps {
  recipes: Tables<'recipes'>[];
}

export function RecipeTable({ recipes }: RecipeTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteRecipe(deleteId);
      toast.success('Recipe deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete recipe. It may be used in production batches.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      await toggleRecipeActive(id, isActive);
      toast.success(isActive ? 'Recipe activated' : 'Recipe deactivated');
      router.refresh();
    } catch {
      toast.error('Failed to update recipe');
    }
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No recipes found</p>
        <Button asChild className="mt-4">
          <Link href="/recipes/new">Create your first recipe</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right hidden md:table-cell">Yield</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Cost/Unit</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="font-medium hover:underline"
                  >
                    {recipe.name}
                  </Link>
                  {/* Show cost per unit on mobile */}
                  <span className="text-xs text-muted-foreground sm:hidden block">
                    {formatCurrency(recipe.cost_per_unit)}/{recipe.yield_unit}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {recipe.category ? (
                    <Badge variant="secondary">{recipe.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {recipe.yield_quantity} {recipe.yield_unit}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(recipe.total_cost)}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {formatCurrency(recipe.cost_per_unit)}/{recipe.yield_unit}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={recipe.is_active}
                    onCheckedChange={(checked) => handleToggleActive(recipe.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/production/new?recipe=${recipe.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Batch
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/recipes/${recipe.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(recipe.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone.
              If this recipe has been used in production batches, you will not be able to delete it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
