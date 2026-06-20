import BaseMonster from '../BaseMonster';

export default class PlaceholderMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) { 
    // We pass hasAnimations: false to safely bypass the animation system
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 45, 
      attackSpeedCooldown: 1000,
      hasAnimations: false, 
      ...waveConfig 
    });
    
    this.body.setSize(40, 40);
    
    // Color code and scale based on Bestiary ID
    if (dbStats.id === 'blighted_gore_thrall') {
      this.setTint(0xdc2626); // Red block
      this.setScale(0.8);
    } 
    else if (dbStats.id === 'night_terror') {
      this.setTint(0x7c3aed); // Purple block
      this.setScale(0.5);
    } 
    else if (dbStats.id === 'hollowed_legionnaire') {
      this.setTint(0x9ca3af); // Gray block
      this.setScale(1.2);
    } 
    else if (dbStats.id === 'abyssal_behemoth') {
      this.setTint(0x4ade80); // Giant Green block
      this.setScale(3);
    } 
    else {
      this.setTint(0xfcd34d); // Yellow fallback for anything else (Bosses)
      this.setScale(1.5);
    }
  }
}