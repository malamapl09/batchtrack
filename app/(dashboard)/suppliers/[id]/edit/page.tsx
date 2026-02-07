/**
 * Edit Supplier Page
 * Form to edit an existing supplier
 */

import { notFound } from 'next/navigation';
import { getSupplier } from '@/lib/actions/suppliers';
import { SupplierForm } from '@/components/suppliers';

interface EditSupplierPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditSupplierPageProps) {
  const { id } = await params;
  try {
    const supplier = await getSupplier(id);
    return { title: `Edit ${supplier.name} | Suppliers | BatchTrack` };
  } catch {
    return { title: 'Edit Supplier | BatchTrack' };
  }
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = await params;

  let supplier;
  try {
    supplier = await getSupplier(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Supplier</h1>
        <p className="text-muted-foreground">
          Update supplier information
        </p>
      </div>

      <SupplierForm supplier={supplier} />
    </div>
  );
}
