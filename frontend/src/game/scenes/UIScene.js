import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.isPaused = false;
  }

  create() {
    // Escape Key logic for pausing
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.togglePause());

    window.addEventListener('VS_RESUME_GAME', () => {
      if (this.isPaused) this.togglePause();
    });

    // Initial HUD trigger
    this.time.delayedCall(10, () => {
      const mainScene = this.scene.get('MainScene');
      if (mainScene && mainScene.player) {
        this.updateHP(mainScene.player.hp, mainScene.player.maxHp);
        this.updateLevelText(mainScene.player.level);
        this.updateInventory(mainScene.player.weapons, mainScene.player.items);
      }
    });
  }

  updateLevelText(level) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_LEVEL', { detail: { level } }));
  }

  updateInventory(weaponsArray, itemsArray = []) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_INVENTORY', { 
      detail: { weapons: weaponsArray, items: itemsArray } 
    }));
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      mainScene.scene.pause(); 
      const p = mainScene.player;
      let stats = null;
      if (p) {
        stats = {
          hp: Math.floor(p.hp),
          maxHp: p.maxHp,
          speed: Math.floor(p.currentSpeed),
          damageMult: (p.damageMult * 100).toFixed(0),
          haste: ((1 / p.cooldownMult) * 100).toFixed(0), 
          armor: p.armor || 0,
          lifesteal: p.lifesteal || 0,
          greed: (p.pickupMult * 100).toFixed(0)
        };
      }
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: true, stats } }));
    } else {
      mainScene.scene.resume(); 
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: false, stats: null } }));
    }
  }

  updateHP(current, max) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: current, maxHp: max } }));
  }

  updateXP(current, max, level) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_XP', { detail: { xp: current, maxXp: max } }));
    this.updateLevelText(level); // Keep level in sync with XP
  }

  // We leave an empty handleResize so the engine doesn't crash if it tries to call it
  handleResize(gameSize) {}
}