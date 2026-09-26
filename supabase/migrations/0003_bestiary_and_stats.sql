-- ==========================================
-- 0003 — BESTIARY & LIFETIME STATS
-- Per-monster kill tracking and per-player aggregate stats.
-- Safe to re-run: every statement is idempotent.
-- ==========================================

-- ==========================================
-- 1. BESTIARY TABLE
-- ==========================================
-- Tracks kills, encounters, and wins for all enemies.
CREATE TABLE IF NOT EXISTS public.user_bestiary (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    monster_id TEXT NOT NULL, -- keys of MonsterDB.js
    kills INTEGER DEFAULT 0,
    encounters INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, monster_id)
);

-- ==========================================
-- 2. GLOBAL STATS TABLE
-- ==========================================
-- No 'DEFAULT' for most_played_character; it stays NULL if no games played.
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_runs INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_gold_earned INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    highest_level_reached INTEGER DEFAULT 0,
    most_played_character TEXT
);

-- ==========================================
-- 3. BESTIARY UPDATER
-- ==========================================
-- Adds one run's worth of kills/encounters/wins for a single monster.
-- Called by: POST /api/v1/game/end_run, POST /api/v1/stats/bestiary/update
CREATE OR REPLACE FUNCTION public.update_bestiary(
    p_user_id UUID,
    p_monster_id TEXT,
    p_kills INTEGER,
    p_encounters INTEGER,
    p_wins INTEGER
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_bestiary (user_id, monster_id, kills, encounters, wins)
    VALUES (p_user_id, p_monster_id, p_kills, p_encounters, p_wins)
    ON CONFLICT (user_id, monster_id) DO UPDATE SET
        kills = user_bestiary.kills + p_kills,
        encounters = user_bestiary.encounters + p_encounters,
        wins = user_bestiary.wins + p_wins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. GLOBAL STATS UPDATER
-- ==========================================
-- Adds one run's metrics to the aggregates, then recalculates
-- 'most_played_character' from match_history (so the run must be logged
-- in match_history *before* this is called — /game/end_run does that).
-- Called by: POST /api/v1/game/end_run, POST /api/v1/stats/update
CREATE OR REPLACE FUNCTION public.update_global_stats(
    p_user_id UUID,
    p_kills INTEGER,
    p_time INTEGER,
    p_is_win BOOLEAN,
    p_gold INTEGER,
    p_level INTEGER,
    p_character TEXT
) RETURNS VOID AS $$
BEGIN
    -- 1. Update/Insert aggregate stats
    INSERT INTO public.user_stats (
        user_id, total_runs, total_wins, total_gold_earned, total_time_seconds, highest_level_reached
    )
    VALUES (
        p_user_id, 1, CASE WHEN p_is_win THEN 1 ELSE 0 END, p_gold, p_time, p_level
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_runs = user_stats.total_runs + 1,
        total_wins = user_stats.total_wins + (CASE WHEN p_is_win THEN 1 ELSE 0 END),
        total_gold_earned = user_stats.total_gold_earned + p_gold,
        total_time_seconds = user_stats.total_time_seconds + p_time,
        highest_level_reached = GREATEST(user_stats.highest_level_reached, p_level);

    -- 2. Update most_played_character by counting records in match_history
    UPDATE public.user_stats
    SET most_played_character = (
        SELECT character_used
        FROM public.match_history
        WHERE user_id = p_user_id
        GROUP BY character_used
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
