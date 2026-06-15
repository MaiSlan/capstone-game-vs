import Phaser from 'phaser';
import { WEAPON_DB } from '../../../data/WeaponDB';

export default class SwirlingBook {
  constructor(scene) {
    this.scene = scene;
    this.stats = WEAPON_DB.magic_book;
    this.orbitAngle = 0;
    
    // --- NEW: Array to hold multiple books ---
    this.books = []; 
    
    // --- NEW: State Machine Variables ---
    this.isActive = true;
    this.isInitialized = false;
    this.nextStateTime = 0;
    
    this.activeDuration = 4000;  // Books spin for 4 seconds
    this.baseCooldown = 3000;    // Books disappear for 3 seconds
  }

  update(time, player, enemiesGroup, weaponLevel = 1) {
    const lvlIdx = weaponLevel - 1;
    
    // Pull multipliers
    const currentDamage = this.stats.damage[lvlIdx] * player.damageMult;
    const currentRotationSpeed = this.stats.rotationSpeed[lvlIdx];
    const currentRadius = this.stats.radius[lvlIdx];
    
    // Apply Player's Cooldown Multiplier (Haste) to the downtime!
    const actualCooldown = this.baseCooldown * player.cooldownMult;

    // 1. Initialize the timer on the very first frame it is equipped
    if (!this.isInitialized) {
      this.nextStateTime = time + this.activeDuration;
      this.isInitialized = true;
    }

    // 2. Process State Changes (Active vs Cooldown)
    if (this.isActive && time > this.nextStateTime) {
      // Time's up! Destroy books and go on cooldown
      this.isActive = false;
      this.nextStateTime = time + actualCooldown;
      this.clearBooks();
    } 
    else if (!this.isActive && time > this.nextStateTime) {
      // Cooldown finished! Reactivate
      this.isActive = true;
      this.nextStateTime = time + this.activeDuration;
    }

    // 3. Process Book Logic if Active
    if (this.isActive) {
      // Determine how many books to spawn based on current level
      let targetBookCount = 1;
      if (weaponLevel >= 3 && weaponLevel < 5) targetBookCount = 2; // Level 3 & 4
      if (weaponLevel >= 5) targetBookCount = 4;                    // Level 5 (Max)

      // Spawn new books if we don't have enough
      while (this.books.length < targetBookCount) {
        const newBook = this.scene.playerProjectiles.create(player.x, player.y, 'magic_book');
        newBook.isBullet = false;
        this.books.push(newBook);
      }
      
      // Advance the master rotation angle
      this.orbitAngle += currentRotationSpeed;

      // Position every active book symmetrically around the player
      this.books.forEach((book, index) => {
        if (!book || !book.active) return;
        
        // Calculate the perfectly spaced angle for this specific book
        const angleOffset = (Math.PI * 2 / targetBookCount) * index;
        const finalAngle = this.orbitAngle + angleOffset;

        book.damage = currentDamage;
        
        book.setPosition(
          player.x + Math.cos(finalAngle) * currentRadius,
          player.y + Math.sin(finalAngle) * currentRadius
        );
        
        // Optional: Rotate the book sprite so it looks like it's "flying" forward
        book.setRotation(finalAngle + Math.PI / 2);
      });
    }
  }

  // Helper method to completely wipe out the books during cooldown
  clearBooks() {
    this.books.forEach(book => {
      if (book && book.active) book.destroy();
    });
    this.books = [];
  }
}