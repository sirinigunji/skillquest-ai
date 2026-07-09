'use client';

import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Skill, UserSkill } from '@/lib/types';

interface SkillNodeProps {
  skill: Skill;
  userSkill?: UserSkill;
  locked?: boolean;
  onUnlock?: (skillId: string) => void;
}

export function SkillNode({ skill, userSkill, locked, onUnlock }: SkillNodeProps) {
  const Icon = (Icons[skill.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.BookOpen;
  const level = userSkill?.level ?? 0;
  const xp = userSkill?.xp ?? 0;
  const xpToNext = skill.xp_to_next;
  const unlocked = userSkill?.unlocked ?? false;
  const pct = unlocked ? Math.min(100, Math.round((xp / xpToNext) * 100)) : 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border p-5 transition-all duration-300',
        locked
          ? 'border-border bg-card/50 opacity-50'
          : unlocked
            ? 'border-primary/30 bg-card hover:border-primary/50 hover:box-glow-primary'
            : 'border-dashed border-accent/30 bg-card/70 hover:border-accent/50'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-all',
            unlocked
              ? 'border-primary/30 bg-primary/10 text-primary'
              : locked
                ? 'border-border bg-secondary text-muted-foreground'
                : 'border-accent/30 bg-accent/10 text-accent'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Tier {skill.tier}
            </span>
            <span className="text-xs text-muted-foreground">{skill.category}</span>
          </div>
          <h4 className="mt-1.5 font-display text-base font-semibold text-foreground">
            {skill.name}
          </h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{skill.description}</p>

          {unlocked ? (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-primary">Level {level}</span>
                <span className="font-mono text-muted-foreground">
                  {xp}/{xpToNext}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          ) : locked ? (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icons.Lock className="h-3.5 w-3.5" /> Unlock previous tier first
            </div>
          ) : (
            <button
              onClick={() => onUnlock?.(skill.id)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all hover:bg-accent/20"
            >
              <Icons.Sparkles className="h-3.5 w-3.5" /> Unlock Skill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
