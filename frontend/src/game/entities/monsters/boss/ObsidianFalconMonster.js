import Phaser from 'phaser';
import EclipseLordBase from '../../BaseEclipseLord';

export default class ObsidianFalconMonster extends EclipseLordBase {
  constructor(scene, x, y, dbStats, multiplier, waveConfig) {
    super(scene, x, y, dbStats, multiplier, { attackDistance: 400, attackSpeedCooldown: 2000, ...waveConfig });
    this.body.setSize(60, 60);
    this.setTint(0x1e1b4b); // Deep space indigo
    this.setScale(2);
    this.blackHoleTimer = 0;
    this.initializeBossUI('OBSIDIAN FALCON, THE ECLIPSE LORD');
  }

  update(time) {
    super.update(time);
    // Gravity Well Logic: Pull the player toward active black holes
    if (this.blackHole && this.blackHole.active) {
      const player = this.scene.player;
      if (player && Phaser.Math.Distance.Between(this.blackHole.x, this.blackHole.y, player.x, player.y) < 250) {
        this.scene.physics.moveToObject(player, this.blackHole, 100); // Drags the player
      }
    }
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;
    this.isAttacking = true;
    this.setVelocity(0);

    const player = this.scene.player;
    if (!player || !player.active) return;

    // Alternate between shooting and spawning a Black Hole
    if (time > this.blackHoleTimer) {
      this.spawnBlackHole(player);
      this.blackHoleTimer = time + 8000; // Every 8 seconds
    } else {
      this.fireFeatherBlades(player);
    }

    this.scene.time.delayedCall(500, () => { this.isAttacking = false; });
    this.attackCooldown = time + this.attackSpeedCooldown;
  }

  fireFeatherBlades(player) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const blade = this.scene.physics.add.sprite(this.x, this.y, 'magic_bullet').setTint(0x1e1b4b);
    this.scene.enemies.add(blade);
    blade.damage = this.damage;
    this.scene.physics.velocityFromRotation(angle, 400, blade.body.velocity);
    blade.attack = () => blade.destroy();
    this.scene.time.delayedCall(3000, () => { if (blade.active) blade.destroy(); });
  }

  spawnBlackHole(player) {
    if (this.blackHole && this.blackHole.active) this.blackHole.destroy();
    this.blackHole = this.scene.add.graphics({ x: player.x, y: player.y });
    this.blackHole.fillStyle(0x000000, 0.8);
    this.blackHole.fillCircle(0, 0, 50);
    this.blackHole.lineStyle(2, 0xa855f7, 1);
    this.blackHole.strokeCircle(0, 0, 50);
    this.scene.time.delayedCall(5000, () => { if (this.blackHole) this.blackHole.destroy(); });
  }
}