'use client';

/**
 * Ingredient Table Component
 * Displays ingredients in a data table with actions
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteIngredient } from '@/lib/actions/ingredients';
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
import { MoreHorizontal, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatQuantity, formatCostPerUnit, isLowStock } from '@/lib/utils/conversions';
import { UNIT_SHORT_LABELS } from '@/lib/constants';
import type { Tables } from '@/types/database.types';
import type { UnitType } from '@/types';

type IngredientWithSupplier = Tables<'ingredients'> & {
  supplier: { id: string; name: string } | null;
};

interface IngredientTableProps {
  ingredients: IngredientWithSupplier[];
}

export function IngredientTable({ ingredients }: IngredientTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteIngredient(deleteId);
      toast.success('Ingredient deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete ingredient');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No ingredients found</p>
        <Button asChild className="mt-4">
          <Link href="/ingredients/new">Add your first ingredient</Link>
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
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right hidden md:table-cell">Cost/Unit</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => {
              const lowStock = isLowStock(ingredient as never);
              const usageUnit = ingredient.usage_unit as UnitType;
              const stockValue = ingredient.stock_quantity * ingredient.cost_per_unit;

              return (
                <TableRow key={ingredient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ingredients/${ingredient.id}`}
                        className="font-medium hover:underline"
                      >
                        {ingredient.name}
                      </Link>
                      {lowStock && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    {ingredient.sku && (
                      <span className="text-xs text-muted-foreground">
                        {ingredient.sku}
                      </span>
                    )}
                    {/* Show value on mobile below name */}
                    <span className="text-xs text-muted-foreground sm:hidden">
                      ${stockValue.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {ingredient.category ? (
                      <Badge variant="secondary">{ingredient.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={lowStock ? 'text-amber-600 font-medium' : ''}>
                      {formatQuantity(ingredient.stock_quantity, usageUnit)}{' '}
                      {UNIT_SHORT_LABELS[usageUnit]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {formatCostPerUnit(ingredient.cost_per_unit)}/{UNIT_SHORT_LABELS[usageUnit]}
                  </TableCell>
                  <TableCell className="text-right font-medium hidden sm:table-cell">
                    ${stockValue.toFixed(2)}
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
                          <Link href={`/ingredients/${ingredient.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(ingredient.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ingredient? This action cannot be undone.
              If this ingredient is used in any recipes, you will not be able to delete it.
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
