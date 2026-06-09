import Phaser from 'phaser';
import { WEAPON_DB } from '../../data/WeaponDB';

export default class MagicMissile {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_orb;
    this.lastFired = 0;
  }

  update(time, player, enemiesGroup) {
    if (time > this.lastFired && enemiesGroup && enemiesGroup.getChildren().length > 0) {
      const closestEnemy = this.scene.physics.closest(player, enemiesGroup.getChildren());
      
      if (closestEnemy) {
        // Use standard dummy graphics for now, we will replace with assets later
        const bullet = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book'); 
        bullet.isBullet = true;
        bullet.damage = this.stats.damage;
        
        this.scene.physics.moveToObject(bullet, closestEnemy, this.stats.speed);
        this.lastFired = time + this.stats.cooldown;
      }
    }
  }
}