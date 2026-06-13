// src/data/CharacterDB.js

export const CHARACTER_DB = {
  witch: { 
    id: 'witch',
    name: 'The Witch', 
    hp: 80,         // Fragile
    speed: 220,     // Very Fast
    weaponName: 'Magic Missiles',
    weaponId: 'magic_orb',
    quote: '"I only came down here because I dropped my favorite hat..."'
  },
  viking: { 
    id: 'viking',
    name: 'The Viking', 
    hp: 150,        // Tanky
    speed: 150,     // Slow
    weaponName: 'Axe Cleave',
    weaponId: 'cleave_axe',
    quote: '"My legs are way too short for all this running!"'
  },
  template: {
    id: 'template',
    name: 'The Template',
    hp: 100,         // Balanced
    speed: 180,      // Average-Fast
    weaponName: 'Axe Cleave',
    weaponId: 'cleave_axe',
    quote: '"I am not unfinished. I am full of potential."'
  }
};