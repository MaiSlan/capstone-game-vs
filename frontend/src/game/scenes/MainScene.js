import Phaser from 'phaser';
import Witch from '../entities/characters/Witch';
import Viking from '../entities/characters/Viking';
import WaveManager from '../managers/WaveManager';
import AnimationManager from '../managers/AnimationManager';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.selectedCharacter = data.character || 'witch';
  }

  preload() {
  }
  
  create() {
    AnimationManager.initializeAnimations(this);

    // --- AUDIO INIT ---
    this.bgm = this.sound.add('bgm_phase1', { volume: 0.3, loop: true }); // THE FIX: Use Phase 1 BGM    
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
    graphics.clear(); graphics.fillStyle(0x06b6d4, 1); graphics.fillRect(0, 0, 12, 12); graphics.generateTexture('exp_gem', 12, 12);
    graphics.clear(); graphics.fillStyle(0x3b82f6, 1); graphics.fillRect(0, 0, 16, 16); graphics.generateTexture('magic_book', 16, 16);
    graphics.clear(); graphics.fillStyle(0x94a3b8, 1); graphics.fillRect(0, 0, 40, 8); graphics.generateTexture('lance', 40, 8);
    graphics.clear(); graphics.fillStyle(0xffffff, 1); graphics.fillRect(0, 0, 40, 40); graphics.generateTexture('placeholder_square', 40, 40);
    graphics.destroy();

    // Groups
    this.playerProjectiles = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.expGems = this.physics.add.group();

    this.physics.add.collider(this.enemies, this.enemies);    

    // --- SPAWN SELECTION ---
    if (this.selectedCharacter === 'witch') {
      this.player = new Witch(this, 4000, 4000);
    } else if (this.selectedCharacter === 'viking') {
      this.player = new Viking(this, 4000, 4000);
    } else {
      this.player = new Template(this, 4000, 4000); // Note: Ensure Template class exists if this fallback is hit
    }
    
    // ==========================================
    // DEV MODE: UNSTOPPABLE POWER
    // Comment these out when you are ready to balance the real game!
    // ==========================================
    this.player.damageMult = 5.0; // Deal 500% Damage instantly
    this.player.xpMult = 5.0;     // Level up 5x faster
    this.player.baseSpeed = 250;  // Run incredibly fast to dodge anything
    this.player.hp = 5000;        // Massive health pool
    this.player.maxHp = 5000;

    // DEV MODE: Grant character-specific weapons at Level 5 (Max)
    let devWeapons = [];
    
    if (this.selectedCharacter === 'witch') {
      devWeapons = ['magic_orb', 'magic_book', 'magic_wand', 'arcane_nova'];
    } else if (this.selectedCharacter === 'viking') {
      // --- THE FIX: Updated to match exact Viking WeaponDB IDs ---
      devWeapons = ['bouncing_axe', 'piercing_lance', 'seismic_stomp', 'dragon_shout'];
    }

    devWeapons.forEach(weaponId => {
      for (let i = 0; i < 5; i++) {
        try {
          this.player.addOrUpgradeWeapon(weaponId);
        } catch (error) {
          console.warn(`Dev Mode: Skipped ${weaponId} - Not mapped for this character.`);
        }
      }
    });
    
    // Optional Time Skip: Uncomment this to start the game directly at Minute 19!
    this.surviveSeconds = 1190; 
    // ==========================================
    
    // Optional Time Skip: Uncomment this to start the game directly at Minute 19!
    this.surviveSeconds = 1190; 
    // ==========================================

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.waveManager = new WaveManager(this, this.enemies, this.player);


    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.waveManager = new WaveManager(this, this.enemies, this.player);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    // --- PURE POLYMORPHIC WEAPON HIT LOGIC ---
    this.physics.add.overlap(this.playerProjectiles, this.enemies, (projectile, enemy) => {
      if (enemy.isDying || !enemy.active || !projectile.active) return;

      enemy.hp -= (projectile.damage || 10);

      if (enemy.isBoss) {
        window.dispatchEvent(new CustomEvent('VS_UPDATE_BOSS_HP', { 
          detail: { hp: enemy.hp, maxHp: enemy.maxHp } 
        }));
      }

      if (projectile.onHit) {
        projectile.onHit(enemy);
      }

      if (enemy.hp <= 0) {        
        
        // THE FIX: Spawn a single gem, but assign it the enemy's Database XP value!
        const gem = this.expGems.create(enemy.x, enemy.y, 'exp_gem');
        gem.xpValue = enemy.xpValue || 1; 
        
        // Lifesteal UI Fix
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

    // --- Player hitting Enemy (Take Damage) ---
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (this.isDead || enemy.isDying) return; 

      player.takeDamage(enemy.damage || 10, this); // Use DB damage if available
      window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: player.hp, maxHp: player.maxHp } }));
      
      if (typeof enemy.attack === 'function') {
        enemy.attack();
      }
      
      if (player.hp <= 0) {
        this.isDead = true;
        this.physics.pause(); 
        player.setTint(0xff0000); 
        
        window.dispatchEvent(new CustomEvent('VS_GAME_OVER', {
          detail: { level: player.level }
        }));
      }
    });

    // --- Player collecting Gem ---
    this.physics.add.overlap(this.player, this.expGems, (player, gem) => {
      // Pass the gem's specific DB value to the player
      player.gainXP(gem.xpValue || 1);
      gem.destroy();
      
      // THE FIX: Changed 'player.nextLevelXp' to the correct 'player.xpToNextLevel'
      window.dispatchEvent(new CustomEvent('VS_UPDATE_XP', { 
        detail: { xp: player.xp, maxXp: player.xpToNextLevel } 
      }));
      
      window.dispatchEvent(new CustomEvent('VS_UPDATE_LEVEL', { 
        detail: { level: player.level } 
      }));
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
      // --- THE FIX: Handle the Infinite Stats ---
      else if (reward.type === 'stat') {
        if (reward.id === 'stat_might') {
          this.player.damageMult += 0.10; 
        } else if (reward.id === 'stat_haste') {
          this.player.cooldownMult *= 0.95; // Reduces cooldowns by 5%
        } else if (reward.id === 'stat_swift') {
          this.player.baseSpeed *= 1.10; // Increases movement by 10%
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
    // A helper function to smoothly transition between tracks
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

    // Listen for Zodd dying (Transition to Phase 2)
    this.midBossDeadListener = () => {
      this.crossfadeMusic('bgm_phase2');
    };
    window.addEventListener('VS_MID_BOSS_DEAD', this.midBossDeadListener);

    // ==========================================
    // THE ECLIPSE SEQUENCE HANDLER
    // ==========================================
    // THE FIX: Accept the event 'e' so we can read the bossId
    this.eclipseListener = (e) => {
      // 1. Camera Shake Impact
      this.cameras.main.shake(2000, 0.015);

      // 2. Crossfade to the Specific God-Hand Music
      const bossMusicMap = {
        'obsidian_falcon': 'bgm_femto',
        'bramble_queen': 'bgm_slan',
        'grand_haruspex': 'bgm_void',
        'rot_bringer': 'bgm_conrad',
        'mad_puppeteer': 'bgm_ubic'
      };
      
      // Look up the track based on the boss ID passed from WaveManager, default to phase 2 if missing
      const nextTrack = (e.detail && e.detail.bossId) ? bossMusicMap[e.detail.bossId] : 'bgm_phase2';
      this.crossfadeMusic(nextTrack);

      // 3. Smoothly Tint the World Blood-Red
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

      // 4. Trap the Player (The Circular Arena)
      this.eclipseActive = true;
      this.eclipseCenter = { x: this.player.x, y: this.player.y };
      
      // EXPANDED: Increased from 600 to 900 to give plenty of dodging room
      this.eclipseRadius = 900; 

      // --- THE VISUAL BLOOD-BARRIER (DONUT TRICK) ---
      const arenaVisual = this.add.graphics({ x: this.eclipseCenter.x, y: this.eclipseCenter.y });

      // The Fix: Instead of complex path-winding, we draw a circle with an impossibly thick border.
      // This perfectly frames the arena and guarantees the center is 100% clear.
      const borderThickness = 4000;
      arenaVisual.lineStyle(borderThickness, 0x020000, 0.9); // 90% opaque dark void
      
      // The stroke grows outward from the center of the line, so we offset the radius
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius + (borderThickness / 2));

      // Draw the glowing red boundary ring
      arenaVisual.lineStyle(8, 0xdc2626, 1); 
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius);
      
      // Add a secondary inner glow
      arenaVisual.lineStyle(3, 0xffa3a3, 0.8);
      arenaVisual.strokeCircle(0, 0, this.eclipseRadius - 6);

      // Flash the barrier into existence
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

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) enemy.update(time); 
    });

    const magnetRadius = 150 * this.player.pickupMult;
    
    this.expGems.getChildren().forEach((gem) => {
      if (gem && gem.active) {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, gem.x, gem.y);        
        if (distance < magnetRadius) {
          this.physics.moveToObject(gem, this.player, 400); 
        } else {
          gem.body.setVelocity(0); 
        }
      }
    });

    // --- CIRCULAR ARENA ENFORCEMENT ---
    if (this.eclipseActive) {
      // Helper function to keep an entity inside the circle
      const constrainToCircle = (sprite, radiusOffset) => {
        if (!sprite || !sprite.active) return;
        
        // Calculate how far the entity is from the center
        const dist = Phaser.Math.Distance.Between(this.eclipseCenter.x, this.eclipseCenter.y, sprite.x, sprite.y);
        const maxDist = this.eclipseRadius - radiusOffset;

        // If they stepped outside the line, pull them exactly back to the edge!
        if (dist > maxDist) {
          const angle = Phaser.Math.Angle.Between(this.eclipseCenter.x, this.eclipseCenter.y, sprite.x, sprite.y);
          sprite.x = this.eclipseCenter.x + Math.cos(angle) * maxDist;
          sprite.y = this.eclipseCenter.y + Math.sin(angle) * maxDist;
        }
      };

      // 1. Constrain the player (20px offset for their hitbox)
      constrainToCircle(this.player, 20);

      // 2. Constrain the Boss and any minions (30px offset)
      this.enemies.getChildren().forEach(enemy => {
        constrainToCircle(enemy, 30);
      });
    }
  }
}