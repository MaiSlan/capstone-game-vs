import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class AxeCleave {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.cleave_axe;
    this.lastFired = 0;

    // Generate the massive half-circle scythe graphic based on the Level 5 Max Radius (175)
    if (!scene.textures.exists('melee_swipe')) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.8);
      graphics.beginPath();
      
      // Center of the 350x350 canvas
      graphics.moveTo(175, 175); 
      
      graphics.arc(
        175, 175, 
        175, // Max radius 
        Phaser.Math.DegToRad(-90), 
        Phaser.Math.DegToRad(90), 
        false
      );
      
      graphics.closePath();
      graphics.fillPath();
      graphics.generateTexture('melee_swipe', 350, 350);
      graphics.destroy();
    }
  }

  // --- THE FIX: Accept weaponLevel as the 4th argument ---
  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      
      // 1. Get the array index (Level 1 = Index 0)
      const lvlIdx = weaponLevel - 1;
      
      // 2. Pull the array stat AND multiply it by the player's item buffs
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];

      const offsetX = Math.cos(player.currentAimAngle) * 20;
      const offsetY = Math.sin(player.currentAimAngle) * 20;

      const swipe = this.scene.playerProjectiles.create(
        player.x + offsetX, 
        player.y + offsetY, 
        'melee_swipe'
      );
      
      swipe.isBullet = false;
      swipe.damage = currentDamage;
      swipe.setOrigin(0.5, 0.5);

      // --- THE FIX: Scale the graphic based on your current level vs the max (175) ---
      swipe.setScale(currentRadius / 175);
      swipe.setRotation(player.currentAimAngle);

      this.scene.time.delayedCall(200, () => {
        if (swipe && swipe.active) swipe.destroy();
      });

      this.lastFired = time + currentCooldown;
    }
  }
}