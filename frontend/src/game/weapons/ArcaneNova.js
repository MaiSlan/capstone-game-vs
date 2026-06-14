import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class ArcaneNova {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.arcane_nova;
    this.lastFired = 0;

    // Dynamically draw the explosion ring
    if (!scene.textures.exists('nova_ring')) {
      const graphics = scene.add.graphics();
      graphics.lineStyle(6, 0x9333ea, 1); // Deep purple line
      graphics.strokeCircle(100, 100, 96);
      graphics.generateTexture('nova_ring', 200, 200);
      graphics.destroy();
    }
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];

      // Drop the explosion directly on the player
      const nova = this.scene.playerProjectiles.create(player.x, player.y, 'nova_ring');
      nova.isBullet = false;
      nova.damage = currentDamage;
      nova.setOrigin(0.5, 0.5);
      
      // Start tiny, fade out, and expand via a Tween
      nova.setScale(0.1); 
      nova.setAlpha(0.8);

      this.scene.tweens.add({
        targets: nova,
        scale: currentRadius / 100, // Expand to the DB radius limit
        alpha: 0,                   // Fade into nothingness
        duration: 400,              // Lasts for almost half a second
        onComplete: () => {
          if (nova && nova.active) nova.destroy();
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }
}