# Branded Descent — Project Guide for Claude Code

This file orients any Claude Code session opened in this repo. Read it first; it
saves re-explaining the project from scratch every time.

## What this is

**Branded Descent** ("capstone-game-vs") is a browser-based Vampire Survivors-like
roguelike: 20-minute survival runs, auto-firing weapons that level up, escalating
waves of monsters, and a run-ending boss gauntlet. Dark fantasy setting (the
"Astral Interstice" — trapped souls forced through an endless death/resurrection
loop by an unseen "Architect"). Built as a capstone project by Basile Herquelle
(Data Engineering Master's, ECE Paris), with a genuine production stack rather
than a toy prototype: persistent accounts, meta-progression, multi-language
support, and a proper monorepo architecture.

## Stack & deployment

- **Frontend**: React + Vite, with Phaser 4 mounted inside it for the actual
  combat canvas. Deployed on **Vercel**.
- **Backend**: FastAPI (Python), talking to **Supabase** (Postgres + Auth).
  Deployed on **Render** (free tier — cold-starts after inactivity, expect
  30-60s on the first request after idle; there's a `/health` endpoint meant
  for an external keep-alive pinger, not yet set up).
- **Database/Auth**: Supabase, free tier.
- **Local dev**: mirrors prod. Use the existing `start_dev.bat` /
  `start_backend.bat` / `start_frontend.bat` launchers — don't invent a new
  local dev workflow, these already work.

## Repo layout

```
backend/
  app/api/routes/       auth.py, shop.py, game.py, stats.py
  app/core/             config.py (env/settings), security.py (JWT verify)
  app/db/                supabase.py — the two Supabase client instances (see below)
  main.py                FastAPI app, CORS, /health

frontend/
  src/pages/             React screens (routed): LandingPage, AuthPage,
                         CharacterSelectUI, PlayArea (the in-game shell),
                         Bestiary, BoneFireShop, ProfileStats, MainTitleUI
  src/components/        PublicNavbar, GameNavbar, ProtectedRoute
  src/game/
    scenes/              Phaser scenes (MainScene = core combat loop, UIScene,
                         PreloadScene, CharacterSelectScene, MainTitleScene)
    entities/            Player, BaseMonster, per-character classes, per-monster
                         classes, boss classes (entities/monsters/boss/)
    managers/            WaveManager (spawn "Director"), WeaponManager,
                         ItemManager, LootManager, MetaStatsManager, AnimationManager
    weapons/              one file per weapon, grouped by character folder
  src/data/               *DB.js files — see "data-driven design" below
  src/i18n.js             react-i18next setup (partial — see i18n gotcha below)

supabase/
  migrations/             DB schema history (NNNN_name.sql, idempotent, run in order)
  scripts/                inspect_schema.sql — read-only live-schema report
```

## Architecture: hybrid React + Phaser

React handles menus, auth, the BoneFire meta shop, and persistent state (gold,
upgrades, bestiary unlocks). Phaser handles the real-time combat loop, physics,
and in-run inventory. The two are deliberately decoupled and talk to each other
only through **custom DOM events** dispatched on `window` — e.g.
`VS_UPDATE_HP`, `VS_LEVEL_UP`, `VS_UPDATE_SETTINGS`, `VS_SHOW_BOSS_BAR`,
`VS_MID_BOSS_STARTED`, `VS_ECLIPSE_STARTED`. When wiring new UI ↔ gameplay
interactions, follow this event-bridge pattern rather than reaching directly
into Phaser scene internals from React or vice versa.

## Data-driven design — edit the DB files, not the classes

Game content and balance numbers live in `src/data/`:
`CharacterDB.js` (heroes), `MonsterDB.js` (monsters/bosses, HP/damage/speed +
name/lore/quotes in `en`/`fr`/`zh`), `WeaponDB.js` (per-level damage/cooldown
arrays), `ItemDB.js` (shop item effects), `RewardDB.js` (level-up/reward pool,
also multi-language), `TimeLineDB.js` (the spawn schedule/timeline).

Entity and weapon classes read from these DB files rather than hardcoding
values — when asked to rebalance something, change the DB file, not the class,
unless the class is missing a hook to read the relevant stat at all.

**Spawn/difficulty scaling**: `WaveManager.js` is "the Director." It reads
`TimeLineDB.js` against the run clock and spawns monsters via
`spawnMonsterFactory()`. There's a global scaling formula: trash-mob
HP/damage/speed get `+40% per minute survived` (linear multiplier). **Bosses
and sub-bosses get an additional, separate `BOSS_HP_TIERS` multiplier**
(defined inline in `WaveManager.js`, added Sept 2026) stacked on top of the
trash-mob multiplier, specifically to make boss fights last longer without
changing the trash-mob difficulty curve or boss lethality. If you touch boss
balance, tune `BOSS_HP_TIERS`, don't just change `MonsterDB.js` HP values
(those still get read by the trash-mob-style formula too).

## i18n — known architectural gotcha, read before touching any UI text

Two parallel translation systems currently coexist. This is not fully resolved
— be careful not to make it worse:

1. **react-i18next** (`src/i18n.js`) — only used by `LandingPage`, `AuthPage`,
   `CharacterSelectUI`, and `PublicNavbar`. Driven by `i18n.language` /
   `i18n.changeLanguage()`.
2. **Ad-hoc per-file dictionaries** — every other page/component
   (`Bestiary`, `BoneFireShop`, `ProfileStats`, `GameNavbar`, `PlayArea`,
   `MainTitleUI`) defines its own local `UI_DICT = { key: {en, fr, zh} }`
   object and a local `t()` helper, reading the active language from
   `localStorage.getItem('vs_lang')` and reacting to a `VS_UPDATE_SETTINGS`
   custom event. The Phaser side (`WaveManager.js`, `UIScene.js`, `MainScene.js`)
   also reads `localStorage.vs_lang` directly for in-canvas text.

**Both systems must be updated together on every language switch.**
`PublicNavbar.jsx`'s `changeLanguage()` and `PlayArea.jsx`'s in-game language
buttons both call `i18n.changeLanguage()` **and** set `localStorage.vs_lang`
**and** dispatch `VS_UPDATE_SETTINGS` — this three-part sync was a real bug
(fixed Sept 2026: `PlayArea.jsx` used to only do the last two, so switching
language from the in-game pause menu left react-i18next pages showing the old
language until a full reload). If you add a new language switcher anywhere,
mirror all three steps. Long-term, consider consolidating onto one system.

## Combat mechanics worth knowing

- Weapon damage/cooldown formulas read `player.damageMult` / `player.cooldownMult`
  off whatever "owner" object is passed into `WeaponManager` — this is also how
  `EchoMonster.js` ("Mimic" / "Echo of the Vessel" sub-boss) fires a *stolen
  copy* of the player's weapon at a deliberately reduced power (see the two
  named constants at the top of its constructor — tune those, not the weapon
  files, if the Mimic feels over/under-tuned).
