export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';
export type QuestDifficulty = 'novice' | 'adept' | 'master';
export type QuestType = 'daily' | 'weekly' | 'challenge';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  class_name: string | null;
  level: number;
  xp: number;
  xp_to_next: number;
  total_xp: number;
  streak: number;
  bio: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  level: number;
  xp: number;
  xp_to_next: number;
  unlocked: boolean;
  parent_id: string | null;
  tier: number;
}

export interface UserSkill {
  id: string;
  skill_id: string;
  profile_id: string;
  level: number;
  xp: number;
  unlocked: boolean;
  skills: Skill | null;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  xp_reward: number;
  skill_id: string | null;
  status: QuestStatus;
  due_date: string | null;
  completed_at: string | null;
  skills: Skill | null;
}

export interface Certificate {
  id: string;
  title: string;
  skill_name: string;
  issued_at: string;
  credential_id: string;
}

export interface Activity {
  id: string;
  action: string;
  detail: string;
  xp_gained: number;
  icon: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}
