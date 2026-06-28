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

  const [isVictory, setIsVictory] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [currentChoices, setCurrentChoices] = useState([]);
  
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStats, setPauseStats] = useState(null);
  const [pauseTab, setPauseTab] = useState('stats');
  
  const [gameTime, setGameTime] = useState(0);
  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  const [metaUpgrades, setMetaUpgrades] = useState([]);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // --- REACT HUD STATE ---
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [playerXp, setPlayerXp] = useState(0);
  const [playerMaxXp, setPlayerMaxXp] = useState(100);
  const [playerCoins, setPlayerCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [inventoryWeapons, setInventoryWeapons] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // --- BOSS HUD STATE ---
  const [bossName, setBossName] = useState(null);
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(100);

  const getAssetIcon = (id) => {
    if (!id) return '';

    // 1. Check Common Items
    const commonItem = REWARD_DB.items.common.find(i => i.id === id);
    if (commonItem && commonItem.icon) return commonItem.icon;

    // 2. Check Consumables
    const consumableItem = REWARD_DB.items.consumables.find(i => i.id === id);
    if (consumableItem && consumableItem.icon) return consumableItem.icon;

    // 3. Check Weapons (Search across all character arrays)
    for (const charKey in REWARD_DB.weapons) {
      const weapon = REWARD_DB.weapons[charKey].find(w => w.id === id);
      if (weapon && weapon.icon) return weapon.icon;
    }

    // Return empty string instead of placeholder to trigger the onError hiding logic
    return ''; 
  };

  useEffect(() => {
    const fetchMetaStats = async () => {
      try {
        const token = localStorage.getItem('game_token');
        if (!token) {
          setIsEngineReady(true);
          return; // No token, just start the game with base stats
        }
        
        const response = await fetch(`${API_BASE_URL}/api/v1/shop/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMetaUpgrades(data.upgrades || []);
        }
      } catch (error) {
        console.error("Failed to load meta stats:", error);
      } finally {
        setIsEngineReady(true);
      }
    };

    fetchMetaStats();
  }, []);

  useEffect(() => {
    const handleGameOver = async (e) => {
      // 1. Trigger the React UI updates
      setIsGameOver(true);
      if (e.detail && e.detail.level) setFinalLevel(e.detail.level);
      if (document.fullscreenElement) document.exitFullscreen();

      // 2. Extract the exact payload sent from MainScene.js
      const runData = e.detail; 
      
      // 3. Grab the auth token
      const token = localStorage.getItem('game_token');

      if (!token) {
        console.error("No soul bound (token missing). Cannot save run data.");
        return;
      }

      // 4. Send the payload to the Python Backend
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/game/end_run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(runData)
        });

        if (!response.ok) {
          throw new Error('The backend rejected the run data.');
        }

        const result = await response.json();
        console.log("Run successfully recorded in the abyss:", result);
        
      } catch (error) {
        console.error("Failed to sync run data:", error);
      }
    };

    const handleVictory = (e) => {
      setIsVictory(true);
      if (e.detail && e.detail.timeSurvived) setFinalTime(e.detail.timeSurvived);
      if (document.fullscreenElement) document.exitFullscreen();
    };

    const handleUpdateTimer = (e) => setGameTime(e.detail.seconds);
    const handleUpdateHp = (e) => { setPlayerHp(e.detail.hp); setPlayerMaxHp(e.detail.maxHp); };
    const handleUpdateXp = (e) => { setPlayerXp(e.detail.xp); setPlayerMaxXp(e.detail.maxXp); };
    const handleUpdateLevel = (e) => setCurrentLevel(e.detail.level);
    const handleUpdateCoins = (e) => setPlayerCoins(e.detail.coins);
    
    const handleUpdateInventory = (e) => {
      if (e.detail.weapons) setInventoryWeapons(e.detail.weapons);
      if (e.detail.items) setInventoryItems(e.detail.items);
    };

    const handleShowBoss = (e) => {
      setBossName(e.detail.name);
      setBossHp(e.detail.hp);
      setBossMaxHp(e.detail.maxHp);
    };
    const handleUpdateBoss = (e) => {
      setBossHp(e.detail.hp);
      setBossMaxHp(e.detail.maxHp);
    };
    const handleHideBoss = () => {
      setBossName(null);
    };

    const handleLevelUp = (e) => {
      const { level: lvl, weapons, items } = e.detail;
      setCurrentLevel(lvl);
      
      let pool = [];

      weapons.forEach(equippedWeapon => {
        if (equippedWeapon.level < 5) {
          let dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
          if (!dbRef) dbRef = { id: equippedWeapon.id, type: 'weapon', title: equippedWeapon.id.replace('_', ' ').toUpperCase(), desc: 'Enhance your primary relic.', icon: getAssetIcon(equippedWeapon.id) };
          pool.push({ ...dbRef, isUpgrade: true, currentLevel: equippedWeapon.level });
        }
      });

      if (weapons.length < 5) {
        REWARD_DB.weapons[selectedCharacter].forEach(dbWeapon => {
          if (!weapons.find(w => w.id === dbWeapon.id)) pool.push(dbWeapon);
        });
      }

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

      if (pool.length < 3) {
        const infiniteStats = [
          { id: 'stat_might', type: 'stat', title: 'LIMIT BREAK: MIGHT', desc: '+10% Base Damage.', icon: 'assets/items/equipable/dagger.png' },
          { id: 'stat_haste', type: 'stat', title: 'LIMIT BREAK: HASTE', desc: '+5% Attack Speed.', icon: 'assets/items/equipable/boots.png' },
          { id: 'stat_swift', type: 'stat', title: 'LIMIT BREAK: SWIFTNESS', desc: '+10% Movement Speed.', icon: 'assets/items/equipable/necklace.png' },
          { id: 'stat_vitality', type: 'stat', title: 'LIMIT BREAK: VITALITY', desc: 'Heal 50% Max HP.', icon: 'assets/items/equipable/ring.png' }
        ];
        const shuffledStats = infiniteStats.sort(() => 0.5 - Math.random());
        while (pool.length < 3 && shuffledStats.length > 0) {
          pool.push(shuffledStats.pop());
        }
      }

      const shuffledPool = pool.sort(() => 0.5 - Math.random());
      setCurrentChoices(shuffledPool.slice(0, 3));
      setIsLevelUp(true);
    };

    const handlePauseState = (e) => {
      setIsPaused(e.detail.isPaused);
      setPauseStats(e.detail.stats || null);
      if (e.detail.isPaused) setPauseTab('stats'); 
    };    

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    window.addEventListener('VS_GAME_WON', handleVictory);
    window.addEventListener('VS_LEVEL_UP', handleLevelUp);
    window.addEventListener('VS_PAUSE_STATE', handlePauseState);
    window.addEventListener('VS_UPDATE_TIMER', handleUpdateTimer);
    window.addEventListener('VS_UPDATE_HP', handleUpdateHp);
    window.addEventListener('VS_UPDATE_XP', handleUpdateXp);
    window.addEventListener('VS_UPDATE_COINS', handleUpdateCoins);
    window.addEventListener('VS_UPDATE_LEVEL', handleUpdateLevel);
    window.addEventListener('VS_UPDATE_INVENTORY', handleUpdateInventory);
    window.addEventListener('VS_SHOW_BOSS_BAR', handleShowBoss);
    window.addEventListener('VS_UPDATE_BOSS_HP', handleUpdateBoss);
    window.addEventListener('VS_HIDE_BOSS_BAR', handleHideBoss);
    
    return () => {
      window.removeEventListener('VS_GAME_OVER', handleGameOver);
      window.removeEventListener('VS_GAME_WON', handleVictory)
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
      window.removeEventListener('VS_PAUSE_STATE', handlePauseState);
      window.removeEventListener('VS_UPDATE_TIMER', handleUpdateTimer);
      window.removeEventListener('VS_UPDATE_HP', handleUpdateHp);
      window.removeEventListener('VS_UPDATE_XP', handleUpdateXp);
      window.removeEventListener('VS_UPDATE_COINS', handleUpdateCoins);
      window.removeEventListener('VS_UPDATE_LEVEL', handleUpdateLevel);
      window.removeEventListener('VS_UPDATE_INVENTORY', handleUpdateInventory);
      window.removeEventListener('VS_SHOW_BOSS_BAR', handleShowBoss);
      window.removeEventListener('VS_UPDATE_BOSS_HP', handleUpdateBoss);
      window.removeEventListener('VS_HIDE_BOSS_BAR', handleHideBoss);
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
    setPlayerCoins(0);
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

  const renderInventoryRow = (items, max = 5) => (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const item = items[i];
        return (
          <div key={i} className="w-8 h-8 bg-zinc-950/80 border border-zinc-700/80 rounded-sm relative flex items-center justify-center shadow-inner">
            {item ? (
              <>
                <img src={getAssetIcon(item.id)} onError={(e) => e.target.style.display = 'none'} alt="icon" className="w-5 h-5 object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold text-amber-500 drop-shadow-[0_0_2px_rgba(0,0,0,1)] bg-black/80 rounded px-1">{item.level}</span>
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
        
       {/* --- UNIFIED CHARACTER STATUS BLOCK (SIMPLIFIED) --- */}
        <div className="absolute top-24 left-6 flex flex-col gap-2 pointer-events-auto">
          <div className="flex flex-col bg-black/85 border border-red-900/40 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.8)] p-3 backdrop-blur-md w-72">
            
            {/* Header: Level & Gold */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Level</span>
                <span className="text-sm font-royal text-red-600 font-bold">{currentLevel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></div>
                <span className="text-[10px] font-bold text-amber-500 tracking-widest">{playerCoins}</span>
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full relative h-3 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden mb-1.5 shadow-inner">
              <div className="h-full bg-red-800 shadow-[0_0_5px_rgba(185,28,28,0.8)] transition-all duration-200 ease-out" style={{ width: `${hpPercent}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold tracking-widest text-zinc-100 drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
                {Math.floor(playerHp)} / {playerMaxHp}
              </span>
            </div>
            
            {/* XP Bar */}
            <div className="w-full relative h-2 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden mb-3 shadow-inner">
              <div className="h-full bg-blue-700 shadow-[0_0_5px_rgba(29,78,216,0.8)] transition-all duration-300 ease-out" style={{ width: `${xpPercent}%` }} />
            </div>

            {/* Inventory integrated directly into the status block */}
            <div className="flex flex-col gap-1 pt-2 border-t border-zinc-800/50">
              {renderInventoryRow(inventoryWeapons)}
              {renderInventoryRow(inventoryItems)}
            </div>
          </div>
        </div>

        {/* =========================================
            TOP CENTER: BOSS HEALTH BAR
        ========================================= */}
        {bossName && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl flex flex-col items-center pointer-events-auto z-40 animate-fade-in">
            <span className="font-royal text-xl text-red-300 uppercase tracking-[0.3em] mb-2 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
              {bossName}
            </span>
            <div className="w-full h-4 bg-black/80 border border-red-900 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.9)] relative">
              <div 
                className="h-full bg-red-700 transition-all duration-100 ease-out" 
                style={{ width: `${Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100))}%` }}
              ></div>
            </div>
          </div>
        )}

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
      </div>

      {/* =========================================
          THE GAME ENGINE
      ========================================= */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-[#050202] cursor-none">
        {isEngineReady ? (
          <PhaserEngine 
            key={gameInstanceKey} 
            selectedCharacter={selectedCharacter} 
            userUpgrades={metaUpgrades} 
          />
        ) : (
          <div className="font-royal text-xl text-zinc-600 uppercase tracking-[0.4em] animate-pulse">
            Forging Vessel...
          </div>
        )}
      </div>
      
      {/* =========================================
          SUSPENDED / PAUSE MENU
      ========================================= */}
      {isPaused && !isGameOver && !isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center animate-fade-in w-full max-w-3xl">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-zinc-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Suspended
            </h2>
            
            <div className="flex gap-12 mb-8 border-b border-red-900/30 pb-3">
              <button 
                onClick={() => setPauseTab('stats')} 
                className={`text-xs uppercase tracking-[0.4em] font-bold transition-colors ${pauseTab === 'stats' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                Attributes
              </button>
              <button 
                onClick={() => setPauseTab('inventory')} 
                className={`text-xs uppercase tracking-[0.4em] font-bold transition-colors ${pauseTab === 'inventory' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                Inventory
              </button>
            </div>

            {pauseTab === 'stats' && pauseStats && (
              <div className="w-full max-w-lg mb-10 p-8 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Vitality</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.hp} / {pauseStats.maxHp}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agility</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.speed}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Power</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.damageMult}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Attack Speed</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.haste}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Armor</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.armor}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Greed</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.greed}%</span>
                  </div>
                </div>
              </div>
            )}

            {pauseTab === 'inventory' && pauseStats && (
              <div className="w-full mb-10 p-6 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm max-h-[350px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pauseStats.weapons.map(w => {
                    const dbInfo = REWARD_DB.weapons[selectedCharacter]?.find(x => x.id === w.id) || { title: w.id.replace('_', ' ').toUpperCase(), desc: 'A relic of the abyss.' };
                    return (
                      <div key={`w-${w.id}`} className="flex items-start gap-4 p-3 border border-zinc-800/80 bg-black/40 rounded-sm">
                        <div className="w-12 h-12 shrink-0 bg-black/60 border border-zinc-700 flex items-center justify-center rounded">
                          <img src={getAssetIcon(w.id)} onError={(e) => e.target.style.display = 'none'} className="w-8 h-8 object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-royal text-zinc-200 uppercase tracking-widest">{dbInfo.title}</span>
                            <span className="text-[10px] font-bold text-amber-500 tracking-widest">LVL {w.level}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-1 leading-relaxed uppercase">{dbInfo.desc}</span>
                        </div>
                      </div>
                    )
                  })}
                  
                  {pauseStats.items.map(i => {
                    const dbInfo = REWARD_DB.items.common.find(x => x.id === i.id) || { title: i.id.toUpperCase(), desc: 'Passive augmentation.' };
                    return (
                      <div key={`i-${i.id}`} className="flex items-start gap-4 p-3 border border-zinc-800/80 bg-black/40 rounded-sm">
                        <div className="w-12 h-12 shrink-0 bg-black/60 border border-zinc-700 flex items-center justify-center rounded">
                          <img src={getAssetIcon(i.id)} onError={(e) => e.target.style.display = 'none'} className="w-8 h-8 object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-royal text-zinc-200 uppercase tracking-widest">{dbInfo.title}</span>
                            <span className="text-[10px] font-bold text-amber-500 tracking-widest">LVL {i.level}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-1 leading-relaxed uppercase">{dbInfo.desc}</span>
                        </div>
                      </div>
                    )
                  })}
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

      {/* =========================================
          GAME OVER MENU
      ========================================= */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
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

      {/* =========================================
          VICTORY MENU
      ========================================= */}
      {isVictory && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-amber-500 drop-shadow-[0_0_20px_rgba(217,119,6,0.5)]">
              Eclipse Survived
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-amber-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
                Time Alive: {formatTime(finalTime)}
              </p>
              <span className="w-8 h-px bg-amber-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={() => navigate('/select')} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-amber-500 hover:text-amber-400">
                Ascend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          LEVEL UP MENU
      ========================================= */}
      {isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-3xl font-black uppercase tracking-[0.4em] text-zinc-200 mb-2">Evolution</h2>
            <div className="flex gap-8 mt-8">
              {currentChoices.map((reward) => (
                <div key={reward.id} onClick={() => selectReward(reward)} className="qliphoth-node w-56 flex flex-col items-center text-center cursor-pointer group">
                  <div className="text-4xl mb-6 mt-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {reward.icon.includes('.png') ? <img src={reward.icon} alt={reward.id} className="w-16 h-16 object-contain" /> : reward.icon}
                  </div>
                  <h3 className="font-royal text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2">{reward.title}</h3>
                  
                  {reward.isUpgrade ? (
                    <div className="text-[10px] text-amber-600 font-bold tracking-[0.2em] uppercase mb-2 animate-pulse">
                      Level {reward.currentLevel} ➔ {reward.currentLevel + 1}
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase mb-2">
                      Level 1
                    </div>
                  )}

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