import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicMissile {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_orb;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];

      const bullet = this.scene.playerProjectiles.create(player.x, player.y, 'magic_orb'); 
      bullet.isBullet = true;
      bullet.damage = currentDamage;
      bullet.setScale(0.5);
      
      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, bullet.body.velocity);
      bullet.setRotation(player.currentAimAngle);
      
      this.lastFired = time + currentCooldown;
    }
  }
}