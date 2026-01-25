/**
 * Sign In Page
 * Email/password authentication with Supabase
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { SignInForm } from './sign-in-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Sign In | BatchTrack',
  description: 'Sign in to your BatchTrack account',
};

function SignInFormFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SignInFormFallback />}>
          <SignInForm />
        </Suspense>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
