import Phaser from 'phaser';
import { MONSTER_DB } from '../../../data/MonsterDB';

export default class SlimeMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime_walk'); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const stats = MONSTER_DB.slime || { hp: 40, speed: 50, damage: 10, xp: 5 };
    this.hp = stats.hp;
    this.baseSpeed = stats.speed;
    this.xpValue = stats.xp;
    
    this.setScale(2.5);
    this.body.setSize(30, 30);
    this.body.setOffset(17, 17); 
    
    // --- STATE HIERARCHY FLAGS ---
    this.deadTriggered = false; 
    this.isDying = false; 
    this.isAttacking = false;
    this.isHurt = false; // NEW: Tracks the Hit Stun state
    
    this.attackCooldown = 0;
    this.currentDirection = 'down';

    this.play('slime_walk_down', true);
  }

  update(time) {
    // STATE CHECK: Do not process walking if locked in a higher-priority animation
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isAttacking || this.isHurt) {
      if (this.isAttacking || this.isHurt) this.setVelocity(0); // Lock feet
      return;
    }

    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    // --- THE SPACING FIX ---
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);

    // Increased to 65 to ensure they stop cleanly outside the player's sprite
    if (distance <= 65) {
      this.setVelocity(0);
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed);

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
    if (this.deadTriggered || this.isAttacking || this.isHurt || time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); 
    
    this.play(`slime_attack_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      // Only unlock if the attack finished normally
      if (animation.key.includes('attack') && !this.deadTriggered && !this.isHurt) {
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + 1000; 
      }
    });
  }

  // --- NEW: THE HURT METHOD (HIT STUN) ---
  hurt() {
    // Never interrupt a death sequence
    if (this.deadTriggered || this.isDying) return;

    // Interrupt walking and attacking
    this.isHurt = true;
    this.isAttacking = false; 
    this.setVelocity(0);

    // Purge previous animation listeners so they don't fire incorrectly
    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);

    // Play the flinch animation
    this.play(`slime_hurt_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key.includes('hurt') && !this.deadTriggered) {
        this.isHurt = false; // Allow them to walk/attack again
      }
    });
  }

  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    
    this.setVelocity(0);
    this.body.enable = false; 
    this.clearTint();

    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);

    this.play('slime_death', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key === 'slime_death') {
        this.destroy();
      }
    });
  }
}