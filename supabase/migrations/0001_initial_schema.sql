-- ==========================================
-- 0001 — INITIAL SCHEMA
-- Profiles, character inventory, match history, and the new-user trigger.
-- Safe to re-run: every statement is idempotent.
-- ==========================================

-- ==========================================
-- 1. PROFILES TABLE (The Player's Public Data)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    evr_balance INTEGER DEFAULT 0, -- Crypto token placeholder
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- ==========================================
-- 2. USER INVENTORY (Unlocked Characters)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL, -- e.g., 'witch', 'viking' (keys of CharacterDB.js)
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Ensure a user can't unlock the same character twice
    UNIQUE (user_id, character_id)
);

-- ==========================================
-- 3. MATCH HISTORY (Telemetry & Leaderboards)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.match_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    character_used TEXT NOT NULL,
    level_reached INTEGER NOT NULL DEFAULT 1,
    enemies_defeated INTEGER NOT NULL DEFAULT 0,
    survival_time_seconds INTEGER NOT NULL DEFAULT 0,
    is_cleared BOOLEAN NOT NULL DEFAULT false, -- True if no cheats detected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. AUTOMATION: NEW USER TRIGGER
-- ==========================================
-- This function fires automatically every time someone registers.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create their public profile
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));

  -- 2. Grant them the default starting characters immediately
  INSERT INTO public.user_characters (user_id, character_id)
  VALUES
    (new.id, 'witch'),
    (new.id, 'viking');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to Supabase's hidden auth table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
