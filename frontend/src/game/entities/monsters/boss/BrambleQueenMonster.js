import Phaser from 'phaser';
import EclipseLordBase from '../../BaseEclipseLord';
import GoreThrallMonster from '../GoreThrallMonster';
import { MONSTER_DB } from '../../../../data/MonsterDB';

export default class BrambleQueenMonster extends EclipseLordBase {
  constructor(scene, x, y, dbStats, multiplier, waveConfig) {
    super(scene, x, y, dbStats, multiplier, { attackDistance: 500, attackSpeedCooldown: 3000, ...waveConfig });
    this.body.setSize(60, 60);
    this.setTint(0x166534); // Deep forest green
    this.setScale(2);
    this.thrallTimer = 0;

    this.isBoss = true;
    this.maxHp = this.hp; 
    this.initializeBossUI('BRAMBLE QUEEN, THE ECLIPSE LORD');
  }

  triggerAttack(time) {
    if (time < this.attackCooldown) return;
    this.isAttacking = true;
    this.setVelocity(0);

    const player = this.scene.player;
    if (player && player.active) {
      // 1. Spawn a permanent Thorn Wall nearby
      const wall = this.scene.add.tileSprite(player.x + Phaser.Math.Between(-150, 150), player.y + Phaser.Math.Between(-150, 150), 100, 30, 'placeholder_square');
      wall.setTint(0x064e3b);
      this.scene.physics.add.existing(wall, true); // Static body
      this.scene.walls.add(wall);

      // 2. Summon Gore-Thralls
      if (time > this.thrallTimer) {
        const stats = MONSTER_DB['blighted_gore_thrall'];
        this.scene.enemies.add(new GoreThrallMonster(this.scene, this.x, this.y, stats, 1));
        this.scene.enemies.add(new GoreThrallMonster(this.scene, this.x, this.y, stats, 1));
        this.thrallTimer = time + 6000;
      }
    }

    this.scene.time.delayedCall(500, () => { this.isAttacking = false; });
    this.attackCooldown = time + this.attackSpeedCooldown;
  }
}