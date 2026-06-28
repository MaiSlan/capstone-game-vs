// src/game/managers/MetaStatsManager.js

export default class MetaStatsManager {
  constructor(dbUpgrades = []) {
    // Default base multipliers (Level 0)
    this.modifiers = {
      hpMult: 1.0,       // Vitality: +10% per level
      damageMult: 1.0,   // Might: +5% per level
      cooldownMult: 1.0, // Haste: -2% cooldown per level
      greedMult: 1.0     // Greed: +10% coin drops per level
    };

    this.parseUpgrades(dbUpgrades);
  }

  parseUpgrades(upgrades) {
    if (!upgrades || upgrades.length === 0) return;

    upgrades.forEach(upgrade => {
      const level = upgrade.level;
      
      switch (upgrade.upgrade_id) {
        case 'vitality':
          this.modifiers.hpMult += (0.10 * level);
          break;
        case 'might':
          this.modifiers.damageMult += (0.05 * level);
          break;
        case 'haste':
          // Reduces cooldown (fires faster)
          this.modifiers.cooldownMult -= (0.02 * level); 
          break;
        case 'greed':
          this.modifiers.greedMult += (0.10 * level);
          break;
        default:
          console.warn(`Unknown meta upgrade ID: ${upgrade.upgrade_id}`);
      }
    });
  }

  getModifiers() {
    return this.modifiers;
  }
}