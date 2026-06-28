import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Drifter extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.drifter;
    
    super(scene, x, y, 'drifter_walk', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    this.hasAnimations = true; 
    this.animPrefix = 'drifter_walk';
    
    // Scale matching the high-res spritesheets
    this.baseScale = 0.45; 
    this.setScale(this.baseScale);
  }
}