import Phaser from 'phaser';
import { TIMELINE_DB } from '../../data/TimeLineDB';
import { MONSTER_DB } from '../../data/MonsterDB';

// --- WE WILL IMPORT THE SPECIFIC CLASSES HERE AS WE BUILD THEM IN PHASE 4 ---
import SlimeMonster from '../entities/monsters/SlimeMonster';
import GoreThrallMonster from '../entities/monsters/GoreThrallMonster';
import VampireMonster from '../entities/monsters/VampireMonster';
import LegionnaireMonster from '../entities/monsters/LegionnaireMonster';
import BatMonster from '../entities/monsters/BatMonster';
import BehemothMonster from '../entities/monsters/BehemothMonster';
import SentinelMonster from '../entities/monsters/SentinelMonster';
import EchoMonster from '../entities/monsters/EchoMonster';
import KarnokMonster from '../entities/monsters/KarnokMonster';
import ObsidianFalconMonster from '../entities/monsters/boss/ObsidianFalconMonster';
import BrambleQueenMonster from '../entities/monsters/boss/BrambleQueenMonster';
import GrandHaruspexMonster from '../entities/monsters/boss/GrandHaruspexMonster';
import RotBringerMonster from '../entities/monsters/boss/RotBringerMonster';
import MadPuppeteerMonster from '../entities/monsters/boss/MadPuppeteerMonster';

export default class WaveManager {
  constructor(scene, enemyGroup, player) {
    this.scene = scene;
    this.enemies = enemyGroup;
    this.player = player;
    
    // Tracks the next allowed spawn time for each specific timeline event
    this.eventTimers = new Map(); 
    
    this.eclipseTriggered = false;
  }

  update(timeMs, runTimeSeconds) {
    if (this.eclipseTriggered) return;

    // --- THE ECLIPSE TRIGGER (Minute 20) ---
    if (runTimeSeconds >= 1200) {
      this.triggerEclipse();
      return;
    }

    // --- DYNAMIC SCALING MATH ---
    // Monsters gain +40% Base Stats (HP, Damage, Speed) for every minute survived
    const currentMinute = Math.floor(runTimeSeconds / 60);
    const globalMultiplier = 1 + (currentMinute * 0.40);

    // --- THE DIRECTOR SCRIPT ---
    TIMELINE_DB.forEach((event, index) => {
      // Is this event currently active according to the clock?
      if (runTimeSeconds >= event.startTime && runTimeSeconds < event.endTime) {
        
        // Initialize the timer for this event if it just started
        if (!this.eventTimers.has(index)) {
          this.eventTimers.set(index, timeMs); // Trigger immediately
        }

        // Is it time to spawn the next wave for this event?
        if (timeMs >= this.eventTimers.get(index)) {
          this.executePattern(event, globalMultiplier);
          
          // Set the timer for the next wave of this specific event
          this.eventTimers.set(index, timeMs + event.spawnRateMs);
        }
      }
    });
  }

  // ==========================================
  // PATTERN GENERATORS
  // ==========================================

  executePattern(event, multiplier) {
    const { pattern, countPerSpawn, monsterId } = event;
    const spawnData = []; // Store coordinates AND config

    const cam = this.scene.cameras.main;
    const safeRadius = Math.max(cam.width, cam.height) / 2 + 100;

    switch (pattern) {
      case 'random_edge':
        for (let i = 0; i < countPerSpawn; i++) {
          spawnData.push({ coord: this.getRandomEdgePoint(cam, safeRadius), config: {} });
        }
        break;

      case 'circle':
        const angleStep = (Math.PI * 2) / countPerSpawn;
        for (let i = 0; i < countPerSpawn; i++) {
          const angle = angleStep * i;
          spawnData.push({
            coord: { x: this.player.x + Math.cos(angle) * safeRadius, y: this.player.y + Math.sin(angle) * safeRadius },
            config: {}
          });
        }
        break;

      case 'wall_horizontal':
        const isTop = Math.random() > 0.5;
        const startY = isTop ? cam.midPoint.y - cam.height / 2 - 100 : cam.midPoint.y + cam.height / 2 + 100;
        const startX = cam.midPoint.x - cam.width / 2;
        const spacingX = cam.width / countPerSpawn;

        for (let i = 0; i < countPerSpawn; i++) {
          spawnData.push({
            coord: { x: startX + (spacingX * i), y: startY },
            config: { 
              aiOverride: 'sweep', 
              sweepVelocity: { x: 0, y: isTop ? 30 : -30 }, // Very slow crawl
              lifeTime: 9000 // Fades out and disappears after 9 seconds
            }
          });
        }
        break;

      case 'wall_vertical':
        const isLeft = Math.random() > 0.5;
        const wallStartX = isLeft ? cam.midPoint.x - cam.width / 2 - 100 : cam.midPoint.x + cam.width / 2 + 100;
        const wallStartY = cam.midPoint.y - cam.height / 2;
        const spacingY = cam.height / countPerSpawn;

        for (let i = 0; i < countPerSpawn; i++) {
          spawnData.push({
            coord: { x: wallStartX, y: wallStartY + (spacingY * i) },
            config: { 
              aiOverride: 'sweep', 
              sweepVelocity: { x: isLeft ? 30 : -30, y: 0 }, // Very slow crawl
              lifeTime: 9000 
            }
          });
        }
        break;

      case 'boss':
        spawnData.push({ coord: this.getRandomEdgePoint(cam, safeRadius), config: {} });
        break;
    }

    spawnData.forEach(data => {
      const clampedX = Phaser.Math.Clamp(data.coord.x, 100, 7900);
      const clampedY = Phaser.Math.Clamp(data.coord.y, 100, 7900);
      this.spawnMonsterFactory(monsterId, clampedX, clampedY, multiplier, data.config);
    });
  }

