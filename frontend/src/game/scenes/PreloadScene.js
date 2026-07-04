import Phaser from 'phaser';

const ROTATION_FRAMES = [
  { x: 1, y: 517 },   // 0: South 
  { x: 517, y: 1 },   // 1: South-East
  { x: 1, y: 1 },     // 2: East
  { x: 259, y: 1 },   // 3: North-East
  { x: 259, y: 259 }, // 4: North 
  { x: 1, y: 259 },   // 5: North-West
  { x: 259, y: 517 }, // 6: West
  { x: 517, y: 259 }  // 7: South-West
];

const PALADIN_FRAMES = [
  { x: 517, y: 259 }, // 0: South
  { x: 1, y: 1 },     // 1: South-East (Fallback to East)
  { x: 1, y: 1 },     // 2: East
  { x: 259, y: 1 },   // 3: North-East
  { x: 259, y: 259 }, // 4: North
  { x: 1, y: 259 },   // 5: North-West
  { x: 1, y: 517 },   // 6: West
  { x: 517, y: 1 }    // 7: South-West
];

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
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
      text: 'MANIFESTING RIFT...',
      style: { font: '14px serif', fill: '#71717a', letterSpacing: '4px' }
    }).setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 30,
      text: '✦ 0% ✦',
      style: { font: '12px serif', fill: '#991b1b' }
    }).setOrigin(0.5, 0.5);

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

    // In-Game Combat Sprites
    this.load.image('witch_sprite', 'assets/characters/witch/witch.png');
    this.load.spritesheet('witch_walk', 'assets/characters/witch/witch_walk.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('viking_sprite', 'assets/characters/viking/viking.png');
    this.load.spritesheet('viking_walk', 'assets/characters/viking/viking_walk.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('berserker_sprite', 'assets/characters/berserker/south.png');
    this.load.spritesheet('berserker_walk', 'assets/characters/berserker/berserker_walk.png', { frameWidth: 256, frameHeight: 256 });

    // Menu Selection Sprites
    this.load.image('witch_menu', 'assets/characters/witch/standing.png');
    this.load.image('viking_menu', 'assets/characters/viking/standing.png');
    this.load.image('paladin_menu', 'assets/characters/paladin/standing.png');
    this.load.image('pirate_menu', 'assets/characters/pirate/standing.png');
    this.load.image('berserker_menu', 'assets/characters/berserker/standing.png');
    this.load.image('drifter_menu', 'assets/characters/drifter/standing.png');

    // Monsters 
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
    this.load.audio('bgm_berserker', 'assets/sounds/bgm/Berserker.ogg');
    this.load.audio('bgm_drifter', 'assets/sounds/bgm/Drifter.ogg');
    
    // Boss Music
    this.load.audio('bgm_zodd', 'assets/sounds/bgm/BossMidGame.ogg');
    this.load.audio('bgm_femto', 'assets/sounds/bgm/BossFemto.ogg');    
    this.load.audio('bgm_carmilla', 'assets/sounds/bgm/BossCarmilla.ogg');  
    this.load.audio('bgm_elara', 'assets/sounds/bgm/BossElara.ogg');  
    this.load.audio('bgm_valeria', 'assets/sounds/bgm/BossValeria.ogg');  
    this.load.audio('bgm_void', 'assets/sounds/bgm/BossVoid.ogg');  

    this.load.audio('bgm_MENU', 'assets/sounds/bgm/MainTitle.ogg');  


    // Items and Weapons
    this.load.image('bouncing_axe', 'assets/weapons/axe.png');
    this.load.image('magic_orb', 'assets/weapons/magic_orb.png');
    this.load.image('piercing_lance', 'assets/weapons/spear.png');
    this.load.image('magic_book', 'assets/weapons/spellbook.png');
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
    // --- MAP CUSTOM COORDINATES TO PHASER TEXTURES ---
    const defineFrames = (textureKey, frames) => {
      const texture = this.textures.get(textureKey);
      if (texture && texture.key !== '__MISSING') {
        frames.forEach((pos, index) => {
          texture.add(index.toString(), 0, pos.x, pos.y, 256, 256);
        });
      }
    };

    defineFrames('witch_menu', ROTATION_FRAMES);
    defineFrames('viking_menu', ROTATION_FRAMES);
    defineFrames('pirate_menu', ROTATION_FRAMES);
    defineFrames('berserker_menu', ROTATION_FRAMES);
    defineFrames('paladin_menu', PALADIN_FRAMES);
    defineFrames('drifter_menu', ROTATION_FRAMES);

    this.scene.start('MainTitleScene'); 
  }
}