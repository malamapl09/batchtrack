'use client';

/**
 * Batch Card Component
 * Displays a batch summary with quick actions
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { completeBatch, cancelBatch, startBatch } from '@/lib/actions/batches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/conversions';
import { BATCH_STATUS_CONFIG } from '@/lib/constants';
import type { Tables } from '@/types/database.types';

type BatchWithRecipe = Tables<'batches'> & {
  recipe: { id: string; name: string } | null;
};

interface BatchCardProps {
  batch: BatchWithRecipe;
}

export function BatchCard({ batch }: BatchCardProps) {
  const router = useRouter();
  const statusConfig = BATCH_STATUS_CONFIG[batch.status];

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{batch.batch_number}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {batch.recipe?.name || 'Unknown Recipe'}
            </p>
          </div>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Multiplier</p>
            <p className="font-medium">{batch.multiplier}x</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Cost</p>
            <p className="font-medium">{formatCurrency(batch.total_cost)}</p>
          </div>
        </div>

        {batch.started_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Started {new Date(batch.started_at).toLocaleString()}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {batch.status === 'draft' && (
            <>
              <Button size="sm" onClick={handleStart}>
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}

          {batch.status === 'in_progress' && (
            <>
              <Button size="sm" onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}

          <Button size="sm" variant="ghost" asChild>
            <Link href={`/production/${batch.id}`}>
              Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
