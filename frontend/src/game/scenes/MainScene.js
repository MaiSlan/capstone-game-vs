import Phaser from 'phaser';
import Witch from '../entities/characters/Witch';
import Viking from '../entities/characters/Viking';
import WaveManager from '../managers/WaveManager';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.selectedCharacter = data.character || 'witch';
  }

  preload() {
    this.load.image('witch_sprite', 'assets/characters/witch.png');
    this.load.image('viking_sprite', 'assets/characters/viking.png');
  }

  // Inside src/game/scenes/MainScene.js
  
  create() {
    this.physics.world.setBounds(0, 0, 4000, 4000);
    this.cameras.main.setBounds(0, 0, 4000, 4000);
    this.add.grid(2000, 2000, 4000, 4000, 64, 64, 0x000000, 0, 0x4c1d95, 0.4);

    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1); graphics.fillRect(0, 0, 32, 32); graphics.generateTexture('dummy_monster', 32, 32);
    graphics.clear(); graphics.fillStyle(0xffff00, 1); graphics.fillCircle(8, 8, 8); graphics.generateTexture('magic_bullet', 16, 16);
    
    // --- NEW: EXP Gem Graphic (Little glowing blue square)
    graphics.clear(); graphics.fillStyle(0x06b6d4, 1); graphics.fillRect(0, 0, 12, 12); graphics.generateTexture('exp_gem', 12, 12);
    graphics.destroy(); 

    // Groups
    this.playerProjectiles = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.expGems = this.physics.add.group(); // --- NEW

    if (this.selectedCharacter === 'witch') {
      this.player = new Witch(this, 2000, 2000);
    } else {
      this.player = new Viking(this, 2000, 2000);
    }

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.waveManager = new WaveManager(this, this.enemies, this.player);

    // --- UPDATED: Bullet hitting Enemy
    this.physics.add.overlap(this.playerProjectiles, this.enemies, (projectile, enemy) => {
      if (projectile.isBullet) projectile.destroy(); 
      
      // Spawn a gem where the enemy died
      this.expGems.create(enemy.x, enemy.y, 'exp_gem');
      enemy.destroy();  
    });

    // --- NEW: Player hitting Enemy (Take Damage)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      player.takeDamage(10, this);
      this.scene.get('UIScene').updateHP(player.hp, player.maxHp);
      
      if (player.hp <= 0) {
        console.log("GAME OVER"); // We'll build a real Game Over screen later
      }
    });

    // --- NEW: Player collecting Gem
    this.physics.add.overlap(this.player, this.expGems, (player, gem) => {
      gem.destroy();
      player.gainXP(10);
      this.scene.get('UIScene').updateXP(player.xp, player.xpToNextLevel, player.level);
    });

    this.isDead = false;

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (this.isDead) return; // Don't take damage if already dead

      player.takeDamage(10, this);
      this.scene.get('UIScene').updateHP(player.hp, player.maxHp);
      
      // THE DEATH TRIGGER
      if (player.hp <= 0) {
        this.isDead = true;
        this.physics.pause(); // Instantly freezes all movement and collisions
        player.setTint(0xff0000); // Lock the player to a red color
        
        // Shout out to React that the game is over, passing the final level
        window.dispatchEvent(new CustomEvent('VS_GAME_OVER', {
          detail: { level: player.level }
        }));
      }
    });

    this.scene.launch('UIScene');
  }

  update(time, delta) {
    if (this.isDead) return;
    this.player.update(time, this.enemies);
    this.waveManager.update(time);

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) enemy.update(this.player);
    });

    // --- NEW: The EXP Magnet Effect
    // If a gem is within 150 pixels, it flies toward the player
    this.expGems.getChildren().forEach((gem) => {
      if (gem && gem.active) {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, gem.x, gem.y);
        if (distance < 150) {
          this.physics.moveToObject(gem, this.player, 400); // 400 is the fly speed
        } else {
          gem.body.setVelocity(0); // Stop moving if player runs away
        }
      }
    });
  }  
}