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
    
    // Shrink hitbox so the 64x64 frame has a tight physical core
    this.body.setSize(24, 24);
    this.body.setOffset(20, 20); 
    
    this.isDying = false;
    this.currentDirection = 'down'; // Track facing direction for attacks later
  }

  update(time) {
    if (!this.active || this.hp <= 0 || this.isDying) return;

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

  die() {
    if (this.isDying) return;
    this.isDying = true;
    
    this.setVelocity(0);
    this.body.enable = false; 

    // Play the unified death animation
    this.play('slime_death');

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
    });
  }
}