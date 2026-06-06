import Phaser from 'phaser';

export default class DummyMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'dummy_monster');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.speed = 100;
  }

  // We pass the player object into the update loop so the monster knows who to chase
  update(player) {
    if (this.active && player && player.active) {
      this.scene.physics.moveToObject(this, player, this.speed);
    }
  }
}