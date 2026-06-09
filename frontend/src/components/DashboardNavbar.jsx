import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

  return (
    <nav className="nav-gothic fixed top-0 left-0 w-full h-16 flex items-center justify-between px-12 z-50 font-grim">
      
      <div className="flex items-center gap-3 cursor-pointer group z-10" onClick={() => navigate('/home')}>
        <span className="text-xl text-red-800 font-royal transition-transform group-hover:rotate-90 duration-500">
          ✦
        </span>
        <h1 className="text-lg font-bold uppercase tracking-[0.4em] text-red-900 group-hover:text-red-600 transition-colors">
          Tartarus
        </h1>
      </div>

      <div className="z-10">
        <button 
          onClick={handleSignOut}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}