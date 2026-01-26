/**
 * Sentry Edge Configuration
 * Initializes error tracking for edge runtime (middleware, edge routes)
 * Requires NEXT_PUBLIC_SENTRY_DSN env variable
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance monitoring sample rate
    tracesSampleRate: 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',
  });
}
