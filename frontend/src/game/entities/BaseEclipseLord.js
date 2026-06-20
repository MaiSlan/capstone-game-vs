import Phaser from 'phaser';
import BaseMonster from './BaseMonster';

export default class EclipseLordBase extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    super(scene, x, y, 'placeholder_square', 'none', dbStats, multiplier, {
      hasAnimations: false,
      ...waveConfig
    });
    this.isEclipseLord = true;
    
    // --- CENTRALIZED BOSS LOGIC ---
    this.isBoss = true;
    this.maxHp = this.hp; 
  }

  // Child classes will call this once they are ready
  initializeBossUI(bossName) {
    window.dispatchEvent(new CustomEvent('VS_SHOW_BOSS_BAR', { 
      detail: { name: bossName, hp: this.hp, maxHp: this.maxHp } 
    }));
  }

  // Absolute immunity to crowd control
  set isKnockedBack(value) {} get isKnockedBack() { return false; }
  set isSlowed(value) {} get isSlowed() { return false; }

  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    
    this.setVelocity(0);
    if (this.body) this.body.enable = false;

    this.scene.cameras.main.flash(1000, 255, 255, 255); // Massive white flash

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 3000,
      ease: 'Sine.in',
      onComplete: () => {
        // --- CENTRALIZED UI HIDING & VICTORY ---
        window.dispatchEvent(new CustomEvent('VS_HIDE_BOSS_BAR'));
        
        window.dispatchEvent(new CustomEvent('VS_GAME_WON', { 
          detail: { timeSurvived: this.scene.surviveSeconds } 
        }));
        
        this.destroy();
      }
    });
  }
}