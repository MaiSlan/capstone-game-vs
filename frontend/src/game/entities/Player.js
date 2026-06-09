import AxeCleave from '../weapons/AxeCleave';
import MagicMissile from '../weapons/MagicMissile';
import PiercingLance from '../weapons/PiercingLance';
import SwirlingBook from '../weapons/SwirlingBook';

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

    this.isManualAim = false;
    this.currentAimAngle = 0; // Stored in radians

    // Listen for a left-click to toggle the aim mode
    scene.input.on('pointerdown', (pointer) => {
      // Only toggle on left click (button 0)
      if (pointer.button === 0) {
        this.isManualAim = !this.isManualAim;
        // Optional: We can add a UI notification here later
        console.log("Manual Aim:", this.isManualAim); 
      }
    });
  }

  addOrUpgradeItem(itemId) {
    const existingItem = this.items.find(i => i.id === itemId);
    
    if (existingItem) {
      if (existingItem.level < 5) {
        existingItem.level++;
        // Apply stacking buffs for upgrades
        if (itemId === 'speed_boots') this.baseSpeed += 10;
        if (itemId === 'vitality_ring') { this.maxHp += 10; this.hp += 10; }
      }
    } else if (this.items.length < this.maxItems) {
      this.items.push({ id: itemId, level: 1 });
      // Apply initial buff
      if (itemId === 'speed_boots') this.baseSpeed += 20;
      if (itemId === 'vitality_ring') { this.maxHp += 25; this.hp += 25; }
    }

    // Tell UI to redraw with BOTH arrays
    if (this.scene && this.scene.scene.get('UIScene')) {
      this.scene.scene.get('UIScene').updateInventory(this.weapons, this.items);
    }
  }

  addOrUpgradeWeapon(weaponId) {
    const existingWeapon = this.weapons.find(w => w.id === weaponId);
    
    if (existingWeapon) {
      if (existingWeapon.level < 5) existingWeapon.level++;
    } else if (this.weapons.length < this.maxWeapons) {
      // NEW: We store the visual UI data AND the live weapon instance together
      const WeaponClass = WEAPON_REGISTRY[weaponId];
      this.weapons.push({ 
        id: weaponId, 
        level: 1,
        instance: new WeaponClass(this.scene) // Instantiate the specific weapon logic
      });
    }

    if (this.scene && this.scene.scene.get('UIScene')) {
      this.scene.scene.get('UIScene').updateInventory(this.weapons, this.items);
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
        
        // --- NEW: Update Level UI ---
        this.scene.scene.get('UIScene').updateLevelText(this.level);
      }

      this.scene.scene.pause('MainScene');
      
      // Pass the inventory to React so the Level-Up screen knows what we already have!
      window.dispatchEvent(new CustomEvent('VS_LEVEL_UP', {
        detail: { 
          level: this.level,
          currentWeapons: this.weapons,
          currentItems: this.items
        }
      }));
    }
  }

  update(time, enemiesGroup) {
    if (this.hp <= 0) return;
    this.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.setVelocityX(-this.baseSpeed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.setVelocityX(this.baseSpeed);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.setVelocityY(-this.baseSpeed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.setVelocityY(this.baseSpeed);
    }

    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.normalize().scale(this.baseSpeed);
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
    this.updateAimTarget(enemiesGroup);
    this.weapons.forEach(weapon => {
      weapon.instance.update(time, this, enemiesGroup);
    });
  }
}