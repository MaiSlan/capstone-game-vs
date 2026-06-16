import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class DragonShout {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.dragon_shout;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentKnockback = this.stats.knockbackForce[lvlIdx];

      // 1. The Physics Hitbox
      const shout = this.scene.playerProjectiles.create(player.x, player.y, null).setVisible(false);
      shout.body.setCircle(30);
      shout.body.setOffset(-30, -30);
      shout.damage = currentDamage;
      shout.hitEnemies = [];

      this.scene.physics.velocityFromRotation(player.currentAimAngle, 1000, shout.body.velocity);

      // --- THE FIX: The Visual Effects ---
      const drawWave = (delay, alphaMultiplier) => {
        // Create the graphic EXACTLY at the player's coordinates
        const wave = this.scene.add.graphics({ x: player.x, y: player.y });
        wave.lineStyle(6, 0xffffff, alphaMultiplier); // Thick white line
        
        // Draw the arc at local 0,0 so it scales perfectly from the center
        wave.beginPath();
        wave.arc(0, 0, 40, -0.6, 0.6, false);
        wave.strokePath();

        // Rotate to face the aim direction
        wave.rotation = player.currentAimAngle;

        // Calculate where the visual should fly to (matches the 1000 velocity)
        const flyDistance = 300; 
        const targetX = player.x + Math.cos(player.currentAimAngle) * flyDistance;
        const targetY = player.y + Math.sin(player.currentAimAngle) * flyDistance;

        // Tween the visual independently of the physics body
        this.scene.tweens.add({
          targets: wave,
          x: targetX,
          y: targetY,
          scaleX: 4,  // Scales up beautifully into a massive cone
          scaleY: 4,
          alpha: 0,
          duration: 350,
          delay: delay,
          onComplete: () => wave.destroy()
        });
      };

      // Draw three overlapping waves for a visceral "shout" effect
      drawWave(0, 1);       // The primary shockwave
      drawWave(50, 0.6);    // Follow-up echo
      drawWave(100, 0.3);   // Faint trailing echo
      // ------------------------------------

      // 3. Expand the physics hitbox rapidly to simulate the cone
      this.scene.tweens.add({
        targets: shout.body,
        radius: 120, 
        duration: 300,
        onComplete: () => { if (shout.active) shout.destroy(); }
      });

      // --- THE CUSTOM BRAIN (Knockback) ---
      shout.onHit = (enemy) => {
        if (shout.hitEnemies.includes(enemy)) return;
        shout.hitEnemies.push(enemy);

        // Inject the Knockback state flags!
        enemy.isKnockedBack = true;
        enemy.knockbackRecoverTime = this.scene.time.now + 400; 

        // Apply the violent push
        const pushAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        this.scene.physics.velocityFromRotation(pushAngle, currentKnockback, enemy.body.velocity);

        // --- MAX LEVEL: THE SHATTER CURSE ---
        if (weaponLevel >= 5) {
          enemy.hasShatterCurse = true; 
          enemy.setTint(0x7dd3fc); 
        } else {
          enemy.setTint(0xd4d4d8); 
        }
      };

      this.lastFired = time + currentCooldown;
    }
  }
}