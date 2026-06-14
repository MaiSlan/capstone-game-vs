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
  const [pauseStats, setPauseStats] = useState(null);
  
  // --- NEW: Track the game time ---
  const [gameTime, setGameTime] = useState(0); 

  useEffect(() => {
    const handleGameOver = (e) => {
      setIsGameOver(true);
      if (e.detail && e.detail.level) setFinalLevel(e.detail.level);
      if (document.fullscreenElement) document.exitFullscreen();
    };

    // --- NEW: Catch the timer event ---
    const handleUpdateTimer = (e) => {
      setGameTime(e.detail.seconds);
    };

    const handleLevelUp = (e) => {
      const { level: lvl, weapons, items } = e.detail;
      setCurrentLevel(lvl);
      
      let pool = [];

      const getWeaponIcon = (id) => {
        const iconMap = {
          'cleave_axe': 'assets/weapons/axe.png',
          'magic_orb': 'assets/weapons/magic_orb.png',
          'lance': 'assets/weapons/spear.png',
          'magic_book': 'assets/weapons/spellbook.png'
        };
        return iconMap[id] || `assets/weapons/${id}_icon.png`;
      };

      if (lvl % 5 === 0) {
        weapons.forEach(equippedWeapon => {
          if (equippedWeapon.level < 5) {
            const dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
            if (dbRef) pool.push({ ...dbRef, isUpgrade: true, currentLevel: equippedWeapon.level });
          }
        });
        if (weapons.length < 5) {
          REWARD_DB.weapons[selectedCharacter].forEach(dbWeapon => {
            const isEquipped = weapons.find(w => w.id === dbWeapon.id);
            if (!isEquipped) pool.push(dbWeapon);
          });
        }
      } 
      else {
        weapons.forEach(equippedWeapon => {
          if (equippedWeapon.level < 5) {
            let dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
            
            if (!dbRef) {
              dbRef = { 
                id: equippedWeapon.id, 
                type: 'weapon', 
                title: equippedWeapon.id.replace('_', ' ').toUpperCase(), 
                desc: 'Enhance your primary relic.', 
                icon: getWeaponIcon(equippedWeapon.id) 
              };
            }
            
            pool.push({ ...dbRef, isUpgrade: true, currentLevel: equippedWeapon.level });
          }
        });
        
        items.forEach(equippedItem => {
          if (equippedItem.level < 5) {
            const dbRef = REWARD_DB.items.common.find(i => i.id === equippedItem.id);
            if (dbRef) pool.push({ ...dbRef, isUpgrade: true, currentLevel: equippedItem.level });
          }
        });
        
        if (items.length < 5) {
          REWARD_DB.items.common.forEach(dbItem => {
            const isEquipped = items.find(i => i.id === dbItem.id);
            if (!isEquipped) pool.push(dbItem);
          });
        }
      }

      if (pool.length === 0) {
        pool.push(REWARD_DB.items.consumables.find(i => i.id === 'heal'));
      }

      const shuffled = pool.sort(() => 0.5 - Math.random());
      setCurrentChoices(shuffled.slice(0, 3));
      setIsLevelUp(true);
    };

    const handlePauseState = (e) => {
      setIsPaused(e.detail.isPaused);
      setPauseStats(e.detail.stats || null);
    };    

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    window.addEventListener('VS_LEVEL_UP', handleLevelUp);
    window.addEventListener('VS_PAUSE_STATE', handlePauseState);
    window.addEventListener('VS_UPDATE_TIMER', handleUpdateTimer); // Map the listener
    
    return () => {
      window.removeEventListener('VS_GAME_OVER', handleGameOver);
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
      window.removeEventListener('VS_PAUSE_STATE', handlePauseState);
      window.removeEventListener('VS_UPDATE_TIMER', handleUpdateTimer);
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
    setGameTime(0); // Reset timer on death
    setGameInstanceKey(prev => prev + 1); 
  };

  const selectReward = (reward) => {
    setIsLevelUp(false);
    window.dispatchEvent(new CustomEvent('VS_APPLY_REWARD', { detail: { reward } }));
  };

  const handleResume = () => {
    window.dispatchEvent(new CustomEvent('VS_RESUME_GAME'));
  };

  const StatRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      <span className="font-royal text-lg text-zinc-300">{value}</span>
    </div>
  );

  // --- NEW: Time Formatting Helper ---
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div ref={fullScreenRef} className="w-full h-screen bg-black flex flex-col relative font-grim">
      <GameNavbar onToggleFullscreen={toggleFullScreen} />
      
      {/* --- NEW: THE ECLIPSE CLOCK OVERLAY --- */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none mt-2">
        {/* The Graphic */}
        <div className="relative w-12 h-12 flex items-center justify-center mb-1">
          {/* The Sun's Corona (Bright glowing ring) */}
          <div className="absolute inset-0 rounded-full bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.6)] opacity-90 animate-pulse"></div>
          {/* The Moon blocking the sun (Dark center) */}
          <div className="absolute inset-0 rounded-full bg-[#050202] w-[85%] h-[85%] m-auto shadow-[inset_0_0_15px_rgba(0,0,0,1)]"></div>
          {/* Subtle blood red rim light to tie into the esoteric theme */}
          <div className="absolute inset-0 rounded-full border border-red-900/40"></div>
        </div>
        
        {/* The Digital Timer */}
        <span className="font-royal text-2xl font-bold tracking-[0.2em] text-zinc-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          {formatTime(gameTime)}
        </span>
      </div>

      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-[#050202] cursor-none">
         <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} />
      </div>

      {/* --- SUSPENDED / PAUSE OVERLAY --- */}
      {isPaused && !isGameOver && !isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center animate-fade-in w-full max-w-2xl">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-zinc-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Suspended
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-900/80 font-bold">
                The Flow of Time Halts
              </p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            {pauseStats && (
              <div className="w-full max-w-lg mb-10 p-8 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-red-800 text-center mb-6 border-b border-red-900/30 pb-4">
                  Vessel Attributes
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <StatRow label="Vitality" value={`${pauseStats.hp} / ${pauseStats.maxHp}`} />
                  <StatRow label="Agility" value={pauseStats.speed} />
                  <StatRow label="Power (DPS)" value={`${pauseStats.damageMult}%`} />
                  <StatRow label="Attack Speed" value={`${pauseStats.haste}%`} />
                  <StatRow label="Armor" value={pauseStats.armor} />
                  <StatRow label="Greed" value={`${pauseStats.greed}%`} />
                </div>
              </div>
            )}

            <div className="flex gap-6">
              <button onClick={handleResume} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">
                Resume
              </button>
              <button onClick={() => navigate('/select')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 hover:border-red-900/50 transition-colors">
                Character Select
              </button>
              <button onClick={() => navigate('/home')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 hover:border-red-900/50 transition-colors">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER OVERLAY --- */}
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
              <button onClick={() => navigate('/home')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:border-red-900/50 transition-colors">
                Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEVEL UP OVERLAY --- */}
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
                    {reward.icon.includes('.png') ? (
                      <img src={reward.icon} alt={reward.id} className="w-16 h-16 object-contain" />
                    ) : (
                      reward.icon
                    )}
                  </div>
                  
                  <h3 className="font-royal text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2 group-hover:text-white transition-colors">
                    {reward.title}
                  </h3>

                  {reward.isUpgrade && (
                    <div className="text-[10px] text-amber-600 font-bold tracking-[0.2em] uppercase mb-2 animate-pulse">
                      Level {reward.currentLevel} ➔ {reward.currentLevel + 1}
                    </div>
                  )}

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