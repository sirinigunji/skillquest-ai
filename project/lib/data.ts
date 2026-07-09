'use client';

import { getSupabaseBrowser } from '@/lib/supabase';
import type { Profile, Quest, UserSkill, Certificate, Activity, Skill } from '@/lib/types';

const supabase = getSupabaseBrowser();

function xpForLevel(level: number): number {
  return Math.floor(500 * Math.pow(1.15, level - 1));
}

export async function ensureProfile(user: { id: string; email: string; user_metadata?: Record<string, unknown> }) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) return;

  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email.split('@')[0];

  const avatarUrl = (user.user_metadata?.avatar_url as string) || null;

  await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: fullName,
    avatar_url: avatarUrl,
    class_name: 'Apprentice',
    level: 1,
    xp: 0,
    xp_to_next: xpForLevel(1),
    total_xp: 0,
    streak: 0,
  });

  // assign starter quests: all daily quests + the weekly project challenge
  const { data: quests } = await supabase
    .from('quests')
    .select('id, type')
    .in('type', ['daily', 'weekly']);

  if (quests && quests.length) {
    const rows = quests.map((q) => ({
      profile_id: user.id,
      quest_id: q.id,
      status: 'active',
      due_date: q.type === 'daily' ? endOfToday() : endOfWeek(),
    }));
    await supabase.from('user_quests').insert(rows);
  }

  // unlock the foundation skill for the new user
  const { data: foundation } = await supabase
    .from('skills')
    .select('id')
    .eq('tier', 1)
    .maybeSingle();

  if (foundation) {
    await supabase.from('user_skills').insert({
      profile_id: user.id,
      skill_id: foundation.id,
      level: 1,
      xp: 0,
      unlocked: true,
    });
  }

  // seed a welcome activity + badge
  await supabase.from('activities').insert({
    profile_id: user.id,
    action: 'Began the journey',
    detail: 'Your adventure starts now. Accept your first quest!',
    xp_gained: 0,
    icon: 'Sparkles',
  });
  await supabase.from('badges').insert({
    profile_id: user.id,
    name: 'First Steps',
    description: 'Created your SkillQuest account',
    icon: 'Footprints',
  });
}

function endOfToday(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}
function endOfWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() + (7 - d.getDay()));
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return (data as Profile) ?? null;
}

export async function fetchUserQuests(): Promise<Quest[]> {
  const { data } = await supabase
    .from('user_quests')
    .select(`
      id, status, due_date, completed_at, created_at,
      quests ( id, title, description, type, difficulty, xp_reward, skill_id,
        skills ( id, name, icon, category ) )
    `)
    .order('created_at', { ascending: true });

  if (!data) return [];
  return data.map((row: any) => ({
    id: row.id,
    status: row.status,
    due_date: row.due_date,
    completed_at: row.completed_at,
    title: row.quests?.title ?? '',
    description: row.quests?.description ?? '',
    type: row.quests?.type ?? 'daily',
    difficulty: row.quests?.difficulty ?? 'novice',
    xp_reward: row.quests?.xp_reward ?? 0,
    skill_id: row.quests?.skill_id ?? null,
    skills: row.quests?.skills ?? null,
  }));
}

export async function fetchUserSkills(): Promise<UserSkill[]> {
  const { data } = await supabase
    .from('user_skills')
    .select(`
      id, level, xp, unlocked, profile_id, skill_id,
      skills ( id, name, category, description, icon, tier, parent_id, xp_to_next )
    `)
    .order('created_at', { ascending: true });

  if (!data) return [];
  return data.map((row: any) => ({
    id: row.id,
    profile_id: row.profile_id,
    skill_id: row.skill_id,
    level: row.level,
    xp: row.xp,
    unlocked: row.unlocked,
    skills: row.skills,
  }));
}

export async function fetchAllSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('tier', { ascending: true });
  return (data as Skill[]) ?? [];
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_at', { ascending: false });
  return (data as Certificate[]) ?? [];
}

export async function fetchActivities(limit = 8): Promise<Activity[]> {
  const { data } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Activity[]) ?? [];
}

export async function completeQuest(userQuestId: string, xpReward: number): Promise<void> {
  const { data: uq } = await supabase
    .from('user_quests')
    .select('profile_id, quests ( title, skill_id )')
    .eq('id', userQuestId)
    .maybeSingle();

  if (!uq) return;
  const profileId = (uq as any).profile_id;
  const questData = (uq as any).quests;
  const questTitle = questData?.title ?? 'a quest';
  const skillId = questData?.skill_id;

  // mark quest complete
  await supabase
    .from('user_quests')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', userQuestId);

  // update profile xp
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, xp_to_next, level, total_xp, streak')
    .eq('id', profileId)
    .maybeSingle();

  if (profile) {
    let { xp, xp_to_next, level, total_xp, streak } = profile;
    total_xp += xpReward;
    xp += xpReward;
    while (xp >= xp_to_next) {
      xp -= xp_to_next;
      level += 1;
      xp_to_next = xpForLevel(level);
    }
    await supabase
      .from('profiles')
      .update({ xp, xp_to_next, level, total_xp, streak })
      .eq('id', profileId);
  }

  // advance the related skill
  if (skillId) {
    const { data: us } = await supabase
      .from('user_skills')
      .select('id, level, xp, skills ( xp_to_next )')
      .eq('skill_id', skillId)
      .eq('profile_id', profileId)
      .maybeSingle();

    if (us) {
      const usRow = us as any;
      let { level, xp } = usRow;
      const cap = usRow.skills?.xp_to_next ?? 300;
      xp += Math.floor(xpReward / 2);
      while (xp >= cap) {
        xp -= cap;
        level += 1;
      }
      await supabase.from('user_skills').update({ level, xp }).eq('id', usRow.id);
    }
  }

  // log activity
  await supabase.from('activities').insert({
    profile_id: profileId,
    action: 'Completed quest',
    detail: questTitle,
    xp_gained: xpReward,
    icon: 'CheckCircle',
  });
}
