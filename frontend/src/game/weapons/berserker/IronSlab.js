import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class IronSlab {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.iron_slab;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // 1. The 360-degree Hitbox
      const slabZone = this.scene.playerProjectiles.create(player.x, player.y, 'greatsword_icon');
      slabZone.isBullet = false; // Melee swing, do not destroy on first hit
      slabZone.damage = currentDamage;
      
      // Expand the hitbox to match the radius
      slabZone.body.setCircle(currentRadius);
      // Offset physics body so it centers perfectly on the player
      slabZone.body.setOffset(-currentRadius / 2, -currentRadius / 2);
      slabZone.setDisplaySize(currentRadius * 2, currentRadius * 2);

      // 2. The Visual Swing Effect
      slabZone.alpha = 0.8;
      // Start the visual blade behind the player's aim and swing it all the way around
      slabZone.rotation = player.currentAimAngle - Math.PI; 
      
      this.scene.tweens.add({
        targets: slabZone,
        rotation: player.currentAimAngle + Math.PI, // Full 360 sweep
        duration: 250, // Slow, heavy swing
        ease: 'Cubic.easeOut',
        onComplete: () => {
          if (slabZone && slabZone.active) slabZone.destroy();
        }
      });

      // 3. Hit and Knockback Logic
      slabZone.hitEnemies = [];
      slabZone.onHit = (enemy) => {
        if (slabZone.hitEnemies.includes(enemy)) return;
        slabZone.hitEnemies.push(enemy);

        // --- MAX LEVEL: MASSIVE KNOCKBACK ---
        if (isMaxLevel) {
          // Calculate the angle from the player to the enemy
          const pushAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
          const pushDistance = 100; // How far they get shoved
          
          // Briefly stun them so their normal movement doesn't override the knockback
          const originalSpeed = enemy.speed;
          enemy.speed = 0;
          
          this.scene.tweens.add({
            targets: enemy,
            x: enemy.x + Math.cos(pushAngle) * pushDistance,
            y: enemy.y + Math.sin(pushAngle) * pushDistance,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
              if (enemy && enemy.active) enemy.speed = originalSpeed; // Restore speed
            }
          });
        }
      };

      this.lastFired = time + currentCooldown;
    }
  }
}