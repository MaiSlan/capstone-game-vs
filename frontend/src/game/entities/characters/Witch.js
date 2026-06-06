import Player from '../Player';

export default class Witch extends Player {
  constructor(scene, x, y) {
    super(scene, x, y, 'witch_sprite', 220);
    this.addOrUpgradeWeapon('magic_orb');
    this.heroName = "Witch";
    this.lastFired = 0;
  }
  // Override the update to include attacking
  update(time, enemiesGroup) {
    super.update(time); // Call the parent movement logic

    // Witch Weapon: Magic Orb every 1 second
    if (time > this.lastFired && enemiesGroup) {
      const closestEnemy = this.scene.physics.closest(this, enemiesGroup.getChildren());
      if (closestEnemy) {
        const bullet = this.scene.playerProjectiles.create(this.x, this.y, 'magic_bullet');
        bullet.isBullet = true; // Mark as a destroyable bullet
        this.scene.physics.moveToObject(bullet, closestEnemy, 400);
        this.lastFired = time + 1000;
      }
    }
  }
}