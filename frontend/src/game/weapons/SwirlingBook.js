import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class SwirlingBook {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_book;
    this.orbitAngle = 0;
    this.bookEntity = null;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    
    // Continuously pull the dynamic multipliers in case the player picks up items while the book is spinning
    const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
    const currentRotationSpeed = this.stats.rotationSpeed[lvlIdx];
    const currentRadius = this.stats.radius[lvlIdx];

    if (!this.bookEntity) {
      this.bookEntity = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
      this.bookEntity.isBullet = false;
    }

    // Keep the damage updated in real-time
    this.bookEntity.damage = currentDamage;

    this.orbitAngle += currentRotationSpeed;
    this.bookEntity.setPosition(
      player.x + Math.cos(this.orbitAngle) * currentRadius,
      player.y + Math.sin(this.orbitAngle) * currentRadius
    );
  }
}