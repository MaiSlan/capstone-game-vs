import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

  return (
    <nav className="nav-dentelle fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-16 flex items-center justify-between px-10 z-50 font-grim">
      
      {/* Brand Title (Red/Crimson) */}
      <div className="flex items-center gap-3 cursor-pointer group z-10" onClick={() => navigate('/home')}>
        <span className="text-2xl text-red-700 font-royal transition-transform group-hover:rotate-180 duration-700">
          ✥
        </span>
        <h1 className="text-xl font-black uppercase tracking-[0.3em] text-red-800 group-hover:text-red-500 transition-colors">
          QLIPHOTH
        </h1>
      </div>

      <div className="z-10">
        {/* Subtle pale text for the action */}
        <button 
          onClick={handleSignOut}
          className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors duration-300"
        >
          SEVER
        </button>
      </div>
    </nav>
  );
}