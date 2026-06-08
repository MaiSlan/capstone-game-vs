import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 fixed top-0 z-50 
      bg-black/90 border-b-2 border-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,1)] backdrop-blur-md font-grim">
      
      {/* Brand Logo - The Brand of Sacrifice Vibe */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
        <span className="text-3xl text-red-900 group-hover:text-red-700 transition-colors">
          ♆
        </span>
        <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
          GODHAND.OS
        </h1>
      </div>

      <div>
        <button 
          onClick={handleSignOut}
          className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-600 hover:text-red-800 transition-colors duration-300"
        >
          SEVER CONNECTION
        </button>
      </div>
    </nav>
  );
}