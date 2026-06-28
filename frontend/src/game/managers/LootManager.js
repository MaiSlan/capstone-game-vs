// src/game/managers/LootManager.js
import Phaser from 'phaser';

export default class LootManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    // Create physics groups for loot
    this.expGems = scene.physics.add.group();
    this.coins = scene.physics.add.group();

    // Set up overlaps for collection
    scene.physics.add.overlap(this.player, this.expGems, this.collectGem, null, this);
    scene.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // Listen for weapons/events triggering a coin drop (e.g., Pirate's weapons)
    this.coinSpawnListener = (e) => {
      const { x, y, type, amount } = e.detail;
      this.spawnCoin(x, y, amount, type);
    };
    window.addEventListener('VS_SPAWN_COIN', this.coinSpawnListener);

    // Clean up listener on scene destroy
    scene.events.on('destroy', () => {
      window.removeEventListener('VS_SPAWN_COIN', this.coinSpawnListener);
    });
  }

  spawnXP(x, y, amount) {
    // Simplify into two types: Small and Large Orbs
    const isLarge = amount >= 10;
    const texture = isLarge ? 'exp_gem_large' : 'exp_gem_small';
    
    const gem = this.expGems.create(x, y, texture);
    gem.xpValue = amount;
  }

  spawnCoin(x, y, amount, type = 'standard') {
    const coin = this.coins.create(x, y, 'coin_gold');
    coin.coinValue = amount || (type === 'high_value' ? 50 : 10);
    
    if (type === 'high_value') {
      coin.setScale(1.5);
      coin.setTint(0xffaa00);
    }
  }

  collectGem(player, gem) {
    // The player's gainXP method handles the VS_UPDATE_XP dispatch internally
    player.gainXP(gem.xpValue || 1);
    gem.destroy();
  }

  collectCoin(player, coin) {
    if (typeof player.collectCoin === 'function') {
      player.collectCoin(coin.coinValue || 1);
    }
    coin.destroy();
  }

  update() {
    // Calculate magnet radius based on player stats
    const magnetRadius = 150 * this.player.pickupMult;

    // Helper to magnetize a group
    const pullLoot = (group) => {
      group.getChildren().forEach((item) => {
        if (item && item.active) {
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);        
          if (distance < magnetRadius) {
            this.scene.physics.moveToObject(item, this.player, 400); 
          } else {
            item.body.setVelocity(0); 
          }
        }
      });
    };

    pullLoot(this.expGems);
    pullLoot(this.coins);
  }
}