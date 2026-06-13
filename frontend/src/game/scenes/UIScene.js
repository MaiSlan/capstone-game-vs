import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.isPaused = false;
  }

  create() {
    // 1. Minimalist XP Bar
    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x18181b, 1); 
    this.xpBarBg.fillRect(0, 0, this.scale.width, 10);

    this.xpBarFill = this.add.graphics();
    this.xpBarFill.fillStyle(0x3b82f6, 1); 
    this.xpBarFill.fillRect(0, 0, this.scale.width * 0.1, 10); 

    // 2. Health Bar
    this.add.text(20, 25, 'HP', { font: '16px monospace', fill: '#ef4444' });
    this.hpBarBg = this.add.graphics(); this.hpBarBg.fillStyle(0x18181b, 1); this.hpBarBg.fillRect(50, 25, 200, 16);
    this.hpBarFill = this.add.graphics(); this.hpBarFill.fillStyle(0xef4444, 1); this.hpBarFill.fillRect(50, 25, 200, 16);
    this.hpText = this.add.text(150, 33, '100 / 100', { font: 'bold 12px sans-serif', fill: '#ffffff' }).setOrigin(0.5);
    
    // 3. Level Indicator
    this.levelText = this.add.text(this.scale.width - 20, 25, 'LVL: 1', {
      font: 'bold 18px monospace',
      fill: '#3b82f6', 
    }).setOrigin(1, 0);

    // 4. Inventory Slots
    this.inventoryContainer = this.add.container(50, 48); 
    this.weaponBoxes = [];
    this.itemBoxes = [];
    
    for (let i = 0; i < 5; i++) {
      const wBox = this.add.graphics(); wBox.lineStyle(2, 0x3f3f46, 1); wBox.strokeRect(i * 32, 0, 28, 28);
      const wInit = this.add.text(i * 32 + 14, 14, '', { font: 'bold 14px sans-serif', fill: '#a855f7' }).setOrigin(0.5);
      const wLvl = this.add.text(i * 32 + 26, 26, '', { font: '10px sans-serif', fill: '#ffffff' }).setOrigin(1, 1);
      this.inventoryContainer.add([wBox, wInit, wLvl]);
      this.weaponBoxes.push({ initial: wInit, level: wLvl });

      const iBox = this.add.graphics(); iBox.lineStyle(2, 0x3f3f46, 1); iBox.strokeRect(i * 32, 32, 28, 28);
      const iInit = this.add.text(i * 32 + 14, 46, '', { font: 'bold 14px sans-serif', fill: '#10b981' }).setOrigin(0.5);
      const iLvl = this.add.text(i * 32 + 26, 58, '', { font: '10px sans-serif', fill: '#ffffff' }).setOrigin(1, 1);
      this.inventoryContainer.add([iBox, iInit, iLvl]);
      this.itemBoxes.push({ initial: iInit, level: iLvl });
    }
    
    // 5. Input Handling for the ESC key (STRICT BINDING)
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => {
      this.togglePause();
    });

    // Listen for the "Resume" button click from React
    window.addEventListener('VS_RESUME_GAME', () => {
      if (this.isPaused) this.togglePause();
    });

    // 6. Global Timer
    this.timerText = this.add.text(this.scale.width / 2, 25, '00:00', {
      font: 'bold 24px monospace',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);
    const mainScene = this.scene.get('MainScene');
    
    // Boot-up sync
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
      if (i < weaponsArray.length) {
        this.weaponBoxes[i].initial.setText(weaponsArray[i].id.charAt(0).toUpperCase());
        this.weaponBoxes[i].level.setText(weaponsArray[i].level);
      } else {
        this.weaponBoxes[i].initial.setText('');
        this.weaponBoxes[i].level.setText('');
      }

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
    const mainScene = this.scene.get('MainScene');

    if (this.isPaused) {
      mainScene.scene.pause(); 
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: true } }));
    } else {
      mainScene.scene.resume(); 
      window.dispatchEvent(new CustomEvent('VS_PAUSE_STATE', { detail: { isPaused: false } }));
    }
  }

  updateHP(current, max) {
    if (!this.hpBarFill) return;
    const percentage = Math.max(0, current / max);
    
    this.hpBarFill.clear();
    this.hpBarFill.fillStyle(0xef4444, 1); 
    this.hpBarFill.fillRect(50, 25, 200 * percentage, 16);

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
  }

  handleResize(gameSize) {
    const { width } = gameSize;
    this.xpBarBg.clear();
    this.xpBarBg.fillStyle(0x18181b, 1);
    this.xpBarBg.fillRect(0, 0, width, 10);
  }

  updateTimer(totalSeconds) {
    if (!this.timerText) return;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    this.timerText.setText(`${minutes}:${seconds}`);
  }
}