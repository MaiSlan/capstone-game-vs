import Phaser from 'phaser';

export default class DummyMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'dummy_monster');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.speed = 100;
    this.hp = 10; // Basic enemy dies in 1 hit (our attacks will do 10 damage)
  }

  update(player) {
    if (this.active && player && player.active) {
      this.scene.physics.moveToObject(this, player, this.speed);
    }
  }
}