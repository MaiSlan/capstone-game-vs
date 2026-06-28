import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class TrailGrenades {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.trail_grenades;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    // Drops an explosive charge on a cooldown[cite: 8]
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Drop grenade exactly where the player is standing
      const grenade = this.scene.playerProjectiles.create(player.x, player.y + 10, 'grenade_icon');
      
      grenade.isBullet = false; // Custom detonation logic
      grenade.damage = currentDamage;
      grenade.setScale(0.6);

      if (isMaxLevel) {
        // --- MAX LEVEL: PROXIMITY MINE ---
        grenade.body.setCircle(15);
        grenade.hitEnemies = [];
        
        // It visually pulses while waiting for a victim
        this.scene.tweens.add({
          targets: grenade,
          scale: 0.8,
          alpha: 0.7,
          yoyo: true,
          repeat: -1,
          duration: 500
        });

        grenade.onHit = (enemy) => {
          this.triggerExplosion(grenade.x, grenade.y, currentRadius, currentDamage);
          grenade.destroy();
        };

        // Safety cleanup to prevent memory leaks if the mine is never stepped on
        this.scene.time.delayedCall(15000, () => {
          if (grenade && grenade.active) grenade.destroy();
        });

      } else {
        // --- NORMAL: TIME-FUSE ---
        // Visually blink faster as it gets closer to exploding
        this.scene.tweens.add({
          targets: grenade,
          alpha: 0.2,
          yoyo: true,
          repeat: 5,
          duration: 250,
          onComplete: () => {
            if (grenade && grenade.active) {
              this.triggerExplosion(grenade.x, grenade.y, currentRadius, currentDamage);
              grenade.destroy();
            }
          }
        });
      }

      this.lastFired = time + currentCooldown;
    }
  }

  triggerExplosion(x, y, radius, damage) {
    // Visual explosion
    const blast = this.scene.add.circle(x, y, radius, 0xff4400, 0.8);
    this.scene.physics.add.existing(blast);
    
    // Check overlap instantly to apply damage to anything in the radius
    this.scene.physics.overlap(blast, this.scene.enemies, (zone, enemy) => {
      enemy.takeDamage(damage);
    });

    // Rapidly fade the explosion visual
    this.scene.tweens.add({
      targets: blast,
      alpha: 0,
      scale: 1.2,
      duration: 200,
      onComplete: () => blast.destroy()
    });
  }
}