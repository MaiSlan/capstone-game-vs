export default class AnimationManager {
  static initializeAnimations(scene) {
    
    // Slime
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

    // ------------------------------------------------------------------
    // Vampire
    // --- VAMPIRE: WALK (6 columns) ---
    scene.anims.create({ key: 'vampire_walk_down', frames: scene.anims.generateFrameNumbers('vampire_walk', { start: 0, end: 5 }), frameRate: 12, repeat: -1 });
    scene.anims.create({ key: 'vampire_walk_up', frames: scene.anims.generateFrameNumbers('vampire_walk', { start: 6, end: 11 }), frameRate: 12, repeat: -1 });
    scene.anims.create({ key: 'vampire_walk_left', frames: scene.anims.generateFrameNumbers('vampire_walk', { start: 12, end: 17 }), frameRate: 12, repeat: -1 });
    scene.anims.create({ key: 'vampire_walk_right', frames: scene.anims.generateFrameNumbers('vampire_walk', { start: 18, end: 23 }), frameRate: 12, repeat: -1 });

    // --- VAMPIRE: ATTACK (12 columns) ---
    scene.anims.create({ key: 'vampire_attack_down', frames: scene.anims.generateFrameNumbers('vampire_attack', { start: 0, end: 11 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_attack_up', frames: scene.anims.generateFrameNumbers('vampire_attack', { start: 12, end: 23 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_attack_left', frames: scene.anims.generateFrameNumbers('vampire_attack', { start: 24, end: 35 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_attack_right', frames: scene.anims.generateFrameNumbers('vampire_attack', { start: 36, end: 47 }), frameRate: 15, repeat: 0 });

    // --- VAMPIRE: HURT (4 columns) ---
    scene.anims.create({ key: 'vampire_hurt_down', frames: scene.anims.generateFrameNumbers('vampire_hurt', { start: 0, end: 3 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_hurt_up', frames: scene.anims.generateFrameNumbers('vampire_hurt', { start: 4, end: 7 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_hurt_left', frames: scene.anims.generateFrameNumbers('vampire_hurt', { start: 8, end: 11 }), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'vampire_hurt_right', frames: scene.anims.generateFrameNumbers('vampire_hurt', { start: 12, end: 15 }), frameRate: 15, repeat: 0 });

    // --- VAMPIRE: DEATH (11 columns) ---
    // Using just the first row to save processing power on corpses
    scene.anims.create({ key: 'vampire_death', frames: scene.anims.generateFrameNumbers('vampire_death', { start: 0, end: 10 }), frameRate: 15, repeat: 0 });

    // ------------------------------------------------------------------
    // Template Character
    // --- TEMPLATE: WALK (6 columns) ---
    // Row 1: Down, Row 2: Left, Row 3: Right, Row 4: Up
    scene.anims.create({ key: 'template_walk_down', frames: scene.anims.generateFrameNumbers('template_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'template_walk_left', frames: scene.anims.generateFrameNumbers('template_walk', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'template_walk_right', frames: scene.anims.generateFrameNumbers('template_walk', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'template_walk_up', frames: scene.anims.generateFrameNumbers('template_walk', { start: 18, end: 23 }), frameRate: 10, repeat: -1 });

    // --- TEMPLATE: IDLE (12 columns, Irregular 4th Row) ---
    scene.anims.create({ key: 'template_idle_down', frames: scene.anims.generateFrameNumbers('template_idle', { start: 0, end: 11 }), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'template_idle_left', frames: scene.anims.generateFrameNumbers('template_idle', { start: 12, end: 23 }), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'template_idle_right', frames: scene.anims.generateFrameNumbers('template_idle', { start: 24, end: 35 }), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'template_idle_up', frames: scene.anims.generateFrameNumbers('template_idle', { start: 36, end: 39 }), frameRate: 4, repeat: -1 });

    // --- TEMPLATE: HURT (5 columns) ---
    scene.anims.create({ key: 'template_hurt_down', frames: scene.anims.generateFrameNumbers('template_hurt', { start: 0, end: 4 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'template_hurt_left', frames: scene.anims.generateFrameNumbers('template_hurt', { start: 5, end: 9 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'template_hurt_right', frames: scene.anims.generateFrameNumbers('template_hurt', { start: 10, end: 14 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'template_hurt_up', frames: scene.anims.generateFrameNumbers('template_hurt', { start: 15, end: 19 }), frameRate: 12, repeat: 0 });

    // --- TEMPLATE: DEATH (7 columns) ---
    scene.anims.create({ key: 'template_death', frames: scene.anims.generateFrameNumbers('template_death', { start: 0, end: 6 }), frameRate: 10, repeat: 0 });

    // ------------------------------------------------------------------
    // Witch
    // --- WITCH: WALK ANIMATIONS (6 columns) ---
    // Row 1: East (0-5), Row 2: West (6-11), Row 3: North (12-17), Row 4: South (18-23)
   scene.anims.create({ key: 'witch_walk_south', frames: scene.anims.generateFrameNumbers('witch_walk', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
    
    // Row 2: North (6-11)
    scene.anims.create({ key: 'witch_walk_north', frames: scene.anims.generateFrameNumbers('witch_walk', { start: 6, end: 11 }), frameRate: 8, repeat: -1 });
    
    // Row 3: West (12-17)
    scene.anims.create({ key: 'witch_walk_west', frames: scene.anims.generateFrameNumbers('witch_walk', { start: 12, end: 17 }), frameRate: 8, repeat: -1 });
    
    // Row 4: East (18-23)
    scene.anims.create({ key: 'witch_walk_east', frames: scene.anims.generateFrameNumbers('witch_walk', { start: 18, end: 23 }), frameRate: 8, repeat: -1 });


    // ------------------------------------------------------------------
    // Viking
    // --- VIKING: WALK ANIMATIONS (6 columns) ---
    // Row 1: South (0-5)
    scene.anims.create({ key: 'viking_walk_south', frames: scene.anims.generateFrameNumbers('viking_walk', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
    
    // Row 2: North (6-11)
    scene.anims.create({ key: 'viking_walk_north', frames: scene.anims.generateFrameNumbers('viking_walk', { start: 6, end: 11 }), frameRate: 8, repeat: -1 });
    
    // Row 3: West (12-17)
    scene.anims.create({ key: 'viking_walk_west', frames: scene.anims.generateFrameNumbers('viking_walk', { start: 12, end: 17 }), frameRate: 8, repeat: -1 });
    
    // Row 4: East (18-23)
    scene.anims.create({ key: 'viking_walk_east', frames: scene.anims.generateFrameNumbers('viking_walk', { start: 18, end: 23 }), frameRate: 8, repeat: -1 });
  }
}