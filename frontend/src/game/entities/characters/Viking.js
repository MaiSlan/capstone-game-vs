import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Viking extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.viking;
    
    super(scene, x, y, 'viking_walk', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    this.hasAnimations = true; 
    this.animPrefix = 'viking_walk';
    
    this.baseScale = 0.45;
    this.setScale(this.baseScale);
  }
}