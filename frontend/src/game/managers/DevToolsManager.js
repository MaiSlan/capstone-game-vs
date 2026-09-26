// src/game/managers/DevToolsManager.js
import { REWARD_DB } from '../../data/RewardDB';
import { WEAPON_DB } from '../../data/WeaponDB';

// ==========================================
// DEV MODE (admin accounts only)
// ==========================================
// Only constructed by MainScene when the run was started with devMode = true,
// which PlayArea sets from the backend's is_admin flag. For everyone else this
// class is never instantiated, so no listener exists and nothing can trigger it.
//
// Driven by the React Dev Panel (components/DevPanel.jsx, Ctrl+Shift+D) through
// the usual window event bridge:
//   VS_DEV_COMMAND  (React -> Phaser)  { action: 'god_mode', enabled }
//                                      { action: 'max_weapons' }
//                                      { action: 'skip_to_minute', minute }
//   VS_DEV_STATE    (Phaser -> React)  { godMode, devModeUsed }
//
// Any action marks the run as dev-assisted (scene.devModeUsed), and PlayArea
// then skips saving its results (gold, stats, bestiary) to the backend.

// God mode stat bundle (same values as the old commented-out MainScene block).
// Multipliers stack on top of the current build; base stats are floors.
const GOD_MODE = {
  damageMult: 5.0, // Deal 500% damage
  xpMult: 5.0,     // Level up 5x faster
  baseSpeed: 250,  // Run fast enough to dodge anything
  baseMaxHp: 5000  // Massive health pool
};

// 20:00 triggers the Eclipse (see WaveManager.update), so it's the last useful skip target.
const MAX_SKIP_MINUTE = 20;

export default class DevToolsManager {
  constructor(scene) {
    this.scene = scene;
    this.godMode = false;
    this.savedBaseStats = null;

    this.commandListener = (e) => this.handleCommand(e.detail || {});
    window.addEventListener('VS_DEV_COMMAND', this.commandListener);

    this.scene.events.once('shutdown', () => this.destroy());
    this.scene.events.once('destroy', () => this.destroy());

    this.broadcastState();
  }

  handleCommand({ action, enabled, minute }) {
    if (!this.scene.player || this.scene.isDead) return;

    if (action === 'god_mode') this.setGodMode(enabled !== false);
    else if (action === 'max_weapons') this.grantMaxWeapons();
    else if (action === 'skip_to_minute') this.skipToMinute(minute);
    else return;

    this.scene.devModeUsed = true;
    this.broadcastState();
  }

  setGodMode(enabled) {
    const player = this.scene.player;
    if (enabled === this.godMode) return;

    if (enabled) {
      this.savedBaseStats = { baseSpeed: player.baseSpeed, baseMaxHp: player.baseMaxHp };
      player.baseSpeed = Math.max(player.baseSpeed, GOD_MODE.baseSpeed);
      player.baseMaxHp = Math.max(player.baseMaxHp, GOD_MODE.baseMaxHp);
      // damageMult/xpMult are rebuilt from items + meta on every recalculateStats(),
      // so they're applied through Player's hook to survive item pickups.
      player.devStatOverride = (p) => {
        p.damageMult *= GOD_MODE.damageMult;
        p.xpMult *= GOD_MODE.xpMult;
      };
    } else {
      Object.assign(player, this.savedBaseStats);
      player.devStatOverride = null;
    }

    player.recalculateStats();
    if (enabled) player.hp = player.maxHp;
    this.godMode = enabled;

    player.updateUIInventory();
    window.dispatchEvent(new CustomEvent('VS_UPDATE_HP', { detail: { hp: player.hp, maxHp: player.maxHp } }));
  }

  // Every weapon in the current hero's pool (RewardDB, the same list the level-up
  // screen offers), at its WeaponDB max level. Works for any hero, not a hand-kept list.
  grantMaxWeapons() {
    const player = this.scene.player;
    const pool = REWARD_DB.weapons[this.scene.selectedCharacter] || [];

    pool.forEach(({ id }) => {
      const maxLevel = (WEAPON_DB[id] && WEAPON_DB[id].maxLevel) || 5;
      for (let i = 0; i < maxLevel; i++) {
        player.weaponManager.addOrUpgradeWeapon(id);
      }
    });

    player.updateUIInventory();
  }

  skipToMinute(minute) {
    const target = Math.min(MAX_SKIP_MINUTE, Math.max(0, Math.floor(Number(minute) || 0)));
    this.scene.surviveSeconds = target * 60;

    // Restart the 1s tick so the clock sits on the exact second for a full second.
    // Boss timeline windows are only 1s wide, so a tick landing right after the
    // skip could otherwise jump past them before WaveManager sees the new time.
    if (this.scene.surviveTimer) this.scene.surviveTimer.elapsed = 0;

    window.dispatchEvent(new CustomEvent('VS_UPDATE_TIMER', { detail: { seconds: this.scene.surviveSeconds } }));
  }

  broadcastState() {
    window.dispatchEvent(new CustomEvent('VS_DEV_STATE', {
      detail: { godMode: this.godMode, devModeUsed: this.scene.devModeUsed === true }
    }));
  }

  destroy() {
    window.removeEventListener('VS_DEV_COMMAND', this.commandListener);
  }
}
