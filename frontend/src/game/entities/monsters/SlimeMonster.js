import BaseMonster from '../BaseMonster';

export default class SlimeMonster extends BaseMonster {
  // --- THE FIX: Constructor now accepts dbStats and multiplier from WaveManager ---
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    
    // Pass everything up to BaseMonster
    // (scene, x, y, textureKey, animationPrefix, dbStats, multiplier, customConfig)
    super(scene, x, y, 'slime_walk', 'slime', dbStats, multiplier, {
      attackDistance: 65, 
      attackSpeedCooldown: 1000,
      ...waveConfig
    });
    
    // Slime-specific physics and sizing
    this.setScale(2.5);
    this.body.setSize(30, 30);
    this.body.setOffset(17, 17); 
  }
}