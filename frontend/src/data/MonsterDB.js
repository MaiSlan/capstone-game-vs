// src/data/MonsterDB.js

export const MONSTER_DB = {
  dummy: { 
    id: 'dummy', 
    name: 'Wandering Husk', 
    hp: 20, 
    speed: 70,       // Slow, shambling 
    damage: 10, 
    xp: 5,
    tint: 0x555555   // Lifeless grey
  },
  bat: { 
    id: 'bat', 
    name: 'Abyssal Bat', 
    hp: 10, 
    speed: 150,      // Fast, erratic
    damage: 5, 
    xp: 3,
    tint: 0x8b0000   // Blood red
  },
  tank_boss: { 
    id: 'tank_boss', 
    name: 'Tartarus Goliath', 
    hp: 600, 
    speed: 50,       // Imposing, unstoppable
    damage: 30, 
    xp: 150,
    tint: 0x3a0000,  // Deep coagulated crimson
    scale: 2.5       // Massive
  }
};