import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Witch extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.witch;
    super(scene, x, y, 'witch_sprite', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    // This now cleanly initializes the standalone MagicMissile.js file
    this.addOrUpgradeWeapon(stats.weaponId);
  }
}