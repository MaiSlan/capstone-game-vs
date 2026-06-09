import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class PiercingLance {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.lance;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup) {
    if (time > this.lastFired) {
      const lance = this.scene.playerProjectiles.create(player.x, player.y, 'lance');
      lance.isBullet = false;
      lance.damage = this.stats.damage;
      lance.pierce = this.stats.pierce;

      // Reads the player's targeting system (Mouse vs Auto)
      this.scene.physics.velocityFromRotation(player.currentAimAngle, this.stats.speed, lance.body.velocity);
      lance.setRotation(player.currentAimAngle);

      this.lastFired = time + this.stats.cooldown;
    }
  }
}