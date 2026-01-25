'use client';

/**
 * Batch Actions Component
 * Action buttons for batch detail page
 */

import { useRouter } from 'next/navigation';
import { startBatch, completeBatch, cancelBatch } from '@/lib/actions/batches';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/types/database.types';

interface BatchActionsProps {
  batch: Tables<'batches'>;
}

export function BatchActions({ batch }: BatchActionsProps) {
  const router = useRouter();

  async function handleStart() {
    try {
      await startBatch(batch.id);
      toast.success('Batch started');
      router.refresh();
    } catch (error) {
      toast.error('Failed to start batch');
    }
  }

  async function handleComplete() {
    try {
      await completeBatch(batch.id);
      toast.success('Batch completed');
      router.refresh();
    } catch (error) {
      toast.error('Failed to complete batch');
    }
  }

  async function handleCancel() {
    try {
      await cancelBatch(batch.id);
      toast.success('Batch cancelled');
      router.refresh();
    } catch (error) {
      toast.error('Failed to cancel batch');
    }
  }

  if (batch.status === 'completed' || batch.status === 'cancelled') {
    return null;
  }

  return (
    <div className="flex gap-2">
      {batch.status === 'draft' && (
        <Button onClick={handleStart}>
          <Play className="mr-2 h-4 w-4" />
          Start Batch
        </Button>
      )}

      {batch.status === 'in_progress' && (
        <Button onClick={handleComplete}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Batch
        </Button>
      )}

      <Button variant="outline" onClick={handleCancel}>
        <XCircle className="mr-2 h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
}
