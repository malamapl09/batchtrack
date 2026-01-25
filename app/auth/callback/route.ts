/**
 * Auth Callback Route
 * Handles OAuth and email confirmation redirects from Supabase
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user has an organization
      const { data: profile } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', data.user.id)
        .single();

      // Redirect to onboarding if no organization, otherwise to dashboard
      if (!profile?.organization_id) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Redirect to sign-in on error
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`);
}
