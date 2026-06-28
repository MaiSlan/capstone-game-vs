// src/game/entities/monsters/EchoMonster.js
import Phaser from 'phaser';
import BaseMonster from '../BaseMonster';
import WeaponManager from '../../managers/WeaponManager';

export default class EchoMonster extends BaseMonster {
  constructor(scene, x, y, dbStats, multiplier, waveConfig = {}) {
    const targetPlayer = scene.player;
    const playerSprite = targetPlayer ? targetPlayer.texture.key : 'placeholder_square';

    super(scene, x, y, playerSprite, 'none', dbStats, multiplier, {
      attackDistance: 250, 
      attackSpeedCooldown: 3500, 
      hasAnimations: false, 
      ...waveConfig
    });

    this.hasPlayerAnims = targetPlayer ? targetPlayer.hasAnimations : false;
    this.animPrefix = targetPlayer ? targetPlayer.animPrefix : '';
    this.baseScale = targetPlayer ? targetPlayer.baseScale : 0.125;
    this.setScale(this.baseScale); 
    this.body.setSize(this.width * 0.5, this.height * 0.5); 

    this.baseTint = 0x050505; 
    this.setTint(this.baseTint); 
    this.setAlpha(0.9); 

    this.stolenProjectiles = this.scene.physics.add.group();
    this.scene.physics.add.overlap(this.scene.player, this.stolenProjectiles, (player, proj) => {
      if (!proj.active) return;
      player.takeDamage(proj.damage || 20, this.scene);
      if (proj.onHit) proj.onHit(player);
      else proj.destroy(); 
    });

    this.weaponManager = new WeaponManager(this.scene, this);
    if (targetPlayer && targetPlayer.weaponManager && targetPlayer.weaponManager.weapons.length > 0) {
      const randomWeapon = Phaser.Utils.Array.GetRandom(targetPlayer.weaponManager.weapons);
      this.weaponManager.addOrUpgradeWeapon(randomWeapon.id);
      this.weaponManager.weapons[0].level = randomWeapon.level; 
    } else {
      this.weaponManager.addOrUpgradeWeapon('magic_orb');
    }
    
    this.damageMult = 2.0;   
    this.cooldownMult = 0.8; 
  }

  clearTint() { super.clearTint(); super.setTint(this.baseTint); return this; }
  hurt() {}
  die() { this.isDying = true; this.setVelocity(0); this.destroy(); }

  update(time) {
    if (!this.active || this.isDying) return;

    // 1. CHASE PLAYER (Only if NOT in the middle of a dash)
    if (!this.isAttacking) {
      if (super.update) super.update(time);
    }
    
    // 2. PASSIVE WEAPON FIRING
    this.currentAimAngle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
    const realProjectiles = this.scene.playerProjectiles;
    const realEnemies = this.scene.enemies;
    
    this.scene.playerProjectiles = this.stolenProjectiles;
    this.scene.enemies = { getChildren: () => [this.scene.player] };
    this.weaponManager.update(time, this.scene.enemies);
    this.stolenProjectiles.getChildren().forEach(proj => proj.setTint(0x050505));

    this.scene.playerProjectiles = realProjectiles;
    this.scene.enemies = realEnemies;

    // 3. ANIMATION LOGIC
    const isMoving = Math.abs(this.body.velocity.x) > 1 || Math.abs(this.body.velocity.y) > 1;
    if (this.hasPlayerAnims && this.animPrefix) {
      if (isMoving) {
        this.setFlipX(false);
        if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
          this.anims.play(this.body.velocity.x > 0 ? `${this.animPrefix}_east` : `${this.animPrefix}_west`, true);
        } else {
          this.anims.play(this.body.velocity.y > 0 ? `${this.animPrefix}_south` : `${this.animPrefix}_north`, true);
        }
      } else { this.anims.stop(); }
    } else if (isMoving) {
      this.setFlipX(this.body.velocity.x > 0);
      this.setAngle(Math.sin(time / 80) * 15);
    } else { this.setAngle(0); }
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;
    this.isAttacking = true;
    this.setVelocity(0); 

    this.scene.tweens.addCounter({
      from: 0, to: 1, duration: 150, yoyo: true, repeat: 3, 
      onUpdate: (tween) => {
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          new Phaser.Display.Color(5, 5, 5), new Phaser.Display.Color(220, 38, 38), 1, tween.getValue()
        );
        super.setTint(Phaser.Display.Color.ObjectToColor(color).color); 
      },
      onComplete: () => {
        if (!this.active || this.isDying) return;
        super.setTint(this.baseTint); 
        this.shadowDash(); 
      }
    });
  }

  shadowDash() {
    const player = this.scene.player;
    if (!player || !player.active) {
      this.isAttacking = false;
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const dashSpeed = 550; 
    
    // Explicitly set velocity
    this.scene.physics.velocityFromRotation(angle, dashSpeed, this.body.velocity);

    this.scene.time.delayedCall(400, () => {
      if (this.active) {
        this.setVelocity(0);
        this.isAttacking = false;
        this.attackCooldown = this.scene.time.now + this.attackSpeedCooldown;
      }
    });
  }
}