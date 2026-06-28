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
    
    this.cameras.main.setBackgroundColor('#050202');

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    
    progressBox.lineStyle(1, 0x7f1d1d, 0.5); 
    progressBox.strokeRect(width / 2 - 160, height / 2 - 2, 320, 4);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'MANIFESTING VESSEL...',
      style: { font: '14px serif', fill: '#71717a', letterSpacing: '4px' }
    }).setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 30,
      text: '✦ 0% ✦',
      style: { font: '12px serif', fill: '#991b1b' }
    }).setOrigin(0.5, 0.5);

    // --- 2. PHASER LOADING EVENTS ---
    this.load.on('progress', (value) => {
      percentText.setText(`✦ ${parseInt(value * 100)}% ✦`);
      progressBar.clear();
      progressBar.fillStyle(0x991b1b, 1); 
      progressBar.fillRect(width / 2 - 160, height / 2 - 2, 320 * value, 4);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // --- 3. THE MASTER ENGINE PRELOAD LIST ---
    // Characters
    this.load.image('witch_sprite', 'assets/characters/witch/witch.png');
    this.load.spritesheet('witch_walk', 'assets/characters/witch/witch_walk.png', { frameWidth: 256, frameHeight: 256 });

    this.load.image('viking_sprite', 'assets/characters/viking/viking.png');
    this.load.spritesheet('viking_walk', 'assets/characters/viking/viking_walk.png', { frameWidth: 256, frameHeight: 256 });

    // Monsters (Acting as placeholders for all other Bestiary entries)
    const slimeConfig = { frameWidth: 64, frameHeight: 64 };
    this.load.spritesheet('slime_walk', 'assets/monsters/slime/Slime2_Walk_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_idle', 'assets/monsters/slime/Slime2_Idle_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_attack', 'assets/monsters/slime/Slime2_Attack_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_death', 'assets/monsters/slime/Slime2_Death_with_shadow.png', slimeConfig);
    this.load.spritesheet('slime_hurt', 'assets/monsters/slime/Slime2_Hurt_with_shadow.png', slimeConfig);

    const vampireConfig = { frameWidth: 64, frameHeight: 64 }; 
    this.load.spritesheet('vampire_walk', 'assets/monsters/vampire/Vampires3_Walk_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_attack', 'assets/monsters/vampire/Vampires3_Attack_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_hurt', 'assets/monsters/vampire/Vampires3_Hurt_with_shadow.png', vampireConfig);
    this.load.spritesheet('vampire_death', 'assets/monsters/vampire/Vampires3_Death_with_shadow.png', vampireConfig);

    // Maps & Audio
    this.load.image('ground_rocks_img', 'assets/maps/tiles.png'); 
    this.load.image('border_top', 'assets/maps/TopBorder.png');
    this.load.image('border_bottom', 'assets/maps/BottomBorder.png');
    
    this.load.audio('bgm_viking', 'assets/sounds/bgm/Viking.ogg');
    this.load.audio('bgm_witch', 'assets/sounds/bgm/Witch.ogg');
    this.load.audio('bgm_paladin', 'assets/sounds/bgm/Paladin.ogg');
    this.load.audio('bgm_pirate', 'assets/sounds/bgm/Pirate.ogg');
    this.load.audio('bgm_drifter', 'assets/sounds/bgm/Drifter.ogg');
    
    // Mid-Boss Music
    this.load.audio('bgm_zodd', 'assets/sounds/bgm/BossMidGame.ogg');
    
    // Eclipse Lord Music
    this.load.audio('bgm_femto', 'assets/sounds/bgm/BossFemto.ogg');    // For Obsidian Falcon
    this.load.audio('bgm_carmilla', 'assets/sounds/bgm/BossCarmilla.ogg');  // For Bramble Queen
    this.load.audio('bgm_elara', 'assets/sounds/bgm/BossElara.ogg');  // For Rot-Bringer
    this.load.audio('bgm_valeria', 'assets/sounds/bgm/BossValeria.ogg');  // For Mad Puppeteer
    this.load.audio('bgm_void', 'assets/sounds/bgm/BossVoid.ogg');  // For Grand Haruspex

    // Weapons
    this.load.image('bouncing_axe', 'assets/weapons/axe.png');
    this.load.image('magic_orb', 'assets/weapons/magic_orb.png');
    this.load.image('piercing_lance', 'assets/weapons/spear.png');
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