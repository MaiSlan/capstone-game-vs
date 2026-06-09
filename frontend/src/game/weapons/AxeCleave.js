import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class AxeCleave {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.cleave_axe;
    this.lastFired = 0;

    // Generate the massive half-circle scythe graphic
    if (!scene.textures.exists('melee_swipe')) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.8);
      graphics.beginPath();
      
      // Center of the 300x300 canvas
      graphics.moveTo(150, 150); 
      
      // Draw a 180-degree arc (half-circle) facing Right (0 radians)
      graphics.arc(
        150, 150, 
        this.stats.radius, 
        Phaser.Math.DegToRad(-90), 
        Phaser.Math.DegToRad(90), 
        false
      );
      
      graphics.closePath();
      graphics.fillPath();
      graphics.generateTexture('melee_swipe', 300, 300);
      graphics.destroy();
    }
  }

  update(time, player, enemiesGroup) {
    if (time > this.lastFired) {
      
      // Calculate a slight offset so the swing extends outward from the character
      // rather than spinning directly on top of their center pixel
      const offsetX = Math.cos(player.currentAimAngle) * 20;
      const offsetY = Math.sin(player.currentAimAngle) * 20;

      const swipe = this.scene.playerProjectiles.create(
        player.x + offsetX, 
        player.y + offsetY, 
        'melee_swipe'
      );
      
      swipe.isBullet = false;
      swipe.damage = this.stats.damage;
      swipe.setOrigin(0.5, 0.5);

      // --- NEW: Apply the Player's Targeting Angle ---
      swipe.setRotation(player.currentAimAngle);

      // Linger slightly longer (200ms) to give it that "heavy slash" feel
      this.scene.time.delayedCall(200, () => {
        if (swipe && swipe.active) swipe.destroy();
      });

      this.lastFired = time + this.stats.cooldown;
    }
  }
}