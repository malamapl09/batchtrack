/**
 * Auth Layout
 * Shared layout for authentication pages (sign-in, sign-up)
 */

import { APP_NAME } from '@/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-2">
          Inventory management for small production businesses
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        Track your COGS. Reduce waste. Grow your business.
      </p>
    </div>
  );
}
