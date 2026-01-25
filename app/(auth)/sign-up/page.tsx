/**
 * Sign Up Page
 * New user registration
 */

import Link from 'next/link';
import { SignUpForm } from './sign-up-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Sign Up | BatchTrack',
  description: 'Create your BatchTrack account',
};

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Start your 14-day free trial. No credit card required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
