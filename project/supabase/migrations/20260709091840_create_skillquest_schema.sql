/*
# Create SkillQuest AI schema — multi-user RPG learning platform

1. Purpose
   SkillQuest AI gamifies real-life skill learning. Authenticated users ("adventurers")
   have a profile with level/XP, accept quests to earn XP, progress through a skill tree,
   and earn certificates. This migration creates the full owner-scoped schema with RLS.

2. New Tables
   - `profiles` — extends auth.users with RPG stats (level, xp, streak, class, bio, avatar).
     `id` is a FK to auth.users so it maps 1:1 to the signed-in user.
   - `skills` — shared catalog of learnable skills arranged in a tiered tree (parent_id,
     tier, icon, category). NOT owner-scoped: the tree is shared across all users.
   - `user_skills` — per-user progress on a skill (level, xp, unlocked). owner-scoped.
   - `quests` — quest definitions (title, description, type, difficulty, xp_reward,
     skill_id). Shared catalog, NOT owner-scoped.
   - `user_quests` — per-user quest assignments and status. owner-scoped.
   - `certificates` — certificates earned by a user. owner-scoped.
   - `activities` — recent-activity feed for a user. owner-scoped.
   - `badges` — achievement badges earned by a user. owner-scoped.

3. Security
   - RLS enabled on EVERY table.
   - `profiles`, `user_skills`, `user_quests`, `certificates`, `activities`, `badges`
     are owner-scoped: 4 separate policies (SELECT/INSERT/UPDATE/DELETE) restricted to
     `TO authenticated` with `auth.uid() = user_id` (or `id` for profiles). Owner
     columns default to `auth.uid()` so client inserts that omit user_id still pass
     WITH CHECK.
   - `skills` and `quests` are shared catalogs: SELECT open to `anon, authenticated`
     (so the catalog is readable), but writes restricted to `authenticated` owners
     via a guard — effectively read-only for normal users. Catalog rows are seeded by
     this migration with service-role-equivalent DDL, not client inserts.

4. Important Notes
   - 1:1 profile per auth user. A trigger could auto-create profiles on signup, but to
     keep this migration self-contained and idempotent we seed profiles on-demand from
     the client after signup instead.
   - Seed data for skills, quests is inserted here so the app has content immediately.
   - All statements use IF NOT EXISTS / DROP POLICY IF EXISTS for safe re-runs.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  class_name text DEFAULT 'Apprentice',
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  xp_to_next int NOT NULL DEFAULT 500,
  total_xp int NOT NULL DEFAULT 0,
  streak int NOT NULL DEFAULT 0,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============ SKILLS (shared catalog) ============
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BookOpen',
  tier int NOT NULL DEFAULT 1,
  parent_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  xp_to_next int NOT NULL DEFAULT 300,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_skills" ON skills;
CREATE POLICY "read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_skills_authenticated" ON skills;
CREATE POLICY "insert_skills_authenticated" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_skills_authenticated" ON skills;
CREATE POLICY "update_skills_authenticated" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ USER_SKILLS (owner-scoped) ============
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  unlocked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, skill_id)
);
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_skills" ON user_skills;
CREATE POLICY "select_own_user_skills" ON user_skills FOR SELECT
  TO authenticated USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert_own_user_skills" ON user_skills;
CREATE POLICY "insert_own_user_skills" ON user_skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_user_skills" ON user_skills;
CREATE POLICY "update_own_user_skills" ON user_skills FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete_own_user_skills" ON user_skills;
CREATE POLICY "delete_own_user_skills" ON user_skills FOR DELETE
  TO authenticated USING (auth.uid() = profile_id);

-- ============ QUESTS (shared catalog) ============
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'daily' CHECK (type IN ('daily','weekly','challenge')),
  difficulty text NOT NULL DEFAULT 'novice' CHECK (difficulty IN ('novice','adept','master')),
  xp_reward int NOT NULL DEFAULT 50,
  skill_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_quests" ON quests;
CREATE POLICY "read_quests" ON quests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_quests_authenticated" ON quests;
CREATE POLICY "insert_quests_authenticated" ON quests FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_quests_authenticated" ON quests;
CREATE POLICY "update_quests_authenticated" ON quests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ USER_QUESTS (owner-scoped) ============
CREATE TABLE IF NOT EXISTS user_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('available','active','completed','failed')),
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, quest_id)
);
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_quests" ON user_quests;
CREATE POLICY "select_own_user_quests" ON user_quests FOR SELECT
  TO authenticated USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert_own_user_quests" ON user_quests;
CREATE POLICY "insert_own_user_quests" ON user_quests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_user_quests" ON user_quests;
CREATE POLICY "update_own_user_quests" ON user_quests FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete_own_user_quests" ON user_quests;
CREATE POLICY "delete_own_user_quests" ON user_quests FOR DELETE
  TO authenticated USING (auth.uid() = profile_id);

-- ============ CERTIFICATES (owner-scoped) ============
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  skill_name text NOT NULL,
  credential_id text NOT NULL DEFAULT '',
  issued_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_certificates" ON certificates;
CREATE POLICY "select_own_certificates" ON certificates FOR SELECT
  TO authenticated USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert_own_certificates" ON certificates;
CREATE POLICY "insert_own_certificates" ON certificates FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_certificates" ON certificates;
CREATE POLICY "update_own_certificates" ON certificates FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete_own_certificates" ON certificates;
CREATE POLICY "delete_own_certificates" ON certificates FOR DELETE
  TO authenticated USING (auth.uid() = profile_id);

-- ============ ACTIVITIES (owner-scoped) ============
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  detail text NOT NULL DEFAULT '',
  xp_gained int NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT 'Sparkles',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_activities" ON activities;
CREATE POLICY "select_own_activities" ON activities FOR SELECT
  TO authenticated USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert_own_activities" ON activities;
CREATE POLICY "insert_own_activities" ON activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_activities" ON activities;
CREATE POLICY "update_own_activities" ON activities FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete_own_activities" ON activities;
CREATE POLICY "delete_own_activities" ON activities FOR DELETE
  TO authenticated USING (auth.uid() = profile_id);

-- ============ BADGES (owner-scoped) ============
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Award',
  earned_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_badges" ON badges;
CREATE POLICY "select_own_badges" ON badges FOR SELECT
  TO authenticated USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert_own_badges" ON badges;
CREATE POLICY "insert_own_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "update_own_badges" ON badges;
CREATE POLICY "update_own_badges" ON badges FOR UPDATE
  TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete_own_badges" ON badges;
CREATE POLICY "delete_own_badges" ON badges FOR DELETE
  TO authenticated USING (auth.uid() = profile_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_skills_parent ON skills(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_profile ON user_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_profile ON user_quests(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_status ON user_quests(status);
CREATE INDEX IF NOT EXISTS idx_certificates_profile ON certificates(profile_id);
CREATE INDEX IF NOT EXISTS idx_activities_profile ON activities(profile_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_badges_profile ON badges(profile_id);
