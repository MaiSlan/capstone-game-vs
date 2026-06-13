// src/data/MonsterDB.js

export const MONSTER_DB = {
  slime: { 
    id: 'slime', 
    name: 'Abyssal Slime', 
    hp: 15, 
    speed: 60,       
    damage: 5, 
    xp: 2,
    scale: 1.5
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