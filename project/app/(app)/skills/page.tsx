'use client';

import { useEffect, useState, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { SkillNode } from '@/components/rpg/skill-node';
import { fetchAllSkills, fetchUserSkills, fetchProfile } from '@/lib/data';
import { getSupabaseBrowser } from '@/lib/supabase';
import type { Skill, UserSkill } from '@/lib/types';

export default function SkillTreePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [all, us] = await Promise.all([fetchAllSkills(), fetchUserSkills()]);
    setAllSkills(all);
    setUserSkills(us);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const getUserSkill = (skillId: string) => userSkills.find((us) => us.skill_id === skillId);

  const isLocked = (skill: Skill) => {
    if (!skill.parent_id) return false;
    const parentUs = getUserSkill(skill.parent_id);
    return !parentUs || parentUs.level < 2;
  };

  const handleUnlock = useCallback(
    async (skillId: string) => {
      if (!user) return;
      const supabase = getSupabaseBrowser();
      await supabase.from('user_skills').insert({
        profile_id: user.id,
        skill_id: skillId,
        level: 1,
        xp: 0,
        unlocked: true,
      });
      await load();
    },
    [user, load]
  );

  const tiers = Array.from(new Set(allSkills.map((s) => s.tier))).sort();
  const unlockedCount = userSkills.filter((us) => us.unlocked).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Tree"
        description="Forge your path to mastery. Unlock skills and progress through the tiers."
        icon="GitBranch"
        actions={
          <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary">
            <Icons.Unlock className="h-3 w-3" /> {unlockedCount} unlocked
          </Badge>
        }
      />

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-card/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Icons.GitBranch className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skills Unlocked</p>
              <p className="font-display text-2xl font-bold text-foreground">{unlockedCount} / {allSkills.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-card/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
              <Icons.Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Highest Tier</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {Math.max(...userSkills.filter(us => us.unlocked).map(us => us.skills?.tier ?? 1), 1)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gold/20 bg-card/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-gold">
              <Icons.Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Skill Levels</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {userSkills.reduce((sum, us) => sum + us.level, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tiers */}
      {tiers.map((tier) => {
        const tierSkills = allSkills.filter((s) => s.tier === tier);
        return (
          <div key={tier} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
                {tier}
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Tier {tier} {tier === 1 ? '— Foundations' : tier === 2 ? '— Disciplines' : '— Mastery'}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tierSkills.map((skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  userSkill={getUserSkill(skill.id)}
                  locked={isLocked(skill)}
                  onUnlock={handleUnlock}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* How it works */}
      <Card className="border-border bg-card/40">
        <CardHeader>
          <CardTitle className="text-lg">How the Skill Tree Works</CardTitle>
          <CardDescription>Progress through tiers to unlock mastery paths.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-bold">1</div>
            <p className="text-sm text-muted-foreground">Complete quests tied to a skill to earn XP toward that skill's level.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-bold">2</div>
            <p className="text-sm text-muted-foreground">Reach level 2 in a skill to unlock its children in the next tier.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-bold">3</div>
            <p className="text-sm text-muted-foreground">Master a full path to earn a certificate proving your expertise.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
