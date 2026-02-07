/**
 * Supplier Detail Page
 * Shows supplier info and linked ingredients
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupplier } from '@/lib/actions/suppliers';
import { getIngredients } from '@/lib/actions/ingredients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Mail, Phone, MapPin } from 'lucide-react';

interface SupplierDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SupplierDetailPageProps) {
  const { id } = await params;
  try {
    const supplier = await getSupplier(id);
    return { title: `${supplier.name} | Suppliers | BatchTrack` };
  } catch {
    return { title: 'Supplier | BatchTrack' };
  }
}

export default async function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  const { id } = await params;

  let supplier;
  try {
    supplier = await getSupplier(id);
  } catch {
    notFound();
  }

  // Get ingredients linked to this supplier
  const allIngredients = await getIngredients();
  const linkedIngredients = allIngredients.filter((ing) => ing.supplier_id === id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/suppliers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{supplier.name}</h1>
            {supplier.contact_name && (
              <p className="text-muted-foreground">{supplier.contact_name}</p>
            )}
          </div>
        </div>
        <Button asChild>
          <Link href={`/suppliers/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {supplier.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                {supplier.email}
              </a>
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.address}</span>
            </div>
          )}
          {!supplier.email && !supplier.phone && !supplier.address && (
            <p className="text-muted-foreground">No contact information added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {supplier.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{supplier.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Linked Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>
            Linked Ingredients ({linkedIngredients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedIngredients.length === 0 ? (
            <p className="text-muted-foreground">
              No ingredients linked to this supplier yet.
            </p>
          ) : (
            <div className="space-y-3">
              {linkedIngredients.map((ing) => (
                <div key={ing.id} className="flex items-center justify-between">
                  <Link
                    href={`/ingredients/${ing.id}`}
                    className="font-medium hover:underline"
                  >
                    {ing.name}
                  </Link>
                  {ing.category && (
                    <Badge variant="secondary">{ing.category}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
