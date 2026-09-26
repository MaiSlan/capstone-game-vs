-- ==========================================
-- 0007 — NEW-USER TRIGGER OWNS PROFILE CREATION
-- Safe to re-run: every statement is idempotent.
-- ==========================================
--
-- Bug fix: profiles used to be created twice on sign-up. First this trigger
-- inserted the row, then POST /api/v1/auth/register inserted the same id
-- again, which failed on the primary key. The account existed, but the player
-- got an error and their chosen username was never saved.
--
-- Now the trigger is the only place a profile is created. The backend passes
-- the username in the sign-up metadata (options.data.username), and the
-- trigger reads it from raw_user_meta_data, falling back to the email prefix
-- when it's missing or blank.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create their public profile, using the username chosen at sign-up
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      NULLIF(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  );

  -- 2. Grant them the default starting characters immediately
  INSERT INTO public.user_characters (user_id, character_id)
  VALUES
    (new.id, 'witch'),
    (new.id, 'viking')
  ON CONFLICT (user_id, character_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
