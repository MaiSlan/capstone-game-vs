// src/data/ItemDB.js

export const ITEM_DB = {
  speed_boots: {
    id: 'speed_boots',
    maxLevel: 5,
    // Bonus Speed %: [5%, 10%, 15%, 22%, 30%]
    speed_multiplier: [0.05, 0.10, 0.15, 0.22, 0.30] 
  },
  vitality_ring: {
    id: 'vitality_ring',
    maxLevel: 5,
    // Bonus Max HP %: [10%, 20%, 30%, 40%, 50%]
    max_hp_multiplier: [0.10, 0.20, 0.30, 0.40, 0.50]
  },
  // Future item example: 
  // titan_belt: { armor_bonus: [5, 10, 15, 20, 30] }
};