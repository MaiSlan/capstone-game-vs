import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class ConsecratedGround {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.consecrated_ground;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    if (time > this.lastFired) {
      const lvlIdx = weaponLevel - 1;
      const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
      const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
      const currentRadius = this.stats.radius[lvlIdx];
      const isMaxLevel = weaponLevel >= 5;
      const healAmount = this.stats.healBase[lvlIdx];

      // Drop the aura directly on the player's current position
      const aura = this.scene.playerProjectiles.create(player.x, player.y, 'aura_icon');
      
      aura.isBullet = false; // Stays on the ground
      aura.damage = currentDamage;
      aura.alpha = 0.5;
      
      // Scale physics body
      aura.body.setCircle(currentRadius / 2);
      aura.setDisplaySize(currentRadius, currentRadius);
      
      aura.hitEnemies = [];

      // The "Tick" Timer: Every 500ms, we clear the hit array so enemies inside take damage again
      const tickTimer = this.scene.time.addEvent({
        delay: 500,
        callback: () => {
          if (!aura || !aura.active) return;
          aura.hitEnemies = []; // Reset hits to tick damage again
          
          // Max Level Mechanic: Heal the player if they stand inside the aura[cite: 7, 8]
          if (isMaxLevel) {
            const dist = Phaser.Math.Distance.Between(player.x, player.y, aura.x, aura.y);
            if (dist <= currentRadius / 2 && player.hp < player.maxHp) {
              // Ensure the player has a heal() method, or manually adjust hp
              if (player.heal) player.heal(healAmount);
              else player.hp = Math.min(player.maxHp, player.hp + healAmount);
            }
          }
        },
        loop: true
      });

      aura.onHit = (enemy) => {
        if (aura.hitEnemies.includes(enemy)) return;
        aura.hitEnemies.push(enemy);
      };

      // Cleanup logic when the aura expires (lives for 3.5 seconds)
      const duration = 3500;
      this.scene.time.delayedCall(duration, () => {
        tickTimer.remove(); // Prevent memory leaks
        if (aura && aura.active) {
          this.scene.tweens.add({
            targets: aura, alpha: 0, duration: 300, onComplete: () => aura.destroy()
          });
        }
      });

      // Backup cleanup if destroyed early
      aura.on('destroy', () => tickTimer.remove());

      this.lastFired = time + currentCooldown;
    }
  }
}