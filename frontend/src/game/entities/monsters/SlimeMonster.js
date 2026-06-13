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
    if (stats.scale) this.setScale(stats.scale);
    
    // Shrink hitbox so the 64x64 frame has a tight physical core
    this.body.setSize(24, 24);
    this.body.setOffset(20, 20); 
    
    this.isDying = false;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.currentDirection = 'down';
  }

  update(time) {
    if (!this.active || this.hp <= 0 || this.isDying || this.isAttacking) {
        if (this.isAttacking) this.setVelocity(0);
        return;
    }

    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed);

    // --- 4-DIRECTIONAL ANIMATION LOGIC ---
    // Only update the animation if we aren't currently playing an attack animation
    if (!this.anims.isPlaying || !this.anims.currentAnim.key.includes('attack')) {
      
      const velX = this.body.velocity.x;
      const velY = this.body.velocity.y;

      // Determine the dominant axis of movement to pick the correct animation
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
    
    if (this.isDying || this.isAttacking || time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); 
    
    this.play(`slime_attack_${this.currentDirection}`, true);

    // Wait for the attack to finish
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      // Safety check: Only resume walking if we didn't die during the attack!
      if (!this.isDying) {
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + 1000; 
      }
    });
  }

  die() {
    if (this.isDying) return;
    this.isDying = true;
    
    this.setVelocity(0);
    this.body.enable = false; 
    this.clearTint();

    // --- THE FIX: Wipe out any lingering "attack" listeners ---
    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);

    this.play('slime_death');

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}