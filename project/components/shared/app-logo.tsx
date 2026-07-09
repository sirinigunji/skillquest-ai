import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { box: 'h-7 w-7', icon: 'h-4 w-4', text: 'text-lg' },
  md: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-xl' },
  lg: { box: 'h-12 w-12', icon: 'h-7 w-7', text: 'text-2xl' },
};

export function AppLogo({ className, showText = true, size = 'md' }: AppLogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg gradient-primary-accent box-glow-primary shrink-0',
          s.box
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('text-white', s.icon)}
          aria-hidden="true"
        >
          <path
            d="M12 2L14.5 8.5L21 9.5L16.5 14.2L17.8 21L12 17.8L6.2 21L7.5 14.2L3 9.5L9.5 8.5L12 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-display font-bold tracking-tight', s.text)}>
          <span className="text-foreground">Skill</span>
          <span className="gradient-text">Quest</span>
        </span>
      )}
    </div>
  );
}
