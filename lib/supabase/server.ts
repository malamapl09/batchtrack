/**
 * Supabase Server Client
 * For use in Server Components, Server Actions, and Route Handlers
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get authenticated user from server
 * Throws if not authenticated
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Not authenticated');
  }

  return user;
}

/**
 * Get authenticated user's organization
 * Throws if not authenticated or no organization
 */
export async function getUserWithOrganization() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile not found');
  }

  if (!profile.organization_id) {
    throw new Error('No organization found');
  }

  // Get organization separately
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.organization_id)
    .single();

  if (orgError || !organization) {
    throw new Error('Organization not found');
  }

  return {
    user,
    profile: {
      ...profile,
      organization,
    },
    organization,
  };
}
