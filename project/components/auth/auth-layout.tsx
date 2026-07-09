'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { AppLogo } from '@/components/shared/app-logo';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[120px]" />

        <Link href="/" className="relative">
          <AppLogo size="lg" />
        </Link>

        <div className="relative">
          <h2 className="font-display text-4xl font-bold leading-tight text-foreground">
            Your real life
            <br />
            <span className="gradient-text text-glow-primary">is the game.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Turn learning into an adventure. Complete quests, level up skills, and earn
            certificates as you grow.
          </p>

          <div className="mt-8 flex gap-6">
            <div>
              <p className="font-display text-2xl font-bold gradient-text">10K+</p>
              <p className="text-xs text-muted-foreground">Adventurers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold gradient-text">500K+</p>
              <p className="text-xs text-muted-foreground">Quests done</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold gradient-text">25K+</p>
              <p className="text-xs text-muted-foreground">Certificates</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.Shield className="h-4 w-4 text-primary" />
          Secure authentication powered by Supabase
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link href="/">
              <AppLogo size="lg" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
