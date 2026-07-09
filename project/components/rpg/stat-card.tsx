import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface StatCardProps {
  icon: keyof typeof Icons;
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'primary' | 'accent' | 'gold' | 'success';
  className?: string;
}

const accentMap = {
  primary: 'text-primary bg-primary/10 border-primary/20',
  accent: 'text-accent bg-accent/10 border-accent/20',
  gold: 'text-gold bg-gold/10 border-gold/20',
  success: 'text-success bg-success/10 border-success/20',
};

export function StatCard({
  icon,
  label,
  value,
  hint,
  accent = 'primary',
  className,
}: StatCardProps) {
  const Icon = (Icons[icon] as Icons.LucideIcon) ?? Icons.Sparkles;
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:box-glow-primary',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg border transition-transform group-hover:scale-110',
            accentMap[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
