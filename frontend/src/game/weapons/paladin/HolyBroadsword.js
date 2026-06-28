import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class HolyBroadsword {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.holy_broadsword;
    this.lastFired = 0;
    this.comboCount = 0; // Track swings for the Smite mechanic
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      this.comboCount++;
      const isSmiteSwing = isMaxLevel && (this.comboCount % 3 === 0);

      // Position the sweep in front of the player
      const offsetDist = 30;
      const sweepX = player.x + Math.cos(player.currentAimAngle) * offsetDist;
      const sweepY = player.y + Math.sin(player.currentAimAngle) * offsetDist;

      const sweep = this.scene.playerProjectiles.create(sweepX, sweepY, 'holy_sword_icon');
      
      sweep.isBullet = false; // Prevent instant destruction
      sweep.damage = currentDamage;
      sweep.alpha = 0.6;
      sweep.rotation = player.currentAimAngle;
      
      // Set circular body for a wide sweeping arc
      sweep.body.setCircle(currentRadius / 2);
      sweep.setDisplaySize(currentRadius, currentRadius);

      sweep.hitEnemies = [];

      sweep.onHit = (enemy) => {
        if (sweep.hitEnemies.includes(enemy)) return;
        sweep.hitEnemies.push(enemy);

        // If it's the 3rd swing at Max Level, trigger Smite on this enemy
        if (isSmiteSwing) {
          this.triggerSmite(enemy.x, enemy.y, currentDamage * 2);
        }
      };

      // Cleanup the swing hitbox quickly
      this.scene.time.delayedCall(150, () => {
        if (sweep && sweep.active) sweep.destroy();
      });

      // Visual expand and fade
      this.scene.tweens.add({ targets: sweep, alpha: 0, scale: 1.5, duration: 150 });

      this.lastFired = time + currentCooldown;
    }
  }

  triggerSmite(x, y, smiteDamage) {
    // Create an AoE strike directly on the struck enemy
    const smiteZone = this.scene.playerProjectiles.create(x, y, 'holy_sword_icon');
    
    smiteZone.setTint(0xffd700); // Gold tint for holy light
    smiteZone.alpha = 0.9;
    smiteZone.isBullet = false;
    smiteZone.damage = smiteDamage;
    
    // Generous explosion radius
    const smiteRadius = 90;
    smiteZone.body.setCircle(smiteRadius / 2);
    smiteZone.setDisplaySize(smiteRadius, smiteRadius);

    smiteZone.hitEnemies = [];
    smiteZone.onHit = (e) => {
       if (smiteZone.hitEnemies.includes(e)) return;
       smiteZone.hitEnemies.push(e);
    };

    // Destroy the smite zone quickly
    this.scene.time.delayedCall(200, () => {
      if (smiteZone && smiteZone.active) smiteZone.destroy();
    });
    
    // Simulate a pillar falling from the sky
    this.scene.tweens.add({ targets: smiteZone, alpha: 0, y: y - 60, scale: 1.2, duration: 200 });
  }
}