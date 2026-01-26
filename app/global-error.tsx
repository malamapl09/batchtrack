/**
 * Global Error Boundary
 * Catches unhandled errors at the app level and reports to Sentry
 * This is a required file for Sentry integration with Next.js App Router
 */

'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We apologize for the inconvenience. Our team has been notified and
            is working to fix the issue.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Go Home
            </Button>
          </div>
          {error.digest && (
            <p className="mt-8 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
