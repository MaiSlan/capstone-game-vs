import Phaser from 'phaser';
import Witch from '../entities/characters/Witch';
import Viking from '../entities/characters/Viking';
import Template from '../entities/characters/Template';
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
    const floorLayer = map.createBlankLayer('BaseFloor', tileset, 0, 0);

    const paleStoneTiles = [0, 2, 4, 6, 8];
    floorLayer.randomize(0, 0, mapWidthInTiles, mapHeightInTiles, paleStoneTiles);
    floorLayer.setScale(2);

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(-500, -500, mapWidth + 1000, mapHeight + 1000);

    // --- 2. THE SOLID WALLS ---
    this.walls = this.physics.add.staticGroup();

    // Top Wall
    const topWall = this.add.tileSprite(mapWidth / 2, 28, mapWidth, 56, 'border_top');
    this.physics.add.existing(topWall, true); // Force static physics body
    this.walls.add(topWall);

    // Bottom Wall
    const bottomWall = this.add.tileSprite(mapWidth / 2, mapHeight - 36, mapWidth, 72, 'border_bottom');
    this.physics.add.existing(bottomWall, true);
    this.walls.add(bottomWall);

    // Left Wall
    const leftWall = this.add.tileSprite(28, mapHeight / 2, mapHeight, 56, 'border_top');
    this.physics.add.existing(leftWall, true);
    leftWall.setAngle(-90);
    leftWall.body.setSize(56, mapHeight); 
    this.walls.add(leftWall);

    // Right Wall
    const rightWall = this.add.tileSprite(mapWidth - 28, mapHeight / 2, mapHeight, 56, 'border_top');
    this.physics.add.existing(rightWall, true);
    rightWall.setAngle(90);
    rightWall.body.setSize(56, mapHeight);
    this.walls.add(rightWall);

    const graphics = this.add.graphics();
    graphics.clear(); graphics.fillStyle(0xf97316, 1); graphics.fillRect(0, 0, 96, 96); graphics.generateTexture('tank_boss', 96, 96);
    graphics.clear(); graphics.fillStyle(0xffff00, 1); graphics.fillCircle(8, 8, 8); graphics.generateTexture('magic_bullet', 16, 16);
    graphics.clear(); graphics.fillStyle(0x06b6d4, 1); graphics.fillRect(0, 0, 12, 12); graphics.generateTexture('exp_gem', 12, 12);
    graphics.clear(); graphics.fillStyle(0x3b82f6, 1); graphics.fillRect(0, 0, 16, 16); graphics.generateTexture('magic_book', 16, 16);
    graphics.clear(); graphics.fillStyle(0x94a3b8, 1); graphics.fillRect(0, 0, 40, 8); graphics.generateTexture('lance', 40, 8);
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
      this.player = new Template(this, 4000, 4000);
    }
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.waveManager = new WaveManager(this, this.enemies, this.player);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    // --- UPDATED WEAPON HIT LOGIC ---
    this.physics.add.overlap(this.playerProjectiles, this.enemies, (projectile, enemy) => {
      // PREVENT GHOST HITS: If the enemy is already playing its death animation, ignore it
      if (enemy.isDying) return; 

      enemy.hp -= (projectile.damage || 10);
      
      if (projectile.pierce !== undefined) {
        projectile.pierce--;
        if (projectile.pierce <= 0) projectile.destroy();
      } else if (projectile.isBullet) {
        projectile.destroy(); 
      }
      
      if (enemy.hp <= 0) {        
        const gemCount = enemy.texture.key === 'tank_boss' ? 5 : 1;
        for (let i = 0; i < gemCount; i++) {
          this.expGems.create(enemy.x + (i * 10), enemy.y + (i * 10), 'exp_gem');
        }
        if (this.player.lifesteal > 0 && this.player.hp < this.player.maxHp) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.lifesteal);
          this.scene.get('UIScene').updateHP(this.player.hp, this.player.maxHp);
        }
        if (typeof enemy.die === 'function') {
          enemy.die(); 
        } else {
          enemy.isDying = true; 
          enemy.destroy();  
        }
      } else {
        
        // --- THE FIX: Trigger the animation instead of flashing white ---
        if (typeof enemy.hurt === 'function') {
          // Temporarily flash white while playing the hurt animation for extra impact
          enemy.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
          this.time.delayedCall(100, () => { 
            if (enemy && enemy.active && !enemy.deadTriggered) enemy.clearTint() 
          });
          
          enemy.hurt(); // Triggers the hit-stun
          
        } else {
          enemy.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
          this.time.delayedCall(100, () => { if (enemy && enemy.active && !enemy.isDying) enemy.clearTint() });
        }
        
      }
    });

    // --- NEW: Player hitting Enemy (Take Damage)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (this.isDead || enemy.isDying) return; 

      player.takeDamage(10, this);
      this.scene.get('UIScene').updateHP(player.hp, player.maxHp);
      
      // --- THE FIX: Tell the enemy to play its attack animation! ---
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

    // --- NEW: Player collecting Gem
    this.physics.add.overlap(this.player, this.expGems, (player, gem) => {
      gem.destroy();
      player.gainXP(10);
      this.scene.get('UIScene').updateXP(player.xp, player.xpToNextLevel, player.level);
    });

    this.isDead = false;
    this.runTimeMs = 0;

    this.scene.launch('UIScene');

    this.rewardListener = (e) => {
      const reward = e.detail.reward; // This is now an object!
      
      if (reward.type === 'consumable' && reward.id === 'heal') {
        this.player.hp = this.player.maxHp;
        this.scene.get('UIScene').updateHP(this.player.hp, this.player.maxHp);
      } else if (reward.type === 'weapon') {
        this.player.addOrUpgradeWeapon(reward.id);
      } else if (reward.type === 'item') {
        this.player.addOrUpgradeItem(reward.id); // We will build this next
      }

      this.scene.resume('MainScene');
    };

    window.addEventListener('VS_APPLY_REWARD', this.rewardListener);

    // Clean up the event listener if the scene restarts
    this.events.on('destroy', () => {
      window.removeEventListener('VS_APPLY_REWARD', this.rewardListener);
    });
  }

  update(time, delta) {
    if (this.isDead) return;

    // Accumulate time strictly based on game delta (so pauses stop the clock)
    this.runTimeMs += delta;
    const runTimeSeconds = Math.floor(this.runTimeMs / 1000);
    
    // Update the UI Clock
    this.scene.get('UIScene').updateTimer(runTimeSeconds);

    this.player.update(time, this.enemies);
    
    // Pass BOTH the raw time and the seconds to the WaveManager
    this.waveManager.update(time, runTimeSeconds);

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) enemy.update(this.player);
    });

    // If a gem is within 150 pixels, it flies toward the player
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
  }  
}