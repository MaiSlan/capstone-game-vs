import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class SeismicStomp {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.seismic_stomp;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const currentDuration = this.stats.duration[lvlIdx];
      
      // Calculate DoT: Since overlap triggers 60 times a second, 
      // we divide the base tick damage so it drains health smoothly over time.
      const dotDamage = (this.stats.damage[lvlIdx] * player.damageMult) * 0.02;

      // 1. Visual Indicator: The "Cracked Earth"
      // If you have a 'stomp_cracks' PNG, you can spawn an image here.
      // For now, we will draw a brutal, burning magma ring.
      const crackVisual = this.scene.add.graphics();
      crackVisual.fillStyle(0x7f1d1d, 0.3); // Deep red, semi-transparent
      crackVisual.fillCircle(player.x, player.y, currentRadius);
      crackVisual.lineStyle(3, 0xf59e0b, 0.6); // Amber/Magma colored jagged rim
      crackVisual.strokeCircle(player.x, player.y, currentRadius);

      // 2. The Physics Hitbox
      const quake = this.scene.playerProjectiles.create(player.x, player.y, null).setVisible(false);
      quake.body.setCircle(currentRadius);
      quake.body.setOffset(-currentRadius, -currentRadius);
      
      // We assign the DoT so MainScene automatically applies it every frame
      quake.damage = dotDamage;

      // --- THE CUSTOM BRAIN ---
      quake.onHit = (enemy) => {
        // At Max Level (5), Surtur's Wake drastically slows enemies traversing the flames
        if (weaponLevel >= 5) {
          // We apply a temporary debuff that lasts just long enough to bridge the gap between frames.
          // Your enemy update loop will need to check this flag to halve their speed.
          enemy.isSlowed = true;
          enemy.slowRecoverTime = this.scene.time.now + 100; // 100ms recovery window
          
          // Visual feedback: Tint them an ashen color while burning in the wake
          enemy.setTint(0xfca5a5); 
        }
      };

      // 3. Lifespan: Fade out and destroy the stomp after the duration ends
      this.scene.tweens.add({
        targets: crackVisual,
        alpha: 0,
        duration: currentDuration,
        ease: 'Power2',
        onComplete: () => {
          crackVisual.destroy();
          if (quake.active) quake.destroy();
        }
      });

      this.lastFired = time + currentCooldown;
    }
  }
}