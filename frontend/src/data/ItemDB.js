// src/data/ItemDB.js

export const ITEM_DB = {
  speed_boots: { maxLevel: 5, speed_multiplier: [0.05, 0.10, 0.15, 0.22, 0.30] },
  vitality_ring: { maxLevel: 5, max_hp_multiplier: [0.10, 0.20, 0.30, 0.40, 0.50] },
  
  // Thief Gloves: Pick up stuff further away, but attacks are slightly slower
  thief_gloves: { maxLevel: 5, pickup_multiplier: [0.3, 0.6, 0.9, 1.2, 1.5], cooldown_multiplier: [0.05, 0.10, 0.15, 0.20, 0.25] },
  
  // Coin Purse: More gold (we will wire this up when coins are added)
  coin_purse: { maxLevel: 5, coin_multiplier: [0.2, 0.4, 0.6, 0.8, 1.0] },
  
  // Sacrificial Dagger: High Damage, but lowers your Max HP (Glass Cannon)
  sacrificial_dagger: { maxLevel: 5, damage_multiplier: [0.15, 0.30, 0.45, 0.60, 0.80], max_hp_multiplier: [-0.05, -0.10, -0.15, -0.20, -0.25] },
  
  // Broken Arrow: High Armor/Defense, but ruins your movement speed
  broken_arrow: { maxLevel: 5, armor: [5, 10, 15, 20, 25], speed_multiplier: [-0.05, -0.10, -0.15, -0.20, -0.30] },
  
  // Voodoo Doll: Drains HP every second, but gives MASSIVE speed and damage
  voodoo_doll: { maxLevel: 5, hp_drain_per_sec: [1, 2, 3, 4, 5], damage_multiplier: [0.4, 0.8, 1.2, 1.6, 2.0], speed_multiplier: [0.2, 0.3, 0.4, 0.5, 0.6] },
  
  // Haste Necklace: Attacks fire much faster (reduces cooldown)
  haste_necklace: { maxLevel: 5, cooldown_multiplier: [-0.1, -0.15, -0.20, -0.25, -0.35] },
  
  // Mysterious Letter: Increases all XP gained.
  mysterious_letter: { maxLevel: 5, xp_multiplier: [0.1, 0.2, 0.3, 0.4, 0.5] },
  
  // Cursed Skull: Grants Lifesteal on kills, but makes more enemies spawn (we will wire the spawn rate to the Director later)
  cursed_skull: { maxLevel: 5, lifesteal: [1, 2, 3, 4, 5], curse_multiplier: [0.1, 0.2, 0.3, 0.4, 0.5] }
};