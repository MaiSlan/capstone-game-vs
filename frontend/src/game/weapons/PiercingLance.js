import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class PiercingLance {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.lance;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const currentPierce = this.stats.pierce[lvlIdx];

      const lance = this.scene.playerProjectiles.create(player.x, player.y, 'lance');
      lance.isBullet = false;
      lance.damage = currentDamage;
      lance.pierce = currentPierce;

      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, lance.body.velocity);
      lance.setRotation(player.currentAimAngle);

      this.lastFired = time + currentCooldown;
    }
  }
}