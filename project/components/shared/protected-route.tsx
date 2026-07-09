'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { AppLogo } from '@/components/shared/app-logo';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="animate-float">
          <AppLogo size="lg" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icons.Sparkles className="h-4 w-4 animate-pulse text-primary" />
          Loading your quest log...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
