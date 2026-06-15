import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ArcaneNova {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.arcane_nova;
    this.lastFired = 0;

    // --- THE FIX: A vastly improved, multi-layered shockwave graphic ---
    if (!scene.textures.exists('nova_ring')) {
      const graphics = scene.add.graphics();

      // 1. Semi-transparent dark purple inner core
      graphics.fillStyle(0x7e22ce, 0.4);
      graphics.fillCircle(150, 150, 140);
      
      // 2. Thick, dense mid-ring
      graphics.lineStyle(20, 0x9333ea, 0.7); 
      graphics.strokeCircle(150, 150, 125);

      // 3. Bright, thin glowing outer edge
      graphics.lineStyle(6, 0xd8b4fe, 1); 
      graphics.strokeCircle(150, 150, 140);

      graphics.generateTexture('nova_ring', 300, 300);
      graphics.destroy();
    }
  }

  // Inside ArcaneNova.js

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];

      const nova = this.scene.playerProjectiles.create(player.x, player.y, 'nova_ring');
      nova.isBullet = false;
      nova.damage = currentDamage;
      nova.setOrigin(0.5, 0.5);
      
      nova.setScale(0.1); 
      nova.setAlpha(0.9);

      // Force the physics body to start tiny
      if (nova.body) nova.body.updateFromGameObject();

      this.scene.tweens.add({
        targets: nova,
        scale: currentRadius / 150, 
        alpha: 0,                   
        duration: 600, // Lasts slightly longer so you can see the carnage
        ease: 'Cubic.easeOut',      
        
        // --- THE FIX: Expand the physics hitbox in real-time ---
        onUpdate: () => {
          if (nova && nova.active && nova.body) {
            nova.body.updateFromGameObject();
          }
        },
        // -------------------------------------------------------

        onComplete: () => {
          if (nova && nova.active) nova.destroy();
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }
}