import Phaser from 'phaser';
import BaseMonster from './BaseMonster';

export default class EclipseLordBase extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      hasAnimations: false,
      ...waveConfig
    });
    this.isEclipseLord = true;
  }

  // Absolute immunity to crowd control
  set isKnockedBack(value) {} get isKnockedBack() { return false; }
  set isSlowed(value) {} get isSlowed() { return false; }

  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    
    this.setVelocity(0);
    this.body.enable = false;

    this.scene.cameras.main.flash(1000, 255, 255, 255); // Massive white flash

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 3000,
      ease: 'Sine.in',
      onComplete: () => {
        // TRIGGER THE VICTORY SCREEN
        window.dispatchEvent(new CustomEvent('VS_GAME_WON', { 
          detail: { timeSurvived: this.scene.surviveSeconds } 
        }));
        this.destroy();
      }
    });
  }
}