import Phaser from 'phaser';

export default class Template extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'template_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Core Stats
    this.hp = 100;
    this.maxHp = 100;
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 100;
    this.speed = 160;
    
    // Physics Hitbox
    this.body.setSize(24, 32);
    this.body.setOffset(20, 20);
    this.setCollideWorldBounds(true);

    this.currentDirection = 'down';
    this.isDead = false;
    this.isHurt = false;

    // Controls
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.play('template_idle_down', true);
  }

  update(time, enemies) {
    if (this.isDead || this.isHurt) return;

    let velocityX = 0;
    let velocityY = 0;

    // Movement Input
    if (this.cursors.left.isDown || this.wasd.left.isDown) velocityX = -this.speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) velocityX = this.speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) velocityY = -this.speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) velocityY = this.speed;

    // Normalize diagonal speed
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.7071;
      velocityY *= 0.7071;
    }

    this.setVelocity(velocityX, velocityY);

    // Determine Direction
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      this.currentDirection = velocityX > 0 ? 'right' : 'left';
    } else if (velocityY !== 0) {
      this.currentDirection = velocityY > 0 ? 'down' : 'up';
    }

    // --- ANIMATION STATE MACHINE ---
    if (velocityX === 0 && velocityY === 0) {
      this.play(`template_idle_${this.currentDirection}`, true);
    } else {
      this.play(`template_walk_${this.currentDirection}`, true);
    }
  }

  takeDamage(amount, scene) {
    if (this.isDead) return;
    
    this.hp -= amount;
    
    // Play Hurt Animation
    if (!this.isHurt && this.hp > 0) {
      this.isHurt = true;
      this.setVelocity(0);
      this.play(`template_hurt_${this.currentDirection}`, true);
      
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
        if (animation.key.includes('hurt')) this.isHurt = false;
      });
    }

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0);
    this.body.enable = false;
    this.play('template_death', true);
  }

  gainXP(amount) {
    this.xp += amount;
    if (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
      window.dispatchEvent(new CustomEvent('VS_LEVEL_UP'));
    }
  }
}