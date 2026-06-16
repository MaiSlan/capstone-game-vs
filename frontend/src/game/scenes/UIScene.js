import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    // Setting active: true ensures this scene boots up alongside MainScene
    super({ key: 'UIScene', active: true }); 
    this.isPaused = false;
  }

  create() {
    // 1. The Input Listener for Pausing
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.togglePause());

    // Listen for React telling us to unpause (e.g., clicking 'Resume')
    window.addEventListener('VS_RESUME_GAME', () => {
      if (this.isPaused) this.togglePause();
    });

    // 2. Initial HUD Data Broadcast
    // We delay slightly to ensure MainScene and Player are fully spawned
    this.time.delayedCall(100, () => {
      const mainScene = this.scene.get('MainScene');
      if (mainScene && mainScene.player) {
        this.updateHP(mainScene.player.hp, mainScene.player.maxHp);
        this.updateXP(mainScene.player.xp, mainScene.player.nextLevelXp, mainScene.player.level);
        this.updateInventory(mainScene.player.weapons, mainScene.player.items);
      }
    });
  }

  // ==========================================
  // REACT BROADCASTER METHODS
  // These catch calls from Player.js / MainScene.js and forward them to PlayArea.jsx
  // ==========================================

  updateLevelText(level) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_LEVEL', { detail: { level } }));
  }

  updateHP(current, max) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: current, maxHp: max } }));
  }

  updateXP(current, max, level) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_XP', { detail: { xp: current, maxXp: max } }));
    // Automatically update the level indicator when XP changes
    this.updateLevelText(level);
  }

  updateInventory(weaponsArray, itemsArray = []) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_INVENTORY', { 
      detail: { weapons: weaponsArray, items: itemsArray } 
    }));
  }

  // ==========================================
  // PAUSE LOGIC
  // ==========================================

  togglePause() {
    this.isPaused = !this.isPaused;
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      // Physically freeze the physics and update loops in MainScene
      this.scene.pause('MainScene'); 
      
      // Package up all the stats to display in the React Pause Menu
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
          greed: (p.pickupMult * 100).toFixed(0),
          weapons: p.weapons || [],
          items: p.items || []
        };
      }
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: true, stats } }));
    } else {
      // Unfreeze the game
      this.scene.resume('MainScene'); 
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: false, stats: null } }));
    }
  }

  // A safety method: keeps the engine from crashing if the browser window is resized
  handleResize(gameSize) { } 
}