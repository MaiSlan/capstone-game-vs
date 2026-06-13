import Phaser from 'phaser';
import { MONSTER_DB } from '../../../data/MonsterDB';

export default class SlimeMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime_walk'); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const stats = MONSTER_DB.slime;
    this.hp = stats.hp;
    this.baseSpeed = stats.speed;
    this.xpValue = stats.xp;
    
    // --- 1. THE SCALE FIX ---
    // We force the scale directly on the sprite here. 2.5x makes them massive.
    this.setScale(2.5);
    
    // Since the sprite is massive, we must adjust the physics box to match.
    // This gives them a nice, fat hitbox so your weapons hit them easily.
    this.body.setSize(30, 30);
    this.body.setOffset(17, 17); 
    
    // --- STATE FLAGS ---
    this.deadTriggered = false; // This custom flag bulletproofs the death animation
    this.isDying = false; 
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.currentDirection = 'down';

    this.play('slime_walk_down', true);
  }

  update(time) {
    // If it's dead, dying, or currently locked in an attack animation, don't move!
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isAttacking) {
      if (this.isAttacking) this.setVelocity(0);
      return;
    }

    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    // --- 2. THE ATTACK RANGE FIX ---
    // Calculate exact pixels between the center of the slime and the player
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);

    // If within 45 pixels, they stop walking to attack. 
    // This prevents them from walking directly into the center of the Viking!
    if (distance <= 45) {
      this.setVelocity(0);
      this.attack();
    } else {
      // If further than 45 pixels, keep chasing
      this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed);

      // 4-Directional Walk Animation
      const velX = this.body.velocity.x;
      const velY = this.body.velocity.y;

      if (Math.abs(velX) > Math.abs(velY)) {
        if (velX > 0) {
          this.play('slime_walk_right', true);
          this.currentDirection = 'right';
        } else {
          this.play('slime_walk_left', true);
          this.currentDirection = 'left';
        }
      } else {
        if (velY > 0) {
          this.play('slime_walk_down', true);
          this.currentDirection = 'down';
        } else {
          this.play('slime_walk_up', true);
          this.currentDirection = 'up';
        }
      }
    }
  }

  attack() {
    const time = this.scene.time.now;
    if (this.deadTriggered || this.isAttacking || time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); // Lock feet during attack
    
    this.play(`slime_attack_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      // Only unlock walking if the attack finishes AND we didn't get killed during it
      if (animation.key.includes('attack') && !this.deadTriggered) {
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + 1000; 
      }
    });
  }

  die() {
    // --- 3. THE DEATH FIX ---
    // By using 'deadTriggered', we ignore whatever MainScene tries to tell us.
    // If we are already running the death logic, abort.
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    
    this.setVelocity(0);
    this.body.enable = false; // Turn off physics entirely
    this.clearTint();

    // Kill any lingering attack listeners so they don't override the death
    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);

    // Force the death puddle animation to play
    this.play('slime_death', true);

    // Completely erase the object from the game only when the puddle finishes
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key === 'slime_death') {
        this.destroy();
      }
    });
  }
}