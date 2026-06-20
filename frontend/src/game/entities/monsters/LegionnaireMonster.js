import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class LegionnaireMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    // We pass 'placeholder_square' and hasAnimations: false
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 60, // Slightly longer reach than a Slime
      attackSpeedCooldown: 1500, // Slow to recover after a swing
      hasAnimations: false,
      ...waveConfig
    });

    // Match the placeholder visual settings
    this.body.setSize(40, 40);
    this.baseColor = 0x9ca3af; // Gray block to represent bone/armor
    this.setTint(this.baseColor);
    this.setScale(1.2); // Slightly larger than standard fodder
  }

  // --- THE CUSTOM WIND-UP AI ---
  triggerAttack(time) {
    if (time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); // Stop walking immediately
    
    // 1. Telegraph Phase: Flash white and "inhale" (scale up)
    this.setTint(0xffffff);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 800,
      yoyo: true, // Shrink back down to simulate a forward strike
      ease: 'Sine.easeInOut'
    });

    // 2. Execution Phase: Wait 1 second, then strike
    this.scene.time.delayedCall(1000, () => {
      // Safety check in case it died during its own wind-up
      if (!this.active || this.isDying || this.deadTriggered) return;

      // Restore base color
      this.setTint(this.baseColor);

      const targetPlayer = this.scene.player;
      if (targetPlayer && targetPlayer.active) {
        // Calculate the distance again to see if the player dodged!
        const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);
        
        // Give a generous hitbox for the heavy swing (attackDistance + 20)
        if (distance <= this.attackDistance + 20) {
          targetPlayer.takeDamage(this.damage, this.scene);
          
          // Update the React UI
          window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { 
            detail: { hp: targetPlayer.hp, maxHp: targetPlayer.maxHp } 
          }));
          
          // Trigger Game Over if the massive swing killed them
          if (targetPlayer.hp <= 0 && !this.scene.isDead) {
            this.scene.isDead = true;
            this.scene.physics.pause();
            targetPlayer.setTint(0xff0000);
            window.dispatchEvent(new CustomEvent('VS_GAME_OVER', { detail: { level: targetPlayer.level } }));
          }
        }
      }

      // Reset states regardless of a hit or miss
      this.isAttacking = false;
      this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
    });
  }
}