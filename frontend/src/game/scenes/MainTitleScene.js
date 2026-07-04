import Phaser from 'phaser';

export default class MainTitleScene extends Phaser.Scene {
  constructor() {
    super('MainTitleScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#030101');

    // --- AUDIO ---
    if (!this.sound.get('bgm_MENU')) {
      this.menuBgm = this.sound.add('bgm_MENU', { volume: 0.3, loop: true });
      this.menuBgm.play();
    }

    // --- ATMOSPHERE (Embers) ---
    if (!this.textures.exists('ember')) {
      const emberTexture = this.add.graphics();
      emberTexture.fillStyle(0xdc2626, 1);
      emberTexture.fillCircle(4, 4, 4);
      emberTexture.generateTexture('ember', 8, 8);
      emberTexture.destroy();
    }

    this.add.particles(0, 0, 'ember', {
      x: { min: 0, max: this.cameras.main.width },
      y: { min: this.cameras.main.height, max: this.cameras.main.height + 100 },
      lifespan: { min: 3000, max: 6000 },
      speedY: { min: -10, max: -30 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: 'ADD'
    });

    // --- RESIZE HANDLER ---
    this.scale.on('resize', (gameSize) => {
      const { width, height } = gameSize;
      this.cameras.main.setSize(width, height);
    });

    // --- TRANSITION LOGIC ---
    const startNextScene = () => {
      this.input.off('pointerdown', startNextScene);
      this.input.keyboard.off('keydown', startNextScene);
      window.removeEventListener('VS_ENTER_MENU', startNextScene);
      
      // Tell React to update UI (if triggered via Phaser directly)
      window.dispatchEvent(new CustomEvent('VS_ENTER_MENU')); 
      
      this.scene.start('CharacterSelectScene');
    };

    // Fallback: If player clicks where UI doesn't intercept
    this.input.on('pointerdown', startNextScene);
    this.input.keyboard.on('keydown', startNextScene);

    // Listen for React UI dispatching the menu event
    window.addEventListener('VS_ENTER_MENU', startNextScene);

    // Cleanup to prevent memory leaks if the scene restarts
    this.events.on('shutdown', () => {
      window.removeEventListener('VS_ENTER_MENU', startNextScene);
    });
  }
}