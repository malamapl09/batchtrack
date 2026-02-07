/**
 * Pro Feature Gate Component
 * Wraps content that requires Pro plan
 * Shows blurred preview with upgrade prompt for non-Pro users
 */

import type { PlanId } from '@/lib/billing/plans';
import { UpgradePromptCard } from './upgrade-prompt';

interface ProFeatureGateProps {
  planId: PlanId;
  children: React.ReactNode;
}

export function ProFeatureGate({ planId, children }: ProFeatureGateProps) {
  if (planId === 'pro') {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60">
        <div className="w-full max-w-md">
          <UpgradePromptCard
            resource="recipes"
            currentCount={0}
            limit={0}
            planId={planId}
          />
        </div>
      </div>
    </div>
  );
}
