import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class MagicWand {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_wand;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];

      // Auto-target the absolute closest enemy
      let angle = player.currentAimAngle; 
      if (enemiesGroup && enemiesGroup.getChildren().length > 0) {
        const closest = this.scene.physics.closest(player, enemiesGroup.getChildren());
        if (closest && closest.active) {
          angle = Phaser.Math.Angle.Between(player.x, player.y, closest.x, closest.y);
        }
      }

      // Reuse the magic orb sprite, but make it smaller and tint it cyan to distinguish it
      const bolt = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book'); 
      bolt.isBullet = true;
      bolt.damage = currentDamage;
      bolt.setScale(0.6); 
      bolt.setTint(0x06b6d4); // Cyan tint

      this.scene.physics.velocityFromRotation(angle, currentSpeed, bolt.body.velocity);
      bolt.setRotation(angle);

      this.lastFired = time + currentCooldown;
    }
  }
}