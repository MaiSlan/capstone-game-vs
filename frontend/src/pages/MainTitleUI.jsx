// src/components/MainTitleUI.jsx (or src/pages/MainTitleUI.jsx)
import { useState, useEffect } from 'react';

// --- LOCALIZATION DICTIONARY ---
const UI_DICT = {
  title: { en: 'BRANDED DESCENT', fr: 'BRANDED DESCENT', zh: 'BRANDED DESCENT' },
  subtitle: { en: 'Ouroboros Rift', fr: 'Faille d\'Ouroboros', zh: '衔尾蛇裂隙' },
  prompt: { en: 'PRESS ANY KEY TO AWAKEN', fr: 'APPUYEZ SUR UNE TOUCHE POUR VOUS ÉVEILLER', zh: '按任意键唤醒' }
};

export default function MainTitleUI() {
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');
  
  const handleAwaken = () => {
    window.dispatchEvent(new CustomEvent('VS_ENTER_MENU'));
  };

  useEffect(() => {
    // 1. Language Listeners
    const handleSettingsUpdate = (e) => {
      if (e.detail && e.detail.language) setLanguage(e.detail.language);
    };
    const handleStorageUpdate = () => {
      setLanguage(localStorage.getItem('vs_lang') || 'en');
    };

    window.addEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    // 2. Keyboard Listener for "Press Any Key"
    const handleKeyDown = () => handleAwaken();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const t = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.en || '';
  };

  return (
    <div 
      className="absolute inset-0 z-40 flex flex-col items-center justify-center font-grim select-none cursor-pointer bg-transparent" 
      onClick={handleAwaken}
    >
      <div className="flex flex-col items-center animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-[0.4em] text-red-700 drop-shadow-[0_0_20px_rgba(185,28,28,0.8)] text-center">
          {t(UI_DICT.title)}
        </h1>
        <h2 className="mt-4 text-sm md:text-base font-sans uppercase tracking-[0.6em] text-zinc-400">
          {t(UI_DICT.subtitle)}
        </h2>
        
        <p className="mt-24 text-xs md:text-sm font-sans uppercase tracking-[0.4em] text-zinc-300 animate-pulse">
          {t(UI_DICT.prompt)}
        </p>
      </div>
    </div>
  );
}