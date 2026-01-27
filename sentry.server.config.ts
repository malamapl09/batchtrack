/**
 * Sentry Server Configuration
 * Initializes error tracking and logging for server-side
 * Requires NEXT_PUBLIC_SENTRY_DSN env variable
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Enable logging to Sentry
    enableLogs: true,

    // Performance monitoring sample rate
    tracesSampleRate: 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',

    // Integrations
    integrations: [
      // Send console.log, console.warn, and console.error to Sentry as logs
      Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    ],

    // Filter out noisy errors
    ignoreErrors: [
      // Next.js internal errors
      'NEXT_NOT_FOUND',
      'NEXT_REDIRECT',
    ],
  });
}
