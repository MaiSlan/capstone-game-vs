// src/data/RewardDB.js

export const REWARD_DB = {
  weapons: {
    witch: [
      { id: 'magic_book', type: 'weapon', title: 'Swirling Book', desc: 'An ancient tome that orbits you.', icon: '📖' },
      // TODO: Add Magic Wand, Familiar, etc.
    ],
    viking: [
      { id: 'lance', type: 'weapon', title: 'Piercing Lance', desc: 'Fires a heavy forward lance.', icon: '🗡️' },
      // TODO: Add Throwing Axes, Shield, etc.
    ]
  },
  items: {
    common: [
      { id: 'speed_boots', type: 'item', title: 'Speed Boots', desc: 'Passively increases movement speed.', icon: '👢' },
      { id: 'vitality_ring', type: 'item', title: 'Vitality Ring', desc: 'Increases Max HP by 25.', icon: '💍' },
      { id: 'heal', type: 'consumable', title: 'Health Potion', desc: 'Instantly restores all HP.', icon: 'assets/items/potion.png' }
    ]
  }
};