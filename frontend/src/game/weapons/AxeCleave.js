import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class AxeCleave {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.cleave_axe;
    this.lastFired = 0;

    // Generate the graphics only once globally
    if (!scene.textures.exists('melee_swipe')) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.8);
      graphics.beginPath();
      graphics.moveTo(100, 100);
      graphics.arc(100, 100, 100, Phaser.Math.DegToRad(-45), Phaser.Math.DegToRad(45), false);
      graphics.closePath();
      graphics.fillPath();
      graphics.generateTexture('melee_swipe', 200, 200);
      graphics.destroy();
    }
  }

  update(time, player, enemiesGroup) {
    if (time > this.lastFired) {
      const swipe = this.scene.playerProjectiles.create(player.x, player.y, 'melee_swipe');
      swipe.isBullet = false;
      swipe.damage = this.stats.damage;
      swipe.setOrigin(0.5, 0.5);

      if (player.flipX) {
        swipe.setAngle(0);
        swipe.setX(player.x + 10); 
      } else {
        swipe.setAngle(180);
        swipe.setX(player.x - 10); 
      }

      this.scene.time.delayedCall(150, () => {
        if (swipe && swipe.active) swipe.destroy();
      });

      this.lastFired = time + this.stats.cooldown;
    }
  }
}