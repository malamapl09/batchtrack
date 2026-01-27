/**
 * Sentry Client Configuration
 * Initializes error tracking and logging for browser-side
 * Requires NEXT_PUBLIC_SENTRY_DSN env variable
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Enable logging to Sentry
    enableLogs: true,

    // Performance monitoring sample rate (0.0 to 1.0)
    // Adjust in production based on traffic volume
    tracesSampleRate: 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Capture 10% of sessions, 100% of sessions with errors
        maskAllText: true,
        blockAllMedia: true,
      }),
      // Send console.warn and console.error to Sentry as logs
      Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
    ],

    // Session replay sample rates
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter out noisy errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Network errors
      'Network request failed',
      'Failed to fetch',
      // Cancelled requests
      'AbortError',
    ],
  });
}
