import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class LoadedDice {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.loaded_dice;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const diceCount = this.stats.diceCount[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      for (let i = 0; i < diceCount; i++) {
        const dice = this.scene.playerProjectiles.create(player.x, player.y, 'dice_icon');
        
        dice.isBullet = false; // We manage destruction manually so they can bounce
        dice.damage = currentDamage;
        dice.setScale(0.5);

        // Make it bounce off the MainScene walls/world bounds!
        dice.body.setCollideWorldBounds(true);
        dice.body.setBounce(1, 1); // 1 = perfect elasticity (doesn't lose speed on bounce)

        // Add a slight random spread to each die thrown
        const spreadAngle = player.currentAimAngle + Phaser.Math.FloatBetween(-0.4, 0.4);
        this.scene.physics.velocityFromRotation(spreadAngle, currentSpeed, dice.body.velocity);

        // Visual spin
        this.scene.tweens.add({ targets: dice, rotation: Math.PI * 4, duration: 1000, repeat: -1 });

        // Hit logic
        dice.hitEnemies = [];
        dice.onHit = (enemy) => {
          if (dice.hitEnemies.includes(enemy)) return;
          dice.hitEnemies.push(enemy);

          // Bounce off the enemy (reverse velocity slightly)
          dice.body.velocity.x *= -1;
          dice.body.velocity.y *= -1;

          // --- MAX LEVEL: SNAKE EYES (RANDOM DEBUFF) ---
          if (isMaxLevel) {
            this.applyRandomDebuff(enemy);
          }

          // Allow it to hit the same enemy again after 1 second
          this.scene.time.delayedCall(1000, () => {
            if (dice && dice.active) {
              dice.hitEnemies = dice.hitEnemies.filter(e => e !== enemy);
            }
          });
        };

        // Dice vanish after 4 seconds of bouncing around
        this.scene.time.delayedCall(4000, () => {
          if (dice && dice.active) {
            this.scene.tweens.add({
              targets: dice, alpha: 0, scale: 0, duration: 300, onComplete: () => dice.destroy()
            });
          }
        });
      }

      this.lastFired = time + currentCooldown;
    }
  }

  applyRandomDebuff(enemy) {
    if (!enemy || !enemy.active) return;

    const roll = Math.floor(Math.random() * 3); // 0, 1, or 2

    if (roll === 0) {
      // Freeze
      enemy.setTint(0x00ffff);
      const originalSpeed = enemy.speed;
      enemy.speed = 0;
      this.scene.time.delayedCall(2000, () => {
        if (enemy && enemy.active) { enemy.speed = originalSpeed; enemy.clearTint(); }
      });
    } else if (roll === 1) {
      // Burn (take an extra burst of damage after 1 second)
      enemy.setTint(0xff5500);
      this.scene.time.delayedCall(1000, () => {
        if (enemy && enemy.active) { enemy.takeDamage(20); enemy.clearTint(); }
      });
    } else if (roll === 2) {
      // Poison (Vulnerability)
      enemy.setTint(0x00ff00);
      enemy.damageVulnerability = 1.3; // Takes 30% more damage
      this.scene.time.delayedCall(3000, () => {
        if (enemy && enemy.active) { enemy.damageVulnerability = 1.0; enemy.clearTint(); }
      });
    }
  }
}