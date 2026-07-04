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

    this.scene.cameras.main.flash(1000, 255, 255, 255);

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 3000,
      ease: 'Sine.in',
      onComplete: () => {
        window.dispatchEvent(new CustomEvent('VS_HIDE_BOSS_BAR'));
        
        // --- 1. GATHER THE FULL PAYLOAD FOR THE BACKEND ---
        const player = this.scene.player;
        const totalEnemiesDefeated = this.scene.waveManager ? (this.scene.waveManager.totalKills || 0) : 0;
        const bestiaryMetrics = this.scene.waveManager ? (this.scene.waveManager.bestiaryLog || []) : [];

        // --- 2. DISPATCH COMPLETE VICTORY DATA ---
        window.dispatchEvent(new CustomEvent('VS_GAME_WON', { 
          detail: { 
            character_used: this.scene.selectedCharacter,
            level_reached: player ? player.level : 1, 
            survival_time_seconds: this.scene.surviveSeconds,
            gold_earned: player ? player.coins : 0,
            enemies_defeated: totalEnemiesDefeated,
            is_cleared: true, // This triggers a WIN in the database!
            bestiary_data: bestiaryMetrics
          } 
        }));
        
        this.destroy();
      }
    });
  }
}