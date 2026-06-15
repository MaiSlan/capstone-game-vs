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
      // We spawn an invisible circle that travels incredibly fast and scales up
      const shout = this.scene.playerProjectiles.create(player.x, player.y, null).setVisible(false);
      shout.body.setCircle(30);
      shout.body.setOffset(-30, -30);
      shout.damage = currentDamage;
      shout.hitEnemies = []; // Prevent multi-hitting the same enemy

      // Shoot it forward like a shockwave
      this.scene.physics.velocityFromRotation(player.currentAimAngle, 1000, shout.body.velocity);

      // 2. Visual Effects: The Soundwave Arcs
      const drawWave = (offset, alpha, scale) => {
        const wave = this.scene.add.graphics();
        wave.lineStyle(4, 0xe5e5e5, alpha); // Pale white/gray sonic wave
        wave.beginPath();
        // Draw an arc facing the aim direction
        wave.arc(player.x, player.y, 40, player.currentAimAngle - 0.6, player.currentAimAngle + 0.6, false);
        wave.strokePath();

        // Push the visual wave forward to match the physics hitbox
        this.scene.physics.add.existing(wave);
        this.scene.physics.velocityFromRotation(player.currentAimAngle, 1000, wave.body.velocity);

        this.scene.tweens.add({
          targets: wave,
          scaleX: scale,
          scaleY: scale,
          alpha: 0,
          duration: 300,
          onComplete: () => wave.destroy()
        });
      };

      // Draw three overlapping waves for a visceral "shout" effect
      drawWave(0, 0.8, 3);
      drawWave(-20, 0.5, 4);
      drawWave(-40, 0.2, 5);

      // 3. Expand the physics hitbox rapidly to simulate the cone, then destroy it
      this.scene.tweens.add({
        targets: shout.body,
        radius: 120, // Increases the hit area as it travels
        duration: 300,
        onComplete: () => { if (shout.active) shout.destroy(); }
      });

      // --- THE CUSTOM BRAIN (Knockback) ---
      shout.onHit = (enemy) => {
        if (shout.hitEnemies.includes(enemy)) return;
        shout.hitEnemies.push(enemy);

        // Inject the Knockback state flags (which our upcoming BaseMonster will read!)
        enemy.isKnockedBack = true;
        // They are stunned/pushed for 400 milliseconds
        enemy.knockbackRecoverTime = this.scene.time.now + 400; 

        // Calculate the exact angle from the player to the enemy to push them outward
        const pushAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        
        // Apply the violent push!
        this.scene.physics.velocityFromRotation(pushAngle, currentKnockback, enemy.body.velocity);

        // --- MAX LEVEL: THE SHATTER CURSE ---
        if (weaponLevel >= 5) {
          enemy.hasShatterCurse = true; // BaseMonster will instantly kill them if they hit the wall
          enemy.setTint(0x7dd3fc); // Tint them frosty blue
        } else {
          enemy.setTint(0xd4d4d8); // Normal dust tint
        }
      };

      this.lastFired = time + currentCooldown;
    }
  }
}