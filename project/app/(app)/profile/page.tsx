'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { LevelBadge } from '@/components/rpg/level-badge';
import { XpBar } from '@/components/rpg/xp-bar';
import { fetchUserSkills, fetchUserQuests, fetchActivities, fetchCertificates } from '@/lib/data';
import type { UserSkill, Quest, Activity, Certificate } from '@/lib/types';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([fetchUserSkills(), fetchUserQuests(), fetchActivities(10), fetchCertificates()]).then(
        ([s, q, a, c]) => {
          setSkills(s);
          setQuests(q);
          setActivities(a);
          setCerts(c);
          setLoading(false);
        }
      );
    }
  }, [user]);

  const initials = (profile?.full_name || profile?.email || 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const completedQuests = quests.filter((q) => q.status === 'completed').length;
  const activeSkills = skills.filter((s) => s.unlocked).length;
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';

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
        title="Profile"
        description="Your adventurer identity and achievements."
        icon="User"
        actions={
          <Link href="/settings">
            <Button variant="outline" className="gap-2">
              <Icons.Settings className="h-4 w-4" /> Edit Settings
            </Button>
          </Link>
        }
      />

      {/* Hero card */}
      <Card className="relative overflow-hidden border-primary/20 bg-card box-glow-primary">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary/30">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? ''} />
                <AvatarFallback className="bg-primary/10 font-display text-2xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <LevelBadge level={profile?.level ?? 1} size="sm" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {profile?.full_name ?? 'Adventurer'}
              </h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary">
                  <Icons.Shield className="h-3 w-3" /> {profile?.class_name}
                </Badge>
                <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
                  <Icons.Flame className="h-3 w-3" /> {profile?.streak ?? 0} day streak
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  <Icons.Calendar className="mr-1 h-3 w-3" /> Joined {joinDate}
                </Badge>
              </div>

              {profile?.bio && (
                <p className="mt-4 max-w-xl text-sm text-muted-foreground">{profile.bio}</p>
              )}

              <div className="mt-4 max-w-md">
                <XpBar current={profile?.xp ?? 0} max={profile?.xp_to_next ?? 500} level={profile?.level ?? 1} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/60">
          <CardContent className="p-5 text-center">
            <Icons.Star className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="font-display text-2xl font-bold text-foreground">{profile?.level ?? 1}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/60">
          <CardContent className="p-5 text-center">
            <Icons.Zap className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="font-display text-2xl font-bold text-foreground">{profile?.total_xp ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/60">
          <CardContent className="p-5 text-center">
            <Icons.CheckCircle className="mx-auto mb-2 h-6 w-6 text-success" />
            <p className="font-display text-2xl font-bold text-foreground">{completedQuests}</p>
            <p className="text-xs text-muted-foreground">Quests Done</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/60">
          <CardContent className="p-5 text-center">
            <Icons.GitBranch className="mx-auto mb-2 h-6 w-6 text-gold" />
            <p className="font-display text-2xl font-bold text-foreground">{activeSkills}</p>
            <p className="text-xs text-muted-foreground">Skills Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skills breakdown */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Skill Mastery</CardTitle>
            <CardDescription>Your progress across all unlocked skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.filter((s) => s.unlocked).length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No skills unlocked yet.</p>
            ) : (
              skills.filter((s) => s.unlocked).map((us) => {
                const Icon = (Icons[(us.skills?.icon as string) as keyof typeof Icons] ?? Icons.BookOpen) as Icons.LucideIcon;
                const pct = Math.min(100, Math.round((us.xp / (us.skills?.xp_to_next ?? 300)) * 100));
                return (
                  <div key={us.id}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="flex-1 truncate text-sm font-medium text-foreground">
                        {us.skills?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">LV {us.level}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Activity Feed</CardTitle>
            <CardDescription>Your latest adventures.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                activities.map((act) => {
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
                        <span className="shrink-0 text-xs font-semibold text-gold">+{act.xp_gained}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card className="border-border bg-card/60">
        <CardHeader>
          <CardTitle className="text-lg">Badges</CardTitle>
          <CardDescription>Achievements you've earned on your journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 p-3">
              <Icons.Footprints className="h-6 w-6 text-gold" />
              <div>
                <p className="text-sm font-medium text-foreground">First Steps</p>
                <p className="text-xs text-muted-foreground">Created your account</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
