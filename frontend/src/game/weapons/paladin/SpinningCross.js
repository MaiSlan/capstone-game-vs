import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class SpinningCross {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.spinning_cross;
    this.lastFired = 0;
    this.activeCrosses = [];
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    // 1. Process active crosses continuously
    this.activeCrosses = this.activeCrosses.filter(c => c && c.active);
    this.activeCrosses.forEach(cross => {
      cross.rotation += 0.25; // Visually spin

      // Phase 3: Returning to player
      if (cross.state === 'returning') {
        const dist = Phaser.Math.Distance.Between(cross.x, cross.y, player.x, player.y);
        
        // Destroy if it reaches the player
        if (dist < 30) {
          cross.destroy();
        } else {
          // Accelerate toward the player dynamically
          const angle = Phaser.Math.Angle.Between(cross.x, cross.y, player.x, player.y);
          this.scene.physics.velocityFromRotation(angle, 700, cross.body.velocity);
        }
      }
    });

    // 2. Fire a new cross if off cooldown
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const spinDuration = this.stats.spinDuration[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      const cross = this.scene.playerProjectiles.create(player.x, player.y, 'cross_icon');
      cross.isBullet = false; // Don't destroy on hit
      cross.damage = currentDamage;
      cross.state = 'outward'; // Track current phase
      cross.setScale(0.8);
      cross.hitEnemies = [];

      // Phase 1: Launch it outward based on current aim angle
      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, cross.body.velocity);

      // Grind Timer: Clears hits so enemies take continuous "grind" damage
      const grindTimer = this.scene.time.addEvent({
        delay: 300,
        callback: () => {
          if (!cross || !cross.active) return;
          cross.hitEnemies = []; // Reset hits
          
          // Max Level Mechanic: Shoot tiny light projectiles while spinning in place[cite: 7]
          if (isMaxLevel && cross.state === 'spinning') {
            this.shootLightProjectile(cross.x, cross.y, currentDamage * 0.5);
          }
        },
        loop: true
      });

      // Phase 2: Stop and spin in place
      this.scene.time.delayedCall(400, () => {
        if (!cross.active) return;
        cross.state = 'spinning';
        cross.body.setVelocity(0, 0); // Brake abruptly

        // Phase 3: Initiate return
        this.scene.time.delayedCall(spinDuration, () => {
          if (!cross.active) return;
          cross.state = 'returning';
          cross.hitEnemies = []; // Give it one fresh hit array for the trip back
        });
      });

      cross.onHit = (enemy) => {
        if (cross.hitEnemies.includes(enemy)) return;
        cross.hitEnemies.push(enemy);
      };

      // Ensure timer cleanup if destroyed
      cross.on('destroy', () => grindTimer.remove());

      this.activeCrosses.push(cross);
      this.lastFired = time + currentCooldown;
    }
  }

  // Helper function for the max level effect
  shootLightProjectile(x, y, damage) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    // Use an existing projectile asset and tint it yellow/gold
    const bullet = this.scene.playerProjectiles.create(x, y, 'cross_icon'); 
    
    bullet.setScale(0.3);
    bullet.setTint(0xffeeaa); 
    bullet.isBullet = true; // These small ones DO destroy on impact
    bullet.damage = damage;
    
    this.scene.physics.velocityFromRotation(angle, 350, bullet.body.velocity);
    
    // Automatically fade out stray projectiles
    this.scene.time.delayedCall(800, () => {
      if (bullet && bullet.active) bullet.destroy();
    });
  }
}