import Phaser from 'phaser';
import Player from '../Player';

export default class Viking extends Player {
  constructor(scene, x, y) {
    super(scene, x, y, 'viking_sprite', 170);
    this.heroName = "Chibi Viking";
    this.lastSwiped = 0;

    // Create a perfect 90-degree quarter-circle (pizza slice) graphic
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xffffff, 0.8);
    graphics.beginPath();
    
    // 1. Move to the exact center of our 200x200 texture box
    graphics.moveTo(100, 100);
    // 2. Draw an arc from -45 to 45 degrees (a 90-degree wedge facing right)
    // 3. Radius is 100 pixels long
    graphics.arc(100, 100, 100, Phaser.Math.DegToRad(-45), Phaser.Math.DegToRad(45), false);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.generateTexture('melee_swipe', 200, 200);
    graphics.destroy();
  }

  update(time, enemiesGroup) {
    super.update(time);

    if (time > this.lastSwiped) {
      // Spawn exactly at the player's center coordinates
      const swipe = this.scene.playerProjectiles.create(this.x, this.y, 'melee_swipe');
      swipe.isBullet = false; 
      
      // Set origin to the center so the wedge radiates outward from the player's body
      swipe.setOrigin(0.5, 0.5);

      // Fix the inverted attack direction
      // If flipX is TRUE, the original left-facing sprite has been flipped to face RIGHT
      if (this.flipX) {
        swipe.setAngle(0);       // Face the wedge Right
        swipe.setX(this.x + 10); // Slight offset so it sits just in front of the body
      } else {
      // If flipX is FALSE, the sprite is in its default state facing LEFT
        swipe.setAngle(180);     // Spin the wedge 180 degrees to face Left
        swipe.setX(this.x - 10); 
      }

      this.scene.time.delayedCall(150, () => {
        if (swipe && swipe.active) swipe.destroy();
      });

      this.lastSwiped = time + 1200;
    }
  }
}