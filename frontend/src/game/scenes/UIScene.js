import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.isPaused = false;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Minimalist XP Bar (Ultra-thin line at the very top edge)
    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x18181b, 0.8); // zinc-900
    this.xpBarBg.fillRect(0, 0, width, 4);

    this.xpBarFill = this.add.graphics();
    this.xpBarFill.fillStyle(0x991b1b, 1); // red-800
    this.xpBarFill.fillRect(0, 0, 0, 4); 

    // 2. Health Bar (Elegant hollow box)
    this.add.text(20, 20, 'VITALITY', { font: '10px serif', fill: '#71717a', letterSpacing: '2px' });
    this.hpBarBg = this.add.graphics(); 
    this.hpBarBg.lineStyle(1, 0x3f3f46, 0.8); // zinc-700 outline
    this.hpBarBg.strokeRect(20, 36, 200, 8);
    
    this.hpBarFill = this.add.graphics(); 
    this.hpBarFill.fillStyle(0x991b1b, 1); // red-800 fill
    this.hpBarFill.fillRect(20, 36, 200, 8);
    
    this.hpText = this.add.text(230, 36, '100 / 100', { font: '10px serif', fill: '#d4d4d8' }).setOrigin(0, 0);
    
    // 3. Level Indicator
    this.levelText = this.add.text(width - 20, 20, 'LAYER 1', {
      font: '14px serif',
      fill: '#d4d4d8',
      letterSpacing: '2px'
    }).setOrigin(1, 0);

    // 4. Global Timer (Elegant center)
    this.timerText = this.add.text(width / 2, 25, '00:00', {
      font: '18px serif',
      fill: '#e4e4e7',
      letterSpacing: '2px'
    }).setOrigin(0.5);

    // 5. Inventory Slots (Moved to bottom left)
    this.inventoryContainer = this.add.container(20, height - 50); 
    this.weaponBoxes = [];
    this.itemBoxes = [];
    
    // Weapons (Top row)
    for (let i = 0; i < 5; i++) {
      const box = this.add.graphics(); box.lineStyle(1, 0x3f3f46, 0.8); box.strokeRect(i * 32, -32, 26, 26);
      
      // --- THE FIX: Create an invisible image placeholder instead of Text ---
      const icon = this.add.image(i * 32 + 13, -19, '').setOrigin(0.5).setVisible(false);
      const lvl = this.add.text(i * 32 + 24, -8, '', { font: '8px serif', fill: '#f59e0b' }).setOrigin(1, 1); 
      
      this.inventoryContainer.add([box, icon, lvl]);
      this.weaponBoxes.push({ icon: icon, level: lvl }); // Track 'icon' instead of 'initial'
    }

    // Items (Bottom row)
    for (let i = 0; i < 5; i++) {
      const box = this.add.graphics(); box.lineStyle(1, 0x3f3f46, 0.8); box.strokeRect(i * 32, 0, 26, 26);
      
      // --- THE FIX: Create an invisible image placeholder instead of Text ---
      const icon = this.add.image(i * 32 + 13, 13, '').setOrigin(0.5).setVisible(false);
      const lvl = this.add.text(i * 32 + 24, 24, '', { font: '8px serif', fill: '#f59e0b' }).setOrigin(1, 1);
      
      this.inventoryContainer.add([box, icon, lvl]);
      this.itemBoxes.push({ icon: icon, level: lvl });
    }
    
    // Input Handling
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => this.togglePause());

    window.addEventListener('VS_RESUME_GAME', () => {
      if (this.isPaused) this.togglePause();
    });

    this.scale.on('resize', this.handleResize, this);
    
    this.time.delayedCall(10, () => {
      const mainScene = this.scene.get('MainScene');
      if (mainScene && mainScene.player) {
        this.updateHP(mainScene.player.hp, mainScene.player.maxHp);
        this.updateLevelText(mainScene.player.level);
        this.updateInventory(mainScene.player.weapons);
      }
    });
  }

  updateLevelText(level) {
    if (this.levelText) this.levelText.setText(`LAYER ${level}`);
  }

  // Inside UIScene.js

  updateInventory(weaponsArray, itemsArray = []) {
    if (!this.weaponBoxes || !this.itemBoxes) return; 

    for (let i = 0; i < 5; i++) {
      
      // --- WEAPONS ---
      if (i < weaponsArray.length) {
        // Set the image texture to match the weapon's ID
        this.weaponBoxes[i].icon.setTexture(weaponsArray[i].id);
        this.weaponBoxes[i].icon.setDisplaySize(20, 20); // Shrinks the PNG to fit inside the 26x26 box
        this.weaponBoxes[i].icon.setVisible(true);
        this.weaponBoxes[i].level.setText(weaponsArray[i].level);
      } else {
        this.weaponBoxes[i].icon.setVisible(false);
        this.weaponBoxes[i].level.setText('');
      }

      // --- ITEMS ---
      if (i < itemsArray.length) {
        // Set the image texture to match the item's ID
        this.itemBoxes[i].icon.setTexture(itemsArray[i].id);
        this.itemBoxes[i].icon.setDisplaySize(20, 20);
        this.itemBoxes[i].icon.setVisible(true);
        this.itemBoxes[i].level.setText(itemsArray[i].level);
      } else {
        this.itemBoxes[i].icon.setVisible(false);
        this.itemBoxes[i].level.setText('');
      }
    }
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      mainScene.scene.pause(); 
      
      // --- NEW: Extract Player Stats to pass to React ---
      const p = mainScene.player;
      let stats = null;
      if (p) {
        stats = {
          hp: Math.floor(p.hp),
          maxHp: p.maxHp,
          speed: Math.floor(p.currentSpeed),
          damageMult: (p.damageMult * 100).toFixed(0),
          // If cooldown is 0.8, attack speed is 1.25 (125%)
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
    if (!this.hpBarFill) return;
    const percentage = Math.max(0, current / max);
    
    this.hpBarFill.clear();
    this.hpBarFill.fillStyle(0x991b1b, 1); 
    this.hpBarFill.fillRect(20, 36, 200 * percentage, 8);

    if (this.hpText) this.hpText.setText(`${Math.floor(current)} / ${max}`);
  }

  updateXP(current, max, level) {
    if (!this.xpBarFill) return;
    const percentage = Math.min(1, current / max);
    
    this.xpBarFill.clear();
    this.xpBarFill.fillStyle(0x991b1b, 1); 
    this.xpBarFill.fillRect(0, 0, this.scale.width * percentage, 4);
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;
    this.xpBarBg.clear();
    this.xpBarBg.fillStyle(0x18181b, 0.8);
    this.xpBarBg.fillRect(0, 0, width, 4);
    
    if (this.levelText) this.levelText.setPosition(width - 20, 20);
    if (this.timerText) this.timerText.setPosition(width / 2, 25);
    if (this.inventoryContainer) this.inventoryContainer.setPosition(20, height - 50);
  }

  updateTimer(totalSeconds) {
    if (!this.timerText) return;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    this.timerText.setText(`${minutes}:${seconds}`);
  }
}