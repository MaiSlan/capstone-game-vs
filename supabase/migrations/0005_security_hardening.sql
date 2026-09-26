-- ==========================================
-- 0005 — SECURITY HARDENING
-- Locks every table and RPC down to the backend's service-role key.
-- Safe to re-run: every statement is idempotent.
-- ==========================================
--
-- Why: Supabase exposes the `public` schema over its REST API to anyone who
-- has the project's anon key (which is designed to be public). Without RLS,
-- that key can read and write every row here, including gold balances. And
-- the SECURITY DEFINER functions below can be called directly with any
-- p_user_id / p_cost.
--
-- The game never talks to Supabase from the browser: every read/write goes
-- through the FastAPI backend using the service-role key, which bypasses RLS
-- and keeps its EXECUTE grants. So enabling RLS with *no policies* denies
-- the public API roles (anon, authenticated) without affecting the backend.
-- If the frontend ever queries Supabase directly, add explicit policies for
-- exactly what it needs.

-- ==========================================
-- 1. ROW LEVEL SECURITY (no policies = no public access)
-- ==========================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_upgrades   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bestiary   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats      ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. RPCs: BACKEND-ONLY EXECUTION
-- ==========================================
REVOKE EXECUTE ON FUNCTION public.purchase_upgrade(UUID, TEXT, INTEGER)
    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_bestiary(UUID, TEXT, INTEGER, INTEGER, INTEGER)
    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_global_stats(UUID, INTEGER, INTEGER, BOOLEAN, INTEGER, INTEGER, TEXT)
    FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.purchase_upgrade(UUID, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_bestiary(UUID, TEXT, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_global_stats(UUID, INTEGER, INTEGER, BOOLEAN, INTEGER, INTEGER, TEXT) TO service_role;

-- ==========================================
-- 3. PIN search_path ON SECURITY DEFINER FUNCTIONS
-- ==========================================
-- Prevents a caller from shadowing tables/functions via their own search_path.
-- All function bodies already use schema-qualified names (public.*) or
-- built-ins, so an empty search_path is safe.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.purchase_upgrade(UUID, TEXT, INTEGER) SET search_path = '';
ALTER FUNCTION public.update_bestiary(UUID, TEXT, INTEGER, INTEGER, INTEGER) SET search_path = '';
ALTER FUNCTION public.update_global_stats(UUID, INTEGER, INTEGER, BOOLEAN, INTEGER, INTEGER, TEXT) SET search_path = '';
