import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MeteoriteBlade {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.meteorite_blade;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const lungeDistance = this.stats.lungeDistance[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      const aimAngle = player.currentAimAngle;

      // 1. Perform the initial Dash-Strike
      this.executeDashStrike(player.x, player.y, aimAngle, currentDamage, currentSpeed, lungeDistance);

      // --- MAX LEVEL: PHANTOM AFTERIMAGE ---
      if (isMaxLevel) {
        // Leave a glowing green silhouette at the start location
        const phantom = this.scene.add.sprite(player.x, player.y, player.texture.key);
        phantom.setTint(0x00ff00);
        phantom.alpha = 0.6;
        phantom.rotation = aimAngle; // Face the strike direction

        // 1 second later, the phantom performs the exact same strike
        this.scene.time.delayedCall(1000, () => {
          if (phantom && phantom.active) {
            this.executeDashStrike(phantom.x, phantom.y, aimAngle, currentDamage, currentSpeed, lungeDistance, true);
            
            // Fade out the phantom after its strike
            this.scene.tweens.add({
              targets: phantom, alpha: 0, duration: 300, onComplete: () => phantom.destroy()
            });
          }
        });
      }

      this.lastFired = time + currentCooldown;
    }
  }

  executeDashStrike(startX, startY, angle, damage, speed, distance, isPhantom = false) {
    // Create a wide, rectangular hitbox that pierces through enemies
    const slash = this.scene.playerProjectiles.create(startX, startY, 'meteorite_blade_icon');
    slash.isBullet = false; // We manage its destruction
    slash.damage = damage;
    slash.rotation = angle;
    
    // Make the hitbox long and wide to represent the "dash" path
    slash.body.setSize(distance, 40);
    slash.setDisplaySize(distance, 40);
    
    if (isPhantom) slash.setTint(0x00ff00);

    // Shoot the hitbox forward
    this.scene.physics.velocityFromRotation(angle, speed, slash.body.velocity);

    slash.hitEnemies = [];
    slash.onHit = (enemy) => {
      if (slash.hitEnemies.includes(enemy)) return;
      slash.hitEnemies.push(enemy);
    };

    // Calculate how long it takes to cover the lunge distance and destroy it
    const lifespan = (distance / speed) * 1000;
    this.scene.time.delayedCall(lifespan, () => {
      if (slash && slash.active) {
        this.scene.tweens.add({
          targets: slash, alpha: 0, duration: 100, onComplete: () => slash.destroy()
        });
      }
    });
  }
}