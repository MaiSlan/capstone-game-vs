# Phase 2 Task Brief — Code Health

For a fresh Claude Code session in this repo. Read `CLAUDE.md` first if it
hasn't loaded automatically — this brief assumes that context and doesn't
repeat it.

**Before touching anything**: confirm Phase 1 is committed (see CLAUDE.md's
roadmap section). If it isn't, stop and tell the project owner rather than
building Phase 2 on top of uncommitted Phase 1 changes.

Work through these in order. Two of the three need the project owner's input
before any code gets written — don't guess on those, ask.

---

## 1. Rewrite README.md — proceed autonomously

The current `README.md` is not a real project README — it's leftover text
from an AI planning conversation (Phaser sound-design notes, a gameplay
roadmap discussion), not something a visitor to the GitHub repo should see.
Replace it entirely.

Include:
- Project name + a one- or two-line pitch (dark-fantasy Vampire-Survivors-like
  roguelike; you can nod to the "Astral Interstice" setting briefly, but this
  is a portfolio piece for recruiters/collaborators too, so keep it legible
  to someone who's never heard of the game)
- Tech stack section: React + Vite + Phaser 4 (frontend), FastAPI + Supabase
  (backend), deployed on Vercel / Render / Supabase (free tiers)
- Local setup instructions: cloning, the backend `.env` requirements
  (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), and both the one-command
  path (`start_dev.bat`) and the manual path (`pip install -r
  requirements.txt` + `python run_server.py` for backend; `npm install` +
  `npm run dev` for frontend)
- Link to the live deployment (check `frontend/vercel.json` / CORS origins in
  `backend/main.py` for the actual URLs), with a one-line note that the
  backend may take 30-60s to wake up on first load (Render free-tier cold
  start)
- A short features list (multi-language EN/FR/ZH, 6 playable heroes, boss
  gauntlet, meta-progression shop, etc.) — pull specifics from
  `CharacterDB.js` / `MonsterDB.js` if useful
- Credits line (solo capstone project, ECE Paris)
- Screenshots: leave a placeholder section/comment if none are on hand yet,
  don't fabricate image links

This is public-facing, so show the project owner the draft before finalizing,
but there's no open design decision here — no need to stop and ask first.

---

## 2. `TimeLineDB.js` / `WaveManager.js` pacing — STOP AND ASK FIRST

Do not change any spawn timings, counts, or patterns until the project owner
answers these. The current timeline was deliberately authored, not broken —
"refine the pacing" without specifics is not enough to act on:

- Which part of the 20-minute curve feels off right now: too sparse early
  (0-5 min), too chaotic/dense mid-game (10-19 min), or something else
  entirely?
- Is the complaint about spawn *density*, spawn *variety* (reusing too few
  patterns — currently only `random_edge`, `circle`, `wall_horizontal`,
  `wall_vertical`), or the *timing* of sub-boss/boss triggers relative to the
  surrounding trash waves?
- Now that Phase 1 gave bosses their own `BOSS_HP_TIERS` multiplier (their
  fights last longer than before), do any sub-boss triggers in `TimeLineDB.js`
  now collide awkwardly with the next trash-mob wave ramping up right after?

Once you have concrete answers, propose specific `TimeLineDB.js`/
`WaveManager.js` changes, explain the reasoning, and confirm before applying.
Flag explicitly that any pacing change needs a playtest to validate, same as
Phase 1's boss HP tiers.

---

## 3. Dev Mode extraction + admin gating

**Correction to an earlier version of this brief**: Dev Mode does exist. It's
a hardcoded, commented-out block inside `frontend/src/game/scenes/MainScene.js`
(look for the header comment `DEV MODE: UNSTOPPABLE POWER` — don't rely on a
hardcoded line number, it will drift). Today, "using" Dev Mode means manually
uncommenting this block in a text editor, testing locally, then remembering to
re-comment it before every commit — that manual, easy-to-forget toggle is the
actual problem this task fixes, not a missing feature. The full current block:

```javascript
// ==========================================
// DEV MODE: UNSTOPPABLE POWER
// Comment these out when you are ready to balance the real game!
// ==========================================
//this.player.damageMult = 5.0; // Deal 500% Damage instantly
//this.player.xpMult = 5.0;     // Level up 5x faster
//this.player.baseSpeed = 250;  // Run incredibly fast to dodge anything
//this.player.hp = 5000;        // Massive health pool
//this.player.maxHp = 5000;

// DEV MODE: Grant character-specific weapons at Level 5 (Max)
//let devWeapons = [];

//if (this.selectedCharacter === 'witch') {
//  devWeapons = ['magic_orb', 'magic_book', 'magic_wand', 'arcane_nova'];
//} else if (this.selectedCharacter === 'viking') {
//  devWeapons = ['bouncing_axe', 'piercing_lance', 'seismic_stomp', 'dragon_shout'];
//}

//devWeapons.forEach(weaponId => {
//  for (let i = 0; i < 5; i++) {
//    try {
//      this.player.addOrUpgradeWeapon(weaponId);
//    } catch (error) {
//      console.warn(`Dev Mode: Skipped ${weaponId} - Not mapped for this character.`);
//    }
//  }
//});

// Optional Time Skip: Uncomment this to start the game directly at Minute 19!
//this.surviveSeconds = 240;
// ==========================================
```

Two things to notice before rebuilding this:
- `devWeapons` is only wired for `witch` and `viking` — the other 4 heroes
  (Hrogar/viking's covered, but Pirate, Berserker, Paladin, Drifter aren't)
  get an empty array and just log a console warning. Pull the weapon list
  for *any* character from its own data instead of hand-listing two of six —
  `CharacterDB.js` gives each character's starting `weaponId`, and the full
  per-character weapon set lives in `WeaponManager.js`'s `WEAPON_REGISTRY`
  grouped by the `frontend/src/game/weapons/<character>/` folders. Build the
  dev-weapons list from that instead of a second hardcoded list.
- The comment says "start directly at Minute 19" but `surviveSeconds = 240`
  is 4 minutes, not 19 (that would be `1140`). This is either a stale comment
  or a stale value — **ask the project owner which was intended** before
  picking one; don't silently "fix" it to either without confirming.

### What to build

Delete the commented block from `MainScene.js` entirely and replace it with a
real module, e.g. `frontend/src/game/managers/DevToolsManager.js`, exposing
the same capabilities as callable actions instead of hardcoded assignments
baked into scene startup — for example:
`grantGodMode()` (the damageMult/xpMult/speed/hp bundle), `grantMaxWeapons()`
(fixed to cover all 6 characters, per above), `skipToMinute(n)`. Keep it
completely inert — no listeners registered, no effect possible — unless Dev
Mode is actually active for that session.

### Still need your input before implementing

- **Trigger mechanism**: propose a keyboard shortcut (a modifier + key combo
  that won't collide with WASD/space) to toggle a small on-screen Dev Panel,
  rather than requiring a source-code edit to use it at all. Confirm the
  exact combo and whether you want a visible panel (buttons for each action)
  or just a raw toggle-and-forget.
- **Time-skip value**: minute 4 or minute 19 (see above) — or should the skip
  target itself be adjustable from the panel rather than fixed?
- **Admin gating**: needs a new `is_admin boolean default false` column on
  Supabase's `profiles` table, plus a backend check (JWT claim or a dedicated
  endpoint). Confirm: a one-off SQL command in the Supabase dashboard
  (simplest, fine solo) or a versioned migration file kept in the repo
  (better if this project ever gets other contributors)?
- Until admin gating is wired up, gate Dev Mode behind `import.meta.env.DEV`
  (Vite's built-in "not a production build" flag) at minimum — it must never
  be reachable in the deployed Vercel build before the real admin check
  exists.

Only start writing code once the trigger, time-skip value, and admin-gating
approach are confirmed.

---

## Ground rules (from CLAUDE.md — repeated here since this doc travels alone)

- Small, reviewable diffs per item — don't bundle all three into one commit.
- Anything balance/numeric needs a playtest before being called "done."
- When in doubt on scope, ask — don't fill gaps with assumptions, especially
  on Dev Mode and pacing above.
