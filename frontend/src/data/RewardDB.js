// src/data/RewardDB.js

export const REWARD_DB = {
  weapons: {
    witch: [
      { id: 'magic_book', type: 'weapon', title: 'Swirling Book', desc: 'An ancient tome that orbits you.', icon: 'assets/weapons/spellbook.png' },
      // TODO: Add Magic Wand, Familiar, etc.
    ],
    viking: [
      { id: 'lance', type: 'weapon', title: 'Piercing Lance', desc: 'Fires a heavy forward lance.', icon: 'assets/weapons/spear.png' },
      // TODO: Add Throwing Axes, Shield, etc.
    ],
    template: [
      { id: 'lance', type: 'weapon', title: 'Piercing Lance', desc: 'Fires a heavy forward lance.', icon: 'assets/weapons/spear.png' },
    ]
  },
  items: {
    common: [
      { id: 'speed_boots', type: 'item', title: 'Speed Boots', desc: 'Increases movement speed.', icon: 'assets/items/equipable/boots.png' },
      { id: 'vitality_ring', type: 'item', title: 'Vitality Ring', desc: 'Increases Max HP.', icon: 'assets/items/equipable/ring.png' },
      { id: 'thief_gloves', type: 'item', title: 'Thief Gloves', desc: 'Increases pickup range, but attacks slower.', icon: 'assets/items/equipable/gloves.png' },
      { id: 'coin_purse', type: 'item', title: 'Coin Purse', desc: 'Enemies drop more gold.', icon: 'assets/items/equipable/coin_purse.png' },
      { id: 'sacrificial_dagger', type: 'item', title: 'Sacrificial Dagger', desc: 'Increases Damage, reduces Max HP.', icon: 'assets/items/equipable/dagger.png' },
      { id: 'broken_arrow', type: 'item', title: 'Broken Arrow', desc: 'Increases Armor, drastically reduces speed.', icon: 'assets/items/equipable/broken_arrow.png' },
      { id: 'voodoo_doll', type: 'item', title: 'Voodoo Doll', desc: 'Massive buffs, but constantly drains HP.', icon: 'assets/items/equipable/voodoo.png' },
      { id: 'haste_necklace', type: 'item', title: 'Haste Necklace', desc: 'Increases attack speed.', icon: 'assets/items/equipable/necklace.png' },
      { id: 'mysterious_letter', type: 'item', title: 'Mysterious Letter', desc: 'Increases all XP gained.', icon: 'assets/items/equipable/letter.png' },
      { id: 'cursed_skull', type: 'item', title: 'Cursed Skull', desc: 'Grants Lifesteal, but increases enemy spawns.', icon: 'assets/items/equipable/skull.png' }
    ],
    consumables: [
      { id: 'heal', type: 'consumable', title: 'Health Potion', desc: 'Instantly restores all HP.', icon: 'assets/items/consumable/potion.png' }
    ]
  }
};