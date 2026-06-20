import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicOrb {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_orb;
    this.lastFired = 0;
    this.activeOrbs = [];
    this.lastImplosionTime = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    const currentSpeed = 120 + (lvlIdx * 75);

    // --- 1. ACTIVE TRACKING (HOMING LOGIC) ---
    this.activeOrbs = this.activeOrbs.filter(orb => orb && orb.active);
    const validTargets = this.scene.enemies.getChildren().filter(e => e.active && !e.isDying);
    
    this.activeOrbs.forEach(orb => {
      orb.rotation += 0.05;

      if (validTargets.length > 0) {
        const closest = this.scene.physics.closest(orb, validTargets);
        if (closest) {
          const targetAngle = Phaser.Math.Angle.Between(orb.x, orb.y, closest.x, closest.y);
          this.scene.physics.velocityFromRotation(targetAngle, currentSpeed, orb.body.velocity);
        }
      }
    });

    // --- 2. FIRE NEW ORB ---
    if (time > this.lastFired) {
      // MASSIVE DAMAGE BUFF: Multiply the base damage by 3 so it hits like a truck
      const baseDamage = this.stats.damage ? this.stats.damage[lvlIdx] : 15;
      const currentDamage = baseDamage * player.damageMult * 3.0; 
      
      // Enforce a slower cooldown so it isn't a machine gun
      const baseCooldown = this.stats.cooldown ? this.stats.cooldown[lvlIdx] : 2000;
      const currentCooldown = Math.max(1000, baseCooldown * player.cooldownMult);

      const orb = this.scene.playerProjectiles.create(player.x, player.y, 'magic_orb');
      orb.setScale(0.8);
      orb.damage = currentDamage;
      orb.hasImploded = false;
      
      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, orb.body.velocity);

      this.scene.time.delayedCall(5000, () => {
        if (orb && orb.active) orb.destroy();
      });

      orb.onHit = (enemy) => {
        // Only trigger the implosion ONCE per orb
        if (weaponLevel >= 5 && !orb.hasImploded) {
          orb.hasImploded = true;
          if (time > this.lastImplosionTime) {
            this.triggerVoidImplosion(orb.x, orb.y, currentDamage);
            this.lastImplosionTime = time + 2500; // Lock out new implosions for 2.5s
          }
        }
        orb.destroy(); 
      };

      this.activeOrbs.push(orb);
      this.lastFired = time + currentCooldown;
    }
  }

  triggerVoidImplosion(x, y, baseDamage) {
    const implosionRadius = 120;

    const blastVisual = this.scene.add.graphics({ x: x, y: y });
    blastVisual.fillStyle(0x050202, 1); 
    blastVisual.fillCircle(0, 0, implosionRadius);
    blastVisual.lineStyle(3, 0x9333ea, 0.8); 
    blastVisual.strokeCircle(0, 0, implosionRadius);

    const blackHole = this.scene.playerProjectiles.create(x, y).setVisible(false);
    blackHole.body.setCircle(implosionRadius);
    blackHole.body.setOffset(-implosionRadius, -implosionRadius);
    
    blackHole.body.moves = false; 
    blackHole.body.immovable = true;
    
    // Increased DoT damage while they are stuck in it
    blackHole.damage = baseDamage * 0.05; 

    blackHole.onHit = (enemy) => {
      enemy.isSlowed = true;
      enemy.slowRecoverTime = this.scene.time.now + 200; // Increased slow duration
      this.scene.time.delayedCall(10, () => {
        if (enemy && enemy.active) enemy.setTint(0x9333ea); 
      });
    };

    // Fade and shrink out nicely
    this.scene.tweens.add({
      targets: blastVisual,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 6000, 
      ease: 'Cubic.in', 
      onComplete: () => {
        blastVisual.destroy();
        if (blackHole.active) blackHole.destroy();
      }
    });

    this.scene.time.delayedCall(6000, () => {
      if (blackHole.active) blackHole.destroy();
    });
  }
}