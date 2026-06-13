import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameNavbar from '../components/GameNavbar';
import PhaserEngine from '../game/PhaserEngine';
import { REWARD_DB } from '../data/RewardDB';

export default function PlayArea({ selectedCharacter }) {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalLevel, setFinalLevel] = useState(1);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentChoices, setCurrentChoices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleGameOver = (e) => {
      setIsGameOver(true);
      if (e.detail && e.detail.level) setFinalLevel(e.detail.level);
      if (document.fullscreenElement) document.exitFullscreen();
    };

    const handleLevelUp = (e) => {
      const lvl = e.detail.level;
      setCurrentLevel(lvl);
      
      let pool = [];
      if (lvl % 5 === 0) {
        pool = [...REWARD_DB.weapons[selectedCharacter]];
        if (pool.length === 0) pool.push(REWARD_DB.items.common.find(i => i.id === 'heal'));
      } else {
        pool = [...REWARD_DB.items.common];
      }

      const shuffled = pool.sort(() => 0.5 - Math.random());
      setCurrentChoices(shuffled.slice(0, 3));
      setIsLevelUp(true);
    };

    const handlePauseState = (e) => {
      setIsPaused(e.detail.isPaused);
    };    

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    window.addEventListener('VS_LEVEL_UP', handleLevelUp);
    window.addEventListener('VS_PAUSE_STATE', handlePauseState);
    
    return () => {
      window.removeEventListener('VS_GAME_OVER', handleGameOver);
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
      window.removeEventListener('VS_PAUSE_STATE', handlePauseState);
    };
  }, [selectedCharacter]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      fullScreenRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setGameInstanceKey(prev => prev + 1); 
  };

  const selectReward = (reward) => {
    setIsLevelUp(false);
    window.dispatchEvent(new CustomEvent('VS_APPLY_REWARD', { detail: { reward } }));
  };

  const handleResume = () => {
    window.dispatchEvent(new CustomEvent('VS_RESUME_GAME'));
  };

  return (
    <div ref={fullScreenRef} className="w-full h-screen bg-black flex flex-col relative font-grim">
      <GameNavbar onToggleFullscreen={toggleFullScreen} />
      
      {/* The actual Phaser Game Canvas Container */}
      {/* ADD cursor-none to this div */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-[#050202] cursor-none">
         <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} />
      </div>

      {/* --- SUSPENDED / PAUSE OVERLAY --- */}
      {isPaused && !isGameOver && !isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-zinc-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Suspended
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-900/80 font-bold">
                The Flow of Time Halts
              </p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={handleResume} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">
                Resume
              </button>
              <button onClick={() => navigate('/home')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 hover:border-red-900/50 transition-colors">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER OVERLAY (Esoteric/Hollow Knight style) --- */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-red-800 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
              Vessel Shattered
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
                Descent Halted at Layer {finalLevel}
              </p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={handleRestart} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">
                Resurrect
              </button>
              <button onClick={() => navigate('/select')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">
                New Vessel
              </button>
              <button onClick={() => navigate('/home')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEVEL UP OVERLAY (Qliphoth Node style) --- */}
      {isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-40 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <h2 className="font-royal text-3xl font-black uppercase tracking-[0.4em] text-zinc-200 mb-2">
              Evolution <span className="text-red-800">I</span>I<span className="text-red-800">I</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-red-900/80 font-bold mb-12">
              Select an Augmentation
            </p>
            
            <div className="flex gap-8">
              {currentChoices.map((reward) => (
                <div 
                  key={reward.id}
                  onClick={() => selectReward(reward)}
                  className="qliphoth-node w-56 flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="text-4xl mb-6 mt-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    
                    {/* --- THE FIX: Conditional Image Rendering --- */}
                    {reward.icon.includes('.png') ? (
                      <img src={reward.icon} alt={reward.id} className="w-16 h-16 object-contain" />
                    ) : (
                      reward.icon
                    )}
                    {/* ------------------------------------------ */}

                  </div>
                  <h3 className="font-royal text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3 group-hover:text-white transition-colors">
                    {reward.title}
                  </h3>
                  <div className="w-4 h-px bg-red-900/40 mb-3"></div>
                  <p className="text-[10px] text-zinc-500 tracking-widest leading-relaxed uppercase">
                    {reward.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}