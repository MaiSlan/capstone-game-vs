import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isAuthenticated = !!sessionStorage.getItem('game_token');

  useEffect(() => {
    const currentStoredLang = localStorage.getItem('vs_lang');
    if (currentStoredLang && currentStoredLang !== i18n.language) {
      i18n.changeLanguage(currentStoredLang);
    }

    // Listen for the custom event dispatched by PlayArea.jsx (Pause Menu)
    const handleSettingsUpdate = (e) => {
      if (e.detail && e.detail.language && e.detail.language !== i18n.language) {
        i18n.changeLanguage(e.detail.language);
      }
    };
    
    // Listen for standard cross-tab storage updates
    const handleStorageUpdate = () => {
      const storedLang = localStorage.getItem('vs_lang');
      if (storedLang && storedLang !== i18n.language) {
        i18n.changeLanguage(storedLang);
      }
    };

    window.addEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [i18n]);
  
  const handleSignOut = () => {
    sessionStorage.removeItem('game_token');
    navigate('/');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('vs_lang', lang);
    // Dispatch in case a Phaser scene is active in the background
    window.dispatchEvent(new CustomEvent('VS_UPDATE_SETTINGS', {
      detail: { language: lang }
    }));
  };

  const currentLang = i18n.language;

  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 md:px-12 fixed top-0 z-50 font-grim bg-black/80 backdrop-blur-md border-b border-red-900/30 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      
      {/* Brand */}
      <div className="flex items-center gap-4 cursor-pointer group z-10" onClick={() => navigate(isAuthenticated ? '/home' : '/')}>
        <span className="text-2xl text-red-900 font-royal transition-transform group-hover:rotate-180 duration-700 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
          ✦
        </span>
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-[0.4em] text-zinc-200 group-hover:text-red-500 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            Branded Descent
          </h1>
          <span className="text-[8px] uppercase tracking-[0.5em] text-red-900/80 font-bold -mt-1">
            Ouroboros Rift
          </span>
        </div>
      </div>

      {/* Dynamic Center Links */}
      <div className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-bold z-10">
        
        {/* Always visible */}
        <span onClick={() => navigate('/documentation')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
          {t('navbar.documentation')}
        </span>

        {/* Visible only when authenticated */}
        {isAuthenticated && (
          <>
            <span onClick={() => navigate('/bestiary')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              {t('navbar.bestiary')}
            </span>
            <span onClick={() => navigate('/profile')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              {t('navbar.statistics')}
            </span>
            <span onClick={() => navigate('/shop')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              {t('navbar.bonefire')}
            </span>
            <span onClick={() => navigate('/play')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              {t('navbar.charSelect')}
            </span>
          </>
        )}
      </div>

      {/* Controls & Action Area */}
      <div className="z-10 flex items-center gap-6">
        
        {/* Minimalist Language Toggle */}
        <div className="hidden md:flex gap-3 items-center border-r border-zinc-800 pr-6">
          <button 
            onClick={() => changeLanguage('en')} 
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${currentLang === 'en' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            EN
          </button>
          <button 
            onClick={() => changeLanguage('fr')} 
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${currentLang === 'fr' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            FR
          </button>
          <button 
            onClick={() => changeLanguage('zh')} 
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${currentLang === 'zh' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            ZH
          </button>
        </div>

        {/* Authentication Button */}
        {!isAuthenticated ? (
          location.pathname !== '/auth' && (
            <button 
              onClick={() => navigate('/auth')}
              className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
            >
              {t('navbar.signIn')}
            </button>
          )
        ) : (
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
          >
            {t('navbar.signOut')}
          </button>
        )}
      </div>
      
    </nav>
  );
}