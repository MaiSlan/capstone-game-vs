import { useState, useEffect } from 'react';
import { Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UI_DICT = {
  title: { en: 'Branded Descent', fr: 'Descente Marquée', zh: '烙印降临' },
  expand: { en: 'Expand Void', fr: 'Étendre le Vide', zh: '展开虚空' }
};

export default function GameNavbar({ onToggleFullscreen }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');

  useEffect(() => {
    // Sync on mount
    setLanguage(localStorage.getItem('vs_lang') || 'en');

    const handleSettingsUpdate = (e) => {
      if (e.detail && e.detail.language) setLanguage(e.detail.language);
    };
    const handleStorageUpdate = () => {
      setLanguage(localStorage.getItem('vs_lang') || 'en');
    };

    window.addEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const t = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.en || '';
  };

  return (
    <div className="w-full h-20 flex items-center justify-between px-8 z-50 absolute top-0 font-grim bg-gradient-to-b from-black/95 via-black/60 to-transparent pointer-events-none">
      
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-red-900/80 text-sm drop-shadow-[0_0_5px_rgba(255,0,0,0.8)] animate-pulse">✦</span>
          <h1 className="font-royal text-lg font-bold uppercase tracking-[0.4em] text-zinc-200 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            {t(UI_DICT.title)}
          </h1>
        </div>
      </div>

      <div className="pointer-events-auto">
        <button 
          onClick={onToggleFullscreen}
          className="px-5 py-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-red-100 hover:bg-red-900/30 border border-transparent hover:border-red-900/50 rounded transition-all duration-300"
        >
          <Maximize size={14} strokeWidth={1.5} />
          <span>{t(UI_DICT.expand)}</span>
        </button>
      </div>
      
    </div>
  );
}