  // Helper for random edge spawns
  getRandomEdgePoint(cam, safeRadius) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    return {
      x: cam.midPoint.x + Math.cos(angle) * safeRadius,
      y: cam.midPoint.y + Math.sin(angle) * safeRadius
    };
  }

  // ==========================================
  // THE MONSTER FACTORY
  // ==========================================
  spawnMonsterFactory(monsterId, x, y, multiplier, waveConfig) {
    const dbStats = MONSTER_DB[monsterId];
    if (!dbStats) return;

    switch (monsterId) {
      // REAL ASSETS
      case 'abyssal_sludge':
        this.enemies.add(new SlimeMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
        
      case 'crimson_strigoi':
        this.enemies.add(new VampireMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      case 'blighted_gore_thrall': 
        this.enemies.add(new GoreThrallMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      case 'hollowed_legionnaire': 
        this.enemies.add(new LegionnaireMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      case 'night_terror':         
        this.enemies.add(new BatMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      case 'abyssal_behemoth':
        this.enemies.add(new BehemothMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
   
      case 'ocular_sentinel':      
        this.enemies.add(new SentinelMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      case 'echo_of_the_vessel':
        this.enemies.add(new EchoMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      // MID-GAME BOSS
      case 'karnok_blood_beast':
        this.enemies.add(new KarnokMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      // ECLIPSE LORDS
      case 'obsidian_falcon':
        this.enemies.add(new ObsidianFalconMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
      case 'bramble_queen':
        this.enemies.add(new BrambleQueenMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
      case 'grand_haruspex':
        this.enemies.add(new GrandHaruspexMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
      case 'rot_bringer':
        this.enemies.add(new RotBringerMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;
      case 'mad_puppeteer':
        this.enemies.add(new MadPuppeteerMonster(this.scene, x, y, dbStats, multiplier, waveConfig));
        break;

      default:
        break;
    }
  }

  // ==========================================
  // THE ECLIPSE TRIGGER (MINUTE 20)
  // ==========================================
  triggerEclipse() {
    this.eclipseTriggered = true;

    // 1. Instantly kill all minor enemies on screen
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active && !enemy.isDying) {
        enemy.isDying = true;
        enemy.destroy();
      }
    });

    // 2. Select a random Final Boss from the 5 God Hand inspired Lords
    const eclipseLords = ['obsidian_falcon', 'bramble_queen', 'grand_haruspex', 'rot_bringer', 'mad_puppeteer'];
    const chosenLordId = eclipseLords[Math.floor(Math.random() * eclipseLords.length)];
    
    // We pass a massive multiplier because the player survived 20 minutes
    const eclipseMultiplier = 1 + (20 * 0.40); 

    // Spawn them dead center above the player
    this.spawnMonsterFactory(chosenLordId, this.player.x, this.player.y - 300, eclipseMultiplier);

    // 3. Visual Flair (Handled by the MainScene, but we can trigger an event here)
    window.dispatchEvent(new CustomEvent('VS_ECLIPSE_STARTED'));
  }
}