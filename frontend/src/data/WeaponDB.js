// src/data/WeaponDB.js

export const WEAPON_DB = {
  cleave_axe: {
    id: 'cleave_axe',
    maxLevel: 5,
    damage: [35, 45, 55, 70, 90], 
    cooldown: [1800, 1700, 1600, 1400, 1200], 
    radius: [140, 145, 150, 160, 175] 
  },
  magic_orb: {
    id: 'magic_orb',
    maxLevel: 5,
    damage: [10, 12, 15, 18, 25],
    cooldown: [1000, 900, 800, 650, 500],
    speed: [400, 420, 450, 480, 550]
  },
  lance: {
    id: 'lance',
    maxLevel: 5,
    damage: [15, 20, 25, 30, 40],
    cooldown: [1500, 1400, 1300, 1100, 900],
    speed: [500, 550, 600, 650, 750],
    pierce: [3, 4, 4, 5, 6]
  },
  magic_book: {
    id: 'magic_book',
    maxLevel: 5,
    damage: [5, 7, 9, 12, 15],
    rotationSpeed: [0.05, 0.06, 0.07, 0.08, 0.1],
    radius: [60, 65, 70, 80, 90]
  }
};