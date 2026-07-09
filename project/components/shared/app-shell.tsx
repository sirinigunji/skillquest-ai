'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { AppLogo } from '@/components/shared/app-logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/components/providers/auth-provider';
import { LevelBadge } from '@/components/rpg/level-badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/quests', label: 'Quest Board', icon: 'ScrollText' },
  { href: '/skills', label: 'Skill Tree', icon: 'GitBranch' },
  { href: '/certificates', label: 'Certificates', icon: 'Award' },
  { href: '/profile', label: 'Profile', icon: 'User' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = (Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Circle;
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              active
                ? 'border border-primary/30 bg-primary/10 text-primary box-glow-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className={cn('h-5 w-5 transition-transform group-hover:scale-110', active && 'text-glow-primary')} />
            {item.label}
            {active && <Icons.ChevronRight className="ml-auto h-4 w-4" />}
          </Link>
        );
      })}
    </nav>
  );
}

function UserPanel() {
  const { profile, signOut } = useAuth();
  const initials = (profile?.full_name || profile?.email || 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <LevelBadge level={profile?.level ?? 1} size="sm" className="scale-75" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {profile?.full_name ?? 'Adventurer'}
          </p>
          <p className="truncate text-xs text-muted-foreground">{profile?.class_name}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={() => signOut()} title="Sign out">
          <Icons.LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card/40 backdrop-blur-sm lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/dashboard">
            <AppLogo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="p-3">
          <UserPanel />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm lg:hidden">
        <Link href="/dashboard">
          <AppLogo size="sm" />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <Icons.Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-border bg-card p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-16 items-center border-b border-border px-5">
              <AppLogo />
            </div>
            <div className="p-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <UserPanel />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
