import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class BatMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 30,
      hasAnimations: false,
      ...waveConfig
    });

    this.body.setSize(15, 15);
    
    this.setTint(0x7c3aed); // Purple block
    this.setScale(0.5); // Very small visually
  }
}