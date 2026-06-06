import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameNavbar from '../components/GameNavbar';
import PhaserEngine from '../game/PhaserEngine';

export default function PlayArea({ selectedCharacter }) {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalLevel, setFinalLevel] = useState(1);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentChoices, setCurrentChoices] = useState([]);

  const REWARD_DB = {
    weapons: {
      witch: [
        { id: 'magic_book', type: 'weapon', title: 'Swirling Book', desc: 'An ancient tome that orbits you.', icon: '📖' },
        // You can add more witch weapons here later
      ],
      viking: [
        { id: 'lance', type: 'weapon', title: 'Piercing Lance', desc: 'Fires a heavy forward lance.', icon: '🗡️' },
        // You can add more viking weapons here later
      ]
    },
    items: {
      common: [
        { id: 'speed_boots', type: 'item', title: 'Speed Boots', desc: 'Passively increases movement speed.', icon: '👢' },
        { id: 'vitality_ring', type: 'item', title: 'Vitality Ring', desc: 'Increases Max HP by 25.', icon: '💍' },
        { id: 'heal', type: 'consumable', title: 'Health Potion', desc: 'Instantly restores all HP.', icon: '🧪' }
      ]
    }
  };

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
      // Every 5th level gives Weapons (for the specific character)
      if (lvl % 5 === 0) {
        pool = [...REWARD_DB.weapons[selectedCharacter]];
        // Fallback if they own all weapons maxed out (for later): Add a heal
        if (pool.length === 0) pool.push(REWARD_DB.items.common.find(i => i.id === 'heal'));
      } else {
        // Normal levels give Items/Skills
        pool = [...REWARD_DB.items.common];
      }

      // Shuffle the pool and pick up to 3 cards
      const shuffled = pool.sort(() => 0.5 - Math.random());
      setCurrentChoices(shuffled.slice(0, 3));
      
      setIsLevelUp(true);
    };

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    window.addEventListener('VS_LEVEL_UP', handleLevelUp);
    
    return () => {
      window.removeEventListener('VS_GAME_OVER', handleGameOver);
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
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

  // Placeholder rewards (We will connect these to your weapon/item arrays later)
  const TEMP_REWARDS = [
    { id: 'lance', title: 'Piercing Lance', desc: 'Fires a heavy lance that pierces 3 enemies.', icon: '🗡️' },
    { id: 'magic_book', title: 'Swirling Book', desc: 'An ancient tome that orbits and damages foes.', icon: '📖' },
    { id: 'heal', title: 'Health Potion', desc: 'Instantly restores all HP to max.', icon: '🧪' }
  ];

  return (
    <div ref={fullScreenRef} className="w-full h-screen bg-black flex flex-col relative">
      <GameNavbar onToggleFullscreen={toggleFullScreen} />
      
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-900">
         <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} />
      </div>

      {/* Game Over Overlay (Unchanged) */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          {/* ... existing game over UI ... */}
          <div className="bg-zinc-950 border-2 border-red-900 p-10 rounded-2xl flex flex-col items-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
            <h2 className="text-6xl font-bold text-red-500 mb-2 tracking-widest drop-shadow-lg">YOU DIED</h2>
            <p className="text-zinc-400 mb-10 text-xl font-mono border-b border-zinc-800 pb-4 w-full text-center">Reached Level {finalLevel}</p>
            <div className="flex flex-col gap-4 w-64">
              <button onClick={handleRestart} className="py-4 bg-red-700 hover:bg-red-600 rounded-xl font-bold text-white transition shadow-lg">RESTART RUN</button>
              <button onClick={() => navigate('/select')} className="py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-pink-400 transition">CHANGE HERO</button>
              <button onClick={() => navigate('/home')} className="py-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-zinc-500 transition">MAIN MENU</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: Level Up Overlay --- */}
      {isLevelUp && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 drop-shadow-lg">
              LEVEL {currentLevel}
            </h2>
            <p className="text-zinc-300 mb-8 font-mono">Select an augmentation</p>
            
            <div className="flex gap-6">
              {currentChoices.map((reward) => (
                <div 
                  key={reward.id}
                  onClick={() => selectReward(reward)}
                  className="w-56 h-72 bg-zinc-900 border-2 border-zinc-700 hover:border-emerald-500 rounded-xl p-6 cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-2"
                >
                  <div className="text-6xl mb-6 mt-4">{reward.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
                  <p className="text-sm text-zinc-400">{reward.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}