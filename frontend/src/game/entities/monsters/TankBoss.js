import Phaser from 'phaser';

export default class TankBoss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tank_boss');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.speed = 60;
    this.hp = 200;
  }

  update(player) {
    if (this.active && player && player.active) {
      this.scene.physics.moveToObject(this, player, this.speed);
    }
  }
}