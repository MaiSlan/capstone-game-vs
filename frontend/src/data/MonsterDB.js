// src/data/MonsterDB.js

export const MONSTER_DB = {
  // ==========================================
  // TIER 1: THE SWARM (Fodder & Rushers)
  // ==========================================
  abyssal_sludge: {
    id: 'abyssal_sludge',
    name: 'Abyssal Sludge',
    baseHp: 20,
    baseDamage: 5,
    baseSpeed: 40,
    xpValue: 15,      
    spriteKey: 'slime'
  },
  night_terror: {
    id: 'night_terror',
    name: 'Night-Terror Swarm',
    baseHp: 5,
    baseDamage: 8,
    baseSpeed: 160, 
    xpValue: 8,       
    spriteKey: 'bat'
  },
  blighted_gore_thrall: {
    id: 'blighted_gore_thrall',
    name: 'Blighted Gore-Thrall',
    baseHp: 15,
    baseDamage: 25, 
    baseSpeed: 85,    
    xpValue: 25,      
    spriteKey: 'gore_thrall'
  },

  // ==========================================
  // TIER 2: THE VANGUARD (Core Combatants)
  // ==========================================
  hollowed_legionnaire: {
    id: 'hollowed_legionnaire',
    name: 'Hollowed Legionnaire',
    baseHp: 80,
    baseDamage: 18,
    baseSpeed: 30,  
    xpValue: 35,      
    spriteKey: 'skeleton' 
  },
  crimson_strigoi: {
    id: 'crimson_strigoi',
    name: 'Crimson Strigoi',
    baseHp: 50,
    baseDamage: 12,
    baseSpeed: 90,  
    xpValue: 40,      
    spriteKey: 'vampire' 
  },
  ocular_sentinel: {
    id: 'ocular_sentinel',
    name: 'Ocular Sentinel',
    baseHp: 30,
    baseDamage: 15,
    baseSpeed: 10,  
    xpValue: 50,      
    spriteKey: 'eye_sentinel'
  },

  // ==========================================
  // TIER 3: THE BRUTES (Heavy Elites)
  // ==========================================
  abyssal_behemoth: {
    id: 'abyssal_behemoth',
    name: 'Abyssal Behemoth',
    baseHp: 600,
    baseDamage: 25,
    baseSpeed: 20,  
    xpValue: 250,     
    spriteKey: 'troll'
  },

  // ==========================================
  // SUB-BOSSES (Event Triggers)
  // ==========================================
  echo_of_the_vessel: {
    id: 'echo_of_the_vessel',
    name: 'Echo of the Vessel',
    baseHp: 2500,
    baseDamage: 20,
    baseSpeed: 75,
    xpValue: 1000,    
    spriteKey: 'doppelganger' 
  },

  // ==========================================
  // MID-GAME BOSS (Minute 10)
  // ==========================================
  zul_karn: {
    id: 'zul_karn',
    name: 'Zul\'Karn, the Crimson Behemoth',
    baseHp: 8000,
    baseDamage: 35,
    baseSpeed: 45,  
    xpValue: 2500,    
    spriteKey: 'karnok'
  },
  
  // ==========================================
  // FINAL BOSSES: THE ECLIPSE LORDS (Minute 20)
  // ==========================================
  obsidian_falcon: {
    id: 'obsidian_falcon',
    name: 'The Obsidian Falcon',
    baseHp: 20000,
    baseDamage: 40,
    baseSpeed: 60,
    xpValue: 0, 
    spriteKey: 'obsidian_falcon'
  },
  carmilla: {
    id: 'carmilla',
    name: 'Carmilla, the Thistle-Saint',
    baseHp: 20000,
    baseDamage: 35,
    baseSpeed: 40,
    xpValue: 0,
    spriteKey: 'bramble_queen'
  },
  grand_haruspex: {
    id: 'grand_haruspex',
    name: 'The Grand Haruspex',
    baseHp: 18000,
    baseDamage: 50, 
    baseSpeed: 0,   
    xpValue: 0,
    spriteKey: 'grand_haruspex'
  },
  elara: {
    id: 'elara',
    name: 'Elara, the Weeping Miasma',
    baseHp: 25000, 
    baseDamage: 30,
    baseSpeed: 20,
    xpValue: 0,
    spriteKey: 'rot_bringer'
  },
  valeria: {
    id: 'valeria',
    name: 'Valeria, the Crimson Maestro',
    baseHp: 15000, 
    baseDamage: 35,
    baseSpeed: 80,
    xpValue: 0,
    spriteKey: 'mad_puppeteer'
  }
};