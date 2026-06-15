// src/data/MonsterDB.js

export const MONSTER_DB = {
  slime: { 
    id: 'slime', 
    name: 'Abyssal Slime', 
    hp: 20, 
    speed: 50,       
    damage: 5, 
    xp: 5,
    scale: 2.5
  },
  vampire: { 
    id: 'vampire', 
    name: 'Abyssal Vampire', 
    hp: 30,
    speed: 110,
    damage: 15,
    xp: 8,
    scale: 2.5
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