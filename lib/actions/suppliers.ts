'use server';

/**
 * Supplier Server Actions
 * CRUD operations for suppliers
 */

import { revalidatePath } from 'next/cache';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';

interface SupplierFormData {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

/**
 * Get all suppliers for the current organization
 */
export async function getSuppliers(search?: string) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  let query = supabase
    .from('suppliers')
    .select('*')
    .eq('organization_id', organization.id)
    .order('name');

  if (search) {
    query = query.or(`name.ilike.%${search}%,contact_name.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get a single supplier by ID
 */
export async function getSupplier(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new supplier
 */
export async function createSupplier(formData: SupplierFormData) {
  const supabase = await createClient();
  const { organization } = await getUserWithOrganization();

  const { data, error } = await supabase
    .from('suppliers')
    .insert({
      organization_id: organization.id,
      name: formData.name,
      contact_name: formData.contact_name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/ingredients');
  revalidatePath('/suppliers');
  return data;
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(id: string, formData: Partial<SupplierFormData>) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { data, error } = await supabase
    .from('suppliers')
    .update({
      name: formData.name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/ingredients');
  revalidatePath('/suppliers');
  revalidatePath(`/suppliers/${id}`);
  return data;
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(id: string) {
  const supabase = await createClient();
  await getUserWithOrganization(); // Verify auth

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/ingredients');
  revalidatePath('/suppliers');
}
