import Phaser from 'phaser';
import { MONSTER_DB } from '../../../data/MonsterDB';

export default class VampireMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'vampire_walk'); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    const stats = MONSTER_DB.vampire;
    this.hp = stats.hp;
    this.baseSpeed = stats.speed;
    this.xpValue = stats.xp;
    
    this.setScale(stats.scale || 1.8);
    // Tight, humanoid hitbox
    this.body.setSize(20, 30);
    this.body.setOffset(22, 17); 
    
    // STATE FLAGS
    this.deadTriggered = false; 
    this.isDying = false; 
    this.isAttacking = false;
    this.isHurt = false;
    
    this.attackCooldown = 0;
    this.currentDirection = 'down';

    this.play('vampire_walk_down', true);
  }

  update(time) {
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isAttacking || this.isHurt) {
      if (this.isAttacking || this.isHurt) this.setVelocity(0);
      return;
    }

    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);

    // Stays slightly further back than the slime
    if (distance <= 55) {
      this.setVelocity(0);
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed);

      const velX = this.body.velocity.x;
      const velY = this.body.velocity.y;

      if (Math.abs(velX) > Math.abs(velY)) {
        if (velX > 0) {
          this.play('vampire_walk_right', true);
          this.currentDirection = 'right';
        } else {
          this.play('vampire_walk_left', true);
          this.currentDirection = 'left';
        }
      } else {
        if (velY > 0) {
          this.play('vampire_walk_down', true);
          this.currentDirection = 'down';
        } else {
          this.play('vampire_walk_up', true);
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
    
    this.play(`vampire_attack_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key.includes('attack') && !this.deadTriggered && !this.isHurt) {
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + 800; // Attacks slightly faster than the slime
      }
    });
  }

  hurt() {
    if (this.deadTriggered || this.isDying) return;

    this.isHurt = true;
    this.isAttacking = false; 
    this.setVelocity(0);

    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
    this.play(`vampire_hurt_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key.includes('hurt') && !this.deadTriggered) {
        this.isHurt = false; 
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
    this.play('vampire_death', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key === 'vampire_death') {
        this.destroy();
      }
    });
  }
}