import { MONSTER_DB } from '../../../data/MonsterDB';
import BaseMonster from '../BaseMonster';

export default class VampireMonster extends BaseMonster {
  constructor(scene, x, y) {
    // 1. Fetch stats
    const stats = MONSTER_DB.vampire || { hp: 60, speed: 65, damage: 15, xp: 10 };
    
    // 2. Pass everything to the BaseMonster
    // We pass 55 for attackDistance and 800 for cooldown to preserve his specific behavior!
    super(scene, x, y, 'vampire_walk', 'vampire', stats, {
      attackDistance: 55,       
      attackSpeedCooldown: 800  
    });
    
    // 3. Apply Vampire-specific physics and sizing
    this.setScale(stats.scale || 1.8);
    this.body.setSize(20, 30);
    this.body.setOffset(22, 17); 
  }
}