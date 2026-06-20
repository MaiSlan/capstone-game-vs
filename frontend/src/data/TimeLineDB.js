// src/data/TimelineDB.js

/**
 * PATTERNS GLOSSARY:
 * 'random_edge'     - Spawns at a random point just outside the camera view.
 * 'wall_horizontal' - Spawns a straight horizontal line of enemies sweeping up or down.
 * 'wall_vertical'   - Spawns a straight vertical line sweeping left or right.
 * 'circle'          - Spawns a perfect ring of enemies around the player closing in.
 * 'boss'            - Spawns a single high-priority target and pauses minor spawns if needed.
 */

export const TIMELINE_DB = [
  // ==========================================
  // PHASE 1: THE AWAKENING (Minutes 0 - 5)
  // ==========================================
  
  // MINUTE 0: Warmup
  {
    startTime: 0,
    endTime: 60,
    monsterId: 'abyssal_sludge',
    spawnRateMs: 1000,     
    countPerSpawn: 3,      
    pattern: 'random_edge' 
  },

  // MINUTE 1: Introduction of Exploders
  {
    startTime: 60,
    endTime: 120,
    monsterId: 'abyssal_sludge',
    spawnRateMs: 800,
    countPerSpawn: 4,
    pattern: 'random_edge'
  },
  {
    startTime: 75,
    endTime: 120,
    monsterId: 'blighted_gore_thrall',
    spawnRateMs: 3000,
    countPerSpawn: 1,
    pattern: 'random_edge'
  },

  // MINUTE 2: First Bat Wall Check & Skeletons Arrive
  {
    startTime: 120,
    endTime: 125,         // Lasts only 5 seconds!
    monsterId: 'night_terror',
    spawnRateMs: 500,     // Fires a wall wave every half second
    countPerSpawn: 15,
    pattern: 'wall_horizontal'
  },
  {
    startTime: 125,
    endTime: 180,
    monsterId: 'hollowed_legionnaire',
    spawnRateMs: 2000,
    countPerSpawn: 2,
    pattern: 'random_edge'
  },

  // MINUTE 3: Flankers & Turrets
  {
    startTime: 180,
    endTime: 240,
    monsterId: 'crimson_strigoi',
    spawnRateMs: 1500,
    countPerSpawn: 2,
    pattern: 'random_edge'
  },
  {
    startTime: 200,
    endTime: 240,
    monsterId: 'ocular_sentinel',
    spawnRateMs: 5000,    // Spawns a stationary turret every 5 seconds
    countPerSpawn: 1,
    pattern: 'random_edge'
  },

  // MINUTE 4: First Sub-Boss & The First Ring
  {
    startTime: 240,
    endTime: 241,         // Triggers exactly at 4:00
    monsterId: 'echo_of_the_vessel',
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  },
  {
    startTime: 250,
    endTime: 260,
    monsterId: 'hollowed_legionnaire',
    spawnRateMs: 5000,    // Two waves of skeleton circles
    countPerSpawn: 16,
    pattern: 'circle'
  },

  // ==========================================
  // PHASE 2: THE DESCENT (Minutes 5 - 10)
  // ==========================================

  // MINUTE 5: The First Brute & Swarm Escalation
  {
    startTime: 300,
    endTime: 360,
    monsterId: 'abyssal_sludge',
    spawnRateMs: 500,     // Slimes spawn twice as fast now
    countPerSpawn: 5,
    pattern: 'random_edge'
  },
  {
    startTime: 310,
    endTime: 360,
    monsterId: 'abyssal_behemoth',
    spawnRateMs: 15000,   // A massive tank every 15 seconds
    countPerSpawn: 1,
    pattern: 'random_edge'
  },

  // MINUTE 6: Bullet Hell
  {
    startTime: 360,
    endTime: 420,
    monsterId: 'ocular_sentinel',
    spawnRateMs: 2500,    // Screen fills with turrets
    countPerSpawn: 2,
    pattern: 'random_edge'
  },
  {
    startTime: 375,
    endTime: 385,
    monsterId: 'night_terror',
    spawnRateMs: 400,
    countPerSpawn: 15,
    pattern: 'wall_vertical' // Force horizontal dodging
  },

  // MINUTE 7: Vampiric Onslaught
  {
    startTime: 420,
    endTime: 480,
    monsterId: 'crimson_strigoi',
    spawnRateMs: 1000,
    countPerSpawn: 4,
    pattern: 'random_edge'
  },
  {
    startTime: 440,
    endTime: 450,
    monsterId: 'hollowed_legionnaire',
    spawnRateMs: 3000,
    countPerSpawn: 20,
    pattern: 'circle'
  },

  // MINUTE 8: Second Sub-Boss
  {
    startTime: 480,
    endTime: 481,
    monsterId: 'echo_of_the_vessel',
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  },

  // MINUTE 9: The Gauntlet (Pre-Boss Tension)
  {
    startTime: 540,
    endTime: 595,
    monsterId: 'blighted_gore_thrall',
    spawnRateMs: 1500,
    countPerSpawn: 3,
    pattern: 'random_edge'
  },
  {
    startTime: 540,
    endTime: 595,
    monsterId: 'abyssal_behemoth',
    spawnRateMs: 10000,
    countPerSpawn: 2,
    pattern: 'random_edge'
  },

  // ==========================================
  // PHASE 3: THE MID-GAME FILTER (Minute 10)
  // ==========================================

  // MINUTE 10: MID-BOSS (Karnok)
  {
    startTime: 600,
    endTime: 601,
    monsterId: 'karnok_blood_beast',
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  },

  // ==========================================
  // PHASE 4: THE ABYSS (Minutes 11 - 19)
  // ==========================================
  // Note: From this point on, Slimes are retired. The baseline mob is now Gore-Thralls and Strigoi.

  // MINUTE 11 - 14: Elite Scaling
  {
    startTime: 660,
    endTime: 840,
    monsterId: 'crimson_strigoi',
    spawnRateMs: 800,
    countPerSpawn: 4,
    pattern: 'random_edge'
  },
  {
    startTime: 660,
    endTime: 840,
    monsterId: 'blighted_gore_thrall',
    spawnRateMs: 1200,
    countPerSpawn: 3,
    pattern: 'random_edge'
  },
  {
    startTime: 720,
    endTime: 730,
    monsterId: 'night_terror',
    spawnRateMs: 300,    // Violent, dense bat walls
    countPerSpawn: 20,
    pattern: 'wall_horizontal'
  },

  // MINUTE 15: Final Sub-Boss Check
  {
    startTime: 900,
    endTime: 901,
    monsterId: 'echo_of_the_vessel',
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  },

  // MINUTE 16 - 19: Pure Chaos (Multiple Behemoths, Constant Rings)
  {
    startTime: 960,
    endTime: 1190,
    monsterId: 'hollowed_legionnaire',
    spawnRateMs: 8000,
    countPerSpawn: 24,
    pattern: 'circle'
  },
  {
    startTime: 960,
    endTime: 1190,
    monsterId: 'ocular_sentinel',
    spawnRateMs: 2000,
    countPerSpawn: 3,
    pattern: 'random_edge'
  },
  {
    startTime: 1020,
    endTime: 1190,
    monsterId: 'abyssal_behemoth',
    spawnRateMs: 8000,
    countPerSpawn: 2,
    pattern: 'random_edge'
  },
  {
    startTime: 1140,
    endTime: 1150,
    monsterId: 'night_terror',
    spawnRateMs: 250,
    countPerSpawn: 25,
    pattern: 'wall_vertical' // Final dodging gauntlet before the Eclipse
  },

  // ==========================================
  // PHASE 5: THE ECLIPSE (Minute 20)
  // ==========================================
  
  // The WaveManager will watch for exactly 1200 seconds. 
  // When it hits, it deletes all existing monsters and randomly selects one of the 5 Eclipse Lords.
  {
    startTime: 1200,
    endTime: 1201,
    monsterId: 'TRIGGER_ECLIPSE', 
    spawnRateMs: 1000,
    countPerSpawn: 1,
    pattern: 'boss'
  }
];