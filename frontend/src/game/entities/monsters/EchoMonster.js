import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class EchoMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 200, // Triggers dash when relatively close
      attackSpeedCooldown: 4000, // Dashes every 4 seconds
      hasAnimations: false,
      ...waveConfig
    });

    this.body.setSize(40, 40);
    this.setTint(0x111827); // Extremely dark slate/black
    this.setScale(1.5); // Boss sized
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); // Stop moving to charge up

    // 1. Telegraph: Pulse red rapidly
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 150,
      yoyo: true,
      repeat: 3, // Pulses 4 times
      onUpdate: (tween) => {
        const value = tween.getValue();
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(17, 24, 39), // Dark Base
          new Phaser.Display.Color(220, 38, 38), // Red
          1, value
        );
        const colorObj = Phaser.Display.Color.ObjectToColor(color);
        this.setTint(colorObj.color);
      },
      onComplete: () => {
        if (!this.active || this.isDying) return;
        this.setTint(0x111827);
        this.shadowDash(); // Execute the lunge
      }
    });
  }

  shadowDash() {
    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    // Lock onto the player's exact position at the moment the dash starts
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);
    const dashSpeed = 650; // Extremely fast
    
    this.scene.physics.velocityFromRotation(angle, dashSpeed, this.body.velocity);

    // Stop the dash abruptly after 400 milliseconds
    this.scene.time.delayedCall(400, () => {
      if (this.active && !this.isDying) {
        this.setVelocity(0);
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
      }
    });
  }
}