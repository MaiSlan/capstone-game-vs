-- ==========================================
-- 0006 — ADMIN FLAG (Dev Mode gating)
-- Accounts with is_admin = true can open the in-game Dev Panel.
-- Safe to re-run: every statement is idempotent.
-- ==========================================
--
-- Relies on 0005's RLS: only the backend (service role) can write this
-- column, so players can't grant themselves admin through the public API.
-- To make an account admin, see supabase/README.md.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;
