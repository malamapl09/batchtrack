/**
 * Sentry Utilities
 * Helpers for error tracking, tracing, and logging
 *
 * Usage:
 * - Use `captureError` in try/catch blocks
 * - Use `startSpan` for tracing meaningful operations
 * - Use `logger` for structured logging
 */

import * as Sentry from '@sentry/nextjs';

// Re-export the logger for easy access
export const { logger } = Sentry;

/**
 * Capture an exception with optional context
 * Use in try/catch blocks or where exceptions are expected
 */
export function captureError(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  }
) {
  if (context?.tags) {
    Sentry.setTags(context.tags);
  }
  if (context?.extra) {
    Sentry.setExtras(context.extra);
  }

  Sentry.captureException(error, {
    level: context?.level,
  });
}

/**
 * Create a span for UI interactions (button clicks, form submissions)
 *
 * @example
 * ```ts
 * const handleClick = () => {
 *   trackUIAction('Test Button Click', () => {
 *     doSomething();
 *   }, { buttonId: 'test-btn' });
 * };
 * ```
 */
export function trackUIAction<T>(
  name: string,
  fn: () => T,
  attributes?: Record<string, string | number | boolean>
): T {
  return Sentry.startSpan(
    {
      op: 'ui.click',
      name,
    },
    (span) => {
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      return fn();
    }
  );
}

/**
 * Create a span for API/HTTP calls
 *
 * @example
 * ```ts
 * const data = await trackApiCall('GET /api/users', async () => {
 *   const res = await fetch('/api/users');
 *   return res.json();
 * });
 * ```
 */
export async function trackApiCall<T>(
  name: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name,
    },
    async (span) => {
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      return fn();
    }
  );
}

/**
 * Create a span for database operations
 *
 * @example
 * ```ts
 * const users = await trackDbQuery('SELECT users', async () => {
 *   return supabase.from('users').select('*');
 * }, { table: 'users' });
 * ```
 */
export async function trackDbQuery<T>(
  name: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return Sentry.startSpan(
    {
      op: 'db.query',
      name,
    },
    async (span) => {
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      return fn();
    }
  );
}

/**
 * Create a custom span for any operation
 *
 * @example
 * ```ts
 * const result = await startSpan('process.batch', 'Processing batch', async (span) => {
 *   span.setAttribute('batchSize', items.length);
 *   return processBatch(items);
 * });
 * ```
 */
export function startSpan<T>(
  op: string,
  name: string,
  fn: (span: Sentry.Span) => T
): T {
  return Sentry.startSpan({ op, name }, fn);
}

/**
 * Set user context for all subsequent events
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
} | null) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}