- Player base HP/speed/starting weapon per character live in `CharacterDB.js`.
  Meta-progression (BoneFire shop) and in-run item pickups both stack
  multiplicatively into `damageMult`/`cooldownMult`/HP multiplier — see
  `MetaStatsManager.js` and `ItemManager.js`.

## Backend notes

- `backend/app/db/supabase.py` exposes **two** Supabase clients on purpose:
  `supabase` (service-role/admin, for privileged table reads/writes) and
  `auth_client` (dedicated, singleton, used only for login/register). Keep
  them separate — don't collapse back into a `create_client()` call per
  request, that regresses login/register latency (each call used to pay for a
  fresh client + no connection reuse).
- The Supabase schema lives in `supabase/migrations/` (see `supabase/README.md`).
  Schema changes go in a **new** numbered, idempotent migration file — never edit
  an applied one, and never change the DB only via the dashboard. The project
  owner applies migrations manually in the Supabase SQL editor.
- `0005_security_hardening.sql` enables RLS with no policies and restricts RPCs
  to `service_role`: this is correct only because the browser never talks to
  Supabase directly. If frontend code ever uses `supabase-js` against the DB,
  it needs explicit RLS policies.
- `profiles.is_admin` (migration `0006`) gates Dev Mode.

## Dev Mode — currently a manual comment-toggle, not a real feature

