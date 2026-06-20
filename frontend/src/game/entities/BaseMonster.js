import Phaser from 'phaser';

export default class BaseMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animPrefix, dbStats, multiplier = 1, config = {}) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.animPrefix = animPrefix;
    this.hasAnimations = config.hasAnimations !== false; // Default to true unless explicitly disabled

    // =========================
    // Base Stats (scaled)
    // =========================

    // Scale HP and damage with the world multiplier
    this.maxHp = Math.floor(dbStats.baseHp * multiplier);
    this.hp = this.maxHp;
    this.damage = Math.floor(dbStats.baseDamage * multiplier);

    // Speed grows more slowly to keep gameplay balanced
    const speedGrowth = 1 + ((multiplier - 1) * 0.1);

    this.baseSpeed = dbStats.baseSpeed * speedGrowth;
    this.currentSpeed = this.baseSpeed;

    this.xpValue = dbStats.xpValue;

    // =========================
    // Combat Configuration
    // =========================

    this.attackDistance = config.attackDistance || 40;
    this.attackSpeedCooldown = config.attackSpeedCooldown || 1000;

    this.aiOverride = config.aiOverride || null;
    this.sweepVelocity = config.sweepVelocity || null;

    if (config.lifeTime) {
      scene.time.delayedCall(config.lifeTime, () => {
        if (this.active && !this.isDying) {
          scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1500, // Slowly fade into the shadows
            onComplete: () => {
              this.isDying = true;
              this.destroy();
            }
          });
        }
      });
    }

    // =========================
    // Combat State
    // =========================

    this.deadTriggered = false;
    this.isDying = false;
    this.isAttacking = false;
    this.isHurt = false;

    this.attackCooldown = 0;
    this.currentDirection = 'down';

    // =========================
    // Status Effects
    // =========================

    this.isKnockedBack = false;
    this.knockbackRecoverTime = 0;
    this.hasShatterCurse = false;

    this.isSlowed = false;
    this.slowRecoverTime = 0;

    // Start with the default walking animation
    this.play(`${this.animPrefix}_walk_down`, true);
  }

  update(time) {
    // Ignore updates if the monster is inactive or dying
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isDying) {
      return;
    }

    // -------------------------
    // Knockback handling
    // -------------------------

    if (this.isKnockedBack) {
      if (time < this.knockbackRecoverTime) {
        // Shatter curse instantly kills the monster if it collides during knockback
        if (this.hasShatterCurse && !this.body.blocked.none) {
          this.hp = 0;
        }

        return;
      }

      // Knockback finished
      this.isKnockedBack = false;
      this.hasShatterCurse = false;
      this.clearTint();
    }

    // Pause movement while attacking or recovering from damage
    if (this.isAttacking || this.isHurt) {
      this.setVelocity(0);
      return;
    }

    // -------------------------
    // Slow effect
    // -------------------------

    if (this.isSlowed) {
      if (time < this.slowRecoverTime) {
        this.currentSpeed = this.baseSpeed * 0.5;
      } else {
        this.isSlowed = false;
        this.currentSpeed = this.baseSpeed;
        this.clearTint();
      }
    }

    if (this.aiOverride === 'sweep') {
      this.setVelocity(this.sweepVelocity.x, this.sweepVelocity.y);
      this.updateWalkAnimation();
      return; // Stop here! Do not track the player.
    }

    const targetPlayer = this.scene.player;

    // Stop if there is no valid target
    if (!targetPlayer || !targetPlayer.active) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      targetPlayer.x,
      targetPlayer.y
    );

    // Attack if close enough, otherwise chase the player
    if (distance <= this.attackDistance) {
      this.setVelocity(0);
      this.triggerAttack(time);
    } else {
      this.scene.physics.moveToObject(this, targetPlayer, this.currentSpeed);
      this.updateWalkAnimation();
    }
  }

  updateWalkAnimation() {
    if (!this.hasAnimations) {
      // Just flip the geometric shape left/right if moving
      if (this.body.velocity.x < 0) this.setFlipX(true);
      else if (this.body.velocity.x > 0) this.setFlipX(false);
      return;
    }

    const velX = this.body.velocity.x;
    const velY = this.body.velocity.y;

    // Determine movement direction from velocity
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

    if (this.hasAnimations) {
      this.play(`${this.animPrefix}_attack_${this.currentDirection}`, true);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
        if (animation.key.includes('attack') && !this.deadTriggered && !this.isHurt) {
          this.isAttacking = false;
          this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown; 
        }
      });
    } else {
      // Fallback for geometric shapes: Wait half a second, then finish attack
      this.scene.time.delayedCall(500, () => {
        if (!this.deadTriggered && !this.isHurt) {
          this.isAttacking = false;
          this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
        }
      });
    }
  }

  hurt() {
    if (this.deadTriggered || this.isDying) return;
    this.isHurt = true;
    this.isAttacking = false; 
    if (!this.isKnockedBack) this.setVelocity(0);

    if (this.hasAnimations) {
      this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
      this.play(`${this.animPrefix}_hurt_${this.currentDirection}`, true);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
        if (animation.key.includes('hurt') && !this.deadTriggered) this.isHurt = false; 
      });
    } else {
      // Fallback: Just pause movement for a moment
      this.scene.time.delayedCall(150, () => {
        if (!this.deadTriggered) this.isHurt = false;
      });
    }
  }

  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    this.setVelocity(0);
    this.body.enable = false; 
    this.clearTint();

    if (this.hasAnimations) {
      this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
      this.play(`${this.animPrefix}_death`, true);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
        if (animation.key.includes('death')) this.destroy();
      });
    } else {
      // Fallback: Fade out and destroy
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 200,
        onComplete: () => this.destroy()
      });
    }
  }
}