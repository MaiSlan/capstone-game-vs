// src/data/RewardDB.js

export const REWARD_DB = {
  weapons: {
    viking: [
      { 
        id: 'bouncing_axe', type: 'weapon', icon: 'assets/weapons/axe.png',
        title: { en: "Leviathan's Bite", fr: "La Morsure du Léviathan", zh: "利维坦之咬" },
        desc: { 
          en: 'A frosted axe that seeks warmth, leaping from vein to vein.', 
          fr: 'Une hache givrée qui cherche la chaleur, bondissant de veine en veine.', 
          zh: '一把渴望温暖的冰霜之斧，在血管间跳跃。' 
        } 
      },
      { 
        id: 'piercing_lance', type: 'weapon', icon: 'assets/weapons/spear.png',
        title: { en: 'Wyrm-Spit', fr: 'Crachat de Wyrm', zh: '巨龙之吐息' },
        desc: { 
          en: 'A great harpoon meant to pierce scales thick as mountains.', 
          fr: 'Un grand harpon conçu pour percer des écailles aussi épaisses que des montagnes.', 
          zh: '一柄足以刺穿如山脉般厚重鳞片的巨型鱼叉。' 
        } 
      },
      { 
        id: 'seismic_stomp', type: 'weapon', icon: 'assets/weapons/stomp_icon.png',
        title: { en: "Surtur's Wake", fr: 'Sillage de Surtur', zh: '苏尔特尔的苏醒' },
        desc: { 
          en: 'Shatter the earth to ensnare the foolish. Leaves burning ruins.', 
          fr: 'Brise la terre pour piéger les imprudents. Laisse des ruines fumantes.', 
          zh: '粉碎大地以困住愚者。留下燃烧的废墟。' 
        } 
      },
      { 
        id: 'dragon_shout', type: 'weapon', icon: 'assets/weapons/shout_icon.png',
        title: { en: "World-Eater's Voice", fr: 'Voix du Dévoreur de Mondes', zh: '噬界者之声' },
        desc: { 
          en: 'Guttural words of power. Blasts the swarm backward into dust.', 
          fr: 'Des mots de pouvoir gutturaux. Repousse la nuée et la réduit en poussière.', 
          zh: '充满力量的低吼。将虫群击退化为尘埃。' 
        } 
      }
    ],
    pirate: [
      { 
        id: 'musket', type: 'weapon', icon: 'assets/weapons/musket_icon.png',
        title: { en: "The Merchant's Folly", fr: 'La Folie du Marchand', zh: '商人的愚行' },
        desc: { 
          en: 'Chaotic powder; some shots merely sting, others tear reality asunder.', 
          fr: "Poudre chaotique ; certains tirs ne font que piquer, d'autres déchirent la réalité.", 
          zh: '混乱的火药；有些射击只是刺痛，有些则撕裂现实。' 
        } 
      },
      { 
        id: 'molotov', type: 'weapon', icon: 'assets/weapons/molotov_icon.png',
        title: { en: 'Nemesis Brew', fr: 'Breuvage de Némésis', zh: '复仇女神之酿' },
        desc: { 
          en: 'Bottled madness that burns the flesh and leaves a golden residue.', 
          fr: 'Folie en bouteille qui brûle la chair et laisse un résidu doré.', 
          zh: '瓶装的疯狂，燃烧血肉并留下金色的残渣。' 
        } 
      },
      { 
        id: 'treasure_shovel', type: 'weapon', icon: 'assets/weapons/shovel_icon.png',
        title: { en: "Grave-Robber's Toll", fr: 'Tribut du Pilleur de Tombes', zh: '盗墓贼的代价' },
        desc: { 
          en: 'A chipped spade that digs past bone to unearth hidden greed.', 
          fr: 'Une bêche ébréchée qui creuse au-delà des os pour déterrer la cupidité cachée.', 
          zh: '一把缺口的铁锹，挖穿白骨以寻找隐藏的贪婪。' 
        } 
      },
      { 
        id: 'loaded_dice', type: 'weapon', icon: 'assets/weapons/dice_icon.png',
        title: { en: "Devil's Bones", fr: 'Ossements du Diable', zh: '恶魔之骨' },
        desc: { 
          en: 'Carved from the knuckles of a forgotten king. Dictates cruel fates.', 
          fr: 'Sculpté dans les jointures d\'un roi oublié. Dicte des destins cruels.', 
          zh: '用被遗忘的国王指骨雕刻而成。宣告残酷的命运。' 
        } 
      }
    ],
    berserker: [
      { 
        id: 'iron_slab', type: 'weapon', icon: 'assets/weapons/greatsword_icon.png',
        title: { en: 'The Iron Slab', fr: 'La Plaque de Fer', zh: '铁块大剑' },
        desc: { 
          en: 'Too big, thick, and heavy to be called a sword. Cleaves everything.', 
          fr: 'Trop grande, épaisse et lourde pour être appelée une épée. Elle fend tout.', 
          zh: '太大、太厚、太重，根本称不上是剑。劈开一切。' 
        } 
      },
      { 
        id: 'fan_of_knives', type: 'weapon', icon: 'assets/weapons/knives_icon.png',
        title: { en: "Swallow's Flight", fr: "Vol de l'Hirondelle", zh: '飞燕' },
        desc: { 
          en: "A barrage of poisoned steel, a vagabond's desperate strike.", 
          fr: "Un barrage d'acier empoisonné, la frappe désespérée d'un vagabond.", 
          zh: '一阵淬毒钢铁的弹幕，流浪者的绝望一击。' 
        } 
      },
      { 
        id: 'trail_grenades', type: 'weapon', icon: 'assets/weapons/grenade_icon.png',
        title: { en: "Alchemist's Regret", fr: "Regret de l'Alchimiste", zh: '炼金术士的悔恨' },
        desc: { 
          en: 'Explosive orbs left in your wake. Nothing follows the Black Swordsman.', 
          fr: "Des orbes explosifs laissés dans votre sillage. Personne ne suit l'Épéiste Noir.", 
          zh: '在你身后留下的爆炸法球。没有人能跟随黑剑士。' 
        } 
      },
      { 
        id: 'arm_cannon', type: 'weapon', icon: 'assets/weapons/cannon_icon.png',
        title: { en: 'The Iron Hand', fr: 'La Main de Fer', zh: '铁手' },
        desc: { 
          en: 'A prosthetic monstrosity. Violently exhales fire and shrapnel.', 
          fr: "Une monstruosité prothétique. Exhale violemment du feu et des éclats d'obus.", 
          zh: '一个假体怪物。猛烈地喷吐出火焰和弹片。' 
        } 
      }
    ],
    paladin: [
      { 
        id: 'shield_bash', type: 'weapon', icon: 'assets/weapons/shield_icon.png',
        title: { en: 'The Aegis Wall', fr: "Le Mur de l'Égide", zh: '庇护之墙' },
        desc: { 
          en: 'A declaration of unyielding resolve. Halts and stuns the dark.', 
          fr: 'Une déclaration de détermination inébranlable. Stoppe et étourdit les ténèbres.', 
          zh: '不屈意志的宣言。阻挡并击晕黑暗。' 
        } 
      },
      { 
        id: 'holy_broadsword', type: 'weapon', icon: 'assets/weapons/holy_sword_icon.png',
        title: { en: 'Righteous Penance', fr: 'Pénitence Vertueuse', zh: '正义苦修' },
        desc: { 
          en: 'A blade forged in fire; each swing is a prayer, every 3rd an execution.', 
          fr: 'Une lame forgée dans le feu ; chaque coup est une prière, le 3ème une exécution.', 
          zh: '在火焰中锻造的刀刃；每一次挥舞都是一次祈祷，每三次便是一次处决。' 
        } 
      },
      { 
        id: 'consecrated_ground', type: 'weapon', icon: 'assets/weapons/aura_icon.png',
        title: { en: 'Grace of the White Tree', fr: "Grâce de l'Arbre Blanc", zh: '白树之恩典' },
        desc: { 
          en: 'Sanctify the profane earth. A lingering haven that mends flesh.', 
          fr: 'Sanctifiez la terre profane. Un havre persistant qui répare les chairs.', 
          zh: '净化被亵渎的大地。一个能够治愈血肉的短暂避难所。' 
        } 
      },
      { 
        id: 'spinning_cross', type: 'weapon', icon: 'assets/weapons/cross_icon.png',
        title: { en: "Inquisitor's Halo", fr: "Auréole de l'Inquisiteur", zh: '审判官的光环' },
        desc: { 
          en: 'A heavy cruciform that spins like a star of judgment to grind the wicked.', 
          fr: 'Un lourd cruciforme qui tourne comme une étoile de jugement pour broyer les impies.', 
          zh: '一个沉重的十字架，像审判之星一样旋转以碾碎邪恶。' 
        } 
      }
    ],
    witch: [
      { 
        id: 'magic_orb', type: 'weapon', icon: 'assets/weapons/magic_orb.png',
        title: { en: 'The Void Eye', fr: "L'Œil du Vide", zh: '虚空之眼' },
        desc: { 
          en: 'A sphere of abyssal gravity that hungers for life. Seeks the nearest soul.', 
          fr: "Une sphère de gravité abyssale qui a soif de vie. Cherche l'âme la plus proche.", 
          zh: '一个渴望生命的深渊引力球。寻找最近的灵魂。' 
        } 
      },
      { 
        id: 'magic_book', type: 'weapon', icon: 'assets/weapons/spellbook.png',
        title: { en: 'Forbidden Folios', fr: 'Folios Interdits', zh: '禁忌对开本' },
        desc: { 
          en: 'Ancient texts that orbit your vessel, ripping the marrow from those who step close.', 
          fr: "Des textes anciens qui orbitent autour de votre réceptacle, arrachant la moelle de ceux qui s'approchent.", 
          zh: '环绕着你的躯壳的古老文字，撕裂靠近者的骨髓。' 
        } 
      },
      { 
        id: 'arcane_nova', type: 'weapon', icon: 'assets/weapons/nova_icon.png',
        title: { en: 'Chaos Pulse', fr: 'Pulsion de Chaos', zh: '混沌脉冲' },
        desc: { 
          en: 'A violent rejection of the physical world. Tears the veil to shatter the swarm.', 
          fr: 'Un rejet violent du monde physique. Déchire le voile pour fracasser la nuée.', 
          zh: '对物理世界的猛烈排斥。撕裂帷幕以粉碎虫群。' 
        } 
      },
      { 
        id: 'magic_wand', type: 'weapon', icon: 'assets/weapons/wand_icon.png',
        title: { en: 'Violet Comet', fr: 'Comète Violette', zh: '紫罗兰彗星' },
        desc: { 
          en: 'A concentrated beam of agonizing starlight. Sweeps the earth clean of the unworthy.', 
          fr: 'Un rayon concentré de lumière stellaire atroce. Balaie la terre de ses indignes.', 
          zh: '一束令人痛苦的星光射线。将大地上不配存活的生命扫除殆尽。' 
        } 
      }
    ],
    drifter: [
      { 
        id: 'meteorite_blade', type: 'weapon', icon: 'assets/weapons/meteorite_blade_icon.png',
        title: { en: 'The Meteorite Blade', fr: 'La Lame Météorite', zh: '陨星之刃' },
        desc: { 
          en: 'A rapid, forward-lunging dash-strike that pierces through enemies in a line.', 
          fr: 'Une frappe rapide en avant qui transperce les ennemis sur une ligne.', 
          zh: '迅速向前突刺的冲刺攻击，穿透一条直线上的敌人。' 
        } 
      },
      { 
        id: 'phantom_strike', type: 'weapon', icon: 'assets/weapons/phantom_strike_icon.png',
        title: { en: 'Tear in the Veil', fr: 'Déchirure dans le Voile', zh: '帷幕之裂' },
        desc: { 
          en: 'Rip open micro-fissures, sending phantoms to violently chain-strike the swarm.', 
          fr: 'Ouvrez de micro-fissures, envoyant des fantômes frapper violemment la nuée.', 
          zh: '撕开微小的裂缝，召唤幻影对虫群进行猛烈的连环打击。' 
        } 
      },
      { 
        id: 'chilling_aura', type: 'weapon', icon: 'assets/weapons/frost_aura_icon.png',
        title: { en: 'Echo of the Frost', fr: 'Écho du Givre', zh: '冰霜的回音' },
        desc: { 
          en: 'A localized blast of freezing wind that coats the earth in unnatural rime.', 
          fr: "Une rafale localisée de vent glacial qui recouvre la terre d'un givre surnaturel.", 
          zh: '一阵局部的刺骨寒风，将大地覆盖上不自然的冰霜。' 
        } 
      },
      { 
        id: 'conjunction_sphere', type: 'weapon', icon: 'assets/weapons/conjunction_sphere_icon.png',
        title: { en: 'Conjunction Sphere', fr: 'Sphère de Conjonction', zh: '天体交汇之球' },
        desc: { 
          en: 'Harness catastrophic energy to call down stellar debris on the densest clusters.', 
          fr: "Exploitez une énergie catastrophique pour faire s'abattre des débris stellaires sur les groupes denses.", 
          zh: '驾驭灾难性的能量，召唤星辰碎片砸向最密集的敌群。' 
        } 
      }
    ]
  },
  items: {
    common: [
      { 
        id: 'speed_boots', type: 'item', icon: 'assets/items/equipable/boots.png',
        title: { en: 'Gravewalker Boots', fr: 'Bottes du Marche-Tombes', zh: '行墓者之靴' },
        desc: { 
          en: 'Increases movement speed. Flee while you still have legs.', 
          fr: 'Augmente la vitesse de déplacement. Fuyez tant que vous avez encore des jambes.', 
          zh: '提升移动速度。趁你的腿还在，赶紧逃吧。' 
        } 
      },
      { 
        id: 'vitality_ring', type: 'item', icon: 'assets/items/equipable/ring.png',
        title: { en: 'Ring of Sacrifice', fr: 'Anneau de Sacrifice', zh: '牺牲之戒' },
        desc: { 
          en: 'Increases Max HP. Pain is the only true currency here.', 
          fr: 'Augmente les PV max. La douleur est la seule véritable monnaie ici.', 
          zh: '提升最大生命值。在这里，痛苦是唯一的硬通货。' 
        } 
      },
      { 
        id: 'thief_gloves', type: 'item', icon: 'assets/items/equipable/gloves.png',
        title: { en: "Scavenger's Grasp", fr: "Étreinte du Charognard", zh: '拾荒者的抓取' },
        desc: { 
          en: 'Increases magnetic pull for extracting souls, but slows attacks.', 
          fr: "Augmente l'attraction magnétique pour extraire les âmes, mais ralentit les attaques.", 
          zh: '增强提取灵魂的磁力，但会降低攻击速度。' 
        } 
      },
      { 
        id: 'coin_purse', type: 'item', icon: 'assets/items/equipable/coin_purse.png',
        title: { en: "Charon's Toll", fr: 'Le Péage de Charon', zh: '卡戎的通行费' },
        desc: { 
          en: 'Enemies drop more gold. Worthless to the dead, valuable to the Ferryman.', 
          fr: "Les ennemis lâchent plus d'or. Inutile pour les morts, précieux pour le Passeur.", 
          zh: '敌人掉落更多的金币。对死者毫无价值，但对摆渡人来说却很珍贵。' 
        } 
      },
      { 
        id: 'sacrificial_dagger', type: 'item', icon: 'assets/items/equipable/dagger.png',
        title: { en: 'Blood-Letting Kris', fr: 'Kriss de Saignée', zh: '放血克里斯匕首' },
        desc: { 
          en: 'Increases Damage, reduces Max HP. A dangerous bargain.', 
          fr: 'Augmente les dégâts, réduit les PV max. Un marché dangereux.', 
          zh: '提升伤害，降低最大生命值。一场危险的交易。' 
        } 
      },
      { 
        id: 'broken_arrow', type: 'item', icon: 'assets/items/equipable/broken_arrow.png',
        title: { en: 'Petrified Shaft', fr: 'Fût Pétrifié', zh: '石化箭杆' },
        desc: { 
          en: 'Increases Armor, drastically reduces speed. Stand your ground.', 
          fr: "Augmente l'Armure, réduit drastiquement la vitesse. Tenez vos positions.", 
          zh: '提升护甲，大幅降低速度。坚守阵地。' 
        } 
      },
      { 
        id: 'voodoo_doll', type: 'item', icon: 'assets/items/equipable/voodoo.png',
        title: { en: 'Effigy of the Damned', fr: 'Effigie des Damnés', zh: '被诅咒者的假人' },
        desc: { 
          en: 'Massive buffs, but constantly drains HP. A curse on your own house.', 
          fr: 'Buffs massifs, mais draine constamment les PV. Une malédiction sur votre propre maison.', 
          zh: '获得巨幅增益，但持续消耗生命值。这是对你自己的诅咒。' 
        } 
      },
      { 
        id: 'haste_necklace', type: 'item', icon: 'assets/items/equipable/necklace.png',
        title: { en: 'Pendant of the Frenzied', fr: 'Pendentif du Frénétique', zh: '狂乱坠饰' },
        desc: { 
          en: 'Increases attack speed. The heart beats faster as the end approaches.', 
          fr: "Augmente la vitesse d'attaque. Le cœur bat plus vite à l'approche de la fin.", 
          zh: '提升攻击速度。随着终结的临近，心跳也随之加速。' 
        } 
      },
      { 
        id: 'mysterious_letter', type: 'item', icon: 'assets/items/equipable/letter.png',
        title: { en: 'Sealed Interstice Missive', fr: "Missive Scellée de l'Interstice", zh: '封印的缝隙信件' },
        desc: { 
          en: 'Increases all XP gained. Forbidden knowledge from the other side.', 
          fr: "Augmente l'XP gagnée. Un savoir interdit de l'autre côté.", 
          zh: '增加所有获得的经验值。来自另一端的禁忌知识。' 
        } 
      },
      { 
        id: 'cursed_skull', type: 'item', icon: 'assets/items/equipable/skull.png',
        title: { en: 'Beherit Skull', fr: 'Crâne Béhérit', zh: '贝黑莱特头骨' },
        desc: { 
          en: 'Grants Lifesteal, but increases enemy spawns. It hungers for the eclipse.', 
          fr: "Octroie du vol de vie, mais augmente l'apparition d'ennemis. Il a soif de l'éclipse.", 
          zh: '赋予生命偷取，但增加敌人生成数量。它渴望着日食。' 
        } 
      }
    ],
    consumables: [
      { 
        id: 'heal', type: 'consumable', icon: 'assets/items/consumable/potion.png',
        title: { en: 'Estus Flask', fr: "Fiole d'Estus", zh: '原素瓶' },
        desc: { 
          en: 'Mends shattered flesh. Instantly restores all HP.', 
          fr: 'Répare la chair brisée. Restaure instantanément tous les PV.', 
          zh: '治愈破碎的血肉。瞬间恢复所有生命值。' 
        } 
      }
    ]
  }
};