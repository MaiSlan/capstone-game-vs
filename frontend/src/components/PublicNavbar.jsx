import { useNavigate, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem('game_token');

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

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
            Tartarus Node
          </span>
        </div>
      </div>

      {/* Dynamic Center Links */}
      <div className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-bold z-10">
        
        {/* Always visible */}
        <span onClick={() => navigate('/documentation')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
          Documentation
        </span>

        {/* Visible only when authenticated */}
        {isAuthenticated && (
          <>
            <span onClick={() => navigate('/bestiary')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              Bestiary
            </span>
            <span onClick={() => navigate('/shop')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              BoneFire
            </span>
            <span onClick={() => navigate('/select')} className="text-zinc-500 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] cursor-pointer transition-all duration-300">
              Character Selection
            </span>
          </>
        )}
      </div>

      {/* Dynamic Action Area */}
      <div className="z-10">
        {!isAuthenticated ? (
          location.pathname !== '/auth' && (
            <button 
              onClick={() => navigate('/auth')}
              className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
            >
              SignIn/Register
            </button>
          )
        ) : (
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
          >
            Sign Out
          </button>
        )}
      </div>
      
    </nav>
  );
}