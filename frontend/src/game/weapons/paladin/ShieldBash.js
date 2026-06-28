import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ShieldBash {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.shield_bash;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentWidth = this.stats.width[lvlIdx];
      const currentStunDuration = this.stats.stunDuration[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Position the bash slightly in front of the player based on aim
      const offsetDist = 40;
      const bashX = player.x + Math.cos(player.currentAimAngle) * offsetDist;
      const bashY = player.y + Math.sin(player.currentAimAngle) * offsetDist;

      // Use a placeholder sprite (e.g., 'shield_icon' or a blank white square)
      const bash = this.scene.playerProjectiles.create(bashX, bashY, 'shield_icon');
      
      bash.isBullet = false; // Prevent MainScene from instantly destroying it
      bash.damage = currentDamage;
      bash.alpha = 0.5; // Visual indicator
      bash.rotation = player.currentAimAngle; // Align with aim direction
      
      // Set a rectangular physics body
      bash.setSize(currentWidth, 60);
      bash.setDisplaySize(currentWidth, 60);
      
      bash.hitEnemies = []; // Track hits to avoid multi-hitting the same target per bash

      bash.onHit = (enemy) => {
        if (bash.hitEnemies.includes(enemy)) return;
        bash.hitEnemies.push(enemy);

        // Apply stun logic
        if (!enemy.isStunned) {
          enemy.isStunned = true;
          enemy.setTint(0xaaaaaa); // Turn grey to show stun
          
          // Halt movement by forcing speed to 0 (assumes your enemy logic uses a speed property)
          enemy.storedSpeed = enemy.speed; 
          enemy.speed = 0;
          if (enemy.body) enemy.body.setVelocity(0, 0);

          // Apply max level vulnerability
          if (isMaxLevel) enemy.damageVulnerability = 1.5;

          // Remove stun after duration
          this.scene.time.delayedCall(currentStunDuration, () => {
            if (enemy && enemy.active) {
              enemy.isStunned = false;
              enemy.clearTint();
              enemy.speed = enemy.storedSpeed || 50; // Restore original speed
              if (isMaxLevel) enemy.damageVulnerability = 1.0; // Remove vulnerability
            }
          });
        }
      };

      // The bash is a quick strike, destroy it almost instantly
      this.scene.time.delayedCall(150, () => {
        if (bash && bash.active) bash.destroy();
      });

      // Visual fade out
      this.scene.tweens.add({ targets: bash, alpha: 0, duration: 150 });

      this.lastFired = time + currentCooldown;
    }
  }
}