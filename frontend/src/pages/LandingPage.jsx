import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-8 flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 z-10">
          Survive the Swarm.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            Powered by the Cloud.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 z-10 leading-relaxed">
          A high-performance, browser-based survival engine. Built with Phaser 3, React, and secured by a FastAPI microservice architecture. Connect, survive, and conquer the leaderboard.
        </p>

        <div className="flex gap-6 z-10">
          <button 
            onClick={() => navigate('/auth')} 
            className="px-10 py-4 bg-pink-600 rounded-xl font-bold text-xl hover:bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] transition"
          >
            CREATE ACCOUNT
          </button>
          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noreferrer"
            className="px-10 py-4 bg-zinc-800 rounded-xl font-bold text-xl hover:bg-zinc-700 transition border border-zinc-700"
          >
            VIEW SOURCE
          </a>
        </div>
      </main>
    </div>
  );
}