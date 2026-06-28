import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ArmCannon {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.arm_cannon;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const pushbackForce = this.stats.knockbackSelf[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // Fire a shotgun spread of 5 distinct pellets
      const pelletCount = 5;
      
      for (let i = 0; i < pelletCount; i++) {
        // Create a spread angle
        const spreadAngle = player.currentAimAngle + Phaser.Math.FloatBetween(-0.35, 0.35);
        
        const pellet = this.scene.playerProjectiles.create(player.x, player.y, 'cannon_icon');
        pellet.isBullet = true; // Destroy on impact
        
        // Damage is divided slightly so point-blank hits (where all 5 hit) are devastating
        pellet.damage = currentDamage * 0.4; 
        pellet.rotation = spreadAngle;
        pellet.setScale(0.5);
        
        // Fire at extreme velocity
        this.scene.physics.velocityFromRotation(spreadAngle, 1000, pellet.body.velocity);

        // Extremely short range constraint: Destroy pellets after just 150ms[cite: 3]
        this.scene.time.delayedCall(150, () => {
          if (pellet && pellet.active) {
            this.scene.tweens.add({ 
              targets: pellet, 
              alpha: 0, 
              duration: 50, 
              onComplete: () => pellet.destroy() 
            });
          }
        });
      }

      // Visual muzzle flash right at the arm
      const flashX = player.x + Math.cos(player.currentAimAngle) * 20;
      const flashY = player.y + Math.sin(player.currentAimAngle) * 20;
      const flash = this.scene.add.circle(flashX, flashY, 40, 0xffdd00, 0.9);
      
      this.scene.tweens.add({
        targets: flash,
        scale: 1.5,
        alpha: 0,
        duration: 150,
        onComplete: () => flash.destroy()
      });

      // --- MAX LEVEL: TACTICAL RECOIL DODGE ---[cite: 3]
      if (isMaxLevel) {
        // Calculate the exact opposite direction of the blast
        const recoilAngle = player.currentAimAngle + Math.PI; 
        
        // Briefly lock player speed to let the tween handle movement
        const originalSpeed = player.speed || player.baseSpeed;
        player.speed = 0;

        // Push the player backward based on the WeaponDB knockback stat[cite: 8]
        this.scene.tweens.add({
          targets: player,
          x: player.x + Math.cos(recoilAngle) * pushbackForce,
          y: player.y + Math.sin(recoilAngle) * pushbackForce,
          duration: 150,
          ease: 'Power2.easeOut',
          onComplete: () => {
            if (player && player.active) player.speed = originalSpeed; // Restore control
          }
        });
      }

      this.lastFired = time + currentCooldown;
    }
  }
}