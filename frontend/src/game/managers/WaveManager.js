import Phaser from 'phaser';
import SlimeMonster from '../entities/monsters/SlimeMonster';
import VampireMonster from '../entities/monsters/VampireMonster';
import TankBoss from '../entities/monsters/TankBoss';

export default class WaveManager {
  constructor(scene, enemyGroup, player) {
    this.scene = scene;
    this.enemies = enemyGroup;
    this.player = player;
    
    this.spawnTimer = 0;
    this.bossSpawnedAtMinute2 = false;
    this.hasSpawnedInitialBurst = false; // --- NEW: Track the start of the game
  }

  update(timeMs, runTimeSeconds) {
    // --- NEW: Instant Action ---
    // Spawn 10 slimes immediately when the game boots up
    if (!this.hasSpawnedInitialBurst) {
      for (let i = 0; i < 10; i++) {
        const point = this.getOffScreenSpawnPoint();
        this.enemies.add(new SlimeMonster(this.scene, point.x, point.y));
      }
      this.hasSpawnedInitialBurst = true;
    }

    // --- NEW: Faster Spawns (Every 1 second instead of 2) ---
    if (timeMs > this.spawnTimer) {
      this.spawnWave(runTimeSeconds);
      this.spawnTimer = timeMs + 1000; 
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

    let spawnX = cam.midPoint.x + Math.cos(angle) * safeRadius;
    let spawnY = cam.midPoint.y + Math.sin(angle) * safeRadius;

    // --- THE BOUNDARY FIX ---
    // If the math places the monster outside the 8000x8000 walls...
    if (spawnX < 100 || spawnX > 7900 || spawnY < 100 || spawnY > 7900) {
      // Flip the angle 180 degrees to spawn them on the opposite side of the player!
      const oppositeAngle = angle + Math.PI;
      spawnX = cam.midPoint.x + Math.cos(oppositeAngle) * safeRadius;
      spawnY = cam.midPoint.y + Math.sin(oppositeAngle) * safeRadius;
      
      // Final clamp just in case the player is perfectly in a corner
      spawnX = Phaser.Math.Clamp(spawnX, 100, 7900);
      spawnY = Phaser.Math.Clamp(spawnY, 100, 7900);
    }

    return { x: spawnX, y: spawnY };
  }

  spawnWave(runTimeSeconds) {
    const baseSpawnCount = 2 + Math.floor(runTimeSeconds / 15);
    
    for (let i = 0; i < baseSpawnCount; i++) {
      const spawnPoint = this.getOffScreenSpawnPoint();

      if (runTimeSeconds >= 60 && Math.random() < 0.3) {
        this.enemies.add(new VampireMonster(this.scene, spawnPoint.x, spawnPoint.y));
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