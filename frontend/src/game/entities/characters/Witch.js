import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Witch extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.witch;
    super(scene, x, y, 'witch_walk', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    this.hasAnimations = true; 
    this.animPrefix = 'witch_walk';
    
    // --- THE FIX: Scale Override ---
    // The default was 0.125. Try 0.35 or 0.4 to match the Slime's visual weight!
    this.baseScale = 0.35; 
    this.setScale(this.baseScale);
  }
}