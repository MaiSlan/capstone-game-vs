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

  // --- THE OFF-SCREEN SPAWN MATH ---
  getOffScreenSpawnPoint() {
    const cam = this.scene.cameras.main;
    
    // 1. Calculate the minimum safe distance. 
    // We take the longest side of the camera, halve it to get from the center to the edge, 
    // and add a 150px buffer so the monster doesn't pop in right on the border.
    const safeRadius = Math.max(cam.width, cam.height) / 2 + 150;

    // 2. Pick a random 360-degree angle (in radians)
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    // 3. Calculate exact X and Y relative to the camera's current center point
    const spawnX = cam.midPoint.x + Math.cos(angle) * safeRadius;
    const spawnY = cam.midPoint.y + Math.sin(angle) * safeRadius;

    return { x: spawnX, y: spawnY };
  }

  spawnWave(runTimeSeconds) {
    const baseSpawnCount = 3 + Math.floor(runTimeSeconds / 30);
    
    for (let i = 0; i < baseSpawnCount; i++) {
      // Execute the off-screen calculation
      const spawnPoint = this.getOffScreenSpawnPoint();

      if (runTimeSeconds >= 60 && Math.random() < 0.3) {
        this.enemies.add(new FastBat(this.scene, spawnPoint.x, spawnPoint.y));
      } else {
        this.enemies.add(new DummyMonster(this.scene, spawnPoint.x, spawnPoint.y));
      }
    }
  }

  spawnBoss() {
    // The boss uses the exact same off-screen logic, ensuring a cinematic approach
    const spawnPoint = this.getOffScreenSpawnPoint();
    this.enemies.add(new TankBoss(this.scene, spawnPoint.x, spawnPoint.y));
  }
}