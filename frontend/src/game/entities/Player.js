// src/game/entities/Player.js
import Phaser from 'phaser';
import WeaponManager from '../managers/WeaponManager';
import ItemManager from '../managers/ItemManager';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey, baseSpeed = 200, maxHp = 100) {
    super(scene, x, y, textureKey); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.baseScale = 0.125;
    this.setScale(this.baseScale);
    this.setCollideWorldBounds(true);
    
    this.baseSpeed = baseSpeed;
    this.baseMaxHp = maxHp;
    this.currentSpeed = baseSpeed;
    this.maxHp = maxHp;
    this.hp = maxHp;
    
    // --- PROGRESSION & LOOT ---
    this.xp = 0;
    this.xpToNextLevel = 50;
    this.level = 1;
    this.coins = 0; // Ready for the LootManager

    // --- INVINCIBILITY & DASH STATE ---
    this.damageInvincible = false;
    this.isDashing = false;
    this.dashReady = true;
    this.dashVelocity = new Phaser.Math.Vector2(0, 0);

    // --- INVENTORY MANAGERS ---
    this.weaponManager = new WeaponManager(scene, this);
    this.itemManager = new ItemManager();
    
    this.orbitAngle = 0;
    this.orbitals = [];

    // --- INPUTS ---
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D,
      z: Phaser.Input.Keyboard.KeyCodes.Z, q: Phaser.Input.Keyboard.KeyCodes.Q
    });
    this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.isManualAim = false;
    this.currentAimAngle = 0;
    
    this.laserGraphic = scene.add.graphics();
    this.laserGraphic.setDepth(10); 
    
    this.reticle = scene.add.graphics();
    this.reticle.lineStyle(1, 0x8b0000, 0.8);
    this.reticle.strokeCircle(0, 0, 8);
    this.reticle.fillStyle(0xff1a1a, 1);      
    this.reticle.fillCircle(0, 0, 2);
    this.reticle.setDepth(100);               
    this.reticle.setVisible(false);           

    scene.input.on('pointerdown', (pointer) => {
      if (pointer.button === 0) {
        this.isManualAim = !this.isManualAim;
        this.reticle.setVisible(this.isManualAim);
      }
    });

    this.recalculateStats();
  }

  addOrUpgradeItem(itemId) {
    this.itemManager.addOrUpgradeItem(itemId);
    this.recalculateStats();
    this.updateUIInventory();
  }

  addOrUpgradeWeapon(weaponId) {
    this.weaponManager.addOrUpgradeWeapon(weaponId);
    this.updateUIInventory();
  }

  updateUIInventory() {
    if (this.scene && this.scene.scene.get('UIScene')) {
      const cleanWeapons = this.weaponManager.getCleanWeaponData();
      const cleanItems = this.itemManager.getCleanItemData();
      this.scene.scene.get('UIScene').updateInventory(cleanWeapons, cleanItems);
      this.scene.scene.get('UIScene').updateHP(this.hp, this.maxHp);
    }
  }

  recalculateStats() {
    const stats = this.itemManager.getStatMultipliers();

    this.damageMult = stats.damageMult;
    this.cooldownMult = stats.cooldownMult;
    this.pickupMult = stats.pickupMult;
    this.xpMult = stats.xpMult;
    this.lifesteal = stats.lifesteal;
    this.hpDrainPerSec = stats.hpDrainPerSec;
    this.armor = stats.armor;
    this.curseMult = stats.curseMult;
    this.coinMult = stats.coinMult;

    this.currentSpeed = this.baseSpeed * stats.speedMult;
    
    const oldMaxHp = this.maxHp;
    this.maxHp = Math.floor(this.baseMaxHp * stats.hpMult);
    
    if (this.maxHp > oldMaxHp) this.hp += (this.maxHp - oldMaxHp);
    if (this.hp > this.maxHp) this.hp = this.maxHp; 
  }

  updateAimTarget(enemiesGroup) {
    if (this.isManualAim) {
      const pointer = this.scene.input.activePointer;
      this.currentAimAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    } else {
      if (enemiesGroup && enemiesGroup.getChildren().length > 0) {
        const closestEnemy = this.scene.physics.closest(this, enemiesGroup.getChildren());
        if (closestEnemy && closestEnemy.active) {
          this.currentAimAngle = Phaser.Math.Angle.Between(this.x, this.y, closestEnemy.x, closestEnemy.y);
        } else {
          this.currentAimAngle = this.flipX ? 0 : Math.PI;
        }
      } else {
        this.currentAimAngle = this.flipX ? 0 : Math.PI;
      }
    }
  }

  takeDamage(amount, scene) {
    // I-Frames from either taking damage or currently dashing
    if (this.damageInvincible || this.isDashing) return; 
    
    const finalDamage = Math.max(1, amount - this.armor);
    
    this.hp -= finalDamage;
    this.damageInvincible = true;
    this.setTint(0xff0000);
    
    scene.time.delayedCall(1000, () => {
      this.damageInvincible = false;
      this.clearTint();
    });
  }
  
  gainXP(amount) {
    this.xp += (amount * this.xpMult);
    if (this.scene && this.scene.scene.get('UIScene')) {
      this.scene.scene.get('UIScene').updateXP(this.xp, this.xpToNextLevel, this.level);
    }

    if (this.xp >= this.xpToNextLevel) {
      this.level++;
      this.xp -= this.xpToNextLevel;
      this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5); 
      
      const healAmount = this.maxHp * 0.2;
      this.hp = Math.min(this.maxHp, this.hp + healAmount); 
      
      if (this.scene && this.scene.scene.get('UIScene')) {
        this.scene.scene.get('UIScene').updateHP(this.hp, this.maxHp);
        this.scene.scene.get('UIScene').updateXP(this.xp, this.xpToNextLevel, this.level);
        this.scene.scene.get('UIScene').updateLevelText(this.level);
      }

      this.scene.scene.pause('MainScene');
      
      const cleanWeapons = this.weaponManager.getCleanWeaponData();
      const cleanItems = this.itemManager.getCleanItemData();
      
      window.dispatchEvent(new CustomEvent('VS_LEVEL_UP', {
        detail: { level: this.level, weapons: cleanWeapons, items: cleanItems }
      }));
    }
  }

  // Hook for the future LootManager
  collectCoin(amount) {
    this.coins += Math.floor(amount * this.coinMult);
    // UI Event to be wired up later
    window.dispatchEvent(new CustomEvent('VS_UPDATE_COINS', { detail: { coins: this.coins } }));
  }

  startDash(moveX, moveY) {
    this.isDashing = true;
    this.dashReady = false;

    // If no directional input, dash in the direction the character is facing
    if (moveX === 0 && moveY === 0) {
      moveX = this.flipX ? 1 : -1;
    }

    // Dash speed is 3.5x normal speed
    const dashVector = new Phaser.Math.Vector2(moveX, moveY).normalize();
    this.dashVelocity.x = dashVector.x * (this.currentSpeed * 3.5);
    this.dashVelocity.y = dashVector.y * (this.currentSpeed * 3.5);

    // Ghost trail visual effect
    this.scene.time.addEvent({
      delay: 40,
      callback: () => {
        if(!this.active) return;
        const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key);
        ghost.setScale(this.scaleX, this.scaleY);
        ghost.setFlipX(this.flipX);
        ghost.setTint(0x88ffff);
        ghost.setAlpha(0.6);
        this.scene.tweens.add({
          targets: ghost, alpha: 0, duration: 300, onComplete: () => ghost.destroy()
        });
      },
      repeat: 4 
    });

    // End Dash after 200ms
    this.scene.time.delayedCall(200, () => {
      this.isDashing = false;
    });

    // Reset Dash cooldown after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      this.dashReady = true;
      // Brief white flash to indicate the dash is ready again
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(100, () => this.clearTint());
    });
  }

  update(time, enemiesGroup) {
    if (this.hp <= 0) return;

    const delta = this.scene.game.loop.delta;
    
    if (this.hpDrainPerSec > 0 && this.hp > 1) {
      this.hp -= (this.hpDrainPerSec * (delta / 1000));
      if (this.hp < 1) this.hp = 1; 
      if (time % 500 < 20 && this.scene.scene.isActive('UIScene')) {
        this.scene.scene.get('UIScene').updateHP(this.hp, this.maxHp);
      }
    }

    // --- DASH MOVEMENT OVERRIDE ---
    if (this.isDashing) {
      this.setVelocity(this.dashVelocity.x, this.dashVelocity.y);
      // Skip normal movement/aiming while locked in a dash
      return; 
    }

    // --- NORMAL MOVEMENT ---
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown || this.wasd.q.isDown) moveX = -1;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) moveX = 1;

    if (this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.z.isDown) moveY = -1;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) moveY = 1;

    // Trigger Dash
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.dashReady) {
      this.startDash(moveX, moveY);
      return;
    }

    this.setVelocity(moveX * this.currentSpeed, moveY * this.currentSpeed);

    if (moveX !== 0 && moveY !== 0) {
      this.body.velocity.normalize().scale(this.currentSpeed);
    }

    const isMoving = moveX !== 0 || moveY !== 0;

    if (this.hasAnimations) {
      if (isMoving) {
        this.setFlipX(false);
        this.setScale(this.baseScale); 
        if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
          if (this.body.velocity.x > 0) this.anims.play(`${this.animPrefix}_east`, true);
          else this.anims.play(`${this.animPrefix}_west`, true);
        } else {
          if (this.body.velocity.y > 0) this.anims.play(`${this.animPrefix}_south`, true);
          else this.anims.play(`${this.animPrefix}_north`, true);
        }
      } else {
        this.anims.stop();
      }
    } else {
      if (isMoving) {
        if (this.body.velocity.x > 0) this.setFlipX(true);  
        else if (this.body.velocity.x < 0) this.setFlipX(false); 
        this.setAngle(Math.sin(time / 80) * 15);
        this.setScale(this.baseScale, this.baseScale + (Math.abs(Math.sin(time / 80)) * 0.0015));
      } else {
        this.setAngle(0);
        this.setScale(this.baseScale);
      }
    }

    this.updateAimTarget(enemiesGroup);

    const pointer = this.scene.input.activePointer;
    this.laserGraphic.clear(); 
    
    if (this.isManualAim) {
      this.reticle.setPosition(pointer.worldX, pointer.worldY);
      this.laserGraphic.lineStyle(1, 0x8b0000, 0.25); 
      this.laserGraphic.beginPath();
      this.laserGraphic.moveTo(this.x, this.y);
      this.laserGraphic.lineTo(pointer.worldX, pointer.worldY);
      this.laserGraphic.strokePath();
    }

    this.weaponManager.update(time, enemiesGroup);
  }
}