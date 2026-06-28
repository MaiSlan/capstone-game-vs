// src/data/RewardDB.js

export const REWARD_DB = {
  weapons: {
    viking: [
      { id: 'bouncing_axe', type: 'weapon', title: 'Leviathan\'s Bite', desc: 'A frosted axe that seeks warmth, leaping from vein to vein.', icon: 'assets/weapons/axe.png' },
      { id: 'piercing_lance', type: 'weapon', title: 'Wyrm-Spit', desc: 'A great harpoon meant to pierce scales thick as mountains.', icon: 'assets/weapons/spear.png' },
      { id: 'seismic_stomp', type: 'weapon', title: 'Surtur\'s Wake', desc: 'Shatter the earth to ensnare the foolish. Leaves burning ruins.', icon: 'assets/weapons/stomp_icon.png' },
      { id: 'dragon_shout', type: 'weapon', title: 'World-Eater\'s Voice', desc: 'Guttural words of power. Blasts the swarm backward into dust.', icon: 'assets/weapons/shout_icon.png' }
    ],
    pirate: [
      { id: 'musket', type: 'weapon', title: 'The Merchant\'s Folly', desc: 'Chaotic powder; some shots merely sting, others tear reality asunder.', icon: 'assets/weapons/musket_icon.png' },
      { id: 'molotov', type: 'weapon', title: 'Nemesis Brew', desc: 'Bottled madness that burns the flesh and leaves a golden residue.', icon: 'assets/weapons/molotov_icon.png' },
      { id: 'treasure_shovel', type: 'weapon', title: 'Grave-Robber\'s Toll', desc: 'A chipped spade that digs past bone to unearth hidden greed.', icon: 'assets/weapons/shovel_icon.png' },
      { id: 'loaded_dice', type: 'weapon', title: 'Devil\'s Bones', desc: 'Carved from the knuckles of a forgotten king. Dictates cruel fates.', icon: 'assets/weapons/dice_icon.png' }
    ],
    berserker: [
      { id: 'iron_slab', type: 'weapon', title: 'The Iron Slab', desc: 'Too big, thick, and heavy to be called a sword. Cleaves everything.', icon: 'assets/weapons/greatsword_icon.png' },
      { id: 'fan_of_knives', type: 'weapon', title: 'Swallow\'s Flight', desc: 'A barrage of poisoned steel, a vagabond\'s desperate strike.', icon: 'assets/weapons/knives_icon.png' },
      { id: 'trail_grenades', type: 'weapon', title: 'Alchemist\'s Regret', desc: 'Explosive orbs left in your wake. Nothing follows the Black Swordsman.', icon: 'assets/weapons/grenade_icon.png' },
      { id: 'arm_cannon', type: 'weapon', title: 'The Iron Hand', desc: 'A prosthetic monstrosity. Violently exhales fire and shrapnel.', icon: 'assets/weapons/cannon_icon.png' }
    ],
    paladin: [
      { id: 'shield_bash', type: 'weapon', title: 'The Aegis Wall', desc: 'A declaration of unyielding resolve. Halts and stuns the dark.', icon: 'assets/weapons/shield_icon.png' },
      { id: 'holy_broadsword', type: 'weapon', title: 'Righteous Penance', desc: 'A blade forged in fire; each swing is a prayer, every 3rd an execution.', icon: 'assets/weapons/holy_sword_icon.png' },
      { id: 'consecrated_ground', type: 'weapon', title: 'Grace of the White Tree', desc: 'Sanctify the profane earth. A lingering haven that mends flesh.', icon: 'assets/weapons/aura_icon.png' },
      { id: 'spinning_cross', type: 'weapon', title: 'Inquisitor\'s Halo', desc: 'A heavy cruciform that spins like a star of judgment to grind the wicked.', icon: 'assets/weapons/cross_icon.png' }
    ],
    witch: [
      { id: 'magic_orb', type: 'weapon', title: 'The Void Eye', desc: 'A sphere of abyssal gravity that hungers for life. Seeks the nearest soul.', icon: 'assets/weapons/magic_orb.png' },
      { id: 'magic_book', type: 'weapon', title: 'Forbidden Folios', desc: 'Ancient texts that orbit your vessel, ripping the marrow from those who step close.', icon: 'assets/weapons/spellbook.png' },
      { id: 'arcane_nova', type: 'weapon', title: 'Chaos Pulse', desc: 'A violent rejection of the physical world. Tears the veil to shatter the swarm.', icon: 'assets/weapons/nova_icon.png' },
      { id: 'magic_wand', type: 'weapon', title: 'Violet Comet', desc: 'A concentrated beam of agonizing starlight. Sweeps the earth clean of the unworthy.', icon: 'assets/weapons/wand_icon.png' }
    ],
    drifter: [
      { id: 'meteorite_blade', type: 'weapon', title: 'The Meteorite Blade', desc: 'A rapid, forward-lunging dash-strike that pierces through enemies in a line.', icon: 'assets/weapons/meteorite_blade_icon.png' },
      { id: 'phantom_strike', type: 'weapon', title: 'Tear in the Veil', desc: 'Rip open micro-fissures, sending phantoms to violently chain-strike the swarm.', icon: 'assets/weapons/phantom_strike_icon.png' },
      { id: 'chilling_aura', type: 'weapon', title: 'Echo of the Frost', desc: 'A localized blast of freezing wind that coats the earth in unnatural rime.', icon: 'assets/weapons/frost_aura_icon.png' },
      { id: 'conjunction_sphere', type: 'weapon', title: 'Conjunction Sphere', desc: 'Harness catastrophic energy to call down stellar debris on the densest clusters.', icon: 'assets/weapons/conjunction_sphere_icon.png' }
    ]
  },
  items: {
    common: [
      { id: 'speed_boots', type: 'item', title: 'Gravewalker Boots', desc: 'Increases movement speed. Flee while you still have legs.', icon: 'assets/items/equipable/boots.png' },
      { id: 'vitality_ring', type: 'item', title: 'Ring of Sacrifice', desc: 'Increases Max HP. Pain is the only true currency here.', icon: 'assets/items/equipable/ring.png' },
      { id: 'thief_gloves', type: 'item', title: 'Scavenger\'s Grasp', desc: 'Increases magnetic pull for extracting souls, but slows attacks.', icon: 'assets/items/equipable/gloves.png' },
      { id: 'coin_purse', type: 'item', title: 'Charon\'s Toll', desc: 'Enemies drop more gold. Worthless to the dead, valuable to the Ferryman.', icon: 'assets/items/equipable/coin_purse.png' },
      { id: 'sacrificial_dagger', type: 'item', title: 'Blood-Letting Kris', desc: 'Increases Damage, reduces Max HP. A dangerous bargain.', icon: 'assets/items/equipable/dagger.png' },
      { id: 'broken_arrow', type: 'item', title: 'Petrified Shaft', desc: 'Increases Armor, drastically reduces speed. Stand your ground.', icon: 'assets/items/equipable/broken_arrow.png' },
      { id: 'voodoo_doll', type: 'item', title: 'Effigy of the Damned', desc: 'Massive buffs, but constantly drains HP. A curse on your own house.', icon: 'assets/items/equipable/voodoo.png' },
      { id: 'haste_necklace', type: 'item', title: 'Pendant of the Frenzied', desc: 'Increases attack speed. The heart beats faster as the end approaches.', icon: 'assets/items/equipable/necklace.png' },
      { id: 'mysterious_letter', type: 'item', title: 'Sealed Interstice Missive', desc: 'Increases all XP gained. Forbidden knowledge from the other side.', icon: 'assets/items/equipable/letter.png' },
      { id: 'cursed_skull', type: 'item', title: 'Beherit Skull', desc: 'Grants Lifesteal, but increases enemy spawns. It hungers for the eclipse.', icon: 'assets/items/equipable/skull.png' }
    ],
    consumables: [
      { id: 'heal', type: 'consumable', title: 'Estus Flask', desc: 'Mends shattered flesh. Instantly restores all HP.', icon: 'assets/items/consumable/potion.png' }
    ]
  }
};