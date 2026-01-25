'use client';

/**
 * Dashboard Shell Component
 * Client component wrapper that handles mobile menu state
 */

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { MobileSidebar } from './mobile-sidebar';
import { Header } from './header';

interface DashboardShellProps {
  children: React.ReactNode;
  organizationName: string;
  user: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function DashboardShell({ children, organizationName, user }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar organizationName={organizationName} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        organizationName={organizationName}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
