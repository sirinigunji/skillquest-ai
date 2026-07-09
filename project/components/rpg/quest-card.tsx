import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Quest } from '@/lib/types';

const difficultyConfig = {
  novice: { label: 'Novice', className: 'border-success/30 bg-success/10 text-success' },
  adept: { label: 'Adept', className: 'border-primary/30 bg-primary/10 text-primary' },
  master: { label: 'Master', className: 'border-gold/30 bg-gold/10 text-gold' },
};

const typeIcon: Record<string, keyof typeof Icons> = {
  daily: 'Sun',
  weekly: 'CalendarDays',
  challenge: 'Trophy',
};

interface QuestCardProps {
  quest: Quest;
  onComplete?: (id: string, xp: number) => void;
  className?: string;
}

export function QuestCard({ quest, onComplete, className }: QuestCardProps) {
  const diff = difficultyConfig[quest.difficulty];
  const TypeIcon = (Icons[typeIcon[quest.type] ?? 'Sun'] as Icons.LucideIcon) ?? Icons.Sun;
  const SkillIcon =
    (Icons[quest.skills?.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.BookOpen;
  const completed = quest.status === 'completed';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300',
        completed
          ? 'border-success/20 opacity-60'
          : 'border-border hover:border-primary/40 hover:box-glow-primary',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border',
            completed
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-primary/30 bg-primary/10 text-primary'
          )}
        >
          <SkillIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('gap-1 border', diff.className)}>
              <TypeIcon className="h-3 w-3" />
              {diff.label}
            </Badge>
            {quest.skills && (
              <span className="truncate text-xs text-muted-foreground">
                {quest.skills.name}
              </span>
            )}
          </div>
          <h4 className="mt-2 font-display text-base font-semibold text-foreground">
            {quest.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{quest.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium text-gold">
              <Icons.Zap className="h-4 w-4" />
              +{quest.xp_reward} XP
            </span>
            {completed ? (
              <Badge className="gap-1 border-success/30 bg-success/10 text-success">
                <Icons.Check className="h-3 w-3" /> Completed
              </Badge>
            ) : (
              onComplete && (
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5"
                  onClick={() => onComplete(quest.id, quest.xp_reward)}
                >
                  <Icons.Sword className="h-4 w-4" />
                  Complete
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
