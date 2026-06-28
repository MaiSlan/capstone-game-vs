import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class Musket {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.musket;
    this.lastFired = 0;
    this.shotCount = 0; // Track shots for the "Critical Jackpot"
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const baseDamage = this.stats.damageBase[lvlIdx] * player.damageMult;
      const maxMult = this.stats.damageMaxMult[lvlIdx];
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentSpeed = this.stats.speed[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      this.shotCount++;
      const isJackpot = isMaxLevel && (this.shotCount % 5 === 0);

      // --- THE "NICE" RNG DAMAGE CALCULATION ---
      // Random multiplier between 1 and the maxMult.
      const randomMultiplier = Phaser.Math.FloatBetween(1, maxMult);
      let finalDamage = baseDamage * randomMultiplier;

      // If it's a jackpot, override the RNG and give them the absolute maximum
      if (isJackpot) {
        finalDamage = baseDamage * maxMult;
      }

      // Create the bullet
      const bullet = this.scene.playerProjectiles.create(player.x, player.y, 'musket_icon');
      
      bullet.isBullet = true; // Destroys on impact by default
      bullet.damage = Math.round(finalDamage);
      bullet.rotation = player.currentAimAngle;
      
      // Make the jackpot shot visually distinct
      if (isJackpot) {
        bullet.setTint(0xffaa00);
        bullet.setScale(1.5);
      } else {
        bullet.setScale(0.5);
      }

      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, bullet.body.velocity);

      // Custom onHit for the Jackpot explosion
      bullet.onHit = (enemy) => {
        if (isJackpot) {
          // Create a small explosive AoE on the target
          this.createExplosion(enemy.x, enemy.y, bullet.damage * 0.5); // Bonus 50% splash damage
        }
      };

      // Cleanup stray bullets
      this.scene.time.delayedCall(2000, () => {
        if (bullet && bullet.active) bullet.destroy();
      });

      this.lastFired = time + currentCooldown;
    }
  }

  createExplosion(x, y, splashDamage) {
    const explosion = this.scene.add.circle(x, y, 60, 0xff5500, 0.6);
    this.scene.physics.add.existing(explosion);
    
    // Check overlap once for the burst
    this.scene.physics.overlap(explosion, this.scene.enemies, (zone, enemy) => {
      enemy.takeDamage(splashDamage);
    });

    // Fade out
    this.scene.tweens.add({
      targets: explosion, alpha: 0, scale: 1.2, duration: 200, onComplete: () => explosion.destroy()
    });
  }
}