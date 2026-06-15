import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class BouncingAxe {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.bouncing_axe;
    this.lastFired = 0;
    this.activeAxes = []; // Track them to spin them every frame
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    // 1. Visually spin any active axes currently flying around the screen
    this.activeAxes = this.activeAxes.filter(axe => axe && axe.active);
    this.activeAxes.forEach(axe => {
      axe.rotation += 0.3; // Fast, violent spin
    });

    // 2. Fire new axes if off cooldown
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const maxBounces = this.stats.bounces[lvlIdx];

      // At max level, throw 3 axes in a spread pattern. Otherwise, throw 1.
      const axesToThrow = weaponLevel >= 5 ? 3 : 1;
      const spreadAngles = [0, -0.35, 0.35]; // Center, slightly left, slightly right

      for (let i = 0; i < axesToThrow; i++) {
        // You can change 'axe_icon' to whatever you named the preloaded PNG
        const axe = this.scene.playerProjectiles.create(player.x, player.y, 'bouncing_axe'); 
        
        axe.isBullet = false; // We set this to false so MainScene doesn't instantly destroy it
        axe.damage = currentDamage;
        axe.setScale(0.6);
        
        // --- THE "SMART" PROJECTILE DATA ---
        axe.bouncesLeft = maxBounces;
        axe.hitEnemies = []; // Track who we hit so we don't bounce back and forth on the same target

        // Set initial flight path
        const fireAngle = player.currentAimAngle + spreadAngles[i];
        this.scene.physics.velocityFromRotation(fireAngle, currentSpeed, axe.body.velocity);
        
        // --- THE "SMART" RICOCHET LOGIC ---
        // MainScene will call this custom method whenever the axe touches an enemy
        axe.onHit = (enemy) => {
          // Ignore if we already hit this specific enemy
          if (axe.hitEnemies.includes(enemy)) return; 

          axe.hitEnemies.push(enemy);
          axe.bouncesLeft--;

          if (axe.bouncesLeft <= 0) {
            axe.destroy();
            return;
          }

          // Find all alive enemies we HAVEN'T hit yet
          const validTargets = this.scene.enemies.getChildren().filter(e => e.active && !axe.hitEnemies.includes(e));
          
          if (validTargets.length === 0) {
            axe.destroy(); // Nothing left to bounce to
            return;
          }

          // Find the absolute closest valid target and redirect velocity toward them
          const closest = this.scene.physics.closest(axe, validTargets);
          if (closest) {
            const bounceAngle = Phaser.Math.Angle.Between(axe.x, axe.y, closest.x, closest.y);
            this.scene.physics.velocityFromRotation(bounceAngle, currentSpeed, axe.body.velocity);
          }
        };

        this.activeAxes.push(axe);
      }

      this.lastFired = time + currentCooldown;
    }
  }
}