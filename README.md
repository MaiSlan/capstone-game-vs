# Branded Descent

A dark-fantasy survival roguelike in the style of *Vampire Survivors*, playable in the browser.
Pick a hero, survive 20 minutes of escalating monster waves with auto-firing weapons you level up
along the way, then face one of five Eclipse Lords in a final boss fight. The game is set in the
Astral Interstice, a realm where trapped souls are forced through an endless cycle of death and
resurrection.

**Play it live:** https://capstone-game-vs.vercel.app

> The backend runs on Render's free tier, which sleeps when idle. The first login or sign-up after a
> quiet period can take **30–60 seconds** while the server wakes up. After that, it responds normally.

## Screenshots

<!-- TODO: add gameplay screenshots / a short GIF (e.g. docs/screenshots/*.png) -->

*Coming soon.*

## Features

- **6 heroes**, each with their own starting weapon and a set of 4 signature weapons (24 weapons
  in total) that level up during a run. All six are playable. Three still use a placeholder
  standing sprite while their walk animations are in progress.
- **20-minute runs** driven by a timeline-based spawn director, with wave patterns like edge
  swarms, encircling rings and sweeping walls of enemies
- **Boss encounters**: a recurring mimic sub-boss that copies your own weapon, a mid-run
  "great filter" boss at minute 10, and a randomly chosen Eclipse Lord at minute 20
- **Meta-progression**: gold earned in runs is spent at the BoneFire shop on permanent upgrades
  and character unlocks
- **Persistent accounts**: sign-up/login, lifetime stats on a profile page (every run is also
  logged server-side), and a bestiary that fills in as you encounter monsters
- **Three languages**: English, French and Simplified Chinese, switchable from the menus or
  mid-run

## Tech stack

| Layer    | Technology                                            | Hosting               |
|----------|-------------------------------------------------------|-----------------------|
| Frontend | React 19, Vite, Phaser 4, Tailwind CSS, react-i18next | Vercel                |
| Backend  | FastAPI (Python)                                      | Render                |
| Data     | Supabase (Postgres + Auth)                            | Supabase              |

All three services run on free tiers.

### How it fits together

- **React** handles everything outside of combat: routing, auth, the shop, the bestiary,
  profile stats and settings.
- **Phaser** runs the real-time combat loop (physics, spawning, weapons, in-run inventory) on a
  canvas mounted inside the React app.
- The two sides never reach into each other's internals. They communicate only through custom
  DOM events on `window` (e.g. `VS_UPDATE_HP`, `VS_LEVEL_UP`, `VS_SHOW_BOSS_BAR`).
- **Game content is data-driven.** Heroes, monsters, weapons, items, level-up rewards and the
  spawn timeline all live in `frontend/src/data/*DB.js`. Entity and weapon classes read their
  numbers from those files, so balancing the game rarely means touching engine code.
- **The FastAPI backend** is the only thing that talks to Supabase with privileged credentials.
  It verifies the player's JWT and handles purchases, unlocks, end-of-run rewards and stats.

## Project structure

```
backend/
  main.py              FastAPI app, CORS, /health
  run_server.py        Local dev entry point (Uvicorn on port 5000)
  app/api/routes/      auth, shop, game, stats endpoints
  app/core/            settings (.env loading) and JWT verification
  app/db/              Supabase clients
frontend/
  src/pages/           React screens (landing, auth, character select, shop, bestiary, ...)
  src/game/scenes/     Phaser scenes (MainScene = the combat loop)
  src/game/entities/   Player, heroes, monsters, bosses
  src/game/managers/   Wave director, weapons, items, loot, meta-stats
  src/game/weapons/    One file per weapon, grouped by hero
  src/data/            Game content and balance tables
supabase/
  migrations/          Database schema, RPC functions and access rules (run in order)
start_dev.bat          Launches backend + frontend together (Windows)
```

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) (a current LTS release) and npm
- Python 3 (the project is developed on Python 3.14)
- A [Supabase](https://supabase.com/) project

### 1. Clone the repo

```bash
git clone https://github.com/MaiSlan/capstone-game-vs.git
cd capstone-game-vs
```

### 2. Configure the backend

Create `backend/.env`:

```env
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

The service-role key bypasses Supabase row-level security. Keep it server-side only and never
commit it (`.env` is already gitignored).

Then create the database schema: in the Supabase SQL editor, run the files in
`supabase/migrations/` in order. See [`supabase/README.md`](supabase/README.md) for details.

### 3. Install and run

**One command (Windows):** after installing dependencies once (see below), run this from the repo
root:

```bat
start_dev.bat
```

It opens two terminal windows, one for the backend and one for the frontend.

**Manual setup (any OS):**

Backend, from `backend/`:

```bash
python -m venv venv
# Windows:        venv\Scripts\activate
# macOS / Linux:  source venv/bin/activate
pip install -r requirements.txt
python run_server.py
```

This serves the API at `http://localhost:5000` with hot reload. Check it's up at
`http://localhost:5000/health`.

Frontend, from `frontend/`:

```bash
npm install
npm run dev
```

Vite serves the game at `http://localhost:5173`. In dev mode, the frontend automatically talks to
the local backend on port 5000. Production builds point to the deployed Render API instead.

## Credits

Solo capstone project by **Basile Herquelle**, Master's in Data Engineering at ECE Paris.
