import Phaser from 'phaser';
import DummyMonster from '../entities/DummyMonster';

export default class WaveManager {
  constructor(scene, enemyGroup, player) {
    this.scene = scene;
    this.enemies = enemyGroup;
    this.player = player;
    
    this.spawnTimer = 0;
    this.spawnInterval = 2000; // Spawns a wave every 2 seconds
    this.enemiesPerWave = 3;   // Starts with 3 enemies per wave
  }

  update(time) {
    if (time > this.spawnTimer) {
      this.spawnWave();
      this.spawnTimer = time + this.spawnInterval;
      
      // Slowly increase difficulty: every wave, make the next wave slightly larger
      if (this.enemiesPerWave < 30) {
        this.enemiesPerWave += 0.5; 
      }
    }
  }

  spawnWave() {
    // Spawn multiple enemies at once
    const spawnCount = Math.floor(this.enemiesPerWave);
    
    for (let i = 0; i < spawnCount; i++) {
      // Phaser math trick: pick a random point on a circle around the player
      // 600 pixels is just outside the camera view
      const spawnPoint = new Phaser.Math.Vector2();
      Phaser.Math.RandomXY(spawnPoint, 600); 
      
      const spawnX = this.player.x + spawnPoint.x;
      const spawnY = this.player.y + spawnPoint.y;

      const newEnemy = new DummyMonster(this.scene, spawnX, spawnY);
      this.enemies.add(newEnemy);
    }
  }
}