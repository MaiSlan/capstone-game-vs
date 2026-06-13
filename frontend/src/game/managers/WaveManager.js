import Phaser from 'phaser';
import SlimeMonster from '../entities/monsters/SlimeMonster';
import FastBat from '../entities/monsters/FastBat';
import TankBoss from '../entities/monsters/TankBoss';

export default class WaveManager {
  constructor(scene, enemyGroup, player) {
    this.scene = scene;
    this.enemies = enemyGroup;
    this.player = player;
    
    this.spawnTimer = 0;
    this.bossSpawnedAtMinute2 = false;
  }

  update(timeMs, runTimeSeconds) {
    if (timeMs > this.spawnTimer) {
      this.spawnWave(runTimeSeconds);
      this.spawnTimer = timeMs + 2000;
    }

    if (runTimeSeconds >= 120 && !this.bossSpawnedAtMinute2) {
      this.spawnBoss();
      this.bossSpawnedAtMinute2 = true;
    }
  }

  getOffScreenSpawnPoint() {
    const cam = this.scene.cameras.main;
    const safeRadius = Math.max(cam.width, cam.height) / 2 + 150;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    const spawnX = cam.midPoint.x + Math.cos(angle) * safeRadius;
    const spawnY = cam.midPoint.y + Math.sin(angle) * safeRadius;

    return { x: spawnX, y: spawnY };
  }

  spawnWave(runTimeSeconds) {
    const baseSpawnCount = 3 + Math.floor(runTimeSeconds / 30);
    
    for (let i = 0; i < baseSpawnCount; i++) {
      const spawnPoint = this.getOffScreenSpawnPoint();

      if (runTimeSeconds >= 60 && Math.random() < 0.3) {
        this.enemies.add(new FastBat(this.scene, spawnPoint.x, spawnPoint.y));
      } else {
        this.enemies.add(new SlimeMonster(this.scene, spawnPoint.x, spawnPoint.y));
      }
    }
  }

  spawnBoss() {
    const spawnPoint = this.getOffScreenSpawnPoint();
    this.enemies.add(new TankBoss(this.scene, spawnPoint.x, spawnPoint.y));
  }
}