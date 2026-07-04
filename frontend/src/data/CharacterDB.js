// src/data/CharacterDB.js

export const CHARACTER_DB = {
  viking: { 
    id: 'viking',
    hp: 150,        
    speed: 150,
    weaponId: 'bouncing_axe',
    name: {
      en: 'Hrogar, the Blood-Eagle',
      fr: "Hrogar, l'Aigle de Sang",
      zh: '赫罗加，血鹰'
    },
    weaponName: {
      en: "Leviathan's Bite",
      fr: 'La Morsure du Léviathan',
      zh: '利维坦之咬'
    },
    quotes: [
      {
        en: "The seer promised me the world... but this is just a slaughterhouse.",
        fr: "Le devin m'avait promis le monde... mais ce n'est qu'un abattoir.",
        zh: "先知曾许诺我整个世界……但这只是一个屠宰场。"
      },
      {
        en: "What kind of god forces a man to crawl through his own blood forever?",
        fr: "Quel genre de dieu force un homme à ramper dans son propre sang pour l'éternité ?",
        zh: "什么样的神会强迫一个人永远在自己的血泊中爬行？"
      },
      {
        en: "I used to crave the roar of battle. Now, I just want the silence. Don't make me go back.",
        fr: "Avant, j'avais soif du rugissement des batailles. Maintenant, je ne veux que le silence. Ne m'y renvoyez pas.",
        zh: "我曾经渴望战斗的咆哮。现在，我只想求得安宁。别让我回去。"
      },
      {
        en: "There is no Valhalla. Only you, pulling my strings in the dark.",
        fr: "Le Valhalla n'existe pas. Il n'y a que vous, tirant mes ficelles dans l'obscurité.",
        zh: "没有英灵殿。只有你在黑暗中操纵着我的命运。"
      },
      {
        en: "My bones are dust, my spirit is ash... let me rot in peace.",
        fr: "Mes os sont poussière, mon esprit est cendre... laissez-moi pourrir en paix.",
        zh: "我的骨头已成尘土，我的灵魂已化灰烬……让我安息吧。"
      },
      {
        en: "I have died a thousand deaths. Is my legend not written yet? Stop this.",
        fr: "Je suis mort mille fois. Ma légende n'est-elle pas encore écrite ? Arrêtez ça.",
        zh: "我已经死了一千次。我的传说还没写完吗？停下吧。"
      }
    ]
  },
  
  pirate: { 
    id: 'pirate',
    hp: 100,        
    speed: 250,     
    weaponId: 'musket',
    name: {
      en: 'Captain Calypso, the Blood Siren',
      fr: 'Capitaine Calypso, la Sirène de Sang',
      zh: '卡吕普索船长，血妖姬'
    },
    weaponName: {
      en: "The Merchant's Folly",
      fr: 'La Folie du Marchand',
      zh: '商人的愚行'
    },
    quotes: [
      {
        en: "*Hic*... Pour me another, and maybe I won't feel their teeth this time.",
        fr: "*Hic*... Sers-m'en un autre, et peut-être que je ne sentirai pas leurs crocs cette fois.",
        zh: "*嗝*……再给我倒一杯，也许这次我就感觉不到他们的牙齿了。"
      },
      {
        en: "There isn't enough rum in the world to wash away the red light.",
        fr: "Il n'y a pas assez de rhum au monde pour effacer cette lumière rouge.",
        zh: "这世上没有足够的朗姆酒能洗刷掉那红色的光芒。"
      },
      {
        en: "I'll give you all the gold I scavenged... just don't make me sail that abyss again.",
        fr: "Je vous donnerai tout l'or que j'ai pillé... mais ne m'obligez pas à naviguer sur cet abîme à nouveau.",
        zh: "我会把我搜刮的所有金子都给你……只要别让我再航行于那片深渊。"
      },
      {
        en: "The compass just spins... we're going nowhere. Stop sending me down.",
        fr: "La boussole ne fait que tourner... nous n'allons nulle part. Arrêtez de m'envoyer là-bas.",
        zh: "指南针只是一直在转……我们哪儿也去不了。别再派我下去了。"
      },
      {
        en: "Everything's spinning... or is that just the node? Let a captain sleep...",
        fr: "Tout tourne... ou est-ce juste le nœud ? Laissez un capitaine dormir...",
        zh: "一切都在旋转……还是说那只是节点？让船长睡一会儿吧……"
      },
      {
        en: "I wagered my soul and lost. Haven't I paid my debt? Stop picking me.",
        fr: "J'ai parié mon âme et j'ai perdu. N'ai-je pas payé ma dette ? Arrêtez de me choisir.",
        zh: "我拿灵魂打赌，输了。难道我还没还清债务吗？别再选我了。"
      }
    ]
  },
  
  berserker: { 
    id: 'berserker',
    hp: 120,        
    speed: 180,     
    weaponId: 'iron_slab',
    name: {
      en: 'Galt, the Branded Hound',
      fr: 'Galt, le Chien Marqué',
      zh: '加尔特，烙印猎犬'
    },
    weaponName: {
      en: 'The Iron Slab',
      fr: 'La Plaque de Fer',
      zh: '铁块大剑'
    },
    quotes: [
      {
        en: "No matter how hard I swing... I can't reach him. It's all for nothing.",
        fr: "Peu importe la force avec laquelle je frappe... je ne peux pas l'atteindre. Tout ça pour rien.",
        zh: "无论我怎么用力挥舞……我都触不到他。一切都是徒劳。"
      },
      {
        en: "My sword just phases through the dark. Why do I keep fighting?",
        fr: "Mon épée passe au travers de l'obscurité. Pourquoi est-ce que je continue de me battre ?",
        zh: "我的剑只是穿透了黑暗。我为什么还要继续战斗？"
      },
      {
        en: "I thought my rage would be enough. But I'm just empty now.",
        fr: "Je pensais que ma rage suffirait. Mais je suis juste vide, maintenant.",
        zh: "我以为我的愤怒就足够了。但现在我只感到空虚。"
      },
      {
        en: "Please... my hands won't stop shaking. Let the hound rest.",
        fr: "Pitié... mes mains n'arrêtent pas de trembler. Laissez le chien se reposer.",
        zh: "求求你……我的手一直在抖。让猎犬休息吧。"
      },
      {
        en: "The brand is cold. Everything is cold. Don't wake me up again.",
        fr: "La marque est froide. Tout est froid. Ne me réveillez plus.",
        zh: "烙印很冷。一切都很冷。别再唤醒我了。"
      },
      {
        en: "Even if my flesh rots, my sword will swing... but I am so tired.",
        fr: "Même si ma chair pourrit, mon épée frappera... mais je suis si fatigué.",
        zh: "即使我的肉体腐烂，我的剑也会挥动……但我太累了。"
      }
    ]
  },
  
  paladin: { 
    id: 'paladin',
    hp: 200,        
    speed: 120,     
    weaponId: 'shield_bash',
    name: {
      en: 'Balian, Last Praetorian',
      fr: 'Balian, le Dernier Prétorien',
      zh: '巴利安，最后的近卫军'
    },
    weaponName: {
      en: 'The Aegis Wall',
      fr: "Le Mur de l'Égide",
      zh: '庇护之墙'
    },
    quotes: [
      {
        en: "I prayed for the Emperor's light, but only the abyss answered.",
        fr: "J'ai prié pour la lumière de l'Empereur, mais seul l'abîme m'a répondu.",
        zh: "我祈求皇帝的光芒，但只有深渊回应了我。"
      },
      {
        en: "Was my devotion just a lie? Why have we been forsaken?",
        fr: "Ma dévotion n'était-elle qu'un mensonge ? Pourquoi avons-nous été abandonnés ?",
        zh: "我的虔诚只是一个谎言吗？我们为何被抛弃？"
      },
      {
        en: "My knees are bruised from praying to a deaf god. Do not send me back to the altar.",
        fr: "Mes genoux sont meurtris d'avoir prié un dieu sourd. Ne me renvoyez pas à l'autel.",
        zh: "向一个充耳不闻的神祈祷，我的双膝已满是淤青。别把我送回祭坛了。"
      },
      {
        en: "There is no holy war here. Just an execution. Please, spare me.",
        fr: "Il n'y a pas de guerre sainte ici. Juste une exécution. Pitié, épargnez-moi.",
        zh: "这里没有圣战。只有一场处决。求求你，放过我吧。"
      },
      {
        en: "I drop my shield. I renounce my vows. Just let it end.",
        fr: "Je lâche mon bouclier. Je renonce à mes vœux. Que tout cela se termine.",
        zh: "我放下盾牌。我放弃誓言。让这一切结束吧。"
      },
      {
        en: "The Emperor's light does not reach this place. Leave me in the dark.",
        fr: "La lumière de l'Empereur n'atteint pas cet endroit. Laissez-moi dans l'obscurité.",
        zh: "皇帝的光芒无法触及这里。让我在黑暗中吧。"
      }
    ]
  },
  
  witch: { 
    id: 'witch',
    hp: 90,         
    speed: 230,     
    weaponId: 'magic_orb',
    name: {
      en: 'Yenna, Obsidian Scholar',
      fr: "Yenna, l'Érudite d'Obsidienne",
      zh: '耶娜，黑曜石学者'
    },
    weaponName: {
      en: 'The Void Eye',
      fr: "L'Œil du Vide",
      zh: '虚空之眼'
    },
    quotes: [
      {
        en: "I haven't slept since... since the first descent.",
        fr: "Je n'ai pas dormi depuis... depuis la première descente.",
        zh: "从……从第一次降临开始，我就没睡过觉。"
      },
      {
        en: "Just let me close my eyes. Please don't click my name.",
        fr: "Laissez-moi juste fermer les yeux. Par pitié, ne cliquez pas sur mon nom.",
        zh: "让我闭上眼睛吧。求你别点击我的名字。"
      },
      {
        en: "My magic feels so heavy. I'm just so tired.",
        fr: "Ma magie me semble si lourde. Je suis juste tellement fatiguée.",
        zh: "我的魔法感觉好沉重。我真的太累了。"
      },
      {
        en: "Why do you keep sending me down there? I can't take another cycle.",
        fr: "Pourquoi continuez-vous à m'envoyer là-bas ? Je ne peux pas supporter un autre cycle.",
        zh: "你为什么一直把我往下送？我无法再承受一次轮回了。"
      },
      {
        en: "There's nothing left to learn in the dark. Leave me be.",
        fr: "Il n'y a plus rien à apprendre dans le noir. Laissez-moi tranquille.",
        zh: "在黑暗中已经没有什么可学的了。让我一个人待着吧。"
      },
      {
        en: "I forgot what the real sky looks like. Don't make me look at the red sun again.",
        fr: "J'ai oublié à quoi ressemble le vrai ciel. Ne m'obligez pas à regarder le soleil rouge à nouveau.",
        zh: "我忘了真正的天空是什么样子。别让我再看那红色的太阳了。"
      }
    ]
  },
  
  drifter: { 
    id: 'drifter',
    hp: 110,         
    speed: 240,     
    weaponId: 'meteorite_blade',
    name: {
      en: 'Cira, the Ashen Swallow',
      fr: "Cira, l'Hirondelle Cendrée",
      zh: '希拉，灰烬飞燕'
    },
    weaponName: {
      en: 'The Meteorite Blade',
      fr: 'La Lame Météorite',
      zh: '陨星之刃'
    },
    quotes: [
      {
        en: "I have outrun the frost across a dozen worlds... but there are no doors here.",
        fr: "J'ai échappé au givre à travers une douzaine de mondes... mais il n'y a pas de portes, ici.",
        zh: "我曾在十几个世界中跑赢了严寒……但这里没有门。"
      },
      {
        en: "My blood was supposed to be a gift. In this dark, it is just bait.",
        fr: "Mon sang était censé être un don. Dans ces ténèbres, ce n'est qu'un appât.",
        zh: "我的血本应是一份礼物。在这黑暗中，它只是诱饵。"
      },
      {
        en: "Another timeline, another slaughter. Will I ever just rest?",
        fr: "Une autre chronologie, un autre massacre. Vais-je seulement me reposer un jour ?",
        zh: "另一条时间线，另一场屠杀。我还能安息吗？"
      },
      {
        en: "I can feel the space tearing around me, but it never leads out. Stop pushing me.",
        fr: "Je sens l'espace se déchirer autour de moi, mais cela ne mène jamais vers la sortie. Arrêtez de me pousser.",
        zh: "我能感觉到周围的空间在撕裂，但它永远没有出口。别再逼我了。"
      },
      {
        en: "My blade is heavy with the blood of endless cycles. Just let me sleep.",
        fr: "Ma lame s'alourdit du sang de cycles infinis. Laissez-moi juste dormir.",
        zh: "我的剑沾满了无尽轮回的鲜血，变得沉重无比。让我睡吧。"
      },
      {
        en: "I used to jump between stars... now I'm just a rat in a cage. Don't make me go back.",
        fr: "Avant, je sautais d'étoile en étoile... maintenant, je ne suis qu'un rat en cage. Ne m'y renvoyez pas.",
        zh: "我曾经在星辰间跳跃……现在我只是一只笼中鼠。别让我回去。"
      }
    ]
  }
};