import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class SentinelMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 1000, // Can "see" and shoot the player from anywhere
      attackSpeedCooldown: 3000, // Fires once every 3 seconds
      hasAnimations: false,
      ...waveConfig
    });

    this.body.setSize(30, 30);
    this.setTint(0xeab308); // Gold/Yellow block to represent the Eye
    this.setScale(1.2);
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); // Plant feet to shoot
    
    const targetPlayer = this.scene.player;
    if (targetPlayer && targetPlayer.active) {
      
      // 1. Telegraph Phase: Flash bright white
      this.setTint(0xffffff);
      
      // 2. Fire Phase: 300ms later
      this.scene.time.delayedCall(300, () => {
        if (!this.active || this.isDying) return;
        this.setTint(0xeab308); // Return to yellow

        this.fireBullet(targetPlayer);
        
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
      });
      
    } else {
      this.isAttacking = false;
    }
  }

  fireBullet(targetPlayer) {
    // Spawn the magic bullet (using the texture generated in MainScene)
    const bullet = this.scene.physics.add.sprite(this.x, this.y, 'magic_bullet');
    
    // Add it to the enemies group so MainScene knows it hurts the player!
    this.scene.enemies.add(bullet); 
    
    // Pass the Sentinel's damage down to the bullet
    bullet.damage = this.damage;
    bullet.isDying = false; 
    
    // Calculate aim angle
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);
    
    // Fire at 250 speed (faster than the player, requires dodging)
    this.scene.physics.velocityFromRotation(angle, 250, bullet.body.velocity);
    
    // The Gore-Thrall Trick: When MainScene triggers an overlap, it calls enemy.attack()
    // We override attack() here so the bullet destroys itself on impact!
    bullet.attack = () => {
      bullet.destroy();
    };

    // Destroy the bullet after 5 seconds if it misses, to prevent memory leaks
    this.scene.time.delayedCall(5000, () => {
      if (bullet && bullet.active) bullet.destroy();
    });
  }
}