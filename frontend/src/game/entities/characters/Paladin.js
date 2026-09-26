import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Paladin extends Player {
  constructor(scene, x, y, metaUpgrades = []) {
    const stats = CHARACTER_DB.paladin;
    
    // No in-run walk spritesheet yet (Phase 3 art): use the south-facing frame of the
    // character-select sheet (frames defined in PreloadScene) with Player's
    // non-animated movement (flip + wobble).
    super(scene, x, y, 'paladin_menu', stats.speed, stats.hp, metaUpgrades);
    this.setFrame('0');
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    this.hasAnimations = false;
    
    this.baseScale = 0.45; 
    this.setScale(this.baseScale);
  }
}