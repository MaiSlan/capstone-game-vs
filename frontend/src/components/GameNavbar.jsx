import { Maximize, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameNavbar({ onToggleFullscreen }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-16 bg-zinc-950 border-b-2 border-purple-900 flex items-center justify-between px-6 shadow-md z-10 relative">
      <div className="flex items-center gap-4">
        {/* Updated route to /select instead of /dashboard */}
        <button 
          onClick={() => navigate('/select')}
          className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition text-pink-300"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          VS Cloud Engine
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* I am leaving the static EXP label here for now, but you can remove it since you have the blue bar */}
        <button 
          onClick={onToggleFullscreen}
          className="p-2 bg-purple-900/50 text-purple-200 rounded-lg hover:bg-purple-800 transition border border-purple-700 flex items-center gap-2"
        >
          <Maximize size={18} />
          <span className="text-sm font-bold">Fullscreen</span>
        </button>
      </div>
    </div>
  );
}