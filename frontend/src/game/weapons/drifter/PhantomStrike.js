import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class PhantomStrike {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.phantom_strike;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const chainCount = this.stats.chainCount[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;

      // 1. Find a valid starting target (random enemy on screen)
      const visibleEnemies = this.scene.enemies.getChildren().filter(e => e.active);
      if (visibleEnemies.length > 0) {
        // Pick a random starting enemy
        const startEnemy = Phaser.Utils.Array.GetRandom(visibleEnemies);
        
        // Create the glowing green Phantom
        const phantom = this.scene.add.sprite(startEnemy.x - 50, startEnemy.y - 50, 'phantom_strike_icon');
        phantom.setTint(0x00ffaa); // Bright spatial green
        phantom.setScale(1.2);
        
        // Add a trail effect (optional, but looks great for "zigzag flashes")
        const particles = this.scene.add.particles(0, 0, 'phantom_strike_icon', {
            speed: 0, scale: { start: 0.5, end: 0 }, alpha: { start: 0.5, end: 0 },
            tint: 0x00ffaa, lifespan: 300, blendMode: 'ADD'
        });
        particles.startFollow(phantom);

        // 2. Start the Chain-Blink recursion
        this.performBlink(phantom, startEnemy, currentDamage, chainCount, isMaxLevel, particles);
      }

      this.lastFired = time + currentCooldown;
    }
  }

  performBlink(phantom, target, damage, blinksLeft, isMaxLevel, particles, hitList = []) {
    if (!target || !target.active || blinksLeft <= 0) {
      // --- MAX LEVEL: SHATTERED REALITY (BLACK HOLE) ---
      if (isMaxLevel && phantom) {
        this.createBlackHole(phantom.x, phantom.y, damage * 2);
      }
      
      // Cleanup
      if (phantom) phantom.destroy();
      if (particles) this.scene.time.delayedCall(300, () => particles.destroy());
      return;
    }

    hitList.push(target);

    // Instant blink to the target
    this.scene.tweens.add({
      targets: phantom,
      x: target.x,
      y: target.y,
      duration: 50, // Nearly instant
      onComplete: () => {
        // Damage the target
        if (target && target.active) target.takeDamage(damage);

        // Find the next closest enemy that hasn't been hit yet
        const validTargets = this.scene.enemies.getChildren().filter(e => e.active && !hitList.includes(e));
        const nextTarget = this.scene.physics.closest(phantom, validTargets);

        // Pause for a split second before the next blink
        this.scene.time.delayedCall(100, () => {
          this.performBlink(phantom, nextTarget, damage, blinksLeft - 1, isMaxLevel, particles, hitList);
        });
      }
    });
  }

  createBlackHole(x, y, explosionDamage) {
    const blackHole = this.scene.add.circle(x, y, 100, 0x110022, 0.8);
    blackHole.setStrokeStyle(4, 0x00ffaa);

    // Spin effect
    this.scene.tweens.add({ targets: blackHole, scale: 1.2, yoyo: true, repeat: -1, duration: 400 });

    // Suck enemies in for 2 seconds
    const pullTimer = this.scene.time.addEvent({
      delay: 50, // Tick 20 times a second
      callback: () => {
        const pullZone = new Phaser.Geom.Circle(x, y, 200); // 200px pull radius
        this.scene.enemies.getChildren().forEach(enemy => {
          if (enemy.active && Phaser.Geom.Circle.ContainsPoint(pullZone, enemy)) {
            // Forcefully move them towards the center
            this.scene.physics.moveToObject(enemy, blackHole, 200);
          }
        });
      },
      loop: true
    });

    // Explode after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      pullTimer.remove();
      
      // Explosion Visuals
      const blast = this.scene.add.circle(x, y, 150, 0x00ffaa, 1);
      this.scene.physics.add.existing(blast);
      
      // Damage everything in the blast radius
      this.scene.physics.overlap(blast, this.scene.enemies, (zone, enemy) => {
        enemy.takeDamage(explosionDamage);
        
        // Restore their original movement logic (stop being pulled)
        if (enemy.body) enemy.body.setVelocity(0, 0); 
      });

      this.scene.tweens.add({
        targets: [blackHole, blast], alpha: 0, scale: 2, duration: 300, onComplete: () => {
          blackHole.destroy();
          blast.destroy();
        }
      });
    });
  }
}