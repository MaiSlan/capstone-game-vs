import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ChillingAura {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.chilling_aura;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const freezeDuration = this.stats.freezeDuration[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Create the freezing blast visual
      const blast = this.scene.add.circle(player.x, player.y, currentRadius, 0x00ffff, 0.5);
      this.scene.physics.add.existing(blast);
      
      // Add a cool icy shockwave effect
      this.scene.tweens.add({
        targets: blast,
        scale: 1.5,
        alpha: 0,
        duration: 400,
        ease: 'Cubic.easeOut',
        onComplete: () => blast.destroy()
      });

      // Detect enemies in the blast
      this.scene.physics.overlap(blast, this.scene.enemies, (zone, enemy) => {
        enemy.takeDamage(currentDamage);

        // Apply visual tint
        enemy.setTint(0x88ffff);
        this.scene.time.delayedCall(1000, () => {
           if (enemy && enemy.active && !enemy.isFrozen) enemy.clearTint();
        });

        // Calculate distance to center for the Max Level effect
        const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
        const innerCoreRadius = currentRadius * 0.4; // The "very center"

        if (isMaxLevel && dist <= innerCoreRadius) {
          // --- MAX LEVEL: FREEZE SOLID ---
          this.freezeEnemy(enemy, freezeDuration);
        } else {
          // --- NORMAL: STACKING SLOW ---[cite: 3]
          this.applyStackingSlow(enemy);
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }

  applyStackingSlow(enemy) {
    if (!enemy || !enemy.active || enemy.isFrozen) return;

    // Initialize original speed if we haven't yet
    if (enemy.originalSpeed === undefined) {
      enemy.originalSpeed = enemy.speed;
      enemy.frostStacks = 0;
    }

    // Add a stack (max 5 stacks)
    enemy.frostStacks = Math.min(enemy.frostStacks + 1, 5);
    
    // Slow them by 15% per stack (up to 75% slow)
    const slowMultiplier = 1 - (enemy.frostStacks * 0.15);
    enemy.speed = enemy.originalSpeed * slowMultiplier;

    // Optional: After a long time out of the frost, they could thaw, 
    // but in a survival game, leaving it permanent until death is highly effective!
  }

  freezeEnemy(enemy, duration) {
    if (!enemy || !enemy.active) return;

    enemy.isFrozen = true;
    enemy.setTint(0x0000ff); // Deep blue for frozen solid
    
    if (enemy.originalSpeed === undefined) {
      enemy.originalSpeed = enemy.speed;
    }
    
    // Halt movement entirely[cite: 3]
    enemy.speed = 0;
    if (enemy.body) enemy.body.setVelocity(0, 0);

    // Thaw them out after the duration
    this.scene.time.delayedCall(duration, () => {
      if (enemy && enemy.active) {
        enemy.isFrozen = false;
        enemy.clearTint();
        // Restore speed based on whatever frost stacks they had before freezing
        const slowMultiplier = 1 - ((enemy.frostStacks || 0) * 0.15);
        enemy.speed = enemy.originalSpeed * slowMultiplier;
      }
    });
  }
}