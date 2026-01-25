'use client';

/**
 * Mobile Sidebar Component
 * Sheet-based navigation for mobile devices
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Factory,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ingredients', href: '/ingredients', icon: Package },
  { name: 'Recipes', href: '/recipes', icon: BookOpen },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationName: string;
}

export function MobileSidebar({ open, onOpenChange, organizationName }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onOpenChange(false);
    router.push('/sign-in');
    router.refresh();
  }

  function handleLinkClick() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>{APP_NAME}</span>
          </SheetTitle>
        </SheetHeader>

        {/* Organization */}
        <div className="border-b px-4 py-3">
          <p className="text-xs text-muted-foreground">Organization</p>
          <p className="text-sm font-medium truncate">{organizationName}</p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="my-4 border-t mx-2" />

          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sign Out */}
        <div className="border-t p-4 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground h-12"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
