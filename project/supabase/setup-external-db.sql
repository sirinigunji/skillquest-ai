-- ============================================================================
-- SkillQuest AI — Complete Database Setup
-- ============================================================================
-- Run this entire script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- on your external project: https://ydmprlhybsstnejxptmx.supabase.co
--
-- It creates all tables, RLS policies, indexes, and seed data in one go.
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- ============================================================================

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

-- ============================================================================
-- SEED DATA — Skill catalog
-- ============================================================================
INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
SELECT 'Foundation: Mind & Focus', 'Mindset', 'Build the mental discipline that powers all other skills.', 'Brain', 1, NULL, 300
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Foundation: Mind & Focus');

DO $$
DECLARE
  foundation_id uuid;
  coding_id uuid;
  design_id uuid;
BEGIN
  SELECT id INTO foundation_id FROM skills WHERE name = 'Foundation: Mind & Focus';

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Coding: Fundamentals', 'Technology', 'Master the building blocks of programming — variables, loops, logic.', 'Code', 2, foundation_id, 400
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Coding: Fundamentals');
  SELECT id INTO coding_id FROM skills WHERE name = 'Coding: Fundamentals';

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Design: Visual Principles', 'Creative', 'Learn color theory, typography, and layout fundamentals.', 'Palette', 2, foundation_id, 400
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Design: Visual Principles');
  SELECT id INTO design_id FROM skills WHERE name = 'Design: Visual Principles';

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Languages: Polyglot Path', 'Languages', 'Develop fluency in a new language through daily practice.', 'Languages', 2, foundation_id, 400
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Languages: Polyglot Path');

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Fitness: Body Forge', 'Health', 'Build strength, endurance, and flexibility.', 'Dumbbell', 2, foundation_id, 400
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Fitness: Body Forge');

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Coding: Web Architecture', 'Technology', 'Advanced patterns — frameworks, APIs, deployment.', 'Globe', 3, coding_id, 600
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Coding: Web Architecture');

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Coding: Systems & Algorithms', 'Technology', 'Data structures, algorithms, and system design.', 'Cpu', 3, coding_id, 600
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Coding: Systems & Algorithms');

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Design: UX Mastery', 'Creative', 'User research, prototyping, and interaction design.', 'MousePointerClick', 3, design_id, 600
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Design: UX Mastery');

  INSERT INTO skills (name, category, description, icon, tier, parent_id, xp_to_next)
  SELECT 'Design: Motion & Animation', 'Creative', 'Bring interfaces to life with motion design.', 'Wand2', 3, design_id, 600
  WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Design: Motion & Animation');
END $$;

-- ============================================================================
-- SEED DATA — Quest catalog
-- ============================================================================
INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Morning Mindfulness', 'Spend 15 minutes in focused meditation to sharpen your mental clarity.', 'daily', 'novice', 40,
  (SELECT id FROM skills WHERE name = 'Foundation: Mind & Focus')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Morning Mindfulness');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Write 50 Lines of Code', 'Make progress on a coding project by writing at least 50 lines today.', 'daily', 'adept', 75,
  (SELECT id FROM skills WHERE name = 'Coding: Fundamentals')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Write 50 Lines of Code');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Learn 20 New Words', 'Study 20 vocabulary words in your target language and review them.', 'daily', 'novice', 50,
  (SELECT id FROM skills WHERE name = 'Languages: Polyglot Path')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Learn 20 New Words');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT '30-Minute Workout', 'Complete a 30-minute training session to forge your body.', 'daily', 'novice', 45,
  (SELECT id FROM skills WHERE name = 'Fitness: Body Forge')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = '30-Minute Workout');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Sketch a UI Concept', 'Design and sketch one complete interface concept.', 'daily', 'adept', 60,
  (SELECT id FROM skills WHERE name = 'Design: Visual Principles')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Sketch a UI Concept');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Read a Technical Article', 'Read and summarize one in-depth technical article.', 'daily', 'novice', 35,
  (SELECT id FROM skills WHERE name = 'Coding: Fundamentals')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Read a Technical Article');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Weekly Challenge: Build a Mini Project', 'Complete a small end-to-end project this week combining multiple skills.', 'weekly', 'master', 300,
  (SELECT id FROM skills WHERE name = 'Coding: Web Architecture')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Weekly Challenge: Build a Mini Project');

INSERT INTO quests (title, description, type, difficulty, xp_reward, skill_id)
SELECT 'Weekly Challenge: Language Sprint', 'Hold a 15-minute conversation entirely in your target language.', 'weekly', 'adept', 200,
  (SELECT id FROM skills WHERE name = 'Languages: Polyglot Path')
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Weekly Challenge: Language Sprint');

-- ============================================================================
-- DONE — Your SkillQuest AI database is ready.
-- ============================================================================
