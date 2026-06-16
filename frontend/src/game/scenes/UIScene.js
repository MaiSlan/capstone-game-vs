import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true }); // Make sure it stays active!
    this.isPaused = false;
  }

  create() {
    // 1. The Input Listener for Pausing
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.togglePause());

    // Listen for React telling us to unpause
    window.addEventListener('VS_RESUME_GAME', () => {
      if (this.isPaused) this.togglePause();
    });

    // 2. Initial HUD Data Broadcast
    this.time.delayedCall(100, () => {
      const mainScene = this.scene.get('MainScene');
      if (mainScene && mainScene.player) {
        this.updateHP(mainScene.player.hp, mainScene.player.maxHp);
        this.updateXP(mainScene.player.xp, mainScene.player.nextLevelXp, mainScene.player.level);
        this.updateInventory(mainScene.player.weapons, mainScene.player.items);
      }
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      // --- THE FIX: We must explicitly pause the MainScene so physics stop! ---
      this.scene.pause('MainScene'); 
      
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
          // --- NEW: Pass the inventory to React for the Submenu ---
          weapons: p.weapons || [],
          items: p.items || []
        };
      }
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: true, stats } }));
    } else {
      // Unpause the MainScene
      this.scene.resume('MainScene'); 
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: false, stats: null } }));
    }
  }

  updateHP(current, max) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: current, maxHp: max } }));
  }

  updateXP(current, max, level) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_XP', { detail: { xp: current, maxXp: max } }));
    window.dispatchEvent(new CustomEvent('VS_UPDATE_LEVEL', { detail: { level } }));
  }

  updateInventory(weaponsArray, itemsArray = []) {
    window.dispatchEvent(new CustomEvent('VS_UPDATE_INVENTORY', { 
      detail: { weapons: weaponsArray, items: itemsArray } 
    }));
  }

  handleResize(gameSize) { } // Keep empty to prevent crash
}