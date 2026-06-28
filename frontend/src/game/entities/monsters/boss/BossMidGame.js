import Phaser from 'phaser';
import BaseMonster from '../../BaseMonster';

export default class KarnokMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    // If you have the actual 'karnok' sprite loaded, use it here. 
    // We pass hasAnimations: false so the AI doesn't freeze waiting for non-existent frames.
    super(scene, x, y, 'karnok', 'none', dbStats, multiplier, {
      attackDistance: 150, // Phase 1 shockwave radius
      attackSpeedCooldown: 3000, // Phase 1 slam every 3 seconds
      hasAnimations: false,
      ...waveConfig
    });

    this.body.setSize(80, 80); // Massive hitbox
    this.setScale(2); // Boss size
    
    // --- KARNOK STATE MACHINE ---
    this.currentPhase = 1;
    this.isEnraging = false;
    this.isLeaping = false;

    // --- TAG AS BOSS & TRIGGER UI ---
    this.isBoss = true;
    this.maxHp = this.hp; // Ensure maxHp is strictly set
    window.dispatchEvent(new CustomEvent('VS_SHOW_BOSS_BAR', { 
      detail: { name: 'KARNOK, THE BLOOD BEAST', hp: this.hp, maxHp: this.maxHp } 
    }));
  }

  // --- BOSS IMMUNITIES ---
  set isKnockedBack(value) {}
  get isKnockedBack() { return false; }
  set isSlowed(value) {}
  get isSlowed() { return false; }

  // --- OVERRIDE UPDATE FOR PHASES ---
  update(time) {
    if (!this.active || this.hp <= 0 || this.deadTriggered || this.isDying) return;

    // Phase Transition Check
    if (this.hp <= this.maxHp / 2 && this.currentPhase === 1 && !this.isEnraging) {
      this.triggerEnrage();
      return;
    }

    if (this.isAttacking || this.isEnraging || this.isLeaping) {
      this.setVelocity(0); // Stop moving while performing actions
      return;
    }

    // Phase Logic Route
    if (this.currentPhase === 1) {
      this.phaseOneLogic(time);
    } else {
      this.phaseTwoLogic(time);
    }
  }

  // ==========================================
  // PHASE 1: SLOW WALK & GROUND SLAM
  // ==========================================
  phaseOneLogic(time) {
    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    if (time >= this.attackCooldown) {
      this.triggerGroundSlam();
    } else {
      // Very slow, menacing walk
      this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed * 0.8);
      this.updateWalkAnimation();
    }
  }

  triggerGroundSlam() {
    this.isAttacking = true;
    this.setVelocity(0);

    const slamRadius = 150;
    
    // 1. Telegraph the Slam
    const telegraph = this.scene.add.graphics({ x: this.x, y: this.y });
    telegraph.lineStyle(2, 0xdc2626, 0.5); // Faint red line
    telegraph.strokeCircle(0, 0, slamRadius);
    
    const fill = this.scene.add.graphics({ x: this.x, y: this.y });
    fill.fillStyle(0xdc2626, 0.2);

    // Expand the fill to show timing
    this.scene.tweens.add({
      targets: fill,
      scaleX: slamRadius / 10,
      scaleY: slamRadius / 10,
      duration: 1000,
      onComplete: () => {
        if (!this.active || this.isDying) {
          telegraph.destroy(); fill.destroy(); return;
        }

        // 2. Execute the Slam
        this.scene.cameras.main.shake(200, 0.01); // Screen shake
        telegraph.destroy();
        fill.destroy();

        // Draw instant explosion ring
        const blast = this.scene.add.graphics({ x: this.x, y: this.y });
        blast.lineStyle(4, 0xff0000, 1);
        blast.strokeCircle(0, 0, slamRadius);
        this.scene.tweens.add({ targets: blast, alpha: 0, duration: 300, onComplete: () => blast.destroy() });

        // Apply Damage if player didn't dodge
        const player = this.scene.player;
        if (player && player.active) {
          if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= slamRadius) {
            player.takeDamage(this.damage, this.scene);
            window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: player.hp, maxHp: player.maxHp } }));
          }
        }

        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
      }
    });
  }

  // ==========================================
  // PHASE TRANSITION: THE ENRAGE
  // ==========================================
  triggerEnrage() {
    this.isEnraging = true;
    this.setVelocity(0);
    this.scene.cameras.main.shake(500, 0.02); // Heavy shake

    // Flash aggressively and tint permanently to red
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 200,
      yoyo: true,
      repeat: 5, // Roars for about 2 seconds
      onUpdate: (tween) => {
        const val = tween.getValue();
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(255, 255, 255), 
          new Phaser.Display.Color(220, 38, 38), 
          1, val
        );
        this.setTint(Phaser.Display.Color.ObjectToColor(color).color);
      },
      onComplete: () => {
        if (!this.active || this.isDying) return;
        this.setTint(0xffaaaa); // Permanent enraged reddish tint
        this.currentPhase = 2;
        this.isEnraging = false;
        this.attackCooldown = this.scene.time.now + 1000; // Attack almost immediately!
        this.baseSpeed = this.baseSpeed * 1.5; // Speed boost
      }
    });
  }

  // ==========================================
  // PHASE 2: DIVE BOMBS
  // ==========================================
  phaseTwoLogic(time) {
    if (time >= this.attackCooldown) {
      this.triggerDiveBomb();
    } else {
      // Walks aggressively between jumps
      const targetPlayer = this.scene.player;
      if (targetPlayer && targetPlayer.active) {
        this.scene.physics.moveToObject(this, targetPlayer, this.baseSpeed);
      }
    }
  }

  triggerDiveBomb() {
    const targetPlayer = this.scene.player;
    if (!targetPlayer || !targetPlayer.active) return;

    this.isLeaping = true;
    this.setVelocity(0);
    this.body.enable = false; // Invincible and passes over walls while in the air

    const targetX = targetPlayer.x;
    const targetY = targetPlayer.y;
    const impactRadius = 180;

    // 1. Draw a crosshair on the ground where he will land
    const shadow = this.scene.add.graphics({ x: targetX, y: targetY });
    shadow.fillStyle(0x000000, 0.5);
    shadow.fillCircle(0, 0, impactRadius);
    shadow.lineStyle(2, 0xff0000, 0.8);
    shadow.strokeCircle(0, 0, impactRadius);

    // 2. Leap Up (Scale up to simulate flying toward the camera)
    this.scene.tweens.add({
      targets: this,
      scaleX: 3.5,
      scaleY: 3.5,
      alpha: 0.8,
      duration: 600,
      ease: 'Sine.easeOut',
      onComplete: () => {
        if (!this.active || this.isDying) { shadow.destroy(); return; }

        // Teleport above the player
        this.setPosition(targetX, targetY);

        // 3. Crash Down
        this.scene.tweens.add({
          targets: this,
          scaleX: 2, // Back to normal boss size
          scaleY: 2,
          alpha: 1,
          duration: 300,
          ease: 'Expo.easeIn',
          onComplete: () => {
            if (!this.active || this.isDying) { shadow.destroy(); return; }

            this.body.enable = true; // Re-enable physics
            shadow.destroy();
            this.scene.cameras.main.shake(300, 0.03); // Massive shake

            // Deal Damage
            if (Phaser.Math.Distance.Between(this.x, this.y, targetPlayer.x, targetPlayer.y) <= impactRadius) {
              targetPlayer.takeDamage(this.damage * 1.5, this.scene); // Divebomb deals 50% extra damage!
              window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: targetPlayer.hp, maxHp: targetPlayer.maxHp } }));
            }

            this.isLeaping = false;
            this.attackCooldown = this.scene.time.now + 2500; // Jump every 2.5 seconds
          }
        });
      }
    });
  }

  // Override die to drop a massive explosion of XP
  die() {
    if (this.deadTriggered) return;
    this.deadTriggered = true;
    this.isDying = true;
    this.setVelocity(0);
    this.body.enable = false;

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        // Drop 10 massive XP gems around his corpse
        for (let i = 0; i < 10; i++) {
          const offsetX = Phaser.Math.Between(-50, 50);
          const offsetY = Phaser.Math.Between(-50, 50);
          const gem = this.scene.expGems.create(this.x + offsetX, this.y + offsetY, 'exp_gem');
          gem.xpValue = this.xpValue / 10; 
          gem.setTint(0xff0000); // Tint them red to show they are boss gems
          gem.setScale(2);
        }
        
        // --- NEW: Tell the engine the mid-boss is dead! ---
        window.dispatchEvent(new CustomEvent('VS_MID_BOSS_DEAD'));
        window.dispatchEvent(new CustomEvent('VS_HIDE_BOSS_BAR'));
        this.destroy();
      }
    });
  }
}