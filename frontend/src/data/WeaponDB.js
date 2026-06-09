// src/data/WeaponDB.js

export const WEAPON_DB = {
  cleave_axe: {
    id: 'cleave_axe',
    damage: 25,
    cooldown: 1200, // Fires every 1.2 seconds
  },
  magic_orb: {
    id: 'magic_orb',
    damage: 10,
    cooldown: 1000, // Fires every 1 second
    speed: 400
  },
  lance: {
    id: 'lance',
    damage: 15,
    cooldown: 1500,
    speed: 500,
    pierce: 3
  },
  magic_book: {
    id: 'magic_book',
    damage: 5,
    rotationSpeed: 0.05,
    radius: 60
  }
};