import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicOrb {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_orb;
    this.lastFired = 0;
    this.activeOrbs = []; 
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    
    // --- THE FIX: Dynamic Speed Scaling ---
    // Starts at a very slow 120 speed, and gains 75 speed per level (Max 420)
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
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;

      const orb = this.scene.playerProjectiles.create(player.x, player.y, 'magic_orb');
      orb.setScale(0.7);
      orb.damage = currentDamage;
      
      this.scene.physics.velocityFromRotation(player.currentAimAngle, currentSpeed, orb.body.velocity);

      this.scene.time.delayedCall(5000, () => {
        if (orb && orb.active) orb.destroy();
      });

      orb.onHit = (enemy) => {
        if (weaponLevel >= 5) {
          this.triggerVoidImplosion(orb.x, orb.y, currentDamage);
        }
        orb.destroy(); 
      };

      this.activeOrbs.push(orb);
      this.lastFired = time + currentCooldown;
    }
  }

  triggerVoidImplosion(x, y, baseDamage) {
    const implosionRadius = 100;

    const blastVisual = this.scene.add.graphics();
    blastVisual.fillStyle(0x050202, 1); 
    blastVisual.fillCircle(x, y, implosionRadius);
    blastVisual.lineStyle(3, 0x9333ea, 0.8); 
    blastVisual.strokeCircle(x, y, implosionRadius);

    const blackHole = this.scene.playerProjectiles.create(x, y).setVisible(false);
    blackHole.body.setCircle(implosionRadius);
    blackHole.body.setOffset(-implosionRadius, -implosionRadius);
    
    blackHole.damage = baseDamage * 0.02; 

    blackHole.onHit = (enemy) => {
      enemy.isSlowed = true;
      enemy.slowRecoverTime = this.scene.time.now + 100;
      this.scene.time.delayedCall(10, () => {
        if (enemy && enemy.active) enemy.setTint(0x9333ea); 
      });
    };

    this.scene.tweens.add({
      targets: blastVisual,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 3000,
      ease: 'Cubic.in', 
      onComplete: () => {
        blastVisual.destroy();
        if (blackHole.active) blackHole.destroy();
      }
    });

    this.scene.time.delayedCall(3000, () => {
      if (blackHole.active) blackHole.destroy();
    });
  }
}