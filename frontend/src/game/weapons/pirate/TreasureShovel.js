import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class TreasureShovel {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.treasure_shovel;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRange = this.stats.range[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Position the stab directly in front of the player
      const stabX = player.x + Math.cos(player.currentAimAngle) * currentRange;
      const stabY = player.y + Math.sin(player.currentAimAngle) * currentRange;

      const shovel = this.scene.playerProjectiles.create(stabX, stabY, 'shovel_icon');
      shovel.isBullet = false; // Fast melee strike
      shovel.damage = currentDamage;
      shovel.rotation = player.currentAimAngle;
      
      shovel.body.setCircle(15); // Small, precise hitbox
      shovel.hitEnemies = [];

      shovel.onHit = (enemy) => {
        if (shovel.hitEnemies.includes(enemy)) return;
        shovel.hitEnemies.push(enemy);

        // --- MAX LEVEL: GUARANTEED HIGH-VALUE COIN ---
        // If this specific strike is going to kill the enemy
        if (isMaxLevel && (enemy.hp - currentDamage <= 0)) {
          
          // The Safe Hook: Dispatch an event for the future Loot System
          window.dispatchEvent(new CustomEvent('VS_SPAWN_COIN', {
            detail: { x: enemy.x, y: enemy.y, type: 'high_value', amount: 50 }
          }));
          
          // Optional: direct fallback if you implement spawnCoin in MainScene first
          if (typeof this.scene.spawnCoin === 'function') {
            this.scene.spawnCoin(enemy.x, enemy.y, 'high_value');
          }
        }
      };

      // Very quick strike and retract animation
      this.scene.tweens.add({
        targets: shovel,
        x: stabX + Math.cos(player.currentAimAngle) * 20, // push forward
        y: stabY + Math.sin(player.currentAimAngle) * 20,
        yoyo: true,
        duration: 75,
        onComplete: () => {
          if (shovel && shovel.active) shovel.destroy();
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }
}