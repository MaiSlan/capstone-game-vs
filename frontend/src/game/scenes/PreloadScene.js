import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  init(data) {
    // Catch the data from React
    this.sceneData = data; 
  }

  preload() {
    // --- 1. SETUP VISUAL LOADING BAR CONTAINER ---
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create graphics objects for the progress bar outlines
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    
    // Draw a dark background container for the loading bar
    progressBox.fillStyle(0x1e1e24, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // --- 2. ADD LOADING TEXT ---
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading Assets...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '14px monospace',
        fill: '#a855f7' // Purple accent color
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // --- 3. PHASER LOADING EVENTS ---
    // 'progress' returns a value between 0 and 1
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // Displays the current file name being loaded
    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading: ' + file.key);
    });

    // Cleans up the loading visuals when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    // --- 4. THE MASTER ENGINE PRELOAD LIST ---
    // Characters
    this.load.image('witch_sprite', 'assets/characters/witch.png');
    this.load.image('viking_sprite', 'assets/characters/viking.png');
    
    // Items & Consumables
    this.load.image('red_potion', 'assets/items/potion.png'); 

    // --- SLIME MONSTER ---
    const slimeConfig = { frameWidth: 64, frameHeight: 64 };
    this.load.spritesheet('slime_walk', 'assets/monsters/slime/Slime2_Walk_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_idle', 'assets/monsters/slime/Slime2_Idle_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_attack', 'assets/monsters/slime/Slime2_Attack_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_death', 'assets/monsters/slime/Slime2_Death_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_hurt', 'assets/monsters/slime/Slime2_Hurt_with_shadow.png', slimeConfig);

    // --- VAMPIRE MONSTER ---
    const vampireConfig = { frameWidth: 64, frameHeight: 64 }; 
    this.load.spritesheet('vampire_walk', 'assets/monsters/vampire/Vampires3_Walk_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_attack', 'assets/monsters/vampire/Vampires3_Attack_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_hurt', 'assets/monsters/vampire/Vampires3_Hurt_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_death', 'assets/monsters/vampire/Vampires3_Death_with_shadow.png', vampireConfig);

    // --- MAP ASSETS ---
    this.load.image('ground_rocks_img', 'assets/maps/tiles.png');
  }

  create() {
    this.scene.start('MainScene', this.sceneData);
  }
}