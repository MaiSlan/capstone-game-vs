import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class Molotov {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.molotov;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const duration = this.stats.duration[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // --- THE "NICE" RNG THROW TARGETING ---
      // We pick a random angle, but keep it within a 90-degree cone of where the player is aiming.
      const angleSpread = Phaser.Math.FloatBetween(-0.8, 0.8); 
      const throwAngle = player.currentAimAngle + angleSpread;
      const throwDistance = Phaser.Math.Between(100, 250); // Random distance

      const targetX = player.x + Math.cos(throwAngle) * throwDistance;
      const targetY = player.y + Math.sin(throwAngle) * throwDistance;

      // Spawn the bottle
      const bottle = this.scene.add.sprite(player.x, player.y, 'molotov_icon');
      
      // Simulate an "arc" throw using a tween
      this.scene.tweens.add({
        targets: bottle,
        x: targetX,
        y: targetY,
        rotation: Math.PI * 4, // Spin wildly in the air
        duration: 600,
        ease: 'Sine.easeOut',
        onComplete: () => {
          bottle.destroy();
          this.shatterAndBurn(targetX, targetY, currentRadius, duration, currentDamage, isMaxLevel);
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }

  shatterAndBurn(x, y, radius, duration, tickDamage, isMaxLevel) {
    // The fire pool visual
    const firePool = this.scene.add.circle(x, y, radius, 0xff4400, 0.4);
    
    // The damage tick timer
    const burnTimer = this.scene.time.addEvent({
      delay: 400, // Ticks slightly faster than Paladin's aura
      callback: () => {
        const fireZone = new Phaser.Geom.Circle(x, y, radius);
        
        this.scene.enemies.getChildren().forEach(enemy => {
          if (enemy.active && Phaser.Geom.Circle.ContainsPoint(fireZone, enemy)) {
            
            // Inside the Molotov burnTimer callback:
            if (isMaxLevel && (enemy.hp - tickDamage <= 0)) {
            if (Math.random() > 0.5) { // 50% chance
                window.dispatchEvent(new CustomEvent('VS_SPAWN_COIN', {
                detail: { x: enemy.x, y: enemy.y, type: 'standard', amount: 10 }
                }));
            }
            }
            enemy.takeDamage(tickDamage);
          }
        });
      },
      loop: true
    });

    // Cleanup when the fire burns out
    this.scene.time.delayedCall(duration, () => {
      burnTimer.remove();
      this.scene.tweens.add({
        targets: firePool, alpha: 0, duration: 500, onComplete: () => firePool.destroy()
      });
    });
  }
}