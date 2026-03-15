'use client';

/**
 * Log Waste Dialog
 * Form to log waste for a specific ingredient
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Loader2 } from 'lucide-react';
import { logWaste } from '@/lib/actions/waste';

const WASTE_REASONS = [
  { value: 'expired', label: 'Expired' },
  { value: 'dropped', label: 'Dropped / Damaged' },
  { value: 'spillage', label: 'Spillage' },
  { value: 'defective', label: 'Defective' },
  { value: 'other', label: 'Other' },
] as const;

interface LogWasteDialogProps {
  ingredientId: string;
  ingredientName: string;
  usageUnit: string;
  currentStock: number;
}

export function LogWasteDialog({
  ingredientId,
  ingredientName,
  usageUnit,
  currentStock,
}: LogWasteDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    if (qty > currentStock) {
      setError(`Cannot waste more than current stock (${currentStock} ${usageUnit})`);
      return;
    }

    if (!reason) {
      setError('Please select a reason');
      return;
    }

    setIsLoading(true);

    try {
      await logWaste({
        ingredientId,
        quantity: qty,
        reason: reason as 'expired' | 'dropped' | 'spillage' | 'defective' | 'other',
        notes: notes || undefined,
      });

      setOpen(false);
      setQuantity('');
      setReason('');
      setNotes('');
    } catch {
      setError('Failed to log waste. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Log Waste
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Waste</DialogTitle>
          <DialogDescription>
            Record wasted {ingredientName}. Stock will be adjusted automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="waste-quantity">Quantity ({usageUnit})</Label>
            <Input
              id="waste-quantity"
              type="number"
              step="any"
              min="0"
              max={currentStock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Max: ${currentStock}`}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Current stock: {currentStock} {usageUnit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste-reason">Reason</Label>
            <Select value={reason} onValueChange={setReason} disabled={isLoading}>
              <SelectTrigger id="waste-reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {WASTE_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste-notes">Notes (optional)</Label>
            <Textarea
              id="waste-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Waste
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
