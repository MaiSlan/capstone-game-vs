import { useNavigate, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a token exists to determine auth state
  const isAuthenticated = !!localStorage.getItem('game_token');

  const handleSignOut = () => {
    localStorage.removeItem('game_token');
    navigate('/');
  };

  return (
    <nav className="nav-gothic w-full h-16 flex items-center justify-between px-8 md:px-12 fixed top-0 z-50 font-grim">
      
      {/* Brand - Routes to /home if logged in, otherwise / */}
      <div className="flex items-center gap-3 cursor-pointer group z-10" onClick={() => navigate(isAuthenticated ? '/home' : '/')}>
        <span className="text-xl text-red-800 font-royal transition-transform group-hover:rotate-90 duration-500">
          ✦
        </span>
        <h1 className="text-lg md:text-xl font-bold uppercase tracking-[0.4em] text-red-900 group-hover:text-red-600 transition-colors">
          Tartarus Engine
        </h1>
      </div>

      {/* Dynamic Center Links */}
      <div className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold z-10">
        {!isAuthenticated ? (
          <>
            <a href="#features" className="text-zinc-500 hover:text-red-800 transition-colors duration-300">Dogma</a>
            <a href="#architecture" className="text-zinc-500 hover:text-red-800 transition-colors duration-300">Architecture</a>
            <a href="#tech" className="text-zinc-500 hover:text-red-800 transition-colors duration-300">Relics</a>
          </>
        ) : (
          <span className="text-red-900/30">Vessel Linked</span>
        )}
      </div>

      {/* Dynamic Action Area */}
      <div className="z-10">
        {!isAuthenticated ? (
          // Don't show the "Initiate Descent" button if we are already on the Auth page
          location.pathname !== '/auth' && (
            <button 
              onClick={() => navigate('/auth')}
              className="btn-pure px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-bold"
            >
              Initiate Descent
            </button>
          )
        ) : (
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
          >
            Sign Out
          </button>
        )}
      </div>
      
    </nav>
  );
}