import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameNavbar from '../components/GameNavbar';
import PhaserEngine from '../game/PhaserEngine';

export default function PlayArea({ selectedCharacter }) {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();
  
  // Game Over State
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalLevel, setFinalLevel] = useState(1);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);

  // Listen for the custom death event from Phaser
  useEffect(() => {
    const handleGameOver = (e) => {
      setIsGameOver(true);
      if (e.detail && e.detail.level) {
        setFinalLevel(e.detail.level);
      }
      // Force exit fullscreen so the user can easily navigate the menus
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    return () => window.removeEventListener('VS_GAME_OVER', handleGameOver);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      fullScreenRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleRestart = () => {
    setIsGameOver(false);
    // Changing the key forces React to completely unmount and remount the game engine
    setGameInstanceKey(prev => prev + 1); 
  };

  return (
    <div ref={fullScreenRef} className="w-full h-screen bg-black flex flex-col relative">
      <GameNavbar onToggleFullscreen={toggleFullScreen} />
      
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-900">
         {/* The key property handles our instant-restarts */}
         <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} />
      </div>

      {/* --- GAME OVER OVERLAY --- */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-zinc-950 border-2 border-red-900 p-10 rounded-2xl flex flex-col items-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
            <h2 className="text-6xl font-bold text-red-500 mb-2 tracking-widest drop-shadow-lg">YOU DIED</h2>
            <p className="text-zinc-400 mb-10 text-xl font-mono border-b border-zinc-800 pb-4 w-full text-center">
              Reached Level {finalLevel}
            </p>

            <div className="flex flex-col gap-4 w-64">
              <button 
                onClick={handleRestart} 
                className="py-4 bg-red-700 hover:bg-red-600 rounded-xl font-bold text-white transition shadow-lg"
              >
                RESTART RUN
              </button>
              <button 
                onClick={() => navigate('/select')} 
                className="py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-pink-400 transition"
              >
                CHANGE HERO
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="py-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-zinc-500 transition"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}