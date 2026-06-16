import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicWand {
  constructor(scene) {
    this.scene = scene;
    // Fallback stats just in case your DB isn't fully updated yet
    this.stats = WEAPON_DB.magic_wand || { 
      damage: [15, 20, 25, 30, 40], 
      cooldown: [1500, 1400, 1300, 1200, 1000] 
    };
    
    this.lastFired = 0;
    this.sweepEndTime = 0;
    this.lastTick = 0;
    
    // We create a persistent graphics object for the laser visuals
    this.beamGraphics = scene.add.graphics();
    this.beamGraphics.setDepth(5); 
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
    
    // The beam's width scales up drastically as it levels
    const beamWidth = 10 + (lvlIdx * 8); 

    // --- 1. TRIGGER THE BEAM ---
    if (time > this.lastFired) {
      const isMaxLevel = weaponLevel >= 5;
      
      // Standard beam is a quick 250ms flash. Max level is 1 full second (1000ms).
      const activeDuration = isMaxLevel ? 1000 : 250;
      
      this.sweepEndTime = time + activeDuration;
      // Cooldown only starts AFTER the beam finishes firing
      this.lastFired = time + currentCooldown + activeDuration; 
    }

    // --- 2. THE SWEEP (WHILE ACTIVE) ---
    if (time < this.sweepEndTime) {
      this.beamGraphics.clear();
      
      // Calculate the end point of the laser (far off-screen)
      const length = 1200; 
      const endX = player.x + Math.cos(player.currentAimAngle) * length;
      const endY = player.y + Math.sin(player.currentAimAngle) * length;

      // Draw the Outer Violet Aura
      this.beamGraphics.lineStyle(beamWidth, 0xa855f7, 0.4); // Semi-transparent purple
      this.beamGraphics.strokeLineShape(new Phaser.Geom.Line(player.x, player.y, endX, endY));
      
      // Draw the Inner White-Hot Core
      this.beamGraphics.lineStyle(beamWidth * 0.3, 0xffffff, 1); 
      this.beamGraphics.strokeLineShape(new Phaser.Geom.Line(player.x, player.y, endX, endY));

      // --- 3. THE PHYSICS STREAM ---
      // Fire an invisible, high-speed physics circle every 40ms to simulate a solid beam
      if (time > this.lastTick) {
        const segment = this.scene.playerProjectiles.create(player.x, player.y, null).setVisible(false);
        segment.body.setCircle(beamWidth / 2);
        segment.body.setOffset(-beamWidth / 2, -beamWidth / 2);
        
        // Because the beam ticks rapidly, we fractionalize the damage so it doesn't instantly one-shot bosses
        segment.damage = (this.stats.damage[lvlIdx] * player.damageMult) * 0.3;
        
        // Blast the segment forward at extreme speed
        this.scene.physics.velocityFromRotation(player.currentAimAngle, 3000, segment.body.velocity);

        // Destroy the physics segment after it clears the screen to prevent memory leaks
        this.scene.time.delayedCall(400, () => {
          if (segment && segment.active) segment.destroy();
        });

        // The polymorphic brain: Ensure one segment doesn't multi-hit the same enemy
        segment.hitEnemies = [];
        segment.onHit = (enemy) => {
          if (segment.hitEnemies.includes(enemy)) return;
          segment.hitEnemies.push(enemy);
        };

        this.lastTick = time + 40; 
      }
    } else {
      // Hide the visuals entirely when the weapon is on cooldown
      this.beamGraphics.clear();
    }
  }
}