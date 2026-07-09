'use client';

import { useEffect, useState, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { QuestCard } from '@/components/rpg/quest-card';
import { Badge } from '@/components/ui/badge';
import { fetchUserQuests, completeQuest } from '@/lib/data';
import type { Quest } from '@/lib/types';

export default function QuestBoardPage() {
  const { user, refreshProfile } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setQuests(await fetchUserQuests());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const handleComplete = useCallback(
    async (id: string, xp: number) => {
      await completeQuest(id, xp);
      await load();
      await refreshProfile();
    },
    [load, refreshProfile]
  );

  const daily = quests.filter((q) => q.type === 'daily');
  const weekly = quests.filter((q) => q.type === 'weekly');
  const completed = quests.filter((q) => q.status === 'completed');

  const totalXp = quests.reduce((sum, q) => sum + (q.status === 'completed' ? q.xp_reward : 0), 0);
  const completionRate = quests.length > 0 ? Math.round((completed.length / quests.length) * 100) : 0;

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
        title="Quest Board"
        description="Accept and complete quests to earn XP and advance your skills."
        icon="ScrollText"
        actions={
          <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
            <Icons.Zap className="h-3 w-3" /> {totalXp} XP earned
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.ListChecks className="h-4 w-4" /> Total Quests
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{quests.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.CheckCircle className="h-4 w-4 text-success" /> Completed
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{completed.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.TrendingUp className="h-4 w-4 text-primary" /> Completion Rate
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{completionRate}%</p>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="daily" className="gap-1.5">
            <Icons.Sun className="h-4 w-4" /> Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-1.5">
            <Icons.CalendarDays className="h-4 w-4" /> Weekly
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5">
            <Icons.CheckCircle className="h-4 w-4" /> Done
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {daily.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {weekly.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
              <Icons.Trophy className="mb-3 h-10 w-10 text-gold/50" />
              <p className="font-medium text-foreground">No completed quests yet</p>
              <p className="text-sm text-muted-foreground">Complete your first quest to see it here!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {completed.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
