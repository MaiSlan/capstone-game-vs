import Phaser from 'phaser';
import EclipseLordBase from '../../BaseEclipseLord';

export default class RotBringerMonster extends EclipseLordBase {
  constructor(scene, x, y, dbStats, multiplier, waveConfig) {
    super(scene, x, y, dbStats, multiplier, { attackDistance: 80, attackSpeedCooldown: 2000, ...waveConfig });
    this.body.setSize(90, 90);
    this.setTint(0x854d0e); // Mud/Rot
    this.setScale(2.5);
    this.puddleTimer = 0;
    this.initializeBossUI('ROT BRINGER, THE ECLIPSE LORD');
  }

  update(time) {
    super.update(time);
    
    // Leave a toxic puddle every 2 seconds
    if (time > this.puddleTimer && !this.isDying) {
      this.createPuddle();
      this.puddleTimer = time + 2000;
    }
  }

  // Override melee attack to steal health
  attack() {
    this.hp = Math.min(this.maxHp, this.hp + (this.damage * 2)); // Lifesteal
    this.setTint(0x22c55e); // Flash green
    this.scene.time.delayedCall(200, () => this.setTint(0x854d0e));
  }

  createPuddle() {
    const puddle = this.scene.add.graphics({ x: this.x, y: this.y });
    puddle.fillStyle(0x854d0e, 0.5);
    puddle.fillCircle(0, 0, 80);
    
    // Create an invisible hazard zone
    const hazard = this.scene.physics.add.sprite(this.x, this.y, null).setVisible(false);
    hazard.body.setCircle(80);
    hazard.body.setOffset(-80, -80);
    this.scene.enemies.add(hazard);
    hazard.damage = this.damage * 0.5; // Tick damage
    
    this.scene.time.delayedCall(10000, () => {
      if (puddle) puddle.destroy();
      if (hazard && hazard.active) hazard.destroy();
    });
  }
}