import Phaser from 'phaser';
import { TIMELINE_DB } from '../../data/TimeLineDB';
import { MONSTER_DB } from '../../data/MonsterDB';

import SlimeMonster from '../entities/monsters/SlimeMonster';
import GoreThrallMonster from '../entities/monsters/GoreThrallMonster';
import VampireMonster from '../entities/monsters/VampireMonster';
import LegionnaireMonster from '../entities/monsters/LegionnaireMonster';
import BatMonster from '../entities/monsters/BatMonster';
import BehemothMonster from '../entities/monsters/BehemothMonster';
import SentinelMonster from '../entities/monsters/SentinelMonster';
import EchoMonster from '../entities/monsters/EchoMonster';
import KarnokMonster from '../entities/monsters/boss/BossMidGame';
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
    
    this.eventTimers = new Map(); 
    
    this.eclipseTriggered = false;
    this.totalKills = 0;
    this.bestiaryMap = new Map();
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
      if (runTimeSeconds >= event.startTime && runTimeSeconds < event.endTime) {
        if (!this.eventTimers.has(index)) {
          this.eventTimers.set(index, timeMs); 
        }

        if (timeMs >= this.eventTimers.get(index)) {
          this.executePattern(event, globalMultiplier);
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
    const spawnData = []; 

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
              sweepVelocity: { x: 0, y: isTop ? 30 : -30 }, 
              lifeTime: 9000 
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
              sweepVelocity: { x: isLeft ? 30 : -30, y: 0 }, 
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

    // --- LOG THE ENCOUNTER ---
    if (!this.bestiaryMap.has(monsterId)) {
      this.bestiaryMap.set(monsterId, { monster_id: monsterId, encounters: 0, kills: 0, wins: 0 });
    }
    this.bestiaryMap.get(monsterId).encounters += 1;

    const currentLang = localStorage.getItem('vs_lang') || 'en';

    // Helper to spawn a boss, attach it to the scene, and send the UI event
    const spawnBoss = (BossClass, isMidBoss = false) => {
      const boss = new BossClass(this.scene, x, y, dbStats, multiplier, waveConfig);
      
      boss.monsterId = monsterId; 
      this.enemies.add(boss);
      
      if (isMidBoss) {
        window.dispatchEvent(new CustomEvent('VS_MID_BOSS_STARTED'));
      }
      
      window.dispatchEvent(new CustomEvent('VS_SHOW_BOSS_BAR', {
        detail: {
          name: dbStats.name[currentLang],
          hp: boss.maxHp || (dbStats.baseHp * multiplier),
          maxHp: boss.maxHp || (dbStats.baseHp * multiplier)
        }
      }));
    };

    // Hold the standard enemy instance temporarily
    let enemyInstance = null;

    switch (monsterId) {
      case 'abyssal_sludge':
        enemyInstance = new SlimeMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'crimson_strigoi':
        enemyInstance = new VampireMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'blighted_gore_thrall': 
        enemyInstance = new GoreThrallMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'hollowed_legionnaire': 
        enemyInstance = new LegionnaireMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'night_terror':         
        enemyInstance = new BatMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'abyssal_behemoth':
        enemyInstance = new BehemothMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;
      case 'ocular_sentinel':      
        enemyInstance = new SentinelMonster(this.scene, x, y, dbStats, multiplier, waveConfig);
        break;

      // BOSSES
      case 'echo_of_the_vessel': spawnBoss(EchoMonster); break;
      case 'zul_karn': spawnBoss(KarnokMonster, true); break;
      case 'obsidian_falcon': spawnBoss(ObsidianFalconMonster); break;
      case 'carmilla': spawnBoss(BrambleQueenMonster); break;
      case 'grand_haruspex': spawnBoss(GrandHaruspexMonster); break;
      case 'elara': spawnBoss(RotBringerMonster); break;
      case 'valeria': spawnBoss(MadPuppeteerMonster); break;
      default: break;
    }

    if (enemyInstance) {
      enemyInstance.monsterId = monsterId; 
      this.enemies.add(enemyInstance);
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

    // 2. Select a random Final Boss using the MonsterDB IDs
    const eclipseLords = ['obsidian_falcon', 'carmilla', 'grand_haruspex', 'elara', 'valeria'];
    const chosenLordId = eclipseLords[Math.floor(Math.random() * eclipseLords.length)];
    
    // We pass a massive multiplier because the player survived 20 minutes
    const eclipseMultiplier = 1 + (20 * 0.40); 

    // Spawn them dead center above the player
    this.spawnMonsterFactory(chosenLordId, this.player.x, this.player.y - 300, eclipseMultiplier);

    // 3. Visual Flair (Handled by the MainScene, but we can trigger an event here)
    window.dispatchEvent(new CustomEvent('VS_ECLIPSE_STARTED', { 
      detail: { bossId: chosenLordId } 
    }));
  }

  // ==========================================
  // METRICS TRACKING
  // ==========================================
  
  // Called by MainScene when an enemy HP hits 0
  logKill(monsterId, isBoss = false) {
    this.totalKills += 1;
    
    if (this.bestiaryMap.has(monsterId)) {
      const entry = this.bestiaryMap.get(monsterId);
      entry.kills += 1;
      
      // If it's a boss, a kill counts as a 'win' against that specific boss
      if (isBoss) {
        entry.wins += 1;
      }
    }
  }

  // Called by MainScene during Game Over / Victory to format data for Python
  get bestiaryLog() {
    // Converts the Map into the flat array expected by the FastAPI backend
    return Array.from(this.bestiaryMap.values());
  }
}