/**
 * Production Page
 * Overview of production batches
 */

import Link from 'next/link';
import { getBatches } from '@/lib/actions/batches';
import { BatchCard } from '@/components/production';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Production | BatchTrack',
  description: 'Manage your production batches',
};

export default async function ProductionPage() {
  const allBatches = await getBatches();

  // Group by status
  const activeBatches = allBatches.filter(
    (b) => b.status === 'in_progress' || b.status === 'draft'
  );
  const completedBatches = allBatches.filter((b) => b.status === 'completed');
  const cancelledBatches = allBatches.filter((b) => b.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Production</h1>
          <p className="text-muted-foreground">
            {activeBatches.length} active · {completedBatches.length} completed
          </p>
        </div>
        <Button asChild>
          <Link href="/production/new">
            <Plus className="mr-2 h-4 w-4" />
            Start Batch
          </Link>
        </Button>
      </div>

      {/* Batches by Status */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full flex h-auto flex-wrap gap-1 sm:w-auto sm:flex-nowrap sm:h-10">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">
            Active ({activeBatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">
            Completed ({completedBatches.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">
            Cancelled ({cancelledBatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeBatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active batches</p>
              <Button asChild className="mt-4">
                <Link href="/production/new">Start a new batch</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedBatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No completed batches yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelledBatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cancelled batches</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cancelledBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
