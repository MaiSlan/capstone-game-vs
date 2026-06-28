// src/game/entities/characters/Witch.js
import Phaser from 'phaser';
import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Witch extends Player {
  // THE FIX: Add metaUpgrades here (defaulting to empty array just in case)
  constructor(scene, x, y, metaUpgrades = []) { 
    const stats = CHARACTER_DB.witch;
    
    // THE FIX: Pass metaUpgrades into the super() call!
    super(scene, x, y, 'witch_walk', stats.speed, stats.hp, metaUpgrades);
    
    this.heroName = stats.name;
    this.addOrUpgradeWeapon(stats.weaponId);

    this.hasAnimations = true; 
    this.animPrefix = 'witch_walk';
    
    this.baseScale = 0.45; 
    this.setScale(this.baseScale);
  }
}