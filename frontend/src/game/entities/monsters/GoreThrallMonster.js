import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';

export default class GoreThrallMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    // We pass 'placeholder_square' and hasAnimations: false 
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      attackDistance: 45, // Explodes when it gets within 45 pixels of the player
      hasAnimations: false,
      ...waveConfig
    });

    // Match the placeholder visual settings
    this.body.setSize(40, 40);
    this.setTint(0xdc2626); // Red block
    this.setScale(0.8);
  }

  // --- TRIGGER 1: Player walks into it ---
  attack() {
    this.die();
  }

  // --- TRIGGER 2: It walks up to the player ---
  triggerAttack(time) {
    this.die(); 
  }

  // --- THE CUSTOM EXPLOSION FUSE ---
  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    
    // Stop moving and disable the hitbox so the player can run away
    this.setVelocity(0);
    this.body.enable = false; 

    // Visual Fuse: Flash rapidly between red and white
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 100,
      yoyo: true,
      repeat: 2, // Flashes 3 times over 0.5 seconds
      onUpdate: (tween) => {
        const value = tween.getValue();
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(220, 38, 38), // Red
          new Phaser.Display.Color(255, 255, 255), // White
          1, value
        );
        const colorObj = Phaser.Display.Color.ObjectToColor(color);
        this.setTint(colorObj.color);
      },
      onComplete: () => {
        this.explode();
        this.destroy(); // Remove the monster from the game
      }
    });
  }

  explode() {
    const explosionRadius = 100;

    // 1. Draw the Blast Visual
    const blastVisual = this.scene.add.graphics({ x: this.x, y: this.y });
    blastVisual.fillStyle(0xdc2626, 0.4); 
    blastVisual.fillCircle(0, 0, explosionRadius);
    blastVisual.lineStyle(3, 0xef4444, 0.8); 
    blastVisual.strokeCircle(0, 0, explosionRadius);

    // Fade the blast visual out quickly
    this.scene.tweens.add({
      targets: blastVisual,
      alpha: 0,
      duration: 300,
      onComplete: () => blastVisual.destroy()
    });

    // 2. Apply Damage to the Player
    const player = this.scene.player;
    if (player && player.active) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      
      // If the player didn't escape the radius in time
      if (distance <= explosionRadius) {
        player.takeDamage(this.damage, this.scene);
        
        // Update the React UI
        window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { 
          detail: { hp: player.hp, maxHp: player.maxHp } 
        }));
        
        // Trigger Game Over if the blast killed them
        if (player.hp <= 0 && !this.scene.isDead) {
          this.scene.isDead = true;
          this.scene.physics.pause();
          player.setTint(0xff0000);
          window.dispatchEvent(new CustomEvent('VS_GAME_OVER', { detail: { level: player.level } }));
        }
      }
    }
  }
}