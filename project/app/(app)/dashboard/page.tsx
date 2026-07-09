'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { XpBar } from '@/components/rpg/xp-bar';
import { LevelBadge } from '@/components/rpg/level-badge';
import { StatCard } from '@/components/rpg/stat-card';
import { QuestCard } from '@/components/rpg/quest-card';
import {
  fetchUserQuests,
  fetchUserSkills,
  fetchCertificates,
  fetchActivities,
  completeQuest,
  fetchProfile,
} from '@/lib/data';
import type { Quest, UserSkill, Certificate, Activity } from '@/lib/types';

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [q, s, c, a] = await Promise.all([
      fetchUserQuests(),
      fetchUserSkills(),
      fetchCertificates(),
      fetchActivities(6),
    ]);
    setQuests(q);
    setSkills(s);
    setCertificates(c);
    setActivities(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  const handleComplete = useCallback(
    async (id: string, xp: number) => {
      await completeQuest(id, xp);
      await loadAll();
      await refreshProfile();
    },
    [loadAll, refreshProfile]
  );

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');
  const activeDaily = dailyQuests.filter((q) => q.status === 'active').slice(0, 3);
  const completedToday = dailyQuests.filter((q) => q.status === 'completed').length;
  const weeklyChallenge = weeklyQuests[0];

  const skillsWithProgress = skills.filter((s) => s.unlocked).slice(0, 4);

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
        title={`Welcome back, ${profile?.full_name?.split(' ')[0] ?? 'Adventurer'}`}
        description="Here's your quest log for today."
        icon="LayoutDashboard"
        actions={
          <Link href="/quests">
            <Button variant="outline" className="gap-2">
              <Icons.ScrollText className="h-4 w-4" /> Quest Board
            </Button>
          </Link>
        }
      />

      {/* Hero stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="Star" label="Current Level" value={profile?.level ?? 1} hint={`${profile?.total_xp ?? 0} total XP`} accent="primary" />
        <StatCard icon="Zap" label="XP Today" value={profile?.xp ?? 0} hint={`${profile?.xp_to_next ?? 500} to next level`} accent="accent" />
        <StatCard icon="Flame" label="Day Streak" value={profile?.streak ?? 0} hint="Keep it alive!" accent="gold" />
        <StatCard icon="Trophy" label="Quests Done" value={completedToday} hint={`of ${dailyQuests.length} today`} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* XP Overview */}
          <Card className="border-primary/20 bg-card/80 box-glow-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <LevelBadge level={profile?.level ?? 1} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-xl font-bold text-foreground">
                        {profile?.class_name ?? 'Apprentice'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.level ?? 1 >= 10 ? 'Seasoned adventurer' : 'Rising hero'}
                      </p>
                    </div>
                    <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
                      <Icons.Flame className="h-3 w-3" /> {profile?.streak ?? 0} day streak
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <XpBar current={profile?.xp ?? 0} max={profile?.xp_to_next ?? 500} level={profile?.level ?? 1} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Quests */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Daily Quests</h2>
              <Link href="/quests" className="text-sm text-primary hover:text-glow-primary">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeDaily.length === 0 ? (
                <Card className="col-span-full border-dashed border-border bg-card/40">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Icons.PartyPopper className="mb-3 h-8 w-8 text-gold" />
                    <p className="font-medium text-foreground">All daily quests complete!</p>
                    <p className="text-sm text-muted-foreground">Check the Quest Board for more adventures.</p>
                  </CardContent>
                </Card>
              ) : (
                activeDaily.map((quest) => <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />)
              )}
            </div>
          </div>

          {/* Weekly Challenge */}
          {weeklyChallenge && (
            <Card className="border-gold/30 bg-card box-glow-gold">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
                    <Icons.Trophy className="h-3 w-3" /> Weekly Challenge
                  </Badge>
                  <CardTitle className="mt-2 text-xl">{weeklyChallenge.title}</CardTitle>
                  <CardDescription>{weeklyChallenge.description}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-gold text-glow-gold">
                    +{weeklyChallenge.xp_reward}
                  </p>
                  <p className="text-xs text-muted-foreground">XP reward</p>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full gap-2"
                  disabled={weeklyChallenge.status === 'completed'}
                  onClick={() => handleComplete(weeklyChallenge.id, weeklyChallenge.xp_reward)}
                >
                  {weeklyChallenge.status === 'completed' ? (
                    <><Icons.Check className="h-4 w-4" /> Completed</>
                  ) : (
                    <><Icons.Swords className="h-4 w-4" /> Accept Challenge</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Skill Progress */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Skill Progress</h2>
              <Link href="/skills" className="text-sm text-primary hover:text-glow-primary">
                Skill Tree →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {skillsWithProgress.length === 0 ? (
                <Card className="col-span-full border-dashed border-border bg-card/40">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Icons.GitBranch className="mb-3 h-8 w-8 text-accent" />
                    <p className="font-medium text-foreground">No skills unlocked yet</p>
                    <p className="text-sm text-muted-foreground">Visit the Skill Tree to begin.</p>
                  </CardContent>
                </Card>
              ) : (
                skillsWithProgress.map((us) => {
                  const Icon = (Icons[(us.skills?.icon as string) as keyof typeof Icons] ?? Icons.BookOpen) as Icons.LucideIcon;
                  const pct = Math.min(100, Math.round((us.xp / (us.skills?.xp_to_next ?? 300)) * 100));
                  return (
                    <Card key={us.id} className="border-border bg-card/60 transition-all hover:border-primary/30">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {us.skills?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Level {us.level}</p>
                          </div>
                          <Badge variant="outline" className="text-primary">
                            {pct}%
                          </Badge>
                        </div>
                        <Progress value={pct} className="mt-3 h-1.5" />
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column — sidebar widgets */}
        <div className="space-y-6">
          {/* AI Mentor */}
          <Card className="border-accent/30 bg-card/80 box-glow-accent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                  <Icons.Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Mentor</CardTitle>
                  <CardDescription>Your quest guide</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm text-foreground">
                <p>
                  Greetings, adventurer! You're on a{' '}
                  <span className="font-semibold text-gold">{profile?.streak ?? 0}-day streak</span>.
                  Keep the momentum going — complete your remaining daily quests to earn{' '}
                  <span className="font-semibold text-primary">
                    {activeDaily.reduce((sum, q) => sum + q.xp_reward, 0)} XP
                  </span>
                  .
                </p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Icons.Lightbulb className="h-4 w-4 text-gold" />
                  Tip: Focus on one skill tree path at a time for faster mastery.
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2 border-accent/30 text-accent hover:bg-accent/10">
                <Icons.MessageSquare className="h-4 w-4" /> Ask the Mentor
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border bg-card/60">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px] pr-3">
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Icons.History className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((act) => {
                      const Icon = (Icons[(act.icon as string) as keyof typeof Icons] ?? Icons.Sparkles) as Icons.LucideIcon;
                      return (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{act.action}</p>
                            <p className="truncate text-xs text-muted-foreground">{act.detail}</p>
                          </div>
                          {act.xp_gained > 0 && (
                            <span className="shrink-0 text-xs font-semibold text-gold">
                              +{act.xp_gained}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="border-border bg-card/60">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Certificates</CardTitle>
              <Link href="/certificates" className="text-xs text-primary hover:text-glow-primary">
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icons.Award className="mb-2 h-6 w-6 text-gold/50" />
                  <p className="text-sm text-muted-foreground">No certificates yet</p>
                  <p className="text-xs text-muted-foreground">Complete skill paths to earn them.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {certificates.slice(0, 3).map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 p-3"
                    >
                      <Icons.Award className="h-5 w-5 shrink-0 text-gold" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{cert.title}</p>
                        <p className="text-xs text-muted-foreground">{cert.skill_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
