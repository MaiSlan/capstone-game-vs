import { Maximize, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameNavbar({ onToggleFullscreen }) {
  const navigate = useNavigate();

  return (
    <div className="nav-gothic w-full h-16 flex items-center justify-between px-8 z-10 relative font-grim">
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/select')}
          className="text-zinc-500 hover:text-red-600 transition-colors duration-300"
          title="Abandon Run"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-red-900/60 text-sm">✦</span>
          <h1 className="font-royal text-sm font-bold uppercase tracking-[0.4em] text-zinc-300 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            Tartarus Engine
          </h1>
        </div>
      </div>

      <div>
        <button 
          onClick={onToggleFullscreen}
          className="btn-pure px-4 py-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]"
        >
          <Maximize size={14} strokeWidth={1.5} />
          <span>Expand Void</span>
        </button>
      </div>
      
    </div>
  );
}