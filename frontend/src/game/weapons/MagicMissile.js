import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class MagicMissile {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_orb;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup) {
    if (time > this.lastFired) {
      // Use the book sprite temporarily until we import an orb asset
      const bullet = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book'); 
      bullet.isBullet = true;
      bullet.damage = this.stats.damage;
      
      // Fire precisely along the Player's calculated aim angle (Mouse or Auto)
      this.scene.physics.velocityFromRotation(player.currentAimAngle, this.stats.speed, bullet.body.velocity);
      
      // Rotate the projectile to face its travel direction
      bullet.setRotation(player.currentAimAngle);
      
      this.lastFired = time + this.stats.cooldown;
    }
  }
}