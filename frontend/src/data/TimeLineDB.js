// src/data/TimelineDB.js

export const TIMELINE_DB = [
  // ==========================================
  // PHASE 1: THE AWAKENING (Minutes 0 - 5)
  // ==========================================
  { startTime: 0, endTime: 60, monsterId: 'abyssal_sludge', spawnRateMs: 1000, countPerSpawn: 3, pattern: 'random_edge' },
  { startTime: 60, endTime: 120, monsterId: 'abyssal_sludge', spawnRateMs: 800, countPerSpawn: 4, pattern: 'random_edge' },
  { startTime: 75, endTime: 120, monsterId: 'blighted_gore_thrall', spawnRateMs: 3000, countPerSpawn: 1, pattern: 'random_edge' },
  { startTime: 120, endTime: 125, monsterId: 'night_terror', spawnRateMs: 500, countPerSpawn: 15, pattern: 'wall_horizontal' },
  { startTime: 125, endTime: 180, monsterId: 'hollowed_legionnaire', spawnRateMs: 2000, countPerSpawn: 2, pattern: 'random_edge' },
  { startTime: 180, endTime: 240, monsterId: 'crimson_strigoi', spawnRateMs: 1500, countPerSpawn: 2, pattern: 'random_edge' },
  { startTime: 200, endTime: 240, monsterId: 'ocular_sentinel', spawnRateMs: 5000, countPerSpawn: 1, pattern: 'random_edge' },
  { startTime: 240, endTime: 241, monsterId: 'echo_of_the_vessel', spawnRateMs: 1000, countPerSpawn: 1, pattern: 'boss' },
  { startTime: 250, endTime: 260, monsterId: 'hollowed_legionnaire', spawnRateMs: 5000, countPerSpawn: 16, pattern: 'circle' },

  // ==========================================
  // PHASE 2: THE DESCENT (Minutes 5 - 10)
  // ==========================================
  { startTime: 300, endTime: 360, monsterId: 'abyssal_sludge', spawnRateMs: 500, countPerSpawn: 5, pattern: 'random_edge' },
  { startTime: 310, endTime: 360, monsterId: 'abyssal_behemoth', spawnRateMs: 15000, countPerSpawn: 1, pattern: 'random_edge' },
  { startTime: 360, endTime: 420, monsterId: 'ocular_sentinel', spawnRateMs: 2500, countPerSpawn: 2, pattern: 'random_edge' },
  { startTime: 375, endTime: 385, monsterId: 'night_terror', spawnRateMs: 400, countPerSpawn: 15, pattern: 'wall_vertical' },
  { startTime: 420, endTime: 480, monsterId: 'crimson_strigoi', spawnRateMs: 1000, countPerSpawn: 4, pattern: 'random_edge' },
  { startTime: 440, endTime: 450, monsterId: 'hollowed_legionnaire', spawnRateMs: 3000, countPerSpawn: 20, pattern: 'circle' },
  { startTime: 480, endTime: 481, monsterId: 'echo_of_the_vessel', spawnRateMs: 1000, countPerSpawn: 1, pattern: 'boss' },
  { startTime: 540, endTime: 595, monsterId: 'blighted_gore_thrall', spawnRateMs: 1500, countPerSpawn: 3, pattern: 'random_edge' },
  { startTime: 540, endTime: 595, monsterId: 'abyssal_behemoth', spawnRateMs: 10000, countPerSpawn: 2, pattern: 'random_edge' },

  // ==========================================
  // PHASE 3: THE MID-GAME FILTER (Minute 10)
  // ==========================================
  {
    startTime: 600,
    endTime: 601,
    monsterId: 'zul_karn', // THE FIX: Using the new Mid-Boss ID
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  },

  // ==========================================
  // PHASE 4: THE ABYSS (Minutes 11 - 19)
  // ==========================================
  { startTime: 660, endTime: 840, monsterId: 'crimson_strigoi', spawnRateMs: 800, countPerSpawn: 4, pattern: 'random_edge' },
  { startTime: 660, endTime: 840, monsterId: 'blighted_gore_thrall', spawnRateMs: 1200, countPerSpawn: 3, pattern: 'random_edge' },
  { startTime: 720, endTime: 730, monsterId: 'night_terror', spawnRateMs: 300, countPerSpawn: 20, pattern: 'wall_horizontal' },
  { startTime: 900, endTime: 901, monsterId: 'echo_of_the_vessel', spawnRateMs: 1000, countPerSpawn: 1, pattern: 'boss' },
  { startTime: 960, endTime: 1190, monsterId: 'hollowed_legionnaire', spawnRateMs: 8000, countPerSpawn: 24, pattern: 'circle' },
  { startTime: 960, endTime: 1190, monsterId: 'ocular_sentinel', spawnRateMs: 2000, countPerSpawn: 3, pattern: 'random_edge' },
  { startTime: 1020, endTime: 1190, monsterId: 'abyssal_behemoth', spawnRateMs: 8000, countPerSpawn: 2, pattern: 'random_edge' },
  { startTime: 1140, endTime: 1150, monsterId: 'night_terror', spawnRateMs: 250, countPerSpawn: 25, pattern: 'wall_vertical' },

  // ==========================================
  // PHASE 5: THE ECLIPSE (Minute 20)
  // ==========================================
  {
    startTime: 1200,
    endTime: 1201,
    monsterId: 'TRIGGER_ECLIPSE', 
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  }
];