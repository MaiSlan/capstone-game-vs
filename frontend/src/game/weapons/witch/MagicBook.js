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
    const activeDuration = weaponLevel >= 5 ? 15000 : 3000 + (lvlIdx * 1000); 
    
    // Starts spinning slowly, gets aggressively faster as it levels
    const orbitSpeed = 0.02 + (lvlIdx * 0.015);
    // Radius slightly expands at higher levels
    const orbitRadius = 75 + (lvlIdx * 5); 

    // --- 1. SPAWN BOOKS (When off cooldown) ---
    if (time > this.lastFired) {
      this.activeEndTime = time + activeDuration;
      
      // The weapon cooldown starts AFTER the active duration finishes
      this.lastFired = time + currentCooldown + activeDuration;

      // Create the ring of books
      for (let i = 0; i < expectedBookCount; i++) {
        const book = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
        book.setScale(0.6);
        // Fractional DoT damage
        book.damage = currentDamage * 0.1; 
        this.orbitingBooks.push(book);
      }
    }

    // --- 2. UPDATE ORBIT OR DESTROY ---
    if (time < this.activeEndTime) {
      // Rotate the master angle
      this.orbitAngle += orbitSpeed;
      const angleStep = (Math.PI * 2) / this.orbitingBooks.length;

      this.orbitingBooks.forEach((book, index) => {
        if (book && book.active) {
          const currentAngle = this.orbitAngle + (angleStep * index);

          book.x = player.x + Math.cos(currentAngle) * orbitRadius;
          book.y = player.y + Math.sin(currentAngle) * orbitRadius;
          book.rotation += 0.1; // Book spins on its own axis
          
          book.damage = currentDamage * 0.1; 
        }
      });
    } else if (this.orbitingBooks.length > 0) {
      // The active duration expired! Destroy all books and wait for cooldown.
      this.orbitingBooks.forEach(book => {
        if (book && book.active) book.destroy();
      });
      this.orbitingBooks = []; // Clear the array
    }
  }
}