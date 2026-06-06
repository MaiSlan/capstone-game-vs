import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.isPaused = false;
  }

  create() {
    // 1. Minimalist XP Bar (Top edge, full width, thin)
    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x18181b, 1); // Zinc-900 background
    this.xpBarBg.fillRect(0, 0, this.scale.width, 10);

    this.xpBarFill = this.add.graphics();
    this.xpBarFill.fillStyle(0x3b82f6, 1); // Blue fill
    this.xpBarFill.fillRect(0, 0, this.scale.width * 0.1, 10); // 10% full for testing

    // 2. Health Bar
    this.add.text(20, 25, 'HP', { font: '16px monospace', fill: '#ef4444' });
    this.hpBarBg = this.add.graphics(); this.hpBarBg.fillStyle(0x18181b, 1); this.hpBarBg.fillRect(50, 25, 200, 16);
    this.hpBarFill = this.add.graphics(); this.hpBarFill.fillStyle(0xef4444, 1); this.hpBarFill.fillRect(50, 25, 200, 16);
    this.hpText = this.add.text(150, 33, '100 / 100', { font: 'bold 12px sans-serif', fill: '#ffffff' }).setOrigin(0.5);
    
    // --- NEW: Level Indicator ---
    // Top right, below the XP bar
    this.levelText = this.add.text(this.scale.width - 20, 25, 'LVL: 1', {
      font: 'bold 18px monospace',
      fill: '#3b82f6', // Blue to match XP
    }).setOrigin(1, 0);

    // --- NEW: Inventory Slots ---
    this.inventoryContainer = this.add.container(50, 48); // Positioned right under the HP bar
    this.weaponBoxes = [];
    this.itemBoxes = [];
    
    for (let i = 0; i < 5; i++) {
      // 1. Weapon Boxes (Top Row)
      const wBox = this.add.graphics(); wBox.lineStyle(2, 0x3f3f46, 1); wBox.strokeRect(i * 32, 0, 28, 28);
      const wInit = this.add.text(i * 32 + 14, 14, '', { font: 'bold 14px sans-serif', fill: '#a855f7' }).setOrigin(0.5);
      const wLvl = this.add.text(i * 32 + 26, 26, '', { font: '10px sans-serif', fill: '#ffffff' }).setOrigin(1, 1);
      this.inventoryContainer.add([wBox, wInit, wLvl]);
      this.weaponBoxes.push({ initial: wInit, level: wLvl });

      // 2. Item Boxes (Bottom Row - Shifted down by 32px)
      const iBox = this.add.graphics(); iBox.lineStyle(2, 0x3f3f46, 1); iBox.strokeRect(i * 32, 32, 28, 28);
      // Give items a different color (emerald/green) so they stand out from weapons
      const iInit = this.add.text(i * 32 + 14, 46, '', { font: 'bold 14px sans-serif', fill: '#10b981' }).setOrigin(0.5);
      const iLvl = this.add.text(i * 32 + 26, 58, '', { font: '10px sans-serif', fill: '#ffffff' }).setOrigin(1, 1);
      this.inventoryContainer.add([iBox, iInit, iLvl]);
      this.itemBoxes.push({ initial: iInit, level: iLvl });
    }
    
    // 3. Pause Menu Overlay (Hidden by default)
    this.pauseContainer = this.add.container(0, 0);
    this.pauseContainer.setVisible(false);

    // Dark semi-transparent background covering the whole screen
    const dimBg = this.add.graphics();
    dimBg.fillStyle(0x000000, 0.7);
    dimBg.fillRect(0, 0, this.scale.width, this.scale.height);
    this.pauseContainer.add(dimBg);

    // Pause Text
    const pauseText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'PAUSED', {
      font: 'bold 48px sans-serif',
      fill: '#a855f7', // Purple-500
      letterSpacing: 10
    }).setOrigin(0.5);
    this.pauseContainer.add(pauseText);

    // Instruction Text
    const subText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Press ESC to Resume', {
      font: '16px sans-serif',
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.pauseContainer.add(subText);

    // 4. Input Handling for the ESC key
    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });

    // 5. Global Timer (Top Center)
    this.timerText = this.add.text(this.scale.width / 2, 25, '00:00', {
      font: 'bold 24px monospace',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Handle window resize to keep UI elements correctly positioned
    this.scale.on('resize', this.handleResize, this);
    const mainScene = this.scene.get('MainScene');
    
    // We use a delayed call of 10 milliseconds to ensure MainScene has fully 
    // finished mounting the player before we try to read their stats.
    this.time.delayedCall(10, () => {
      if (mainScene && mainScene.player) {
        this.updateHP(mainScene.player.hp, mainScene.player.maxHp);
        this.updateLevelText(mainScene.player.level);
        this.updateInventory(mainScene.player.weapons);
      }
    });
  }

  updateLevelText(level) {
    if (this.levelText) {
      this.levelText.setText(`LVL: ${level}`);
    }
  }

  updateInventory(weaponsArray, itemsArray = []) {
    if (!this.weaponBoxes || !this.itemBoxes) return; 

    for (let i = 0; i < 5; i++) {
      // Weapons
      if (i < weaponsArray.length) {
        this.weaponBoxes[i].initial.setText(weaponsArray[i].id.charAt(0).toUpperCase());
        this.weaponBoxes[i].level.setText(weaponsArray[i].level);
      } else {
        this.weaponBoxes[i].initial.setText('');
        this.weaponBoxes[i].level.setText('');
      }

      // Items
      if (i < itemsArray.length) {
        this.itemBoxes[i].initial.setText(itemsArray[i].id.charAt(0).toUpperCase());
        this.itemBoxes[i].level.setText(itemsArray[i].level);
      } else {
        this.itemBoxes[i].initial.setText('');
        this.itemBoxes[i].level.setText('');
      }
    }
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    
    // Grab the active MainScene
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      mainScene.scene.pause(); // Freezes physics, updates, and animations in MainScene
      this.pauseContainer.setVisible(true);
    } else {
      mainScene.scene.resume(); // Unfreezes the game
      this.pauseContainer.setVisible(false);
    }
  }

  updateHP(current, max) {
    if (!this.hpBarFill) return;
    const percentage = Math.max(0, current / max);
    
    this.hpBarFill.clear();
    this.hpBarFill.fillStyle(0xef4444, 1); 
    this.hpBarFill.fillRect(50, 25, 200 * percentage, 16);

    // --- NEW: Update the text string ---
    if (this.hpText) {
      this.hpText.setText(`${Math.floor(current)} / ${max}`);
    }
  }

  updateXP(current, max, level) {
    if (!this.xpBarFill) return;
    const percentage = Math.min(1, current / max);
    
    this.xpBarFill.clear();
    this.xpBarFill.fillStyle(0x3b82f6, 1); 
    this.xpBarFill.fillRect(0, 0, this.scale.width * percentage, 10);
    
    // Optional: You can add a text element in create() to show the Level, and update it here
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;
    
    // Redraw XP Bar background to match new width
    this.xpBarBg.clear();
    this.xpBarBg.fillStyle(0x18181b, 1);
    this.xpBarBg.fillRect(0, 0, width, 10);
    
    // Center the pause text dynamically
    if (this.pauseContainer.list[1]) {
      this.pauseContainer.list[1].setPosition(width / 2, height / 2);
      this.pauseContainer.list[2].setPosition(width / 2, height / 2 + 50);
    }
    
    // Redraw the dim background
    const dimBg = this.pauseContainer.list[0];
    dimBg.clear();
    dimBg.fillStyle(0x000000, 0.7);
    dimBg.fillRect(0, 0, width, height);
  }

  updateTimer(totalSeconds) {
    if (!this.timerText) return;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    this.timerText.setText(`${minutes}:${seconds}`);
  }
}