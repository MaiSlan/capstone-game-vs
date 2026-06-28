// src/game/scenes/MainScene.js
import Phaser from 'phaser';
import Witch from '../entities/characters/Witch';
import Viking from '../entities/characters/Viking';
import WaveManager from '../managers/WaveManager';
import AnimationManager from '../managers/AnimationManager';
import LootManager from '../managers/LootManager';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.selectedCharacter = data.character || 'witch';
    this.userUpgrades = data.userUpgrades || [];
  }

  preload() {
  }
  
  create() {
    AnimationManager.initializeAnimations(this);

    // --- AUDIO INIT ---
    // Dynamically load the theme song based on the chosen vessel
    const charBgmKey = `bgm_${this.selectedCharacter}`;
    this.bgm = this.sound.add(charBgmKey, { volume: 0.3, loop: true });
    this.bgm.play();

    // --- TIMER INIT ---
    this.surviveSeconds = 0;    
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.surviveSeconds++;
        window.dispatchEvent(new CustomEvent('VS_UPDATE_TIMER', { 
          detail: { seconds: this.surviveSeconds } 
        }));
      },
      loop: true
    });

    // --- 1. THE 8000x8000 FLOOR ---
    const mapWidth = 8000;
    const mapHeight = 8000;
    
    const mapWidthInTiles = 250; 
    const mapHeightInTiles = 250;

    const map = this.make.tilemap({ 
      tileWidth: 16, 
      tileHeight: 16, 
      width: mapWidthInTiles, 
      height: mapHeightInTiles 
    });

    const tileset = map.addTilesetImage('ground_rocks', 'ground_rocks_img');
    this.floorLayer = map.createBlankLayer('BaseFloor', tileset, 0, 0);

    const paleStoneTiles = [0, 2, 4, 6, 8];
    this.floorLayer.randomize(0, 0, mapWidthInTiles, mapHeightInTiles, paleStoneTiles);
    this.floorLayer.setScale(2);

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(-500, -500, mapWidth + 1000, mapHeight + 1000);

    // --- 2. THE SOLID WALLS ---
    this.walls = this.physics.add.staticGroup();

    const topWall = this.add.tileSprite(mapWidth / 2, 28, mapWidth, 56, 'border_top');
    this.physics.add.existing(topWall, true); 
    this.walls.add(topWall);

    const bottomWall = this.add.tileSprite(mapWidth / 2, mapHeight - 36, mapWidth, 72, 'border_bottom');
    this.physics.add.existing(bottomWall, true);
    this.walls.add(bottomWall);

    const leftWall = this.add.tileSprite(28, mapHeight / 2, mapHeight, 56, 'border_top');
    this.physics.add.existing(leftWall, true);
    leftWall.setAngle(-90);
    leftWall.body.setSize(56, mapHeight); 
    this.walls.add(leftWall);

    const rightWall = this.add.tileSprite(mapWidth - 28, mapHeight / 2, mapHeight, 56, 'border_top');
    this.physics.add.existing(rightWall, true);
    rightWall.setAngle(90);
    rightWall.body.setSize(56, mapHeight);
    this.walls.add(rightWall);

    const graphics = this.add.graphics();
    graphics.clear(); graphics.fillStyle(0xffff00, 1); graphics.fillCircle(8, 8, 8); graphics.generateTexture('magic_bullet', 16, 16);
    graphics.clear(); graphics.fillStyle(0x3b82f6, 1); graphics.fillRect(0, 0, 16, 16); graphics.generateTexture('magic_book', 16, 16);
    graphics.clear(); graphics.fillStyle(0x94a3b8, 1); graphics.fillRect(0, 0, 40, 8); graphics.generateTexture('lance', 40, 8);
    graphics.clear(); graphics.fillStyle(0xffffff, 1); graphics.fillRect(0, 0, 40, 40); graphics.generateTexture('placeholder_square', 40, 40);
    
    // Loot Textures
    graphics.clear(); graphics.fillStyle(0xffd700, 1); graphics.fillCircle(6, 6, 6); graphics.generateTexture('coin_gold', 12, 12);
    graphics.clear(); graphics.fillStyle(0x06b6d4, 1); graphics.fillCircle(6, 6, 6); graphics.generateTexture('exp_gem_small', 12, 12);
    graphics.clear(); graphics.fillStyle(0xef4444, 1); graphics.fillCircle(8, 8, 8); graphics.generateTexture('exp_gem_large', 16, 16);
    graphics.destroy();

    // Groups
    this.playerProjectiles = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.expGems = this.physics.add.group();

    this.physics.add.collider(this.enemies, this.enemies);    

    // --- SPAWN SELECTION ---
    if (this.selectedCharacter === 'witch') {
      this.player = new Witch(this, 4000, 4000, this.userUpgrades);
    } else if (this.selectedCharacter === 'viking') {
      this.player = new Viking(this, 4000, 4000, this.userUpgrades);
    } else {
      this.player = new Template(this, 4000, 4000, this.userUpgrades); 
    }
    
    // ==========================================
    // DEV MODE: UNSTOPPABLE POWER
    // Comment these out when you are ready to balance the real game!
    // ==========================================
    //this.player.damageMult = 5.0; // Deal 500% Damage instantly
    //this.player.xpMult = 5.0;     // Level up 5x faster
    //this.player.baseSpeed = 250;  // Run incredibly fast to dodge anything
    //this.player.hp = 5000;        // Massive health pool
    //this.player.maxHp = 5000;

    // DEV MODE: Grant character-specific weapons at Level 5 (Max)
    //let devWeapons = [];
    
    //if (this.selectedCharacter === 'witch') {
    //  devWeapons = ['magic_orb', 'magic_book', 'magic_wand', 'arcane_nova'];
    //} else if (this.selectedCharacter === 'viking') {
    //  // --- THE FIX: Updated to match exact Viking WeaponDB IDs ---
    //  devWeapons = ['bouncing_axe', 'piercing_lance', 'seismic_stomp', 'dragon_shout'];
    //}

    //devWeapons.forEach(weaponId => {
    //  for (let i = 0; i < 5; i++) {
    //    try {
    //      this.player.addOrUpgradeWeapon(weaponId);
    //    } catch (error) {
    //      console.warn(`Dev Mode: Skipped ${weaponId} - Not mapped for this character.`);
     //   }
     // }
    //});
    
    // Optional Time Skip: Uncomment this to start the game directly at Minute 19!
    //this.surviveSeconds = 240; 
    // ==========================================

    this.lootManager = new LootManager(this, this.player);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.waveManager = new WaveManager(this, this.enemies, this.player);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    // --- WEAPON HIT LOGIC ---
    this.physics.add.overlap(this.playerProjectiles, this.enemies, (projectile, enemy) => {
      if (enemy.isDying || !enemy.active || !projectile.active) return;

      // 1. Calculate and apply damage
      const damageDealt = Math.floor(projectile.damage || 10);
      enemy.hp -= damageDealt;

      // --- FLOATING DAMAGE TEXT ---
      const dmgText = this.add.text(enemy.x + Phaser.Math.Between(-10, 10), enemy.y - 15, damageDealt.toString(), {
        fontSize: '14px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      });
      
      dmgText.setDepth(50); // Ensure the text renders above characters

      this.tweens.add({
        targets: dmgText,
        y: enemy.y - 40,
        alpha: 0,
        duration: 600,
        ease: 'Power1',
        onComplete: () => dmgText.destroy()
      });
      // ------------------------------

      if (enemy.isBoss) {
        window.dispatchEvent(new CustomEvent('VS_UPDATE_BOSS_HP', { 
          detail: { hp: enemy.hp, maxHp: enemy.maxHp } 
        }));
      }

      if (projectile.onHit) {
        projectile.onHit(enemy);
      }

      if (enemy.hp <= 0) {        
        
        // DELEGATE TO LOOT MANAGER
        this.lootManager.spawnXP(enemy.x, enemy.y, enemy.xpValue || 1);
        
        // 5% chance for a standard enemy to drop a coin
        if (Math.random() < 0.05) {
          this.lootManager.spawnCoin(enemy.x, enemy.y, 1, 'standard');
        }
        
        if (this.player.lifesteal > 0 && this.player.hp < this.player.maxHp) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.lifesteal);
          window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: this.player.hp, maxHp: this.player.maxHp } }));
        }
        
        if (typeof enemy.die === 'function') {
          enemy.die(); 
        } else {
          enemy.isDying = true; 
          enemy.destroy();  
        }
      } else {
        if (typeof enemy.hurt === 'function') {
          enemy.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
          this.time.delayedCall(100, () => { 
            if (enemy && enemy.active && !enemy.deadTriggered) enemy.clearTint() 
          });
          enemy.hurt(); 
        } else {
          enemy.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
          this.time.delayedCall(100, () => { if (enemy && enemy.active && !enemy.isDying) enemy.clearTint() });
        }
      }
    });

    // --- PLAYER HIT BY ENEMY ---
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (this.isDead || enemy.isDying) return; 

      player.takeDamage(enemy.damage || 10, this); 
      window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: player.hp, maxHp: player.maxHp } }));
      
      if (typeof enemy.attack === 'function') {
        enemy.attack();
      }
      
      if (player.hp <= 0) {
        this.isDead = true;
        this.physics.pause(); 
        player.setTint(0xff0000); 
        
        window.dispatchEvent(new CustomEvent('VS_GAME_OVER', {
          detail: { 
            character_used: this.selectedCharacter,
            level_reached: player.level, 
            survival_time_seconds: this.surviveSeconds,
            gold_earned: player.coins 
          }
        }));
      }
    });

    this.isDead = false;
    this.runTimeMs = 0;

    this.scene.launch('UIScene');

    this.rewardListener = (e) => {
      const reward = e.detail.reward; 
      
      if (reward.type === 'consumable' && reward.id === 'heal') {
        this.player.hp = this.player.maxHp;
        window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: this.player.hp, maxHp: this.player.maxHp } }));
      } else if (reward.type === 'weapon') {
        this.player.addOrUpgradeWeapon(reward.id);
      } else if (reward.type === 'item') {
        this.player.addOrUpgradeItem(reward.id); 
      } 
      else if (reward.type === 'stat') {
        if (reward.id === 'stat_might') {
          this.player.damageMult += 0.10; 
        } else if (reward.id === 'stat_haste') {
          this.player.cooldownMult *= 0.95; 
        } else if (reward.id === 'stat_swift') {
          this.player.baseSpeed *= 1.10; 
          this.player.currentSpeed = this.player.baseSpeed;
        } else if (reward.id === 'stat_vitality') {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + (this.player.maxHp * 0.5));
          window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: this.player.hp, maxHp: this.player.maxHp } }));
        }
      }

      this.scene.resume('MainScene');
    };

    window.addEventListener('VS_APPLY_REWARD', this.rewardListener);

    this.pauseListener = (e) => {
      const isPaused = e.detail.isPaused;
      if (this.bgm && this.bgm.isPlaying) {
        this.bgm.setVolume(isPaused ? 0.05 : 0.3);
      }
    };
    window.addEventListener('VS_PAUSE_STATE', this.pauseListener);

    // ==========================================
    // AUDIO CROSSFADE MANAGER & MID-BOSS LOGIC
    // ==========================================
    this.crossfadeMusic = (newTrackKey) => {
      if (!this.bgm) return;
      this.tweens.add({
        targets: this.bgm,
        volume: 0,
        duration: 2000,
        onComplete: () => {
          this.bgm.stop();
          this.bgm = this.sound.add(newTrackKey, { volume: 0, loop: true });
          this.bgm.play();
          this.tweens.add({ targets: this.bgm, volume: 0.3, duration: 2000 });
        }
      });
    };

    // Listen for Zodd (Karnok) spawning
    this.midBossStartListener = () => {
      this.crossfadeMusic('bgm_zodd');
    };
    window.addEventListener('VS_MID_BOSS_STARTED', this.midBossStartListener);

    // Listen for Zodd dying (Transition back to Character Theme)
    this.midBossDeadListener = () => {
      this.crossfadeMusic(`bgm_${this.selectedCharacter}`);
    };
    window.addEventListener('VS_MID_BOSS_DEAD', this.midBossDeadListener);

    // ==========================================
    // THE ECLIPSE SEQUENCE HANDLER
    // ==========================================
    this.eclipseListener = (e) => {
      // 1. Camera Shake Impact
      this.cameras.main.shake(2000, 0.015);

      // 2. Crossfade to the Specific God-Hand Music
      const bossMusicMap = {
        'obsidian_falcon': 'bgm_femto',
        'carmilla': 'bgm_carmilla',
        'grand_haruspex': 'bgm_void',
        'elara': 'bgm_elara',
        'valeria': 'bgm_valeria'
      };
      
      // Look up the track based on the boss ID passed from WaveManager, default to character theme if missing
      const nextTrack = (e.detail && e.detail.bossId) ? bossMusicMap[e.detail.bossId] : `bgm_${this.selectedCharacter}`;
      this.crossfadeMusic(nextTrack);

      this.tweens.addCounter({
        from: 255, 
        to: 100,   
        duration: 3000,
        onUpdate: (tween) => {
          const val = Math.floor(tween.getValue());
          const color = Phaser.Display.Color.GetColor(val, 0, 0);
          this.floorLayer.setTint(color);
        }
      });

      this.eclipseActive = true;
      this.eclipseCenter = { x: this.player.x, y: this.player.y };
      this.eclipseRadius = 900; 

      const arenaVisual = this.add.graphics({ x: this.eclipseCenter.x, y: this.eclipseCenter.y });

      const borderThickness = 4000;
      arenaVisual.lineStyle(borderThickness, 0x020000, 0.9); 
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius + (borderThickness / 2));
      arenaVisual.lineStyle(8, 0xdc2626, 1); 
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius);
      arenaVisual.lineStyle(3, 0xffa3a3, 0.8);
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius - 6);

      arenaVisual.setAlpha(0);
      this.tweens.add({
        targets: arenaVisual,
        alpha: 1,
        duration: 2000,
        ease: 'Sine.easeIn'
      });
    };

    window.addEventListener('VS_ECLIPSE_STARTED', this.eclipseListener);

    this.events.on('destroy', () => {
      window.removeEventListener('VS_APPLY_REWARD', this.rewardListener);
      window.removeEventListener('VS_PAUSE_STATE', this.pauseListener);
      window.removeEventListener('VS_ECLIPSE_STARTED', this.eclipseListener);
      window.removeEventListener('VS_MID_BOSS_STARTED', this.midBossStartListener);
      window.removeEventListener('VS_MID_BOSS_DEAD', this.midBossDeadListener);
      if (this.bgm) this.bgm.stop(); 
    });
  }
  
  update(time, delta) {
    if (this.isDead) return;

    this.player.update(time, this.enemies);
    this.waveManager.update(time, this.surviveSeconds);
    this.lootManager.update(); 

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) enemy.update(time); 
    });

    // --- CIRCULAR ARENA ENFORCEMENT ---
    if (this.eclipseActive) {
      const constrainToCircle = (sprite, radiusOffset) => {
        if (!sprite || !sprite.active) return;
        
        const dist = Phaser.Math.Distance.Between(this.eclipseCenter.x, this.eclipseCenter.y, sprite.x, sprite.y);
        const maxDist = this.eclipseRadius - radiusOffset;

        if (dist > maxDist) {
          const angle = Phaser.Math.Angle.Between(this.eclipseCenter.x, this.eclipseCenter.y, sprite.x, sprite.y);
          sprite.x = this.eclipseCenter.x + Math.cos(angle) * maxDist;
          sprite.y = this.eclipseCenter.y + Math.sin(angle) * maxDist;
        }
      };

      constrainToCircle(this.player, 20);

      this.enemies.getChildren().forEach(enemy => {
        constrainToCircle(enemy, 30);
      });
    }
  }
}