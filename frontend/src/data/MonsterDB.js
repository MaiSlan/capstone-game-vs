// src/data/MonsterDB.js

export const MONSTER_DB = {
  // ==========================================
  // TIER 1: THE SWARM (Fodder & Rushers)
  // ==========================================
  abyssal_sludge: {
    id: 'abyssal_sludge',
    baseHp: 20,
    baseDamage: 5,
    baseSpeed: 40,
    xpValue: 15,      
    spriteKey: 'slime',
    name: {
      en: 'Abyssal Sludge',
      fr: 'Vase Abyssale',
      zh: '深渊粘液'
    }
  },
  night_terror: {
    id: 'night_terror',
    baseHp: 5,
    baseDamage: 8,
    baseSpeed: 160, 
    xpValue: 8,       
    spriteKey: 'bat',
    name: {
      en: 'Night-Terror Swarm',
      fr: 'Nuée de Terreurs Nocturnes',
      zh: '夜魔群'
    }
  },
  blighted_gore_thrall: {
    id: 'blighted_gore_thrall',
    baseHp: 15,
    baseDamage: 25, 
    baseSpeed: 85,    
    xpValue: 25,      
    spriteKey: 'gore_thrall',
    name: {
      en: 'Blighted Gore-Thrall',
      fr: 'Esclave de Sang Corrompu',
      zh: '枯萎血仆'
    }
  },

  // ==========================================
  // TIER 2: THE VANGUARD (Core Combatants)
  // ==========================================
  hollowed_legionnaire: {
    id: 'hollowed_legionnaire',
    baseHp: 80,
    baseDamage: 18,
    baseSpeed: 30,  
    xpValue: 35,      
    spriteKey: 'skeleton',
    name: {
      en: 'Hollowed Legionnaire',
      fr: 'Légionnaire Évidé',
      zh: '空洞军团兵'
    }
  },
  crimson_strigoi: {
    id: 'crimson_strigoi',
    baseHp: 50,
    baseDamage: 12,
    baseSpeed: 90,  
    xpValue: 40,      
    spriteKey: 'vampire',
    name: {
      en: 'Crimson Strigoi',
      fr: 'Strigoï Cramoisi',
      zh: '猩红吸血鬼'
    }
  },
  ocular_sentinel: {
    id: 'ocular_sentinel',
    baseHp: 30,
    baseDamage: 15,
    baseSpeed: 10,  
    xpValue: 50,      
    spriteKey: 'eye_sentinel',
    name: {
      en: 'Ocular Sentinel',
      fr: 'Sentinelle Oculaire',
      zh: '眼球哨兵'
    }
  },

  // ==========================================
  // TIER 3: THE BRUTES (Heavy Elites)
  // ==========================================
  abyssal_behemoth: {
    id: 'abyssal_behemoth',
    baseHp: 600,
    baseDamage: 25,
    baseSpeed: 20,  
    xpValue: 250,     
    spriteKey: 'troll',
    name: {
      en: 'Abyssal Behemoth',
      fr: 'Béhémoth Abyssal',
      zh: '深渊巨兽'
    }
  },

  // ==========================================
  // SUB-BOSSES (Event Triggers)
  // ==========================================
  echo_of_the_vessel: {
    id: 'echo_of_the_vessel',
    baseHp: 2500,
    baseDamage: 20,
    baseSpeed: 75,
    xpValue: 1000,    
    spriteKey: 'doppelganger',
    name: {
      en: 'Echo of the Vessel',
      fr: 'Écho du Réceptacle',
      zh: '容器的回音'
    }
  },

  // ==========================================
  // MID-GAME BOSS (Minute 10)
  // ==========================================
  zul_karn: {
  id: 'zul_karn',
  baseHp: 8000,
  baseDamage: 35,
  baseSpeed: 45,
  xpValue: 2500,
  spriteKey: 'karnok',
  name: {
    en: "Zul'Karn, the Crimson Behemoth",
    fr: "Zul'Karn, le Béhémoth Cramoisi",
    zh: '祖尔·卡恩，猩红巨兽'
  },
  lore: {
    en: "Zul'Karn was once a mortal warlord of unparalleled strength who struck a foul bargain, trading his humanity to eternally guard the middle layer of the abyss. Over millennia, his armor fused with his flesh, mutating him into a massive behemoth with bull horns and dormant bat-like wings. Unlike the others who despair in the cycle, Zul'Karn embraced it; to him, the Astral Interstice is a paradise that provides an endless, glorious battle. He respects only raw, unyielding strength.",
    fr: "Zul'Karn était autrefois un seigneur de guerre mortel d'une force inégalée qui conclut un pacte impie, échangeant son humanité pour garder éternellement la couche médiane de l'abysse. Au fil des millénaires, son armure fusionna avec sa chair, le mutant en un béhémoth massif doté de cornes de taureau et d'ailes de chauve-souris dormantes. Contrairement aux autres qui désespèrent dans le cycle, Zul'Karn l'a embrassé ; pour lui, l'Interstice Astral est un paradis qui offre une bataille glorieuse et infinie. Il ne respecte que la force brute et inflexible.",
    zh: "祖尔·卡恩曾是一位力量无双的凡人军阀，他签订了一个邪恶契约，用自己的人性换取永恒守护深渊中层。经过数千年，他的盔甲与血肉融合，将他变异成一个拥有牛角和休眠蝙蝠翅膀的巨大贝希摩斯。与其他在循环中绝望的人不同，祖尔·卡恩拥抱了这一切；对他来说，星界间隙是一座提供无尽荣耀战斗的天堂。他只尊重原始、不屈的力量。"
  },
  quotes: [
    {
      en: "More meat for the grinder. Show me your worth!",
      fr: "Plus de viande pour le broyeur. Montre-moi ta valeur !",
      zh: "更多绞肉机的肉。向我展示你的价值！"
    },
    {
      en: "The masters watch, little vessel. Bleed for them!",
      fr: "Les maîtres regardent, petit réceptacle. Saigne pour eux !",
      zh: "主人们在注视，小容器。为他们流血吧！"
    },
    {
      en: "Death is a privilege you have not earned!",
      fr: "La mort est un privilège que tu n'as pas mérité !",
      zh: "死亡是你尚未赢得的特权！"
    }
  ]
  },
  
  // ==========================================
  // FINAL BOSSES: THE ECLIPSE LORDS (Minute 20)
  // ==========================================
  obsidian_falcon: {
  id: 'obsidian_falcon',
  baseHp: 20000,
  baseDamage: 40,
  baseSpeed: 60,
  xpValue: 0,
  spriteKey: 'obsidian_falcon',
  name: {
    en: 'The Obsidian Falcon',
    fr: "Le Faucon d'Obsidienne",
    zh: '黑曜石猎鹰'
  },
  lore: {
    en: "Driven utterly mad by an absolute, suffocating ambition that was violently denied to him in the mortal world. He transcended his humanity to become a being of pure, cold logic and crushing gravity. He floats silently above the arena, viewing the player's struggling vessels not as warriors, but as insignificant insects beneath his notice.",
    fr: "Rendu complètement fou par une ambition absolue et étouffante qui lui fut violemment refusée dans le monde mortel. Il transcenda son humanité pour devenir un être de pure logique froide et de gravité écrasante. Il flotte silencieusement au-dessus de l'arène, considérant les réceptacles du joueur non comme des guerriers, mais comme d'insignifiants insectes indignes de son attention.",
    zh: "被凡人世界中被暴力拒绝的绝对、窒息的野心彻底逼疯。他超越了自己的人性，化为纯粹冷酷逻辑与压倒性重力的存在。他静静漂浮于战场上空，将玩家挣扎求生的容器视作微不足道、根本不值得他关注的蝼蚁。"
  }
  },
  carmilla: {
  id: 'carmilla',
  baseHp: 20000,
  baseDamage: 35,
  baseSpeed: 40,
  xpValue: 0,
  spriteKey: 'bramble_queen',
  name: {
    en: 'Carmilla, the Thistle-Saint',
    fr: 'Carmilla, la Sainte des Chardons',
    zh: '卡米拉，荆棘圣女'
  },
  lore: {
    en: "Once a pure saint who endured unimaginable torture in the mortal realm, believing it would grant her salvation. When she entered the Interstice, her mind broke upon realizing her suffering meant absolutely nothing. She twisted her holy vows, intertwining agony and ecstasy over millennia, becoming a sadistic matriarch of pain who now rules through ritualized torment and sacred cruelty.",
    fr: "Autrefois une sainte pure qui endura des tortures inimaginables dans le royaume mortel, croyant que cela lui apporterait le salut. Lorsqu'elle entra dans l'Interstice, son esprit se brisa en réalisant que sa souffrance ne signifiait absolument rien. Elle tordit ses vœux sacrés, entremêlant agonie et extase pendant des millénaires, devenant une matriarche sadique de la douleur qui règne désormais par un supplice ritualisé et une cruauté sacrée.",
    zh: "她曾是一位纯洁的圣女，在凡人世界忍受了难以想象的折磨，相信这会带来救赎。当她进入间隙后，她意识到自己的痛苦毫无意义，精神彻底崩溃。她扭曲了神圣誓言，在数千年间将痛苦与狂喜交织，最终成为一位以仪式化折磨与“神圣”残酷统治一切的施虐痛苦女族长。"
  },
  quotes: [
    {
      en: "Does it hurt, sweet child? Good. Pain is the only truth here.",
      fr: "Ça fait mal, doux enfant ? Bien. La douleur est la seule vérité ici.",
      zh: "痛吗，甜蜜的孩子？很好。痛苦是这里唯一的真理。"
    },
    {
      en: "Bleed for me! Let the thorns drink your sorrow!",
      fr: "Saigne pour moi ! Laisse les épines boire ta tristesse !",
      zh: "为我流血！让荆棘饮下你的悲伤！"
    },
    {
      en: "Your suffering is so beautiful... let me immortalize it.",
      fr: "Ta souffrance est si belle... laisse-moi l'immortaliser.",
      zh: "你的痛苦如此美丽……让我将它永恒化。"
    }
  ]
},
  grand_haruspex: {
  id: 'grand_haruspex',
  baseHp: 18000,
  baseDamage: 50,
  baseSpeed: 0,
  xpValue: 0,
  spriteKey: 'grand_haruspex',
  name: {
    en: 'The Grand Haruspex',
    fr: 'Le Grand Haruspice',
    zh: '大占卜师'
  },
  lore: {
    en: "A former scholar whose mind was completely shattered while attempting to map the mathematical structure of the endless cycle. He saw the true face of the Architect and it broke him beyond repair. His brain is now fully exposed and pulsating with cosmic energy, while his eyes are sewn shut—he no longer requires mortal sight to perceive the geometry of reality itself.",
    fr: "Un ancien érudit dont l'esprit fut entièrement brisé en tentant de cartographier la structure mathématique du cycle infini. Il vit le vrai visage de l'Architecte et cela le détruisit sans réparation possible. Son cerveau est désormais entièrement exposé et pulsant d'énergie cosmique, tandis que ses yeux sont cousus — il n'a plus besoin de la vue mortelle pour percevoir la géométrie de la réalité elle-même.",
    zh: "一位前学者，在试图解析无限循环的数学结构时精神彻底崩溃。他看到了建筑师的真实面目，这使他不可逆地毁灭。如今他的大脑完全暴露，脉动着宇宙能量，双眼被缝合——他已不再需要凡俗视觉去理解现实的几何结构。"
  },
  quotes: [
    {
      en: "The angles... the variables... you are a miscalculation.",
      fr: "Les angles... les variables... tu es un mauvais calcul.",
      zh: "角度……变量……你是一个计算错误。"
    },
    {
      en: "I see the strings! I see the hand that moves you!",
      fr: "Je vois les ficelles ! Je vois la main qui te manipule !",
      zh: "我看到线了！我看到操纵你的那只手！"
    },
    {
      en: "Your death is a mathematical certainty.",
      fr: "Ta mort est une certitude mathématique.",
      zh: "你的死亡是一个数学必然。"
    }
  ]
},
  elara: {
  id: 'elara',
  baseHp: 25000,
  baseDamage: 30,
  baseSpeed: 20,
  xpValue: 0,
  spriteKey: 'rot_bringer',
  name: {
    en: 'Elara, the Weeping Miasma',
    fr: 'Elara, le Miasme Pleureur',
    zh: '埃拉拉，哭泣的瘴气'
  },
  lore: {
    en: "Once a pure maiden of unparalleled healing magic. When she was trapped in the Realm, she desperately tried to cure it of its curse. Instead, over thousands of years, she absorbed all of its sickness. She has devolved into a melancholic, colossal slime-goddess who drowns the heroes in toxic, suffocating affection, believing she is 'saving' them.",
    fr: "Autrefois une pure jeune fille dotée d'une magie de guérison inégalée. Piégée dans le Royaume, elle tenta désespérément de le guérir de sa malédiction. Au lieu de cela, au fil des milliers d'années, elle absorba toute sa maladie. Elle s'est dégradée en une déesse-limace colossale et mélancolique qui noie les héros dans une affection toxique et étouffante, croyant les « sauver ».",
    zh: "曾经是一位拥有无与伦比治愈魔法的纯洁少女。当她被困在领域中时，她拼命试图治愈其诅咒。结果在数千年间，她吸收了所有的病痛。她退化为一位忧郁的巨大史莱姆女神，用有毒、窒息的“爱意”淹没英雄们，并相信自己是在“拯救”他们。"
  },
  quotes: [
    {
      en: "Hush now, little one... let me take your sickness away.",
      fr: "Chut maintenant, petit... laisse-moi emporter ta maladie.",
      zh: "嘘，现在，小家伙……让我带走你的病痛。"
    },
    {
      en: "Why do you run? My embrace is so warm... so quiet.",
      fr: "Pourquoi fuis-tu ? Mon étreinte est si chaude... si calme.",
      zh: "你为什么要跑？我的拥抱如此温暖……如此安静。"
    },
    {
      en: "You look so tired. Rest in my waters forever.",
      fr: "Tu as l'air si fatigué. Repose-toi dans mes eaux pour toujours.",
      zh: "你看起来好累。在我的水中永远安息吧。"
    }
  ]
},
  valeria: {
  id: 'valeria',
  baseHp: 15000,
  baseDamage: 35,
  baseSpeed: 80,
  xpValue: 0,
  spriteKey: 'mad_puppeteer',
  name: {
    en: 'Valeria, the Crimson Maestro',
    fr: 'Valeria, le Maestro Cramoisi',
    zh: '瓦莱丽亚，猩红大师'
  },
  lore: {
    en: "An elegant but deeply sadistic entity who grew so bored with the endless cycle that she began to treat it as her own personal theater. She views the heroes as mere marionettes in a grand tragedy, using blood magic to pull their strings and mock their futile attempts at freedom.",
    fr: "Une entité élégante mais profondément sadique qui s'ennuya tant du cycle infini qu'elle commença à le traiter comme son propre théâtre personnel. Elle voit les héros comme de simples marionnettes dans une grande tragédie, utilisant la magie du sang pour tirer leurs ficelles et se moquer de leurs vaines tentatives de liberté.",
    zh: "一位优雅却极度施虐的存在，她厌倦了无尽的循环，于是将其视为自己的私人剧场。她将英雄们当作宏大悲剧中的傀儡，利用血魔法操控他们的丝线，并嘲笑他们徒劳的自由挣扎。"
  },
  quotes: [
    {
      en: "Act one begins! Try not to die too quickly, darling.",
      fr: "Le premier acte commence ! Essaye de ne pas mourir trop vite, chéri.",
      zh: "第一幕开始！尽量不要死得太快，亲爱的。"
    },
    {
      en: "Which one am I? Oh, the suspense is killing you!",
      fr: "Lequel suis-je ? Oh, le suspense te tue !",
      zh: "我是哪一个？哦，这种悬念要杀了你！"
    },
    {
      en: "A tragic finale! Bow for the audience!",
      fr: "Un final tragique ! Saluez le public !",
      zh: "悲剧的终章！向观众鞠躬！"
    }
  ]
}
};