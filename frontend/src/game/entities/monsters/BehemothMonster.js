import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class BehemothMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 80, // Massive reach
      attackSpeedCooldown: 2000, // Very slow to attack
      hasAnimations: false,
      ...waveConfig
    });

    this.body.setSize(40, 40);
    this.setTint(0x4ade80); // Giant Green block
    this.setScale(3); // Massive size on the screen
  }

  // --- IMMUNITIES (The JavaScript Getter/Setter Trick) ---
  // When the Chaos Pulse tries to set enemy.isKnockedBack = true, 
  // this setter catches it and throws it in the trash.
  set isKnockedBack(value) {
    // The Behemoth cannot be moved!
  }
  get isKnockedBack() {
    return false;
  }

  // When the Void Implosion tries to slow it down, it ignores it.
  set isSlowed(value) {
    // The Behemoth marches endlessly.
  }
  get isSlowed() {
    return false;
  }
}