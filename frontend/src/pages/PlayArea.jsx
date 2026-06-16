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
  const [currentChoices, setCurrentChoices] = useState([]);
  
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStats, setPauseStats] = useState(null);
  const [gameTime, setGameTime] = useState(0); 

  // --- REACT HUD STATE ---
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [playerXp, setPlayerXp] = useState(0);
  const [playerMaxXp, setPlayerMaxXp] = useState(100);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [inventoryWeapons, setInventoryWeapons] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Universal helper for resolving icon paths
  const getAssetIcon = (id) => {
    if (!id) return '';
    const iconMap = {
      'cleave_axe': 'assets/weapons/axe.png',
      'magic_orb': 'assets/weapons/magic_orb.png',
      'lance': 'assets/weapons/spear.png',
      'magic_book': 'assets/weapons/spellbook.png'
    };
    return iconMap[id] || `assets/weapons/${id}_icon.png`;
  };

  useEffect(() => {
    const handleGameOver = (e) => {
      setIsGameOver(true);
      if (e.detail && e.detail.level) setFinalLevel(e.detail.level);
      if (document.fullscreenElement) document.exitFullscreen();
    };

    const handleUpdateTimer = (e) => setGameTime(e.detail.seconds);
    const handleUpdateHp = (e) => { setPlayerHp(e.detail.hp); setPlayerMaxHp(e.detail.maxHp); };
    const handleUpdateXp = (e) => { setPlayerXp(e.detail.xp); setPlayerMaxXp(e.detail.maxXp); };
    const handleUpdateLevel = (e) => setCurrentLevel(e.detail.level);
    
    const handleUpdateInventory = (e) => {
      if (e.detail.weapons) setInventoryWeapons(e.detail.weapons);
      if (e.detail.items) setInventoryItems(e.detail.items);
    };

    const handleLevelUp = (e) => {
      const { level: lvl, weapons, items } = e.detail;
      setCurrentLevel(lvl);
      
      let pool = [];

      if (lvl % 5 === 0) {
        weapons.forEach(equippedWeapon => {
          if (equippedWeapon.level < 5) {
            const dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
            if (dbRef) pool.push({ ...dbRef, isUpgrade: true, currentLevel: equippedWeapon.level });
          }
        });
        if (weapons.length < 5) {
          REWARD_DB.weapons[selectedCharacter].forEach(dbWeapon => {
            if (!weapons.find(w => w.id === dbWeapon.id)) pool.push(dbWeapon);
          });
        }
      } else {
        weapons.forEach(equippedWeapon => {
          if (equippedWeapon.level < 5) {
            let dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
            if (!dbRef) {
              dbRef = { id: equippedWeapon.id, type: 'weapon', title: equippedWeapon.id.replace('_', ' ').toUpperCase(), desc: 'Enhance your primary relic.', icon: getAssetIcon(equippedWeapon.id) };
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
            if (!items.find(i => i.id === dbItem.id)) pool.push(dbItem);
          });
        }
      }

      if (pool.length === 0) pool.push(REWARD_DB.items.consumables.find(i => i.id === 'heal'));

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
    window.addEventListener('VS_UPDATE_TIMER', handleUpdateTimer);
    window.addEventListener('VS_UPDATE_HP', handleUpdateHp);
    window.addEventListener('VS_UPDATE_XP', handleUpdateXp);
    window.addEventListener('VS_UPDATE_LEVEL', handleUpdateLevel);
    window.addEventListener('VS_UPDATE_INVENTORY', handleUpdateInventory);
    
    return () => {
      window.removeEventListener('VS_GAME_OVER', handleGameOver);
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
      window.removeEventListener('VS_PAUSE_STATE', handlePauseState);
      window.removeEventListener('VS_UPDATE_TIMER', handleUpdateTimer);
      window.removeEventListener('VS_UPDATE_HP', handleUpdateHp);
      window.removeEventListener('VS_UPDATE_XP', handleUpdateXp);
      window.removeEventListener('VS_UPDATE_LEVEL', handleUpdateLevel);
      window.removeEventListener('VS_UPDATE_INVENTORY', handleUpdateInventory);
    };
  }, [selectedCharacter]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) fullScreenRef.current.requestFullscreen().catch(err => console.error(err));
    else document.exitFullscreen();
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setGameTime(0); 
    setPlayerHp(100);
    setPlayerXp(0);
    setGameInstanceKey(prev => prev + 1); 
  };

  const selectReward = (reward) => {
    setIsLevelUp(false);
    window.dispatchEvent(new CustomEvent('VS_APPLY_REWARD', { detail: { reward } }));
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const hpPercent = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (playerXp / playerMaxXp) * 100));

  // Reusable inventory row builder
  const renderInventoryRow = (items, max = 5) => (
    <div className="flex gap-2">
      {Array.from({ length: max }).map((_, i) => {
        const item = items[i];
        return (
          <div key={i} className="w-10 h-10 bg-black/60 border border-zinc-800 rounded-sm relative backdrop-blur-md flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            {item ? (
              <>
                <img src={getAssetIcon(item.id)} alt="icon" className="w-6 h-6 object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" />
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold text-amber-500 drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
                  Lv{item.level}
                </span>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={fullScreenRef} className="w-full h-screen bg-black flex flex-col relative font-grim select-none">
      <GameNavbar onToggleFullscreen={toggleFullScreen} />
      
      {/* =========================================
          REACT HUD - Unified over the Canvas
      ========================================= */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        
        {/* TOP LEFT: Health Bar */}
        <div className="absolute top-[88px] left-8 w-56 flex flex-col pointer-events-auto">
          <div className="flex justify-between items-end w-full px-1 mb-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Vitality</span>
            <span className="text-[10px] text-red-600 uppercase tracking-[0.2em] font-bold drop-shadow-[0_0_2px_rgba(185,28,28,0.8)]">
              {Math.floor(playerHp)} / {playerMaxHp}
            </span>
          </div>
          <div className="w-full h-2 bg-black/80 border border-zinc-800 rounded overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            <div className="h-full bg-red-800 transition-all duration-200 ease-out" style={{ width: `${hpPercent}%` }}></div>
          </div>
        </div>

        {/* TOP CENTER: Eclipse Clock */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/30 px-6 py-2 rounded-full border border-red-900/30 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-sm pointer-events-auto">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.4)] opacity-80 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-[#050202] w-[80%] h-[80%] m-auto shadow-[inset_0_0_5px_rgba(0,0,0,1)]"></div>
            <div className="absolute inset-0 rounded-full border border-red-900/40"></div>
          </div>
          <span className="font-royal text-xl font-bold tracking-[0.2em] text-zinc-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            {formatTime(gameTime)}
          </span>
        </div>

        {/* TOP RIGHT: Level Indicator */}
        <div className="absolute top-[88px] right-8 flex flex-col items-end pointer-events-auto">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold mb-1">Layer</span>
          <span className="font-royal text-2xl text-red-800 drop-shadow-[0_0_8px_rgba(153,27,27,0.6)] leading-none">
            {currentLevel}
          </span>
        </div>

        {/* BOTTOM LEFT: Inventory Grid */}
        <div className="absolute bottom-6 left-8 flex flex-col gap-2 pointer-events-auto">
          {renderInventoryRow(inventoryWeapons)}
          {renderInventoryRow(inventoryItems)}
        </div>

        {/* BOTTOM EDGE: Sleek Full-Width XP Bar */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col pointer-events-auto">
          <div className="w-full h-[6px] bg-black/90 border-t border-red-900/40">
            <div 
              className="h-full bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.8)] transition-all duration-300 ease-out" 
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* =========================================
          THE GAME ENGINE
      ========================================= */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-[#050202] cursor-none">
         <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} />
      </div>

      {/* --- OVERLAYS --- */}
      {isPaused && !isGameOver && !isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          {/* PAUSE CONTENT (unchanged) */}
          <div className="flex flex-col items-center animate-fade-in w-full max-w-2xl">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-zinc-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Suspended
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-900/80 font-bold">The Flow of Time Halts</p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            {pauseStats && (
              <div className="w-full max-w-lg mb-10 p-8 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Vitality</span>
                    <span className="font-royal text-lg text-zinc-300">{pauseStats.hp} / {pauseStats.maxHp}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agility</span>
                    <span className="font-royal text-lg text-zinc-300">{pauseStats.speed}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-6">
              <button onClick={() => window.dispatchEvent(new CustomEvent('VS_RESUME_GAME'))} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">Resume</button>
              <button onClick={() => navigate('/select')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500">Character Select</button>
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          {/* GAME OVER CONTENT (unchanged) */}
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-red-800 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
              Vessel Shattered
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Descent Halted at Layer {finalLevel}</p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={handleRestart} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">Resurrect</button>
              <button onClick={() => navigate('/select')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">New Vessel</button>
            </div>
          </div>
        </div>
      )}

      {isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-md">
          {/* LEVEL UP CONTENT (unchanged) */}
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-3xl font-black uppercase tracking-[0.4em] text-zinc-200 mb-2">Evolution</h2>
            <div className="flex gap-8 mt-8">
              {currentChoices.map((reward) => (
                <div key={reward.id} onClick={() => selectReward(reward)} className="qliphoth-node w-56 flex flex-col items-center text-center cursor-pointer group">
                  <div className="text-4xl mb-6 mt-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {reward.icon.includes('.png') ? <img src={reward.icon} alt={reward.id} className="w-16 h-16 object-contain" /> : reward.icon}
                  </div>
                  <h3 className="font-royal text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2">{reward.title}</h3>
                  <div className="w-4 h-px bg-red-900/40 mb-3"></div>
                  <p className="text-[10px] text-zinc-500 tracking-widest leading-relaxed uppercase">{reward.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}