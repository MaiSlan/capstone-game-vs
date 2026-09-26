# Database (Supabase)

Everything the backend expects to exist in Supabase: tables, RPC functions, the new-user trigger
and access rules.

```
supabase/
  migrations/              Schema history, applied in filename order
    0001_initial_schema.sql       profiles, user_characters, match_history, new-user trigger
    0002_gold_and_upgrades.sql    gold_balance, user_upgrades, purchase_upgrade()
    0003_bestiary_and_stats.sql   user_bestiary, user_stats, update_bestiary(), update_global_stats()
    0004_username_cooldown.sql    profiles.last_name_change
    0005_security_hardening.sql   RLS on all tables, RPCs restricted to the service role
    0006_add_is_admin.sql         profiles.is_admin (Dev Mode gating)
    0007_profile_from_signup_metadata.sql
                                  new-user trigger takes the username from sign-up metadata
  scripts/
    inspect_schema.sql     Read-only report of what's actually in a database
```

**Every migration is idempotent.** Each one uses `IF NOT EXISTS` / `CREATE OR REPLACE`, so it
won't fail or duplicate anything if it's already been applied. But **don't re-run an old file on
its own.** Later migrations redefine some of the functions it creates (for example, `0007` replaces
`handle_new_user()` from `0001`, and `0005` hardens functions from `0002`/`0003`). Re-running an
old file alone silently reverts those changes. Re-running the **whole sequence in order** is
always safe.

## Setting up a new Supabase project

1. Create a project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor → New query**, then paste and run each file in `migrations/` **in order**
   (`0001` → `0007`).
3. Copy the project URL and **service-role** key (Project Settings → API) into `backend/.env`.
   See the root [README](../README.md#2-configure-the-backend).

If you have `psql` and the database connection string (Project Settings → Database), you can
run them all in one go instead:

```bash
for f in supabase/migrations/*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

## Updating an existing project

Run only the migration files added since you last updated, in order. To see what the database
currently has, run `scripts/inspect_schema.sql` in the SQL editor. It only reads and changes
nothing.

## Adding a schema change

Add a new file instead of editing old ones: `migrations/NNNN_short_description.sql`, numbered
after the last one. Keep it idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE OR REPLACE FUNCTION`,
etc.) and apply it with the steps above.

## Security model

The browser never talks to Supabase directly. All reads and writes go through the FastAPI
backend, which uses the service-role key. `0005_security_hardening.sql` relies on this: it
enables row-level security with **no policies** and revokes RPC access from the `anon` and
`authenticated` roles. The public API (reachable with the anon key) therefore gets nothing,
while the backend is unaffected. If the frontend ever needs to query Supabase directly, add
explicit RLS policies for exactly that access.

## Granting admin (Dev Mode)

After `0006` is applied, flag your account in the SQL editor:

```sql
UPDATE public.profiles SET is_admin = true WHERE email = 'you@example.com';
```
