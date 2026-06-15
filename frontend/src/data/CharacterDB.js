// src/data/CharacterDB.js

export const CHARACTER_DB = {
  viking: { 
    id: 'viking',
    name: 'Hrogar, the Blood-Eagle', 
    hp: 150,        
    speed: 150,     
    weaponName: "Leviathan's Bite",
    weaponId: 'bouncing_axe',
    quotes: [
      "I have died a thousand deaths... where is Valhalla?",
      "My axe is so heavy today.",
      "Even a warrior's soul shatters eventually.",
      "They just keep coming. They never stop.",
      "Don't send me back into the red light."
    ]
  },
  pirate: { 
    id: 'pirate',
    name: 'Captain Calypso', 
    hp: 100,        
    speed: 250,     
    weaponName: "The Merchant's Folly",
    weaponId: 'musket',
    quotes: [
      "There is no gold in the dark... only teeth.",
      "I'd trade every coin I have to wake up from this.",
      "I rolled the dice, and we all lost.",
      "The sea cannot wash this blood from my hands."
    ]
  },
  berserker: { 
    id: 'berserker',
    name: 'Galt, the Branded Hound', 
    hp: 120,        
    speed: 180,     
    weaponName: 'The Iron Slab',
    weaponId: 'iron_slab',
    quotes: [
      "The brand... it’s bleeding again.",
      "Even if my flesh rots, my sword will swing.",
      "I am already a corpse. Let them come.",
      "There is no end. Only the next swing."
    ]
  },
  paladin: { 
    id: 'paladin',
    name: 'Balian, Last Praetorian', 
    hp: 200,        
    speed: 120,     
    weaponName: 'The Aegis Wall',
    weaponId: 'shield_bash',
    quotes: [
      "The Emperor's light does not reach this place.",
      "My shield is heavy, but my faith is shattered.",
      "Forgive me, brothers. I cannot hold the line.",
      "Is this hell, or have we been abandoned?"
    ]
  },
  witch: { 
    id: 'witch',
    name: 'Yenna, Obsidian Scholar', 
    hp: 90,         
    speed: 230,     
    weaponName: 'The Void Eye',
    weaponId: 'magic_orb',
    quotes: [
      "I just wanted to find my favorite hat...",
      "The shadows have teeth here. I want to go home.",
      "Why does the sun look like a bleeding eye?",
      "Please... don't select me again. It hurts.",
      "I forgot what the real sky looks like."
    ]
  }
};