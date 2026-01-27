/**
 * Marketing Layout
 * Layout for public marketing pages with Paddle checkout support
 */

import { PaddleProvider } from '@/components/billing';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaddleProvider>{children}</PaddleProvider>;
}
