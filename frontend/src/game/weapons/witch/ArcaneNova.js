import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ChaosPulse {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.arcane_nova; // Ensure this matches the ID in your WeaponDB
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      
      // Calculate radius dynamically (e.g., starts at 150px, grows by 30px per level)
      const currentRadius = this.stats.radius ? this.stats.radius[lvlIdx] : 150 + (lvlIdx * 30);

      // --- 1. VISUAL EFFECTS ---
      // We draw it at the player's exact local coordinates so it scales outward perfectly
      const pulseVisual = this.scene.add.graphics({ x: player.x, y: player.y });
      
      // Inner transparent fill
      pulseVisual.fillStyle(0xd8b4fe, 0.3); // Light arcane purple
      pulseVisual.fillCircle(0, 0, 10);
      
      // Outer bright rim
      pulseVisual.lineStyle(4, 0xa855f7, 0.8); // Deep vivid purple
      pulseVisual.strokeCircle(0, 0, 10);

      // Expand and fade out the visuals over 400 milliseconds
      this.scene.tweens.add({
        targets: pulseVisual,
        scaleX: currentRadius / 10,
        scaleY: currentRadius / 10,
        alpha: 0,
        duration: 400,
        ease: 'Sine.easeOut',
        onComplete: () => pulseVisual.destroy()
      });

      // --- 2. PHYSICS HITBOX ---
      const pulseHitbox = this.scene.playerProjectiles.create(player.x, player.y, null).setVisible(false);
      pulseHitbox.body.setCircle(10);
      pulseHitbox.body.setOffset(-10, -10);
      pulseHitbox.damage = currentDamage;
      
      // VERY IMPORTANT: Track who we hit so the pulse only damages them once per wave
      pulseHitbox.hitEnemies = []; 

      // Expand the physics body to perfectly match the visual wave
      this.scene.tweens.add({
        targets: pulseHitbox.body,
        radius: currentRadius,
        duration: 400,
        onUpdate: () => {
          // Phaser requires us to manually re-center the offset when a physics radius changes
          pulseHitbox.body.setOffset(-pulseHitbox.body.radius, -pulseHitbox.body.radius);
        },
        onComplete: () => {
          if (pulseHitbox.active) pulseHitbox.destroy();
        }
      });

      // --- 3. THE CUSTOM BRAIN ---
      pulseHitbox.onHit = (enemy) => {
        // If we already hit this enemy with this specific pulse, ignore them
        if (pulseHitbox.hitEnemies.includes(enemy)) return;
        
        pulseHitbox.hitEnemies.push(enemy);

        // --- MAX LEVEL: ARCANE REPULSION ---
        if (weaponLevel >= 5) {
          enemy.isKnockedBack = true;
          enemy.knockbackRecoverTime = this.scene.time.now + 250; // Stunned for a quarter-second
          
          // Calculate angle exactly away from the Witch
          const pushAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
          const pushForce = 400; // A solid shove backward
          
          this.scene.physics.velocityFromRotation(pushAngle, pushForce, enemy.body.velocity);
          enemy.setTint(0xe9d5ff); // Tint them a pale arcane color during the knockback
        }
      };

      this.lastFired = time + currentCooldown;
    }
  }
}