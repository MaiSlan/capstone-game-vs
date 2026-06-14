import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Viking extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.viking;
    
    // Initialize with the new spritesheet key
    super(scene, x, y, 'viking_walk', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    // --- THE FIX: Enable the animation controller ---
    this.hasAnimations = true; 
    this.animPrefix = 'viking_walk';
    
    // Scale him up to match the high-res 256px spritesheet
    this.baseScale = 0.35; // Adjust this number to make him larger or smaller
    this.setScale(this.baseScale);
  }
}