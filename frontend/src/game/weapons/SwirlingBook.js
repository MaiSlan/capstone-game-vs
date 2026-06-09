import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class SwirlingBook {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_book;
    this.orbitAngle = 0;
    this.bookEntity = null;
  }

  update(time, player, enemiesGroup) {
    // Spawn the book if it doesn't exist
    if (!this.bookEntity) {
      this.bookEntity = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
      this.bookEntity.isBullet = false;
      this.bookEntity.damage = this.stats.damage;
    }

    // Rotate it around the player
    this.orbitAngle += this.stats.rotationSpeed;
    this.bookEntity.setPosition(
      player.x + Math.cos(this.orbitAngle) * this.stats.radius,
      player.y + Math.sin(this.orbitAngle) * this.stats.radius
    );
  }
}