import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  init(data) {
    this.sceneData = data; 
  }

  preload() {
    // --- 1. SETUP VISUAL LOADING BAR CONTAINER ---
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Set background to Pure Abyss
    this.cameras.main.setBackgroundColor('#050202');

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    
    // Minimalist esoteric borders
    progressBox.lineStyle(1, 0x7f1d1d, 0.5); // red-900 border
    progressBox.strokeRect(width / 2 - 160, height / 2 - 2, 320, 4);

    // --- 2. ADD LOADING TEXT ---
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'MANIFESTING VESSEL...',
      style: {
        font: '14px serif', // Mimics the Royal font
        fill: '#71717a',    // zinc-500
        letterSpacing: '4px'
      }
    }).setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 30,
      text: '✦ 0% ✦',
      style: {
        font: '12px serif',
        fill: '#991b1b' // red-800
      }
    }).setOrigin(0.5, 0.5);

    // --- 3. PHASER LOADING EVENTS ---
    this.load.on('progress', (value) => {
      percentText.setText(`✦ ${parseInt(value * 100)}% ✦`);
      progressBar.clear();
      progressBar.fillStyle(0x991b1b, 1); // blood red fill
      progressBar.fillRect(width / 2 - 160, height / 2 - 2, 320 * value, 4);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // --- 4. THE MASTER ENGINE PRELOAD LIST ---
    // Characters
    // --- WITCH CHARACTER ---
    this.load.image('witch_sprite', 'assets/characters/witch.png');
    const witchConfig = { frameWidth: 256, frameHeight: 256 };
    this.load.spritesheet('witch_walk', 'assets/characters/witch/walk/witch_walk.png', witchConfig);

    // --- VIKING CHARACTER ---
    this.load.image('viking_sprite', 'assets/characters/viking.png');
    const vikingConfig = { frameWidth: 256, frameHeight: 256 };
    this.load.spritesheet('viking_walk', 'assets/characters/viking/walk/viking_walk.png', vikingConfig);

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
    this.load.image('border_top', 'assets/maps/TopBorder.png');

    // --- AUDIO ---
    this.load.audio('bgm_skyrim', 'assets/sounds/bgm/skyrim.ogg');
    this.load.image('border_bottom', 'assets/maps/BottomBorder.png');

    // --- HUD ICONS ---   
    // Weapons
    this.load.image('cleave_axe', 'assets/weapons/axe.png');
    this.load.image('magic_orb', 'assets/weapons/magic_orb.png');
    this.load.image('lance', 'assets/weapons/spear.png');
    this.load.image('magic_book', 'assets/weapons/spellbook.png');

    // Items
    this.load.image('speed_boots', 'assets/items/equipable/boots.png');
    this.load.image('vitality_ring', 'assets/items/equipable/ring.png');
    this.load.image('thief_gloves', 'assets/items/equipable/gloves.png');
    this.load.image('sacrificial_dagger', 'assets/items/equipable/dagger.png');
    this.load.image('broken_arrow', 'assets/items/equipable/broken_arrow.png');
    this.load.image('voodoo_doll', 'assets/items/equipable/voodoo.png');
    this.load.image('haste_necklace', 'assets/items/equipable/necklace.png');
    this.load.image('mysterious_letter', 'assets/items/equipable/letter.png');
    this.load.image('cursed_skull', 'assets/items/equipable/skull.png');
    this.load.image('coin_purse', 'assets/items/equipable/coin_purse.png');

  }

  create() {
    this.scene.start('MainScene', this.sceneData);
  }
}