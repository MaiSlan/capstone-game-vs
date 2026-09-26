-- ==========================================
-- 0004 — USERNAME CHANGE COOLDOWN
-- Timestamp of the last display-name change; PUT /api/v1/auth/update_username
-- uses it to enforce a 30-day lock between changes.
-- Safe to re-run: every statement is idempotent.
-- ==========================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_name_change TIMESTAMP WITH TIME ZONE NULL;
