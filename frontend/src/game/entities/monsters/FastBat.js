import Phaser from 'phaser';
import { MONSTER_DB } from '../../../data/MonsterDB';

export default class FastBat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fast_bat_sprite'); // Replace with your actual asset key
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // 1. Load data from the Bestiary
    const stats = MONSTER_DB.bat;
    this.monsterName = stats.name;
    this.hp = stats.hp;
    this.baseSpeed = stats.speed;
    this.damage = stats.damage;
    this.xpValue = stats.xp;

    // 2. Apply physical properties
    this.setTint(stats.tint);
    if (stats.scale) this.setScale(stats.scale);
    
    // Tighten the hitbox slightly so the player can weave between them
    this.body.setSize(this.width * 0.8, this.height * 0.8);
  }

  update(time, player) {
    if (!this.active || this.hp <= 0) return;

    // Standard tracking logic
    this.scene.physics.moveToObject(this, player, this.baseSpeed);

    // Face the player
    if (this.body.velocity.x > 0) {
      this.setFlipX(false);
    } else if (this.body.velocity.x < 0) {
      this.setFlipX(true);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    
    // Flash white to confirm the hit
    const originalTint = this.tintTopLeft;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
      this.setTint(originalTint);
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.disableBody(true, true);
    this.destroy();
  }
}