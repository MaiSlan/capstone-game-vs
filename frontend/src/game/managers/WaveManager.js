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

// Safety cap on simultaneous enemies. Normal waves sit around 20-230 alive; this
// only trims the spikes where TimeLineDB entries overlap. Bosses are exempt.
const MAX_ACTIVE_ENEMIES = 250;

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
        spawnData.push(...this.getWallSpawns(cam, countPerSpawn, Math.random() > 0.5 ? 'top' : 'bottom'));
        break;

      case 'wall_vertical':
        spawnData.push(...this.getWallSpawns(cam, countPerSpawn, Math.random() > 0.5 ? 'left' : 'right'));
        break;

      // Two walls closing in from opposite sides at once (countPerSpawn monsters per wall)
      case 'pincer': {
        const sides = Math.random() > 0.5 ? ['top', 'bottom'] : ['left', 'right'];
        sides.forEach(side => spawnData.push(...this.getWallSpawns(cam, countPerSpawn, side)));
        break;
      }

      // A tight pack rushing in together from a single edge point
      case 'cluster': {
        const packCenter = this.getRandomEdgePoint(cam, safeRadius);
        for (let i = 0; i < countPerSpawn; i++) {
          spawnData.push({
            coord: { x: packCenter.x + Phaser.Math.Between(-60, 60), y: packCenter.y + Phaser.Math.Between(-60, 60) },
            config: {}
          });
        }
        break;
      }

      case 'boss':
        spawnData.push({ coord: this.getRandomEdgePoint(cam, safeRadius), config: event.hpTier ? { hpTier: event.hpTier } : {} });
        break;
    }

    if (pattern !== 'boss') {
      const room = MAX_ACTIVE_ENEMIES - this.enemies.countActive(true);
      if (room <= 0) return;
      spawnData.length = Math.min(spawnData.length, room);
    }

    spawnData.forEach(data => {
      const clampedX = Phaser.Math.Clamp(data.coord.x, 100, 7900);
      const clampedY = Phaser.Math.Clamp(data.coord.y, 100, 7900);
      this.spawnMonsterFactory(monsterId, clampedX, clampedY, multiplier, data.config);
    });
  }

  // One wall of monsters just off-screen on `side` ('top' | 'bottom' | 'left' | 'right'),
  // sweeping across the screen toward the opposite side
  getWallSpawns(cam, count, side) {
    const left = cam.midPoint.x - cam.width / 2;
    const top = cam.midPoint.y - cam.height / 2;
    const spawns = [];

    for (let i = 0; i < count; i++) {
      let coord, sweepVelocity;
      if (side === 'top' || side === 'bottom') {
        coord = { x: left + (cam.width / count) * i, y: side === 'top' ? top - 100 : top + cam.height + 100 };
        sweepVelocity = { x: 0, y: side === 'top' ? 30 : -30 };
      } else {
        coord = { x: side === 'left' ? left - 100 : left + cam.width + 100, y: top + (cam.height / count) * i };
        sweepVelocity = { x: side === 'left' ? 30 : -30, y: 0 };
      }
      spawns.push({ coord, config: { aiOverride: 'sweep', sweepVelocity, lifeTime: 9000 } });
    }
    return spawns;
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

    // --- BOSS HP TUNING ---
    // Bosses/sub-bosses used to inherit the exact same +40%/min multiplier as
    // trash mobs, so their HP pools (and therefore fight duration) were tied to
    // the trash-mob balance curve instead of being deliberately tuned. This
    // stretches boss HP specifically (damage/speed are untouched, since a boss
    // one-shotting the player is a positioning/dodge problem, not a duration
    // one) so encounters last longer without changing how lethal they feel.
    // Tune BOSS_HP_TIERS to taste after playtesting. These are per-boss defaults:
    // a TimeLineDB boss entry can override one appearance with its own hpTier.
    const BOSS_HP_TIERS = {
      echo_of_the_vessel: 1.4, // sub-boss default; its TimeLineDB entries ramp 1.0 / 1.2 / 1.4
      zul_karn: 1.7,           // mid-game "great filter" boss: a proper test
      obsidian_falcon: 2.0,    // Eclipse Lords: the climactic final fight
      carmilla: 2.0,
      grand_haruspex: 2.0,
      elara: 2.0,
      valeria: 2.0
    };

    // Helper to spawn a boss, attach it to the scene, and send the UI event
    const spawnBoss = (BossClass, isMidBoss = false) => {
      const hpTier = (waveConfig && waveConfig.hpTier) || BOSS_HP_TIERS[monsterId] || 1.0;
      const bossDbStats = hpTier !== 1.0
        ? { ...dbStats, baseHp: dbStats.baseHp * hpTier }
        : dbStats;

      const boss = new BossClass(this.scene, x, y, bossDbStats, multiplier, waveConfig);

      boss.monsterId = monsterId;
      this.enemies.add(boss);

      if (isMidBoss) {
        window.dispatchEvent(new CustomEvent('VS_MID_BOSS_STARTED'));
      }

      window.dispatchEvent(new CustomEvent('VS_SHOW_BOSS_BAR', {
        detail: {
          name: dbStats.name[currentLang],
          hp: boss.maxHp || (bossDbStats.baseHp * multiplier),
          maxHp: boss.maxHp || (bossDbStats.baseHp * multiplier)
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