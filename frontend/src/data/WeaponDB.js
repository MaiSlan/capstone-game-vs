// src/data/WeaponDB.js

export const WEAPON_DB = {
  // Viking weapons
  cleave_axe: {
    id: 'cleave_axe',
    maxLevel: 5,
    damage: [35, 45, 55, 70, 90], 
    cooldown: [1800, 1700, 1600, 1400, 1200], 
    radius: [140, 145, 150, 160, 175] 
  },
  lance: {
    id: 'lance',
    maxLevel: 5,
    damage: [15, 20, 25, 30, 40],
    cooldown: [1500, 1400, 1300, 1100, 900],
    speed: [500, 550, 600, 650, 750],
    pierce: [3, 4, 4, 5, 6]
  },
  // Witch weapons
  magic_orb: { // BUFFED: Shoots faster, hits much harder at max level
    id: 'magic_orb',
    maxLevel: 5,
    damage: [15, 20, 28, 38, 55],
    cooldown: [900, 800, 700, 550, 400],
    speed: [450, 480, 520, 560, 650]
  },
  magic_book: { // BUFFED: Spins faster, larger protective radius
    id: 'magic_book',
    maxLevel: 5,
    damage: [10, 15, 22, 30, 45],
    rotationSpeed: [0.06, 0.07, 0.08, 0.1, 0.12],
    radius: [65, 75, 85, 95, 110] 
  },
  magic_wand: {
    id: 'magic_wand',
    maxLevel: 5,
    damage: [8, 12, 18, 25, 35],
    cooldown: [500, 400, 300, 200, 100], // Becomes a laser beam at Level 5
    speed: [500, 550, 600, 700, 800]
  },
  arcane_nova: {
    id: 'arcane_nova',
    maxLevel: 5,
    damage: [25, 40, 60, 85, 120], // Huge burst damage
    cooldown: [3000, 2800, 2500, 2100, 1500],
    radius: [150, 180, 220, 270, 350]
  }
};