export default class AnimationManager {
  static initializeAnimations(scene) {
    
    // --- SLIME: WALK ANIMATIONS (8 columns) ---
    // Row 1: Down (0-7), Row 2: Up (8-15), Row 3: Left (16-23), Row 4: Right (24-31)
    scene.anims.create({ key: 'slime_walk_down', frames: scene.anims.generateFrameNumbers('slime_walk', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'slime_walk_up', frames: scene.anims.generateFrameNumbers('slime_walk', { start: 8, end: 15 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'slime_walk_left', frames: scene.anims.generateFrameNumbers('slime_walk', { start: 16, end: 23 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'slime_walk_right', frames: scene.anims.generateFrameNumbers('slime_walk', { start: 24, end: 31 }), frameRate: 10, repeat: -1 });
    // --- SLIME: DEATH ANIMATION (10 columns) ---
    // We only need one directional death to save overhead. Let's use Row 1 (Down: 0-9).
    scene.anims.create({ key: 'slime_death', frames: scene.anims.generateFrameNumbers('slime_death', { start: 0, end: 9 }), frameRate: 12, repeat: 0 });
    // --- SLIME: ATTACK ANIMATION (11 columns) ---
    // Row 1: Down (0-10), Row 2: Up (11-21), Row 3: Left (22-32), Row 4: Right (33-43)
    scene.anims.create({ key: 'slime_attack_down', frames: scene.anims.generateFrameNumbers('slime_attack', { start: 0, end: 10 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_attack_up', frames: scene.anims.generateFrameNumbers('slime_attack', { start: 11, end: 21 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_attack_left', frames: scene.anims.generateFrameNumbers('slime_attack', { start: 22, end: 32 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_attack_right', frames: scene.anims.generateFrameNumbers('slime_attack', { start: 33, end: 43 }), frameRate: 15, repeat: 0 });
    // --- SLIME: HURT ANIMATION (5 columns) ---
    scene.anims.create({ key: 'slime_hurt_down', frames: scene.anims.generateFrameNumbers('slime_hurt', { start: 0, end: 4 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_hurt_up', frames: scene.anims.generateFrameNumbers('slime_hurt', { start: 5, end: 9 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_hurt_left', frames: scene.anims.generateFrameNumbers('slime_hurt', { start: 10, end: 14 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'slime_hurt_right', frames: scene.anims.generateFrameNumbers('slime_hurt', { start: 15, end: 19 }), frameRate: 15, repeat: 0 });
  }
}