import AxeCleave from '../weapons/AxeCleave';
import MagicMissile from '../weapons/MagicMissile';
import PiercingLance from '../weapons/PiercingLance';
import SwirlingBook from '../weapons/SwirlingBook';
import { ITEM_DB } from '../../data/ItemDB';
import Phaser from 'phaser';

const WEAPON_REGISTRY = {
  'cleave_axe': AxeCleave,
  'magic_orb': MagicMissile,
  'lance': PiercingLance,
  'magic_book': SwirlingBook
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // We added textureKey and baseSpeed as arguments
  constructor(scene, x, y, textureKey, baseSpeed = 200, maxHp = 100) {
    super(scene, x, y, textureKey); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.baseScale = 0.125;
    this.setScale(this.baseScale);
    this.setCollideWorldBounds(true);
    
    // Set the injected stats
    this.baseSpeed = baseSpeed;
    this.baseMaxHp = maxHp;
    this.currentSpeed = baseSpeed;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.xp = 0;
    this.xpToNextLevel = 50;
    this.level = 1;
    this.isInvincible = false;
    // ----------------------

    // --- INVENTORY TRACKING ---
    this.weapons = []; // Array of { id: 'weapon_name', level: 1 }
    this.items = [];   // Array of { id: 'item_name', level: 1 }
    this.maxWeapons = 5;
    this.maxItems = 5;
    this.weaponCooldowns = {
      lance: 0
    };
    this.orbitAngle = 0;
    this.orbitals = [];
    // -------------------------------

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // --- TARGETING SYSTEM ---
    this.isManualAim = false;
    this.currentAimAngle = 0;

    // 1. The Ghostly Targeting Laser
    this.laserGraphic = scene.add.graphics();
    this.laserGraphic.setDepth(10); // Sits on the floor, under entities

    // 2. The Qliphoth Reticle (Custom Cursor)
    this.reticle = scene.add.graphics();
    this.reticle.lineStyle(1, 0x8b0000, 0.8); // Dark blood red outer ring
    this.reticle.strokeCircle(0, 0, 8);
    this.reticle.fillStyle(0xff1a1a, 1);      // Bright glowing center
    this.reticle.fillCircle(0, 0, 2);
    this.reticle.setDepth(100);               // Floats above everything
    this.reticle.setVisible(false);           // Hidden by default

    // Listen for a left-click to toggle the aim mode
    scene.input.on('pointerdown', (pointer) => {
      if (pointer.button === 0) {
        this.isManualAim = !this.isManualAim;
        
        // Toggle the reticle visibility instantly
        this.reticle.setVisible(this.isManualAim);
      }
    });
  }

  addOrUpgradeItem(itemId) {
    const existingItem = this.items.find(i => i.id === itemId);
    
    if (existingItem) {
      const maxLvl = ITEM_DB[itemId].maxLevel;
      if (existingItem.level < maxLvl) {
        existingItem.level++;
      }
    } else if (this.items.length < this.maxItems) {
      this.items.push({ id: itemId, level: 1 });
    }

    this.recalculateStats();

    // Update the UI
    if (this.scene && this.scene.scene.get('UIScene')) {
      const cleanWeapons = this.weapons.map(w => ({ id: w.id, level: w.level }));
      const cleanItems = this.items.map(i => ({ id: i.id, level: i.level }));
      this.scene.scene.get('UIScene').updateInventory(cleanWeapons, cleanItems);
      this.scene.scene.get('UIScene').updateHP(this.hp, this.maxHp); // Update HP bar just in case
    }
  }

  addOrUpgradeWeapon(weaponId) {
    const existingWeapon = this.weapons.find(w => w.id === weaponId);
    
    if (existingWeapon) {
      if (existingWeapon.level < 5) existingWeapon.level++;
    } else if (this.weapons.length < this.maxWeapons) {
      const WeaponClass = WEAPON_REGISTRY[weaponId];
      this.weapons.push({ 
        id: weaponId, 
        level: 1,
        instance: new WeaponClass(this.scene) 
      });
    }

    if (this.scene && this.scene.scene.get('UIScene')) {
      // --- THE FIX: Clean the arrays for the UI Scene ---
      const cleanWeapons = this.weapons.map(w => ({ id: w.id, level: w.level }));
      const cleanItems = this.items.map(i => ({ id: i.id, level: i.level }));
      this.scene.scene.get('UIScene').updateInventory(cleanWeapons, cleanItems);
    }
  }

  recalculateStats() {
    // 1. Start with flat 100% multipliers
    let speedMult = 1.0;
    let hpMult = 1.0;
    
    // Add variables for future flat stats (like armor or damage reduction)
    let flatArmor = 0; 

    // 2. Loop through equipped items and stack the multipliers
    this.items.forEach(item => {
      const itemData = ITEM_DB[item.id];
      if (!itemData) return;

      const levelIndex = item.level - 1; // Level 1 is array index 0

      if (itemData.speed_multiplier) speedMult += itemData.speed_multiplier[levelIndex];
      if (itemData.max_hp_multiplier) hpMult += itemData.max_hp_multiplier[levelIndex];
    });

    // 3. Apply the math to the current active stats
    this.currentSpeed = this.baseSpeed * speedMult;

    // 4. Handle HP carefully so we don't accidentally kill the player or rob them of health
    const oldMaxHp = this.maxHp;
    this.maxHp = Math.floor(this.baseMaxHp * hpMult);

    if (this.maxHp > oldMaxHp) {
      // If their Max HP just expanded, give them the new health instantly
      this.hp += (this.maxHp - oldMaxHp);
    }
  }

  updateAimTarget(enemiesGroup) {
    if (this.isManualAim) {
      // --- MOUSE AIM ---
      // Crucial: Use worldX/worldY so it accurately tracks across the camera
      const pointer = this.scene.input.activePointer;
      this.currentAimAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    } else {
      // --- AUTO AIM ---
      if (enemiesGroup && enemiesGroup.getChildren().length > 0) {
        const closestEnemy = this.scene.physics.closest(this, enemiesGroup.getChildren());
        if (closestEnemy && closestEnemy.active) {
          this.currentAimAngle = Phaser.Math.Angle.Between(this.x, this.y, closestEnemy.x, closestEnemy.y);
        } else {
          // Fallback: If no enemies, aim in the direction we are facing
          this.currentAimAngle = this.flipX ? 0 : Math.PI;
        }
      } else {
        this.currentAimAngle = this.flipX ? 0 : Math.PI;
      }
    }
  }

  takeDamage(amount, scene) {
    if (this.isInvincible) return; // Ignore damage if in I-Frames
    
    this.hp -= amount;
    this.isInvincible = true;
    
    // Flash red
    this.setTint(0xff0000);
    
    // 1-second invincibility cooldown
    scene.time.delayedCall(1000, () => {
      this.isInvincible = false;
      this.clearTint();
    });
  }
  
  gainXP(amount) {
    this.xp += amount;
    
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
      
      // Clean the arrays before sending them across the React bridge
      const cleanWeapons = this.weapons.map(w => ({ id: w.id, level: w.level }));
      const cleanItems = this.items.map(i => ({ id: i.id, level: i.level }));
      
      window.dispatchEvent(new CustomEvent('VS_LEVEL_UP', {
        detail: { 
          level: this.level,
          weapons: cleanWeapons, 
          items: cleanItems      
        }
      }));
    }
  }

  update(time, enemiesGroup) {
    if (this.hp <= 0) return;
    this.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.setVelocityX(-this.currentSpeed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.setVelocityX(this.currentSpeed);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.setVelocityY(-this.currentSpeed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.setVelocityY(this.currentSpeed);
    }

    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.normalize().scale(this.currentSpeed);
    }

    const isMoving = this.body.velocity.x !== 0 || this.body.velocity.y !== 0;

    if (isMoving) {
      if (this.body.velocity.x > 0) {
        this.setFlipX(true);  
      } else if (this.body.velocity.x < 0) {
        this.setFlipX(false); 
      }
      this.setAngle(Math.sin(time / 80) * 15);
      this.setScale(this.baseScale, this.baseScale + (Math.abs(Math.sin(time / 80)) * 0.0015));
    } else {
      this.setAngle(0);
      this.setScale(this.baseScale);
    }
    // Calculate aim BEFORE processing weapons
    this.updateAimTarget(enemiesGroup);

    // --- VISUAL AIMING UPDATE ---
    const pointer = this.scene.input.activePointer;
    
    // Clear the previous frame's laser
    this.laserGraphic.clear(); 

    if (this.isManualAim) {
      // Snap the reticle to the mouse position
      this.reticle.setPosition(pointer.worldX, pointer.worldY);
      
      // Draw the faint red laser from the player to the cursor
      this.laserGraphic.lineStyle(1, 0x8b0000, 0.25); // 25% opacity
      this.laserGraphic.beginPath();
      this.laserGraphic.moveTo(this.x, this.y);
      this.laserGraphic.lineTo(pointer.worldX, pointer.worldY);
      this.laserGraphic.strokePath();
    }
    // -----------------------------

    // Loop through every equipped weapon and fire it
    this.weapons.forEach(weapon => {
      weapon.instance.update(time, this, enemiesGroup);
    });
  }
}