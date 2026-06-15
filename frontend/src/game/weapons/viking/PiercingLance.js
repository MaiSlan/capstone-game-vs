import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class PiercingLance {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.piercing_lance;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const maxPierces = this.stats.pierceCount[lvlIdx];

      // Spawn the harpoon
      const lance = this.scene.playerProjectiles.create(player.x, player.y, 'piercing_lance');
      
      // Visuals & Physics
      lance.setScale(0.8);
      lance.damage = currentDamage;
      
      // Aim exactly where the player is aiming
      lance.rotation = player.currentAimAngle;
      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, lance.body.velocity);

      // --- THE "SMART" PROJECTILE DATA ---
      lance.piercesLeft = maxPierces;
      lance.hitEnemies = []; // Tracks who we already impaled
      
      // A safety timeout: if it flies for 1.5 seconds without hitting its pierce limit, plant it or kill it
      const lifespanTimer = this.scene.time.delayedCall(1500, () => {
        if (lance.active) this.triggerDeath(lance, weaponLevel);
      });

      // --- THE CUSTOM BRAIN ---
      lance.onHit = (enemy) => {
        // 1. Prevent hitting the exact same enemy multiple times as the lance passes through them
        if (lance.hitEnemies.includes(enemy)) return;
        
        // 2. Register the hit and reduce pierce count
        lance.hitEnemies.push(enemy);
        lance.piercesLeft--;

        // 3. Check if the harpoon is spent
        if (lance.piercesLeft <= 0) {
          lifespanTimer.destroy(); // Cancel the timeout
          this.triggerDeath(lance, weaponLevel);
        }
      };

      this.lastFired = time + currentCooldown;
    }
  }

  // Handles destroying the lance and triggering the Level 5 AoE shockwave
  triggerDeath(lance, weaponLevel) {
    if (weaponLevel >= 5) {
      // --- MAX LEVEL: SURTUR'S SEED (AoE Shockwave) ---
      const x = lance.x;
      const y = lance.y;

      // 1. Visual Indicator (A dark red blast mark on the floor)
      const blastVisual = this.scene.add.graphics();
      blastVisual.fillStyle(0x7f1d1d, 0.4); // Red-900 with opacity
      blastVisual.fillCircle(x, y, 90);
      blastVisual.lineStyle(2, 0xb91c1c, 0.8);
      blastVisual.strokeCircle(x, y, 90);

      // 2. The Physics Hitbox
      // We spawn an invisible zone into the playerProjectiles group
      const shockwave = this.scene.playerProjectiles.create(x, y, null).setVisible(false);
      shockwave.body.setCircle(90);
      shockwave.body.setOffset(-90, -90); // Center the physics body
      
      // Because MainScene applies damage every frame (60fps) to anything overlapping,
      // we set this to a tiny fraction so it acts as a smooth Damage-over-Time (DoT)
      shockwave.damage = lance.damage * 0.02; 
      
      // The shockwave passes through enemies without destroying itself
      shockwave.onHit = (enemy) => { /* Just let MainScene apply the DoT tick */ };

      // 3. Fade out and destroy the shockwave after 3 seconds
      this.scene.tweens.add({
        targets: blastVisual,
        alpha: 0,
        duration: 3000,
        onComplete: () => {
          blastVisual.destroy();
          if (shockwave.active) shockwave.destroy();
        }
      });
    }

    // Finally, destroy the lance itself
    lance.destroy();
  }
}