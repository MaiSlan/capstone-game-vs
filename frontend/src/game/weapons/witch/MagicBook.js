import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class MagicBook {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_book; 
    
    // We maintain a persistent array of the physical book sprites
    this.orbitingBooks = []; 
    this.orbitAngle = 0; // The master angle that rotates them all
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    // Assume your stats DB dictates how many books spawn per level (e.g., 1 at lvl 1, 4 at lvl 5)
    const expectedBookCount = this.stats.count ? this.stats.count[lvlIdx] : weaponLevel; 
    
    const orbitRadius = 80; // Distance from the player
    const orbitSpeed = 0.04; // How fast the ring spins

    // --- 1. SPAWN MISSING BOOKS ---
    // If the weapon leveled up, we add new books to match the expected count
    while (this.orbitingBooks.length < expectedBookCount) {
      const book = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
      book.setScale(0.6);
      
      // Because we omit an onHit() method entirely, MainScene will just let it pass through 
      // enemies without destroying it. We give it fractional damage so it acts as a DoT meat-grinder.
      book.damage = (this.stats.damage[lvlIdx] * player.damageMult) * 0.05; 
      
      this.orbitingBooks.push(book);
    }

    // --- 2. UPDATE ORBIT POSITIONS ---
    this.orbitAngle += orbitSpeed;

    // We space the books evenly in a circle using PI * 2 (a full circle in radians)
    const angleStep = (Math.PI * 2) / this.orbitingBooks.length;

    this.orbitingBooks.forEach((book, index) => {
      // Calculate this specific book's angle based on its index
      const currentAngle = this.orbitAngle + (angleStep * index);

      // Lock the book's position relative to the player
      book.x = player.x + Math.cos(currentAngle) * orbitRadius;
      book.y = player.y + Math.sin(currentAngle) * orbitRadius;
      
      // Make the sprite visually spin as it orbits
      book.rotation += 0.1;
      
      // Update damage continuously in case the player picks up a Damage buff
      book.damage = (this.stats.damage[lvlIdx] * player.damageMult) * 0.05; 
    });
  }
}