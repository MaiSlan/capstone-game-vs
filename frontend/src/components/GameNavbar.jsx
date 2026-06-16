import { Maximize, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameNavbar({ onToggleFullscreen }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-20 flex items-center justify-between px-8 z-50 absolute top-0 font-grim bg-gradient-to-b from-black/95 via-black/60 to-transparent pointer-events-none">
      
      {/* 
        We use pointer-events-none on the container so players can click enemies under the transparent parts, 
        but we restore pointer-events-auto on the actual buttons so they remain clickable.
      */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button 
          onClick={() => navigate('/select')}
          className="text-zinc-500 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-all duration-300 p-2"
          title="Abandon Run"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-red-900/80 text-sm drop-shadow-[0_0_5px_rgba(255,0,0,0.8)] animate-pulse">✦</span>
          <h1 className="font-royal text-lg font-bold uppercase tracking-[0.4em] text-zinc-200 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
            Branded Descent
          </h1>
        </div>
      </div>

      <div className="pointer-events-auto">
        <button 
          onClick={onToggleFullscreen}
          className="px-5 py-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-red-100 hover:bg-red-900/30 border border-transparent hover:border-red-900/50 rounded transition-all duration-300"
        >
          <Maximize size={14} strokeWidth={1.5} />
          <span>Expand Void</span>
        </button>
      </div>
      
    </div>
  );
}