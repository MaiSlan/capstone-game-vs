import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navbar: {
        documentation: "Documentation",
        bestiary: "Bestiary",
        statistics: "Statistics",
        bonefire: "BoneFire",
        charSelect: "Character Selection",
        signIn: "SignIn/Register",
        signOut: "Sign Out"
      },
      landing: {
        title: "Branded Descent",
        engine: "Powered by the Ouroboros Rift",
        desc: "A high-performance, browser-based survival engine. Connect, survive, and conquer the Astral Interstice.",
        enter: "Enter the Rift",
        source: "View Source"
      },
      auth: {
        awaken: "Awaken",
        forgePact: "Forge Pact",
        soulSig: "Soul Signature (Email)",
        trueName: "True Name (Username)",
        incantation: "Incantation (Password)",
        enter: "Enter the Rift",
        bind: "Bind Soul",
        channeling: "Channeling...",
        noPact: "No pact exists? Forge one.",
        alreadyBound: "Already bound? Awaken here.",
        success: "Pact forged. You may now awaken."
      }
    }
  },
  fr: {
    translation: {
      navbar: {
        documentation: "Documentation",
        bestiary: "Bestiaire",
        statistics: "Statistiques",
        bonefire: "Feu de camp",
        charSelect: "Sélection de Personnage",
        signIn: "Connexion/Inscription",
        signOut: "Déconnexion"
      },
      landing: {
        title: "Branded Descent",
        engine: "Propulsé par la Faille Ouroboros",
        desc: "Un moteur de survie haute performance sur navigateur. Connectez-vous, survivez et conquérez l'Interstice Astral.",
        enter: "Pénétrer la Faille",
        source: "Voir le Code"
      },
      auth: {
        awaken: "S'éveiller",
        forgePact: "Forger le Pacte",
        soulSig: "Signature d'Âme (Email)",
        trueName: "Nom Véritable (Pseudo)",
        incantation: "Incantation (Mot de passe)",
        enter: "Pénétrer la Faille",
        bind: "Lier l'Âme",
        channeling: "Canalisation...",
        noPact: "Aucun pacte n'existe ? Forgez-en un.",
        alreadyBound: "Déjà lié ? Éveillez-vous ici.",
        success: "Pacte forgé. Vous pouvez vous éveiller."
      }
    }
  },
  zh: {
    translation: {
      navbar: {
        documentation: "文档",
        bestiary: "图鉴",
        statistics: "统计数据",
        bonefire: "篝火",
        charSelect: "角色选择",
        signIn: "登录/注册",
        signOut: "登出"
      },
      landing: {
        title: "Branded Descent",
        engine: "由衔尾蛇裂隙引擎驱动",
        desc: "高性能浏览器端生存引擎。连接、生存并征服星界缝隙。",
        enter: "进入裂隙",
        source: "查看源码"
      },
      auth: {
        awaken: "觉醒",
        forgePact: "缔结契约",
        soulSig: "灵魂印记 (邮箱)",
        trueName: "真名 (用户名)",
        incantation: "咒语 (密码)",
        enter: "进入裂隙",
        bind: "绑定灵魂",
        channeling: "引导中...",
        noPact: "尚未缔结契约？即刻缔结。",
        alreadyBound: "已绑定灵魂？在此觉醒。",
        success: "契约已缔结。你现在可以觉醒了。"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('vs_lang') || 'en', 
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;