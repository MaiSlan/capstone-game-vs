import Phaser from 'phaser';

export default class BaseMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animPrefix, stats, config = {}) {
    super(scene, x, y, texture); 
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // The prefix used to dynamically build animation keys (e.g., 'slime', 'vampire')
    this.animPrefix = animPrefix;

    // --- CORE STATS ---
    this.hp = stats.hp;
    this.baseSpeed = stats.speed;
    this.currentSpeed = stats.speed;
    this.xpValue = stats.xp;
    this.attackDistance = config.attackDistance; 
    this.attackSpeedCooldown = config.attackSpeedCooldown;

    // --- STATE FLAGS ---
    this.deadTriggered = false; 
    this.isDying = false; 
    this.isAttacking = false;
    this.isHurt = false; 
    
    this.attackCooldown = 0;
    this.currentDirection = 'down';

    // --- STATUS EFFECT FLAGS ---
    this.isKnockedBack = false;
    this.knockbackRecoverTime = 0;
    this.hasShatterCurse = false;
    
    this.isSlowed = false;
    this.slowRecoverTime = 0;

    // Play the default idle/walk animation
    this.play(`${this.animPrefix}_walk_down`, true);
  }

  update(time) {
    // 1. HARD LOCKS: Do not process anything if dead or dying
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isDying) return;

    // 2. STATUS EFFECT: KNOCKBACK
    // If the monster is being violently pushed, DO NOT run the walking AI. 
    // Let the physics engine carry their momentum.
    if (this.isKnockedBack) {
      if (time < this.knockbackRecoverTime) {
        
        // Dragon Shout Level 5: The Shatter Curse
        // If they are knocked back and hit a world boundary, instant death
        if (this.hasShatterCurse && !this.body.blocked.none) {
          this.hp = 0; // The MainScene will catch this and trigger the death sequence
        }
        return; // Exit the update loop so they keep flying backwards!

      } else {
        // Knockback duration ended. Clean up flags.
        this.isKnockedBack = false;
        this.hasShatterCurse = false;
        this.clearTint();
      }
    }

    // 3. ANIMATION LOCKS: Stop moving if attacking or in hit-stun
    if (this.isAttacking || this.isHurt) {
      this.setVelocity(0); 
      return;
    }

    // 4. STATUS EFFECT: SLOW (Surtur's Wake)
    if (this.isSlowed) {
      if (time < this.slowRecoverTime) {
        this.currentSpeed = this.baseSpeed * 0.5; // 50% movement reduction
      } else {
        this.isSlowed = false;
        this.currentSpeed = this.baseSpeed;
        this.clearTint();
      }
    }

    // 5. NORMAL AI: Movement and Targeting
    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y);

    if (distance <= this.attackDistance) {
      this.setVelocity(0);
      this.triggerAttack(time);
    } else {
      this.scene.physics.moveToObject(this, targetPlayer, this.currentSpeed);
      this.updateWalkAnimation();
    }
  }

  updateWalkAnimation() {
    const velX = this.body.velocity.x;
    const velY = this.body.velocity.y;

    // Pick the dominant axis of movement to determine which way the sprite faces
    if (Math.abs(velX) > Math.abs(velY)) {
      if (velX > 0) {
        this.play(`${this.animPrefix}_walk_right`, true);
        this.currentDirection = 'right';
      } else {
        this.play(`${this.animPrefix}_walk_left`, true);
        this.currentDirection = 'left';
      }
    } else {
      if (velY > 0) {
        this.play(`${this.animPrefix}_walk_down`, true);
        this.currentDirection = 'down';
      } else {
        this.play(`${this.animPrefix}_walk_up`, true);
        this.currentDirection = 'up';
      }
    }
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;

    this.isAttacking = true;
    this.setVelocity(0); 
    
    // Dynamically call the correct attack animation for this specific monster type
    this.play(`${this.animPrefix}_attack_${this.currentDirection}`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key.includes('attack') && !this.deadTriggered && !this.isHurt) {
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown; 
      }
    });
  }

  hurt() {
    if (this.deadTriggered || this.isDying) return;

    this.isHurt = true;
    this.isAttacking = false; 
    
    // ONLY stop their velocity if they aren't currently flying through the air from a knockback!
    if (!this.isKnockedBack) {
      this.setVelocity(0);
    }

    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
    this.play(`${this.animPrefix}_hurt_${this.currentDirection}`, true);

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
    this.play(`${this.animPrefix}_death`, true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
      if (animation.key.includes('death')) {
        this.destroy();
      }
    });
  }
}