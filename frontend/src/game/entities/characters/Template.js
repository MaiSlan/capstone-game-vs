import Player from '../Player';
import { CHARACTER_DB } from '../../../data/CharacterDB';

export default class Template extends Player {
  constructor(scene, x, y) {
    const stats = CHARACTER_DB.template;
    
    // 1. Call the Player.js constructor to inherit EVERYTHING (HP, Speed, Inventories)
    super(scene, x, y, 'template_idle', stats.speed, stats.hp);
    
    this.heroName = stats.name;
    
    // 2. Override the 0.125 "wobble" scale from Player.js to fit the 64x64 pixel art
    this.baseScale = 1.5; 
    this.setScale(this.baseScale);
    
    // 3. Set the custom hitbox for this specific sprite
    this.body.setSize(24, 32);
    this.body.setOffset(20, 20);

    this.currentDirection = 'down';
    
    // 4. Equip their default weapon from the DB
    this.addOrUpgradeWeapon(stats.weaponId);
  }

  update(time, enemiesGroup) {
    // 1. Run all the core math (Velocity, Aiming, XP, Weapons) from Player.js
    super.update(time, enemiesGroup);

    if (this.hp <= 0) return;

    // 2. Undo the "wobble" visual effect that Player.js applies by default
    this.setAngle(0); 
    this.setScale(this.baseScale); 
    this.setFlipX(false); // We use custom left/right animations instead of flipping

    // 3. Apply our custom 4-directional animations based on velocity
    const velocityX = this.body.velocity.x;
    const velocityY = this.body.velocity.y;

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      this.currentDirection = velocityX > 0 ? 'right' : 'left';
    } else if (velocityY !== 0) {
      this.currentDirection = velocityY > 0 ? 'down' : 'up';
    }

    // Only update movement animations if we aren't currently locked in a "Hurt" animation
    if (!this.anims.isPlaying || !this.anims.currentAnim.key.includes('hurt')) {
      if (velocityX === 0 && velocityY === 0) {
        this.play(`template_idle_${this.currentDirection}`, true);
      } else {
        this.play(`template_walk_${this.currentDirection}`, true);
      }
    }
  }

  takeDamage(amount, scene) {
    // If already invincible (I-Frames), don't trigger hurt logic
    if (this.isInvincible || this.hp <= 0) return;

    // Let Player.js do the HP math and trigger the red flash & I-Frames
    super.takeDamage(amount, scene);

    // Play our custom Hurt animation
    this.play(`template_hurt_${this.currentDirection}`, true);
  }
}