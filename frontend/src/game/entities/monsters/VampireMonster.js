import BaseMonster from '../BaseMonster';

export default class VampireMonster extends BaseMonster {
  // --- THE FIX: Constructor now accepts dbStats and multiplier from WaveManager ---
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    
    // Pass everything up to BaseMonster
    // We pass 55 for attackDistance and 800 for cooldown to preserve his specific behavior!
    super(scene, x, y, 'vampire_walk', 'vampire', dbStats, multiplier, {
      attackDistance: 55,       
      attackSpeedCooldown: 800,
      ...waveConfig
    });
    
    // Vampire-specific physics and sizing
    this.setScale(1.8);
    this.body.setSize(20, 30);
    this.body.setOffset(22, 17); 
  }
}