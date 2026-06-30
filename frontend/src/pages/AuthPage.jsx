import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Ritual failed');

      if (isLogin) {
        sessionStorage.setItem('game_token', data.token);
        navigate('/home'); 
      } else {
        alert('Pact forged. You may now awaken.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pure-abyss min-h-screen flex flex-col font-grim text-zinc-400">
      <PublicNavbar />
      
      <div className="flex-1 flex items-center justify-center p-8 mt-16 relative z-10">
        
        <div className="qliphoth-node w-full max-w-md flex flex-col pt-10 pb-8 px-10">
          
          <header className="flex flex-col items-center mb-8">
            <span className="text-red-900/60 text-xl mb-2">✦</span>
            <h2 className="font-royal text-3xl font-black uppercase tracking-[0.3em] text-zinc-200 text-center">
              {isLogin ? 'Awaken' : 'Forge Pact'}
            </h2>
          </header>

          {error && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-500 p-3 rounded mb-6 text-[10px] uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">Soul Signature (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-800 text-zinc-200 py-2 focus:outline-none focus:border-red-800 transition-colors duration-300 font-royal tracking-widest"
                required 
              />
            </div>
            
            <div className="flex flex-col mb-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">Incantation (Password)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-800 text-zinc-200 py-2 focus:outline-none focus:border-red-800 transition-colors duration-300 font-royal tracking-widest"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-pure w-full py-4 font-royal text-sm uppercase tracking-[0.3em] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Channeling...' : isLogin ? 'Enter Tartarus' : 'Bind Soul'}
            </button>
          </form>

          <div className="flex justify-center mt-8 pt-6 border-t border-red-900/20">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-red-700 transition-colors duration-300"
            >
              {isLogin ? 'No pact exists? Forge one.' : 'Already bound? Awaken here.'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}