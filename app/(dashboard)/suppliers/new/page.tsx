/**
 * New Supplier Page
 * Form to create a new supplier
 */

import { SupplierForm } from '@/components/suppliers';

export const metadata = {
  title: 'Add Supplier | BatchTrack',
  description: 'Add a new supplier',
};

export default function NewSupplierPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Supplier</h1>
        <p className="text-muted-foreground">
          Add a new supplier to your directory
        </p>
      </div>

      <SupplierForm />
    </div>
  );
}
