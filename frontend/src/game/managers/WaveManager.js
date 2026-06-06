import Phaser from 'phaser';
import DummyMonster from '../entities/monsters/DummyMonster';
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

  // time is the exact run time in seconds passed from MainScene
  update(timeMs, runTimeSeconds) {
    // Spawn a standard wave every 2 seconds
    if (timeMs > this.spawnTimer) {
      this.spawnWave(runTimeSeconds);
      this.spawnTimer = timeMs + 2000;
    }

    // Boss Trigger: Exactly at 2 minutes (120 seconds)
    if (runTimeSeconds >= 120 && !this.bossSpawnedAtMinute2) {
      this.spawnBoss();
      this.bossSpawnedAtMinute2 = true;
    }
  }

  spawnWave(runTimeSeconds) {
    // Scaling difficulty: Add 1 enemy to the wave every 30 seconds
    const baseSpawnCount = 3 + Math.floor(runTimeSeconds / 30);
    
    for (let i = 0; i < baseSpawnCount; i++) {
      const spawnPoint = new Phaser.Math.Vector2();
      Phaser.Math.RandomXY(spawnPoint, 600); 
      const spawnX = this.player.x + spawnPoint.x;
      const spawnY = this.player.y + spawnPoint.y;

      // After 60 seconds (1 minute), 30% of spawns become Fast Bats
      if (runTimeSeconds >= 60 && Math.random() < 0.3) {
        this.enemies.add(new FastBat(this.scene, spawnX, spawnY));
      } else {
        this.enemies.add(new DummyMonster(this.scene, spawnX, spawnY));
      }
    }
  }

  spawnBoss() {
    const spawnPoint = new Phaser.Math.Vector2();
    Phaser.Math.RandomXY(spawnPoint, 800); // Boss spawns further away
    this.enemies.add(new TankBoss(this.scene, this.player.x + spawnPoint.x, this.player.y + spawnPoint.y));
  }
}