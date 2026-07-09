import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
};

export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div
        className={cn(
          'absolute inset-0 rounded-full gradient-primary-accent opacity-30 blur-md animate-glow-pulse'
        )}
      />
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full gradient-primary-accent font-display font-bold text-white box-glow-primary',
          sizes[size]
        )}
      >
        <div className="absolute inset-1 rounded-full border border-white/20" />
        <span className="relative">{level}</span>
      </div>
    </div>
  );
}
