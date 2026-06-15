import { MONSTER_DB } from '../../../data/MonsterDB';
import BaseMonster from '../BaseMonster';

export default class SlimeMonster extends BaseMonster {
  constructor(scene, x, y) {
    // 1. Fetch stats
    const stats = MONSTER_DB.slime || { hp: 40, speed: 50, damage: 10, xp: 5 };
    
    // 2. Pass everything to the BaseMonster
    // (scene, x, y, textureKey, animationPrefix, stats, customConfig)
    super(scene, x, y, 'slime_walk', 'slime', stats, {
      attackDistance: 65, 
      attackSpeedCooldown: 1000
    });
    
    // 3. Apply Slime-specific physics and sizing
    this.setScale(2.5);
    this.body.setSize(30, 30);
    this.body.setOffset(17, 17); 
  }
}