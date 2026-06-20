import Phaser from 'phaser';
import EclipseLordBase from '../../BaseEclipseLord';

export default class MadPuppeteerMonster extends EclipseLordBase {
  constructor(scene, x, y, dbStats, multiplier, waveConfig) {
    super(scene, x, y, dbStats, multiplier, { attackDistance: 300, attackSpeedCooldown: 2500, ...waveConfig });
    this.body.setSize(50, 50);
    this.setTint(0x9333ea); // Chaotic Purple
    this.setScale(1.5);
    this.clonesSpawned = false;
    this.initializeBossUI('MAD PUPPETEER, THE ECLIPSE LORD');
  }

  update(time) {
    super.update(time);
    if (!this.clonesSpawned) {
      this.spawnClones();
      this.clonesSpawned = true;
    }
  }

  spawnClones() {
    for (let i = 0; i < 3; i++) {
      const clone = new EclipseLordBase(this.scene, this.x + Phaser.Math.Between(-200, 200), this.y + Phaser.Math.Between(-200, 200), { baseHp: 1, baseDamage: this.damage, baseSpeed: this.baseSpeed, xpValue: 0 }, 1, { attackDistance: 300, attackSpeedCooldown: 2500 });
      clone.setTint(0x9333ea);
      clone.setScale(1.5);
      
      // Clone shooting logic
      clone.triggerAttack = (time) => {
        if (time < clone.attackCooldown) return;
        const player = this.scene.player;
        if (player) {
          const angle = Phaser.Math.Angle.Between(clone.x, clone.y, player.x, player.y);
          const orb = this.scene.physics.add.sprite(clone.x, clone.y, 'magic_bullet').setTint(0x9333ea);
          this.scene.enemies.add(orb);
          orb.damage = clone.damage;
          this.scene.physics.velocityFromRotation(angle, 200, orb.body.velocity);
          orb.attack = () => orb.destroy();
          this.scene.time.delayedCall(4000, () => { if (orb.active) orb.destroy(); });
        }
        clone.attackCooldown = time + 2500;
      };
      
      // Overwrite clone death so it doesn't trigger Victory
      clone.die = () => { if (!clone.deadTriggered) { clone.deadTriggered = true; clone.destroy(); } };
      this.scene.enemies.add(clone);
    }
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;
    this.isAttacking = true;
    this.setVelocity(0);

    const player = this.scene.player;
    if (player && player.active) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      const orb = this.scene.physics.add.sprite(this.x, this.y, 'magic_bullet').setTint(0x9333ea);
      orb.setScale(1.5);
      this.scene.enemies.add(orb);
      orb.damage = this.damage;
      this.scene.physics.velocityFromRotation(angle, 200, orb.body.velocity);
      orb.attack = () => orb.destroy();
      this.scene.time.delayedCall(4000, () => { if (orb.active) orb.destroy(); });
    }

    this.scene.time.delayedCall(500, () => { this.isAttacking = false; });
    this.attackCooldown = time + this.attackSpeedCooldown;
  }
}