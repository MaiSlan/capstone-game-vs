import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class FanOfKnives {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.fan_of_knives;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const knifeCount = this.stats.knifeCount[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Calculate the spread of the cone. 
      // Higher levels tighten the spread to concentrate the damage.
      const coneSpread = Math.PI / (2 + (lvlIdx * 0.5)); // Narrows slightly each level
      const startAngle = player.currentAimAngle - (coneSpread / 2);
      const angleStep = knifeCount > 1 ? coneSpread / (knifeCount - 1) : 0;

      for (let i = 0; i < knifeCount; i++) {
        const fireAngle = startAngle + (i * angleStep);
        
        const knife = this.scene.playerProjectiles.create(player.x, player.y, 'knives_icon');
        knife.isBullet = true; // Destroy on impact
        knife.damage = currentDamage;
        knife.rotation = fireAngle;
        knife.setScale(0.6);

        // Fire outward
        this.scene.physics.velocityFromRotation(fireAngle, currentSpeed, knife.body.velocity);

        // --- MAX LEVEL: STACKING POISON ---
        knife.onHit = (enemy) => {
          if (isMaxLevel) {
            this.applyPoison(enemy);
          }
        };

        // Enforce short range: destroy knives after 300ms so they don't fly across the screen
        this.scene.time.delayedCall(300, () => {
          if (knife && knife.active) {
            this.scene.tweens.add({
              targets: knife, alpha: 0, duration: 100, onComplete: () => knife.destroy()
            });
          }
        });
      }

      this.lastFired = time + currentCooldown;
    }
  }

  applyPoison(enemy) {
    if (!enemy || !enemy.active) return;

    // Turn them a sickly green to visually confirm the poison[cite: 3]
    enemy.setTint(0x00ff00);

    // If they aren't poisoned yet, initialize the DoT (Damage over Time)
    if (!enemy.poisonTimer) {
      enemy.poisonStacks = 1;
      
      enemy.poisonTimer = this.scene.time.addEvent({
        delay: 1000, // Tick damage every 1 second
        callback: () => {
          if (enemy && enemy.active) {
            // Deal 5 damage per stack
            enemy.takeDamage(5 * enemy.poisonStacks);
          } else {
            enemy.poisonTimer.remove(); // Cleanup if enemy died from something else
          }
        },
        loop: true
      });

      // Crucial cleanup: remove the timer if the enemy is destroyed
      enemy.on('destroy', () => {
        if (enemy.poisonTimer) enemy.poisonTimer.remove();
      });

    } else {
      // If already poisoned, add a stack (up to a max of 5)
      enemy.poisonStacks = Math.min(enemy.poisonStacks + 1, 5);
    }
  }
}