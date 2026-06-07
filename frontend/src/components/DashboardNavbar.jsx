import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 fixed top-0 z-50 transition-all duration-500
      bg-hawk-cream border-b-4 border-hawk-gold-dull shadow-[0_4px_30px_rgba(146,106,30,0.15)] text-slate-900
      dark:bg-guts-abyss dark:border-guts-blood-dry dark:shadow-[0_10px_40px_rgba(0,0,0,0.9)] dark:text-zinc-400 font-mono">
      
      {/* Brand Logo - Styled as an Artifact Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
        <span className="text-3xl transition-transform duration-500 hover:rotate-12">
          {isDarkMode ? '⚡' : '👑'}
        </span>
        <h1 className="text-xl font-black uppercase tracking-[0.25em] transition-all duration-500
          text-hawk-royal-blue drop-shadow-[1px_1px_0px_#fde047]
          dark:text-guts-blood-fresh dark:drop-shadow-[2px_2px_0px_#000000]">
          {isDarkMode ? 'GODHAND.ENG' : 'FALCONIA.CORE'}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Toggle Button styled as an Altar Selector */}
        <button 
          onClick={toggleTheme}
          className="relative px-6 py-2.5 rounded font-black text-xs uppercase tracking-widest border transition-all duration-300 active:scale-95
            bg-white border-hawk-gold-dull text-hawk-gold-dull hover:bg-hawk-ivory hover:text-amber-700 shadow-[2px_2px_0px_#926a1e]
            dark:bg-guts-obsidian dark:border-guts-blood-fresh dark:text-guts-blood-fresh dark:hover:bg-guts-blood-dry dark:hover:text-red-400 dark:shadow-[3px_3px_0px_#000000]"
        >
          {isDarkMode ? '[ ACTIVATE ECLIPSE ]' : '[ ASCEND THRONE ]'}
        </button>

        <button 
          onClick={handleSignOut}
          className="text-xs font-bold tracking-wider uppercase transition-colors duration-300
            text-slate-500 hover:text-hawk-royal-blue
            dark:text-zinc-600 dark:hover:text-guts-blood-fresh"
        >
          ABANDON RUN
        </button>
      </div>
    </nav>
  );
}