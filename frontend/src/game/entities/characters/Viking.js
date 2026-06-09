import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Viking extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.viking;
    super(scene, x, y, 'viking_sprite', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    // This now cleanly initializes the standalone AxeCleave.js file
    this.addOrUpgradeWeapon(stats.weaponId); 
  }
}