// src/data/WeaponDB.js

export const WEAPON_DB = {
  // ==========================================
  // Ⅰ. THE BLOOD-EAGLE (VIKING)
  // ==========================================
  bouncing_axe: { // Leviathan's Bite
    id: 'bouncing_axe',
    maxLevel: 5,
    damage: [35, 50, 70, 95, 130],
    cooldown: [1200, 1100, 1000, 850, 700],
    speed: [400, 450, 500, 550, 600],
    bounces: [1, 2, 3, 5, 8] 
  },
  piercing_lance: { // Wyrm-Spit
    id: 'piercing_lance',
    maxLevel: 5,
    damage: [45, 65, 90, 120, 160],
    cooldown: [1500, 1400, 1200, 1000, 800],
    speed: [600, 650, 700, 800, 900],
    pierceCount: [2, 3, 5, 7, 999] 
  },
  seismic_stomp: { // Surtur's Wake
    id: 'seismic_stomp',
    maxLevel: 5,
    damage: [5, 8, 12, 18, 25], // Tick damage
    cooldown: [4000, 3800, 3500, 3000, 2500],
    radius: [80, 110, 140, 180, 240], 
    duration: [2000, 2500, 3000, 3500, 4000] 
  },
  dragon_shout: { // World-Eater's Voice
    id: 'dragon_shout',
    maxLevel: 5,
    damage: [20, 30, 45, 65, 90],
    cooldown: [2500, 2300, 2000, 1700, 1200],
    knockbackForce: [300, 400, 500, 650, 800],
    coneAngle: [45, 60, 75, 90, 120] 
  },

  // ==========================================
  // Ⅱ. THE BLOOD-TIDE SIREN (PIRATE)
  // ==========================================
  musket: { // The Merchant's Folly
    id: 'musket',
    maxLevel: 5,
    damageBase: [10, 15, 20, 30, 40], // Multiplied by a random factor in the class
    damageMaxMult: [2, 3, 4, 6, 10], // e.g. Level 5 can hit for up to 400 damage
    cooldown: [1000, 850, 700, 550, 400],
    speed: [800, 900, 1000, 1100, 1200]
  },
  molotov: { // Nemesis Brew
    id: 'molotov',
    maxLevel: 5,
    damage: [4, 6, 9, 14, 20], // Tick damage in the fire
    cooldown: [2500, 2200, 1900, 1500, 1200],
    radius: [50, 65, 85, 110, 140],
    duration: [3000, 3500, 4000, 5000, 6000]
  },
  treasure_shovel: { // Grave-Robber's Toll
    id: 'treasure_shovel',
    maxLevel: 5,
    damage: [15, 22, 30, 45, 65],
    cooldown: [600, 550, 500, 400, 300], // Extremely fast stab
    range: [40, 45, 50, 60, 75]
  },
  loaded_dice: { // Devil's Bones
    id: 'loaded_dice',
    maxLevel: 5,
    damage: [12, 18, 25, 35, 50],
    cooldown: [1500, 1300, 1100, 900, 700],
    speed: [300, 350, 400, 450, 550],
    diceCount: [1, 2, 3, 4, 6]
  },

  // ==========================================
  // Ⅲ. THE BRANDED HOUND (BERSERKER)
  // ==========================================
  iron_slab: { // The Iron Slab
    id: 'iron_slab',
    maxLevel: 5,
    damage: [40, 60, 85, 120, 180],
    cooldown: [1800, 1600, 1400, 1200, 900], // Slow, heavy sweep
    radius: [70, 85, 105, 130, 160]
  },
  fan_of_knives: { // Swallow's Flight
    id: 'fan_of_knives',
    maxLevel: 5,
    damage: [10, 14, 20, 28, 40],
    cooldown: [1000, 900, 800, 650, 500],
    speed: [500, 550, 600, 650, 750],
    knifeCount: [3, 4, 5, 7, 10]
  },
  trail_grenades: { // Alchemist's Regret
    id: 'trail_grenades',
    maxLevel: 5,
    damage: [30, 45, 65, 90, 130],
    cooldown: [1500, 1300, 1100, 900, 600], // Drops as he walks
    radius: [60, 75, 95, 120, 150]
  },
  arm_cannon: { // The Iron Hand
    id: 'arm_cannon',
    maxLevel: 5,
    damage: [60, 90, 130, 180, 250], // Immense close-range damage
    cooldown: [3000, 2700, 2400, 2000, 1500],
    knockbackSelf: [100, 120, 150, 180, 250] // Pushes the player backward
  },

  // ==========================================
  // Ⅳ. THE LAST PRAETORIAN (PALADIN)
  // ==========================================
  shield_bash: { // The Aegis Wall
    id: 'shield_bash',
    maxLevel: 5,
    damage: [5, 10, 15, 20, 30], // Very low damage
    cooldown: [2000, 1800, 1600, 1400, 1000],
    width: [60, 80, 100, 130, 180],
    stunDuration: [1000, 1200, 1500, 1800, 2500] // Powerful CC
  },
  holy_broadsword: { // Righteous Penance
    id: 'holy_broadsword',
    maxLevel: 5,
    damage: [25, 35, 50, 70, 100],
    cooldown: [1300, 1200, 1100, 950, 800],
    radius: [65, 75, 85, 100, 120]
  },
  consecrated_ground: { // Grace of the White Tree
    id: 'consecrated_ground',
    maxLevel: 5,
    damage: [8, 12, 18, 25, 35], // Tick damage to enemies
    healBase: [0, 0, 0, 0, 2], // Only heals at max level
    cooldown: [5000, 4500, 4000, 3500, 3000],
    radius: [100, 120, 150, 180, 220]
  },
  spinning_cross: { // Inquisitor's Halo
    id: 'spinning_cross',
    maxLevel: 5,
    damage: [15, 22, 30, 42, 60],
    cooldown: [2500, 2300, 2000, 1700, 1400],
    speed: [400, 450, 500, 550, 600],
    spinDuration: [2000, 2500, 3000, 3500, 4500]
  },

  // ==========================================
  // Ⅴ. THE OBSIDIAN SCHOLAR (WITCH)
  // ==========================================
  magic_orb: { // The Void Eye
    id: 'magic_orb',
    maxLevel: 5,
    damage: [15, 25, 40, 60, 90],
    cooldown: [2000, 1800, 1600, 1400, 1200],
    speed: [300, 350, 400, 450, 500] 
  },
  magic_book: { // Forbidden Folios
    id: 'magic_book',
    maxLevel: 5,
    damage: [10, 15, 22, 30, 45],
    cooldown: [5000, 4800, 4500, 4200, 4000],
    count: [2, 3, 4, 5, 6],
    rotationSpeed: [0.015, 0.02, 0.025, 0.03, 0.04], 
    radius: [120, 140, 160, 180, 200] 
  },
  arcane_nova: { // Chaos Pulse
    id: 'arcane_nova',
    maxLevel: 5,
    damage: [25, 40, 60, 85, 120], 
    cooldown: [3000, 2800, 2500, 2100, 1500],
    radius: [150, 180, 220, 270, 350] 
  },
  magic_wand: { // Violet Comet
    id: 'magic_wand',
    maxLevel: 5,
    damage: [8, 12, 18, 25, 35], 
    cooldown: [2000, 1800, 1500, 1200, 1000], 
    width: [10, 15, 20, 30, 45] 
  },

  // ==========================================
  // Ⅵ. THE ASHEN SWALLOW (DRIFTER)
  // ==========================================
  meteorite_blade: { // The Meteorite Blade
    id: 'meteorite_blade',
    maxLevel: 5,
    damage: [25, 35, 50, 75, 110],
    cooldown: [1500, 1300, 1100, 900, 600],
    lungeDistance: [100, 120, 150, 180, 220],
    speed: [600, 700, 800, 900, 1000] // Extremely fast dash
  },
  phantom_strike: { // Tear in the Veil
    id: 'phantom_strike',
    maxLevel: 5,
    damage: [15, 25, 35, 50, 75],
    cooldown: [2500, 2200, 1900, 1500, 1200],
    chainCount: [2, 3, 4, 6, 8], // Number of enemies the phantom chains to
    speed: [800, 850, 900, 950, 1000]
  },
  chilling_aura: { // Echo of the Frost
    id: 'chilling_aura',
    maxLevel: 5,
    damage: [10, 15, 25, 40, 60], // Initial blast damage
    cooldown: [3000, 2800, 2500, 2200, 1800],
    radius: [80, 100, 120, 150, 200],
    freezeDuration: [500, 750, 1000, 1500, 2000] // CC duration in milliseconds
  },
  conjunction_sphere: { // Conjunction Sphere
    id: 'conjunction_sphere',
    maxLevel: 5,
    damage: [40, 60, 85, 120, 170], // High burst, slow cooldown
    cooldown: [4000, 3600, 3200, 2800, 2200],
    meteorCount: [1, 2, 3, 4, 6],
    radius: [60, 75, 90, 110, 140] // Impact explosion radius
  }
};