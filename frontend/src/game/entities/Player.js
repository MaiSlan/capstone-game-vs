import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // We added textureKey and baseSpeed as arguments
  constructor(scene, x, y, textureKey, baseSpeed = 200) {
    super(scene, x, y, textureKey); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.baseScale = 0.125;
    this.setScale(this.baseScale);
    this.setCollideWorldBounds(true);
    this.baseSpeed = baseSpeed;

    // --- NEW: RPG STATS ---
    this.maxHp = 100;
    this.hp = 100;
    this.xp = 0;
    this.xpToNextLevel = 50;
    this.level = 1;
    this.isInvincible = false;
    // ----------------------

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
    });
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
    if (this.xp >= this.xpToNextLevel) {
      this.level++;
      this.xp -= this.xpToNextLevel;
      this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5); 
      
      // Nerf: Only heal 20% of max HP, capped at maxHp
      const healAmount = this.maxHp * 0.2;
      this.hp = Math.min(this.maxHp, this.hp + healAmount); 
      
      // Force the UI to update the red health bar immediately to show the small heal
      if (this.scene && this.scene.scene.get('UIScene')) {
        this.scene.scene.get('UIScene').updateHP(this.hp, this.maxHp);
      }
    }
  }

  update(time) {
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
  }
}