import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Witch extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.witch;
    
    // Make sure she loads 'witch_walk' instead of 'witch_sprite'
    super(scene, x, y, 'witch_walk', stats.speed, stats.hp); 
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    // Add these flags!
    this.hasAnimations = true; 
    this.animPrefix = 'witch_walk';
  }
}