import Phaser from 'phaser';
import EclipseLordBase from '../../BaseEclipseLord';

export default class GrandHaruspexMonster extends EclipseLordBase {
  constructor(scene, x, y, dbStats, multiplier, waveConfig) {
    super(scene, x, y, dbStats, multiplier, { attackDistance: 2000, attackSpeedCooldown: 1500, ...waveConfig });
    this.body.setSize(80, 80);
    this.setTint(0xf472b6); // Brain pink
    this.setScale(2.5);
    this.initializeBossUI('GRAND HARUSPEX, THE ECLIPSE LORD');
  }

  update(time) {
    super.update(time);
    this.setVelocity(0); // Never moves!
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;
    this.isAttacking = true;

    // Fire a ring of 12 bullets
    const bulletCount = 12;
    const angleStep = (Math.PI * 2) / bulletCount;

    for (let i = 0; i < bulletCount; i++) {
      const angle = angleStep * i;
      const bullet = this.scene.physics.add.sprite(this.x, this.y, 'magic_bullet').setTint(0xf472b6);
      bullet.setScale(2);
      this.scene.enemies.add(bullet);
      bullet.damage = this.damage;
      this.scene.physics.velocityFromRotation(angle, 150, bullet.body.velocity);
      bullet.attack = () => bullet.destroy();
      this.scene.time.delayedCall(8000, () => { if (bullet.active) bullet.destroy(); });
    }

    this.scene.time.delayedCall(500, () => { this.isAttacking = false; });
    this.attackCooldown = time + this.attackSpeedCooldown;
  }
}