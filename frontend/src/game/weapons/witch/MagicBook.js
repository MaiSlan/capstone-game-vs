import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicBook {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_book; 
    
    this.orbitingBooks = []; 
    this.orbitAngle = 0;
    
    // Tracking duration and cooldown phases
    this.lastFired = 0;
    this.activeEndTime = 0;
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
    const currentCooldown = this.stats.cooldown[lvlIdx] * player.cooldownMult;
    const expectedBookCount = this.stats.count ? this.stats.count[lvlIdx] : weaponLevel; 

    // --- THE FIX: Dynamic Duration and Orbit Speed ---
    // Starts at 3 seconds active, gains 1 second per level. Level 5 is nearly permanent.
    const activeDuration = 3000 + (lvlIdx * 500);
    
    // Starts spinning slowly, gets aggressively faster as it levels
    const orbitSpeed = this.stats.rotationSpeed ? this.stats.rotationSpeed[lvlIdx] : 0.01 + (lvlIdx * 0.005);    
    // Radius slightly expands at higher levels
    const orbitRadius = this.stats.radius ? this.stats.radius[lvlIdx] : 80 + (lvlIdx * 25);

    if (time > this.lastFired) {
      this.activeEndTime = time + activeDuration;
      
      // Weapon goes on cooldown AFTER the books expire
      this.lastFired = time + currentCooldown + activeDuration;

      for (let i = 0; i < expectedBookCount; i++) {
        const book = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
        book.setScale(0.8); // Made slightly larger to look better at a wider radius
        book.damage = currentDamage * 0.2; // Adjusted tick damage
        this.orbitingBooks.push(book);
      }
    }

    // --- 2. UPDATE ORBIT ---
    if (time < this.activeEndTime) {
      this.orbitAngle += orbitSpeed;
      const angleStep = (Math.PI * 2) / this.orbitingBooks.length;

      this.orbitingBooks.forEach((book, index) => {
        if (book && book.active) {
          const currentAngle = this.orbitAngle + (angleStep * index);
          book.x = player.x + Math.cos(currentAngle) * orbitRadius;
          book.y = player.y + Math.sin(currentAngle) * orbitRadius;
          book.rotation += 0.05; // Slower individual book spin
          book.damage = currentDamage * 0.2; 
        }
      });
    } else if (this.orbitingBooks.length > 0) {
      // Clean up
      this.orbitingBooks.forEach(book => {
        if (book && book.active) book.destroy();
      });
      this.orbitingBooks = [];
    }
  }
}