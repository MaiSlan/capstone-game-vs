import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-pure-abyss min-h-screen font-grim relative text-zinc-400">
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-8 flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden z-10">
        
        {/* Subtle dark red ambient glow matching the esoteric theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center mb-12">
          <h1 className="font-royal text-5xl md:text-7xl font-black uppercase tracking-[0.4em] mb-6 text-red-800/90 drop-shadow-[0_0_20px_rgba(139,0,0,0.1)] z-10">
            Tartarus Engine
          </h1>
          <div className="flex items-center gap-4 mb-8 z-10">
            <span className="w-12 h-px bg-red-900/50"></span>
            <span className="text-red-900/40 text-sm">✦</span>
            <span className="w-12 h-px bg-red-900/50"></span>
          </div>
          
          <p className="text-xs max-w-2xl text-zinc-500 tracking-[0.2em] uppercase font-medium leading-relaxed z-10">
            A high-performance, browser-based survival engine. <br/> 
            Built with Phaser 3 and secured by the Godhand. <br/>
            Connect, survive, and conquer the abyss.
          </p>
        </div>

        <div className="flex items-center gap-8 z-10 mt-4">
          <button 
            onClick={() => navigate('/auth')} 
            className="btn-pure px-12 py-4 rounded-full font-royal text-sm uppercase tracking-[0.3em]"
          >
            Enter the Void
          </button>
          
          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 hover:text-red-700 transition-colors duration-300"
          >
            View Source
          </a>
        </div>
      </main>
    </div>
  );
}