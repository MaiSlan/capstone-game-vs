import Phaser from 'phaser';

export default class FastBat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fast_bat');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.speed = 180;
    this.hp = 5;
  }

  update(player) {
    if (this.active && player && player.active) {
      this.scene.physics.moveToObject(this, player, this.speed);
    }
  }
}