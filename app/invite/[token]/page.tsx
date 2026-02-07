/**
 * Invite Acceptance Page
 * Public page for accepting team invitations
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { acceptInvite } from '@/lib/actions/team';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Accept Invitation | BatchTrack',
};

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to sign in or create an account to accept this invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href={`/sign-in?redirect=/invite/${token}`}>Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/sign-up?redirect=/invite/${token}`}>Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Try to accept the invite
  const result = await acceptInvite(token);

  if ('success' in result) {
    redirect('/dashboard');
  }

  // Handle errors
  const errorMessages: Record<string, { title: string; description: string }> = {
    invalid_token: {
      title: 'Invalid Invitation',
      description: 'This invitation link is invalid or has been revoked.',
    },
    already_accepted: {
      title: 'Already Accepted',
      description: 'This invitation has already been accepted.',
    },
    expired: {
      title: 'Invitation Expired',
      description: 'This invitation has expired. Please ask for a new one.',
    },
    email_mismatch: {
      title: 'Email Mismatch',
      description: `This invitation was sent to a different email address. Please sign in with the correct account.`,
    },
  };

  const errorInfo = errorMessages[result.error] || {
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <CardTitle>{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
