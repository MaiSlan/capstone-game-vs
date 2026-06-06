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

    // 2. Health Bar (Top left, below XP bar)
    this.add.text(20, 25, 'HP', { font: '16px monospace', fill: '#ef4444' });
    
    this.hpBarBg = this.add.graphics();
    this.hpBarBg.fillStyle(0x18181b, 1);
    this.hpBarBg.fillRect(50, 25, 200, 16);

    this.hpBarFill = this.add.graphics();
    this.hpBarFill.fillStyle(0xef4444, 1); // Red fill
    this.hpBarFill.fillRect(50, 25, 200, 16); // 100% full for testing

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

    // Handle window resize to keep UI elements correctly positioned
    this.scale.on('resize', this.handleResize, this);

    // 5. Global Timer (Top Center)
    this.timerText = this.add.text(this.scale.width / 2, 25, '00:00', {
      font: 'bold 24px monospace',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
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
    // Redraw the bar based on the percentage (200 is the max width)
    this.hpBarFill.fillRect(50, 25, 200 * percentage, 16);
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