`frontend/src/game/scenes/MainScene.js` has a hardcoded `DEV MODE:
UNSTOPPABLE POWER` block (search for that comment, not a line number — it
drifts) that's manually uncommented for local testing and re-commented before
committing: god-mode stats (`damageMult`/`xpMult`/`baseSpeed`/`hp`/`maxHp`),
max-level starting weapons (currently only wired for `witch` and `viking` —
the other 4 characters silently get nothing), and a time-skip
(`surviveSeconds = 240`, though the comment beside it says "Minute 19," which
is `1140` seconds, not `240` — an unresolved inconsistency, ask before
"fixing" it either way). Phase 2 replaces this with a real, admin-gated
toggle instead of a source-edit — see `PHASE_2_TASKS.md` for the full plan.

## Current roadmap / status

Work is organized in four phases, agreed with the project owner. **Phase 1 is
committed on `main`** (Sept 26, 2026, commit `ba9e2fc`; tracked `__pycache__`
files untracked separately in `9a16018`) but **not yet playtested**. The
owner has deliberately deferred playtesting until Phase 2's Dev Mode is built,
so it can be used to test boss fights quickly:

- [x] Mimic (Echo of the Vessel) weapon-steal power — was double damage + 20%
      faster than the player's own copy; now a tunable flat reduction.
- [x] Backend login/register responsiveness — shared `auth_client` singleton
      instead of per-request client creation; Render free-tier cold start
      remains the dominant latency source and needs an external keep-alive
      pinger (not yet set up).
- [x] Boss/sub-boss HP tuning for longer fights — decoupled `BOSS_HP_TIERS`
      multiplier in `WaveManager.js`. **Needs playtesting feedback** to dial
      in the exact multipliers.
- [x] Broken/undefined translations — traced to the i18n two-system desync
      above; `PlayArea.jsx`'s switcher now bridges both.
- [x] Bonus: `.gitignore` and `backend/requirements.txt` were saved as
      UTF-16LE (git treated them as binary, couldn't diff/patch them
      normally); re-encoded to UTF-8 with identical content. This lines up
      with a prior "Fix requirements for render deployment" entry in the git
      log — the encoding was very likely the actual cause of that earlier,
      presumably-unresolved deployment issue.

Phase 2 work branches from this committed state. Once Dev Mode lands,
playtest Phase 1 (especially the boss HP fights) along with it.

**Phase 2 (code health, up next)**:
- [ ] Refine `TimeLineDB.js` / `WaveManager.js` pacing
- [ ] Extract Dev Mode into its own module, gated to admin accounts
      (needs a new `is_admin` column — see Backend notes above)
- [ ] Rewrite the README

**Phase 3 (content pipeline)**:
- [ ] Missing monster/weapon/item/shop assets & attacks
- [ ] Boss/player animation frames
- [ ] Regenerate Berserker BGM (Suno)
- [ ] Map generation + better borders/out-of-bounds + background objects
- [ ] Set up Git LFS (or similar) before bulk-adding binary assets

**Phase 4 (new systems, most open design questions)**:
- [ ] Merchant NPC — decided so far: **shapeless/voice-only presence** (no
      sprite, fitting the "unseen Architect" tone), **hybrid backend**
      (rule-based stock/pricing, LLM-generated flavor dialogue only —
      no Groq/LLM client is wired into this repo yet, would be new)
- [ ] Full attack/movement fine-tuning pass across all characters/monsters

## Lore & content reference

The full narrative bible (`Characters_and_Lore.docx` — realm premise, all 6
heroes' backstories/quotes/relics, all 5 Eclipse Lord bosses) and bestiary
(`Monsters.docx` — every monster's archetype/behavior/stats rationale) were
written up separately and are **not currently copied into this repo**. If a
session needs them, ask the project owner to drop plain-text/markdown copies
into a `docs/` folder here — until then, treat any lore/naming questions this
file doesn't answer as open questions to ask, not assumptions to make.

## How I like to work with Claude here

- Flag genuinely ambiguous design/balance decisions instead of guessing —
  especially anything affecting difficulty, monetization-style progression
  (BoneFire costs), or lore consistency.
- Keep changes scoped and easy to review as a diff; avoid drive-by refactors
  bundled into unrelated fixes.
- Balance/numeric changes (HP, damage, drop rates) need real playtesting to
  confirm — say so explicitly rather than presenting a guess as settled.
- Prefer editing the `data/*DB.js` files over hardcoding values in entity,
  weapon, or manager classes.
