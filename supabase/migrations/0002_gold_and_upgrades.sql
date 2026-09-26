-- ==========================================
-- 0002 — GOLD & BONEFIRE UPGRADES
-- In-game currency and the meta-progression shop.
-- Safe to re-run: every statement is idempotent.
-- ==========================================

-- ==========================================
-- 1. ADD IN-GAME CURRENCY TO PROFILES
-- ==========================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gold_balance INTEGER DEFAULT 0;

-- ==========================================
-- 2. USER UPGRADES TABLE (The Meta-Stats)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_upgrades (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    upgrade_id TEXT NOT NULL, -- e.g., 'vitality', 'might', 'greed'
    level INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    PRIMARY KEY (user_id, upgrade_id)
);

-- ==========================================
-- 3. SECURE RPC: PURCHASE AN UPGRADE
-- ==========================================
-- Deducts gold and grants the upgrade level. Returns FALSE if unaffordable.
-- Called by: POST /api/v1/shop/purchase
CREATE OR REPLACE FUNCTION public.purchase_upgrade(
    p_user_id UUID,
    p_upgrade_id TEXT,
    p_cost INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_gold INTEGER;
BEGIN
    -- 1. Check current gold balance
    SELECT gold_balance INTO current_gold
    FROM public.profiles
    WHERE id = p_user_id;

    -- 2. If they can't afford it, reject the transaction
    IF current_gold < p_cost THEN
        RETURN FALSE;
    END IF;

    -- 3. Deduct the gold
    UPDATE public.profiles
    SET gold_balance = gold_balance - p_cost
    WHERE id = p_user_id;

    -- 4. Upsert (Insert or Update) the upgrade level
    INSERT INTO public.user_upgrades (user_id, upgrade_id, level, updated_at)
    VALUES (p_user_id, p_upgrade_id, 1, now())
    ON CONFLICT (user_id, upgrade_id)
    DO UPDATE SET
        level = public.user_upgrades.level + 1,
        updated_at = now();

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
