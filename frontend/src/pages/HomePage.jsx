import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Destroy the local token
    localStorage.removeItem('game_token');
    // Kick the user back to the landing page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-8 relative">
      {/* Top right sign out button */}
      <button 
        onClick={handleSignOut}
        className="absolute top-8 right-8 px-6 py-2 bg-zinc-800 hover:bg-red-900/50 hover:text-red-400 text-zinc-400 rounded-lg font-bold transition"
      >
        SIGN OUT
      </button>

      <h1 className="text-4xl font-bold text-purple-400 mb-6">User Dashboard</h1>
      <p className="text-zinc-400 mb-12">Authentication successful. The engine awaits.</p>
      
      <button 
        onClick={() => navigate('/select')} 
        className="px-12 py-5 bg-pink-600 rounded-xl font-bold text-2xl hover:bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] transition"
      >
        ENTER CHARACTER SELECTION
      </button>
    </div>
  );
}