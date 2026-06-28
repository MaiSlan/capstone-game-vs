// src/game/managers/ItemManager.js
import { ITEM_DB } from '../../data/ItemDB';

export default class ItemManager {
  constructor() {
    this.items = [];
    this.maxItems = 5;
  }

  addOrUpgradeItem(itemId) {
    const existingItem = this.items.find(i => i.id === itemId);
    
    if (existingItem) {
      const maxLvl = ITEM_DB[itemId].maxLevel; //[cite: 10]
      if (existingItem.level < maxLvl) {
        existingItem.level++;
      }
    } else if (this.items.length < this.maxItems) {
      this.items.push({ id: itemId, level: 1 });
    }
  }

  getCleanItemData() {
    return this.items.map(i => ({ id: i.id, level: i.level }));
  }

  // Calculates and returns a single object containing all aggregated stat multipliers
  getStatMultipliers() {
    let stats = {
      speedMult: 1.0,
      hpMult: 1.0,
      damageMult: 1.0,
      cooldownMult: 1.0,
      pickupMult: 1.0,
      xpMult: 1.0,
      lifesteal: 0,
      hpDrainPerSec: 0,
      armor: 0,
      coinMult: 1.0,  // From Coin Purse[cite: 10]
      curseMult: 1.0  // From Cursed Skull[cite: 10]
    };

    this.items.forEach(item => {
      const data = ITEM_DB[item.id];
      if (!data) return;
      
      const lvl = item.level - 1;

      // Add up all the multipliers dynamically[cite: 10]
      if (data.speed_multiplier) stats.speedMult += data.speed_multiplier[lvl];
      if (data.max_hp_multiplier) stats.hpMult += data.max_hp_multiplier[lvl];
      if (data.damage_multiplier) stats.damageMult += data.damage_multiplier[lvl];
      if (data.cooldown_multiplier) stats.cooldownMult += data.cooldown_multiplier[lvl];
      if (data.pickup_multiplier) stats.pickupMult += data.pickup_multiplier[lvl];
      if (data.xp_multiplier) stats.xpMult += data.xp_multiplier[lvl];
      if (data.lifesteal) stats.lifesteal += data.lifesteal[lvl];
      if (data.hp_drain_per_sec) stats.hpDrainPerSec += data.hp_drain_per_sec[lvl];
      if (data.armor) stats.armor += data.armor[lvl];
      if (data.coin_multiplier) stats.coinMult += data.coin_multiplier[lvl];
      if (data.curse_multiplier) stats.curseMult += data.curse_multiplier[lvl];
    });

    return stats;
  }
}