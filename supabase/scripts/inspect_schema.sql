-- ==========================================
-- INSPECT SCHEMA (read-only)
-- Lists what actually exists in the database, so it can be compared against
-- supabase/migrations/. Changes nothing — safe to run on production.
-- ==========================================

SELECT kind, detail FROM (
    -- Columns of every public table
    SELECT 'column' AS kind,
           table_name || '.' || column_name || ' ' || data_type
             || CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END
             || COALESCE(' DEFAULT ' || column_default, '') AS detail
    FROM information_schema.columns
    WHERE table_schema = 'public'

    UNION ALL
    -- Row level security status per table
    SELECT 'rls', c.relname || ' = ' || CASE WHEN c.relrowsecurity THEN 'on' ELSE 'OFF' END
    FROM pg_class c
    WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'

    UNION ALL
    -- RLS policies
    SELECT 'policy', tablename || ': ' || policyname || ' (' || cmd || ')'
    FROM pg_policies
    WHERE schemaname = 'public'

    UNION ALL
    -- Functions / RPCs
    SELECT 'function', p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')'
             || CASE WHEN p.prosecdef THEN ' SECURITY DEFINER' ELSE '' END
    FROM pg_proc p
    WHERE p.pronamespace = 'public'::regnamespace

    UNION ALL
    -- Triggers that call public functions (includes the one on auth.users)
    SELECT 'trigger', t.tgname || ' ON ' || t.tgrelid::regclass::text
             || ' -> ' || p.proname
             || CASE WHEN t.tgenabled = 'D' THEN ' (DISABLED)' ELSE '' END
    FROM pg_trigger t
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE NOT t.tgisinternal AND p.pronamespace = 'public'::regnamespace
) AS schema_report
ORDER BY kind, detail;
