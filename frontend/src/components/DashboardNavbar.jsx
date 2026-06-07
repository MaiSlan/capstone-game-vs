import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  // Default to dark mode (Guts theme)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage or system preference on load
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
    <nav className="w-full h-20 flex items-center justify-between px-8 fixed top-0 z-50 transition-colors duration-500
      bg-slate-100/90 border-b border-amber-300 shadow-[0_4px_20px_rgba(252,211,77,0.2)] text-slate-800 
      dark:bg-zinc-950/90 dark:border-red-900 dark:shadow-[0_4px_20px_rgba(153,27,27,0.4)] dark:text-zinc-300 backdrop-blur-md">
      
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
        <span className="text-3xl transition-transform duration-500 hover:scale-110">
          {isDarkMode ? '💀' : '🦅'}
        </span>
        <h1 className="text-2xl font-black tracking-widest uppercase transition-colors duration-500
          text-sky-600 drop-shadow-[0_0_8px_rgba(2,132,199,0.5)]
          dark:text-red-600 dark:drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
          VS Engine
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300
            bg-white border-2 border-amber-300 text-amber-500 hover:bg-amber-50 hover:shadow-[0_0_15px_rgba(252,211,77,0.5)]
            dark:bg-zinc-900 dark:border-red-800 dark:text-red-500 dark:hover:bg-zinc-800 dark:hover:shadow-[0_0_15px_rgba(153,27,27,0.6)]"
        >
          {isDarkMode ? 'Sacrifice (Dark)' : 'Dream (Light)'}
        </button>

        <button 
          onClick={handleSignOut}
          className="px-6 py-2 rounded-lg font-bold transition-all duration-300
            text-slate-500 hover:text-slate-800 hover:bg-slate-200
            dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/30"
        >
          SIGN OUT
        </button>
      </div>
    </nav>
  );
}