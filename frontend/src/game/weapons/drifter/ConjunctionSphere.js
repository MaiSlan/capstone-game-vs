import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ConjunctionSphere {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.conjunction_sphere;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const meteorCount = this.stats.meteorCount[lvlIdx];
      const impactRadius = this.stats.radius[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Get all valid enemies currently on screen
      const visibleEnemies = this.scene.enemies.getChildren().filter(e => e.active);

      if (visibleEnemies.length > 0) {
        for (let i = 0; i < meteorCount; i++) {
          // Select a random enemy as the target[cite: 3]
          const target = Phaser.Utils.Array.GetRandom(visibleEnemies);
          this.callMeteor(target.x, target.y, currentDamage, impactRadius, isMaxLevel);
        }
      }

      this.lastFired = time + currentCooldown;
    }
  }

  callMeteor(targetX, targetY, damage, radius, isMaxLevel) {
    // Spawn the meteor high above the target
    const startY = targetY - 600;
    const meteor = this.scene.add.sprite(targetX + 100, startY, 'conjunction_sphere_icon');
    meteor.setTint(0xff8800);
    meteor.setScale(1.5);

    // Add a fiery trail
    const particles = this.scene.add.particles(0, 0, 'conjunction_sphere_icon', {
      speed: 0, scale: { start: 0.5, end: 0 }, alpha: { start: 0.8, end: 0 },
      tint: 0xff4400, lifespan: 400, blendMode: 'ADD'
    });
    particles.startFollow(meteor);

    // Drop the meteor
    this.scene.tweens.add({
      targets: meteor,
      x: targetX,
      y: targetY,
      duration: 500, // Fast drop
      ease: 'Cubic.easeIn',
      onComplete: () => {
        meteor.destroy();
        this.scene.time.delayedCall(100, () => particles.destroy());
        this.triggerImpact(targetX, targetY, damage, radius, isMaxLevel);
      }
    });
  }

  triggerImpact(x, y, damage, radius, isMaxLevel) {
    // The explosion visual
    const blast = this.scene.add.circle(x, y, radius, 0xffbb00, 0.8);
    this.scene.physics.add.existing(blast);

    // Instant AoE Damage
    this.scene.physics.overlap(blast, this.scene.enemies, (zone, enemy) => {
      enemy.takeDamage(damage);
    });

    this.scene.tweens.add({
      targets: blast, scale: 1.3, alpha: 0, duration: 200, onComplete: () => blast.destroy()
    });

    // --- MAX LEVEL: GRAVITY WELL ---[cite: 3]
    if (isMaxLevel) {
      this.createGravityWell(x, y, radius * 1.5);
    }
  }

  createGravityWell(x, y, pullRadius) {
    // Visual well
    const well = this.scene.add.circle(x, y, pullRadius, 0x220044, 0.4);
    well.setStrokeStyle(2, 0x8800ff);

    // Spin/pulse visual
    this.scene.tweens.add({ targets: well, scale: 0.9, yoyo: true, repeat: -1, duration: 300 });

    // Pull enemies inward for 3 seconds[cite: 3]
    const pullTimer = this.scene.time.addEvent({
      delay: 50, // 20 ticks per second for smooth pulling
      callback: () => {
        const pullZone = new Phaser.Geom.Circle(x, y, pullRadius);
        this.scene.enemies.getChildren().forEach(enemy => {
          if (enemy.active && Phaser.Geom.Circle.ContainsPoint(pullZone, enemy)) {
            // Do not pull frozen enemies so they act as solid blockers!
            if (!enemy.isFrozen) {
              this.scene.physics.moveTo(enemy, x, y, 150);
            }
          }
        });
      },
      loop: true
    });

    // Cleanup after 3 seconds[cite: 3]
    this.scene.time.delayedCall(3000, () => {
      pullTimer.remove();
      this.scene.tweens.add({
        targets: well, alpha: 0, duration: 300, onComplete: () => well.destroy()
      });
      // Restore enemy movement logic by resetting their velocities to 0 so their AI takes over
      this.scene.enemies.getChildren().forEach(enemy => {
        if (enemy.active && enemy.body) enemy.body.setVelocity(0, 0);
      });
    });
  }
}