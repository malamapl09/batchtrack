/**
 * New Batch Page
 * Start a new production batch
 */

import { StartBatchForm } from '@/components/production';

export const metadata = {
  title: 'Start Batch | BatchTrack',
  description: 'Start a new production batch',
};

export default function NewBatchPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Start New Batch</h1>
        <p className="text-muted-foreground">
          Select a recipe and configure your production batch
        </p>
      </div>

      <StartBatchForm />
    </div>
  );
}
