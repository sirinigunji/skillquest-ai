'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface XpBarProps {
  current: number;
  max: number;
  level: number;
  className?: string;
  showLabel?: boolean;
}

export function XpBar({ current, max, level, className, showLabel = true }: XpBarProps) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-display font-semibold text-primary text-glow-primary">
            LV {level}
          </span>
          <span className="font-mono text-muted-foreground">
            {current.toLocaleString()} / {max.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full gradient-primary-accent transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, boxShadow: '0 0 12px hsl(217 91% 60% / 0.6)' }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-50 animate-shimmer"
          style={{
            width: `${pct}%`,
            background:
              'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.3), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  );
}
