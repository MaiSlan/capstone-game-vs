// src/game/scenes/CharacterSelectScene.js
import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#030101');

    if (!this.sound.get('bgm_MENU')) {
      this.menuBgm = this.sound.add('bgm_MENU', { volume: 0.3, loop: true });
      this.menuBgm.play();
    }

    const emberTexture = this.add.graphics();
    emberTexture.fillStyle(0xdc2626, 1);
    emberTexture.fillCircle(4, 4, 4);
    emberTexture.generateTexture('ember', 8, 8);
    emberTexture.destroy();

    this.add.particles(0, 0, 'ember', {
      x: { min: 0, max: width },
      y: { min: height, max: height + 100 },
      lifespan: { min: 3000, max: 6000 },
      speedY: { min: -10, max: -30 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: 'ADD'
    });

    this.charSprite = this.add.sprite(width / 2, height / 2, 'witch_menu', '0');
    this.charSprite.setScale(1.5); 

    // --- INTERACTIVE ROTATION LOGIC ---
    let currentFrame = 0;
    let isDragging = false;
    let lastX = 0;

    const hitArea = this.add.zone(width / 2, height / 2, width, height);
    hitArea.setInteractive();

    hitArea.on('pointerdown', (pointer) => {
      isDragging = true;
      lastX = pointer.x;
      document.body.style.cursor = 'grabbing';
    });

    hitArea.on('pointerup', () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    });
    
    hitArea.on('pointerout', () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    });

    hitArea.on('pointermove', (pointer) => {
      if (!isDragging) return; 

      const deltaX = pointer.x - lastX;
      if (Math.abs(deltaX) > 12) { 
        currentFrame += deltaX > 0 ? -1 : 1;
        
        if (currentFrame > 7) currentFrame = 0;
        if (currentFrame < 0) currentFrame = 7;
        
        this.charSprite.setFrame(currentFrame.toString());
        lastX = pointer.x;
      }
    });

    // --- REACT COMMUNICATION ---
    this.previewListener = (e) => {
      const activeCharId = e.detail.characterId;
      const isLocked = e.detail.isLocked;
      
      const textureKey = `${activeCharId}_menu`;

      // Set the texture for ALL characters uniformly
      this.charSprite.setTexture(textureKey);
      currentFrame = 0;
      this.charSprite.setFrame(currentFrame.toString());
      
      // Apply silhouette if locked
      if (isLocked) {
        this.charSprite.setTint(0x000000); 
        this.charSprite.setAlpha(0.7);     
      } else {
        this.charSprite.clearTint();       
        this.charSprite.setAlpha(0);
        this.tweens.add({ targets: this.charSprite, alpha: 1, duration: 400 });
      }
    };
    window.addEventListener('VS_PREVIEW_CHAR', this.previewListener);

    this.startListener = (e) => {
      if (this.menuBgm) this.menuBgm.stop();
      this.scene.start('MainScene', {
        character: e.detail.characterId,
        userUpgrades: e.detail.upgrades
      });
    };
    window.addEventListener('VS_START_RUN', this.startListener);

    this.events.on('destroy', () => {
      window.removeEventListener('VS_PREVIEW_CHAR', this.previewListener);
      window.removeEventListener('VS_START_RUN', this.startListener);
      document.body.style.cursor = 'default';
    });
  }
}