import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import GameNavbar from '../components/GameNavbar';
import PhaserEngine from '../game/PhaserEngine';
import { REWARD_DB } from '../data/RewardDB';
import CharacterSelectUI from './CharacterSelectUI';
import MainTitleUI from './MainTitleUI';

// --- IN-GAME UI DICTIONARY ---
const UI_DICT = {
  level: { en: 'Level', fr: 'Niveau', zh: '等级' },
  suspended: { en: 'Suspended', fr: 'Suspendu', zh: '已暂停' },
  attributes: { en: 'Attributes', fr: 'Attributs', zh: '属性' },
  inventory: { en: 'Inventory', fr: 'Inventaire', zh: '物品栏' },
  settings: { en: 'Settings', fr: 'Paramètres', zh: '设置' },
  vitality: { en: 'Vitality', fr: 'Vitalité', zh: '生命力' },
  agility: { en: 'Agility', fr: 'Agilité', zh: '敏捷' },
  power: { en: 'Power', fr: 'Puissance', zh: '力量' },
  haste: { en: 'Attack Speed', fr: 'Vit. d\'Attaque', zh: '攻击速度' },
  armor: { en: 'Armor', fr: 'Armure', zh: '护甲' },
  greed: { en: 'Greed', fr: 'Avidité', zh: '贪婪' },
  resume: { en: 'Resume', fr: 'Reprendre', zh: '继续' },
  charSelect: { en: 'Character Select', fr: 'Sélection', zh: '选择角色' },
  vesselShattered: { en: 'Vessel Shattered', fr: 'Réceptacle Brisé', zh: '躯壳碎裂' },
  descentHalted: { en: 'Descent Halted at Layer', fr: 'Descente arrêtée à la strate', zh: '探索终止于层数' },
  resurrect: { en: 'Resurrect', fr: 'Ressusciter', zh: '复活' },
  newVessel: { en: 'New Vessel', fr: 'Nouveau Réceptacle', zh: '新躯壳' },
  eclipseSurvived: { en: 'Eclipse Survived', fr: 'Éclipse Survécue', zh: '在日食中幸存' },
  timeAlive: { en: 'Time Alive', fr: 'Temps de Survie', zh: '存活时间' },
  ascend: { en: 'Ascend', fr: 'Ascension', zh: '飞升' },
  evolution: { en: 'Evolution', fr: 'Évolution', zh: '进化' },
  lvl: { en: 'LVL', fr: 'NIV', zh: '等级' },
  langLabel: { en: 'Language', fr: 'Langue', zh: '语言' },
  quitRun: { en: 'Quit Run', fr: 'Abandonner', zh: '放弃战斗' }
};

export default function PlayArea() {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();
  
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalLevel, setFinalLevel] = useState(1);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);

  const [isVictory, setIsVictory] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [currentChoices, setCurrentChoices] = useState([]);

  const [hasRerollUpgrade, setHasRerollUpgrade] = useState(false);
  const [rerollsRemaining, setRerollsRemaining] = useState(0); 
  const [currentLevelUpPayload, setCurrentLevelUpPayload] = useState(null);
  
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStats, setPauseStats] = useState(null);
  const [pauseTab, setPauseTab] = useState('stats');

  const [musicVolume, setMusicVolume] = useState(30); 
  const [sfxVolume, setSfxVolume] = useState(50);
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');

  const [selectedCharacter, setSelectedCharacter] = useState('witch');

  const [engineState, setEngineState] = useState('title');

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

  const t = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  const getAssetIcon = (id) => {
    if (!id) return '';
    const commonItem = REWARD_DB.items.common.find(i => i.id === id);
    if (commonItem && commonItem.icon) return commonItem.icon;
    const consumableItem = REWARD_DB.items.consumables.find(i => i.id === id);
    if (consumableItem && consumableItem.icon) return consumableItem.icon;
    for (const charKey in REWARD_DB.weapons) {
      const weapon = REWARD_DB.weapons[charKey].find(w => w.id === id);
      if (weapon && weapon.icon) return weapon.icon;
    }
    return ''; 
  };

  useEffect(() => {
    localStorage.setItem('vs_lang', language);
    window.dispatchEvent(new CustomEvent('VS_UPDATE_SETTINGS', {
      detail: { musicVolume: musicVolume / 100, sfxVolume: sfxVolume / 100, language: language }
    }));
  }, [musicVolume, sfxVolume, language]);

  useEffect(() => {
    const fetchMetaStats = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        if (!token) {
          setIsEngineReady(true);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/v1/shop/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setMetaUpgrades(data.upgrades || []);
          
          // --- CHECK IF THEY OWN THE DICE ---
          const rerollDb = data.upgrades?.find(u => u.upgrade_id === 'reroll');
          if (rerollDb && rerollDb.level > 0) {
            setHasRerollUpgrade(true);
          }
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
      setIsGameOver(true);
      if (e.detail && e.detail.level) setFinalLevel(e.detail.level);
      if (document.fullscreenElement) document.exitFullscreen();

      const runData = e.detail; 
      const token = sessionStorage.getItem('game_token');
      if (!token) return;

      try {
        await fetch(`${API_BASE_URL}/api/v1/game/end_run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(runData)
        });
      } catch (error) {
        console.error("Failed to sync run data:", error);
      }
    };
    
    const handleEnterMenu = () => setEngineState('menu');
    window.addEventListener('VS_ENTER_MENU', handleEnterMenu);

    const handleVictory = async (e) => {
      setIsVictory(true);
      // Ensure we use the exact variable name passed from the new payload
      if (e.detail && e.detail.survival_time_seconds) {
        setFinalTime(e.detail.survival_time_seconds);
      }
      if (document.fullscreenElement) document.exitFullscreen();

      // --- FIRE THE BACKEND API CALL ---
      const runData = e.detail; 
      const token = sessionStorage.getItem('game_token');
      if (!token) return;

      try {
        await fetch(`${API_BASE_URL}/api/v1/game/end_run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(runData)
        });
      } catch (error) {
        console.error("Failed to sync victory data:", error);
      }
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
    const handleHideBoss = () => setBossName(null);

    const generateChoices = (payload) => {
      const { weapons, items } = payload;
      let pool = [];

      weapons.forEach(equippedWeapon => {
        if (equippedWeapon.level < 5) {
          let dbRef = REWARD_DB.weapons[selectedCharacter].find(w => w.id === equippedWeapon.id);
          if (!dbRef) dbRef = { 
            id: equippedWeapon.id, type: 'weapon', 
            title: { en: equippedWeapon.id, fr: equippedWeapon.id, zh: equippedWeapon.id }, 
            desc: { en: 'Enhance your primary relic.', fr: 'Améliorez votre relique principale.', zh: '强化你的主要遗物。' }, 
            icon: getAssetIcon(equippedWeapon.id) 
          };
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
          { id: 'stat_might', type: 'stat', title: { en: 'LIMIT BREAK: MIGHT', fr: 'DÉPASSEMENT: PUISSANCE', zh: '极限突破：力量' }, desc: { en: '+10% Base Damage.', fr: '+10% de Dégâts de Base.', zh: '+10% 基础伤害。' }, icon: 'assets/items/equipable/dagger.png' },
          { id: 'stat_haste', type: 'stat', title: { en: 'LIMIT BREAK: HASTE', fr: 'DÉPASSEMENT: CÉLÉRITÉ', zh: '极限突破：急速' }, desc: { en: '+5% Attack Speed.', fr: '+5% de Vitesse d\'Attaque.', zh: '+5% 攻击速度。' }, icon: 'assets/items/equipable/boots.png' },
          { id: 'stat_swift', type: 'stat', title: { en: 'LIMIT BREAK: SWIFTNESS', fr: 'DÉPASSEMENT: AGILITÉ', zh: '极限突破：敏捷' }, desc: { en: '+10% Movement Speed.', fr: '+10% de Vitesse de Déplacement.', zh: '+10% 移动速度。' }, icon: 'assets/items/equipable/necklace.png' },
          { id: 'stat_vitality', type: 'stat', title: { en: 'LIMIT BREAK: VITALITY', fr: 'DÉPASSEMENT: VITALITÉ', zh: '极限突破：生命力' }, desc: { en: 'Heal 50% Max HP.', fr: 'Soigne 50% des PV Max.', zh: '恢复 50% 最大生命值。' }, icon: 'assets/items/equipable/ring.png' }
        ];
        const shuffledStats = infiniteStats.sort(() => 0.5 - Math.random());
        while (pool.length < 3 && shuffledStats.length > 0) {
          pool.push(shuffledStats.pop());
        }
      }

      const shuffledPool = pool.sort(() => 0.5 - Math.random());
      setCurrentChoices(shuffledPool.slice(0, 3));
    };

    const handleLevelUp = (e) => {
      setCurrentLevel(e.detail.level);
      setCurrentLevelUpPayload(e.detail);
      
      if (hasRerollUpgrade) {
        setRerollsRemaining(1);
      }
      
      generateChoices(e.detail);
      setIsLevelUp(true);
    };

    const handleRerollEvent = () => {
      if (currentLevelUpPayload) {
          generateChoices(currentLevelUpPayload);
      }
    };

    const handlePauseState = (e) => {
      setIsPaused(e.detail.isPaused);
      setPauseStats(e.detail.stats || null);
      if (e.detail.isPaused) setPauseTab('stats'); 
    };    

    window.addEventListener('VS_GAME_OVER', handleGameOver);
    window.addEventListener('VS_GAME_WON', handleVictory);
    window.addEventListener('VS_LEVEL_UP', handleLevelUp);
    window.addEventListener('VS_REROLL_TRIGGERED', handleRerollEvent);
    window.addEventListener('VS_PAUSE_STATE', handlePauseState);
    window.addEventListener('VS_ENTER_MENU', handleEnterMenu);
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
      window.removeEventListener('VS_GAME_WON', handleVictory);
      window.removeEventListener('VS_LEVEL_UP', handleLevelUp);
      window.addEventListener('VS_REROLL_TRIGGERED', handleRerollEvent);
      window.removeEventListener('VS_ENTER_MENU', handleEnterMenu);
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
  }, [selectedCharacter, language, hasRerollUpgrade, currentLevelUpPayload]);

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

  // --- Return to Menu Logic ---
  // Replaces the old navigate('/select')
  const handleReturnToMenu = () => {
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setEngineState('title'); 
    setGameTime(0);
    setPlayerHp(100);
    setPlayerXp(0);
    setPlayerCoins(0);
    // Reboot the entire Phaser instance (triggers PreloadScene -> CharacterSelectScene)
    setGameInstanceKey(prev => prev + 1);
  };

  const selectReward = (reward) => {
    setIsLevelUp(false);
    window.dispatchEvent(new CustomEvent('VS_APPLY_REWARD', { detail: { reward } }));
  };

  const handleReroll = () => {
    if (rerollsRemaining > 0 && currentLevelUpPayload) {
      setRerollsRemaining(prev => prev - 1);
      // We will define generateChoices inside the useEffect, but we need a way to trigger it.
      // Because generateChoices relies on the REWARD_DB and current state, 
      // the cleanest way to trigger a reroll from outside the useEffect is to 
      // dispatch a synthetic event that the useEffect is listening for!
      window.dispatchEvent(new CustomEvent('VS_REROLL_TRIGGERED'));
    }
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
      
      {/* 1. DYNAMIC NAVBAR SWAP */}
      <div className="absolute top-0 left-0 w-full z-50">
        {/* Render PublicNavbar for BOTH menu and title states */}
        {(engineState === 'menu' || engineState === 'title') && <PublicNavbar />}
        {engineState === 'combat' && <GameNavbar onToggleFullscreen={toggleFullScreen} />}
      </div>

      {/* 2. THE PHASER ENGINE (Always rendering in the background) */}
      <div className="absolute inset-0 z-0">
        {isEngineReady ? (
          <PhaserEngine key={gameInstanceKey} selectedCharacter={selectedCharacter} userUpgrades={metaUpgrades} />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-royal text-xl text-zinc-600 uppercase tracking-[0.4em] animate-pulse">
            Forging Vessel...
          </div>
        )}
      </div>

      {/* 3. THE MENU STATE: Show the HTML Overlay over Phaser */}
      {engineState === 'title' && (
        <MainTitleUI />
      )}

      {engineState === 'menu' && (
        <CharacterSelectUI 
          userUpgrades={metaUpgrades}
          onLockIn={(charId) => {
            setSelectedCharacter(charId);
            setEngineState('combat'); 
            window.dispatchEvent(new CustomEvent('VS_START_RUN', {
              detail: { characterId: charId, upgrades: metaUpgrades }
            }));
          }}
        />
      )}

      {/* 4. THE COMBAT STATE: Show the Game HUD over Phaser */}
      {engineState === 'combat' && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          <div className="absolute top-24 left-6 flex flex-col gap-2 pointer-events-auto">
            <div className="flex flex-col bg-black/85 border border-red-900/40 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.8)] p-3 backdrop-blur-md w-72">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{UI_DICT.level[language]}</span>
                  <span className="text-sm font-royal text-red-600 font-bold">{currentLevel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></div>
                  <span className="text-[10px] font-bold text-amber-500 tracking-widest">{playerCoins}</span>
                </div>
              </div>

              <div className="w-full relative h-3 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden mb-1.5 shadow-inner">
                <div className="h-full bg-red-800 shadow-[0_0_5px_rgba(185,28,28,0.8)] transition-all duration-200 ease-out" style={{ width: `${hpPercent}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold tracking-widest text-zinc-100 drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
                  {Math.floor(playerHp)} / {playerMaxHp}
                </span>
              </div>
              
              <div className="w-full relative h-2 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden mb-3 shadow-inner">
                <div className="h-full bg-blue-700 shadow-[0_0_5px_rgba(29,78,216,0.8)] transition-all duration-300 ease-out" style={{ width: `${xpPercent}%` }} />
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-zinc-800/50">
                {renderInventoryRow(inventoryWeapons)}
                {renderInventoryRow(inventoryItems)}
              </div>
            </div>
          </div>

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
      )}

      {/* --- OVERLAYS: Pause, Game Over, Victory, Level Up --- */}
      {isPaused && !isGameOver && !isLevelUp && engineState === 'combat' && (
  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="flex flex-col items-center animate-fade-in w-full max-w-3xl">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-zinc-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {UI_DICT.suspended[language]}
            </h2>
            
            <div className="flex gap-12 mb-8 border-b border-red-900/30 pb-3">
              <button onClick={() => setPauseTab('stats')} className={`text-xs uppercase tracking-[0.4em] font-bold transition-colors ${pauseTab === 'stats' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}>{UI_DICT.attributes[language]}</button>
              <button onClick={() => setPauseTab('inventory')} className={`text-xs uppercase tracking-[0.4em] font-bold transition-colors ${pauseTab === 'inventory' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}>{UI_DICT.inventory[language]}</button>
              <button onClick={() => setPauseTab('settings')} className={`text-xs uppercase tracking-[0.4em] font-bold transition-colors ${pauseTab === 'settings' ? 'text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-zinc-600 hover:text-zinc-400'}`}>{UI_DICT.settings[language]}</button>
            </div>

            {pauseTab === 'stats' && pauseStats && (
              <div className="w-full max-w-lg mb-10 p-8 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm">
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.vitality[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.hp} / {pauseStats.maxHp}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.agility[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.speed}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.power[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.damageMult}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.haste[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.haste}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.armor[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.armor}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{UI_DICT.greed[language]}</span>
                    <span className="font-royal text-xl text-zinc-200">{pauseStats.greed}%</span>
                  </div>
                </div>
              </div>
            )}

            {pauseTab === 'inventory' && pauseStats && (
              <div className="w-full mb-10 p-6 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm max-h-[350px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pauseStats.weapons.map(w => {
                    const dbInfo = REWARD_DB.weapons[selectedCharacter]?.find(x => x.id === w.id) || { title: {en: w.id, fr: w.id, zh: w.id}, desc: {en: 'Relic.', fr: 'Relique.', zh: '遗物。'} };
                    return (
                      <div key={`w-${w.id}`} className="flex items-start gap-4 p-3 border border-zinc-800/80 bg-black/40 rounded-sm">
                        <div className="w-12 h-12 shrink-0 bg-black/60 border border-zinc-700 flex items-center justify-center rounded">
                          <img src={getAssetIcon(w.id)} onError={(e) => e.target.style.display = 'none'} className="w-8 h-8 object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-royal text-zinc-200 uppercase tracking-widest">{t(dbInfo.title)}</span>
                            <span className="text-[10px] font-bold text-amber-500 tracking-widest">{UI_DICT.lvl[language]} {w.level}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-1 leading-relaxed uppercase">{t(dbInfo.desc)}</span>
                        </div>
                      </div>
                    )
                  })}
                  
                  {pauseStats.items.map(i => {
                    const dbInfo = REWARD_DB.items.common.find(x => x.id === i.id) || { title: {en: i.id, fr: i.id, zh: i.id}, desc: {en: 'Item.', fr: 'Objet.', zh: '物品。'} };
                    return (
                      <div key={`i-${i.id}`} className="flex items-start gap-4 p-3 border border-zinc-800/80 bg-black/40 rounded-sm">
                        <div className="w-12 h-12 shrink-0 bg-black/60 border border-zinc-700 flex items-center justify-center rounded">
                          <img src={getAssetIcon(i.id)} onError={(e) => e.target.style.display = 'none'} className="w-8 h-8 object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-royal text-zinc-200 uppercase tracking-widest">{t(dbInfo.title)}</span>
                            <span className="text-[10px] font-bold text-amber-500 tracking-widest">{UI_DICT.lvl[language]} {i.level}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-1 leading-relaxed uppercase">{t(dbInfo.desc)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {pauseTab === 'settings' && (
              <div className="w-full max-w-lg mb-10 p-8 border border-red-900/30 bg-zinc-950/50 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm flex flex-col gap-8">
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Music Volume</span>
                    <span className="font-royal text-xl text-zinc-200">{musicVolume}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={musicVolume} onChange={(e) => setMusicVolume(e.target.value)} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-700" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">SFX Volume</span>
                    <span className="font-royal text-xl text-zinc-200">{sfxVolume}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={sfxVolume} onChange={(e) => setSfxVolume(e.target.value)} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-700" />
                </div>

                <div className="flex flex-col gap-3 mt-2 pt-6 border-t border-zinc-800/50">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold text-center mb-1">{UI_DICT.langLabel[language]}</span>
                  <div className="flex gap-4">
                    <button onClick={() => setLanguage('en')} className={`flex-1 py-3 text-xs font-royal font-bold uppercase tracking-[0.2em] transition-all border ${language === 'en' ? 'border-red-600 text-red-100 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}>
                      EN
                    </button>
                    <button onClick={() => setLanguage('fr')} className={`flex-1 py-3 text-xs font-royal font-bold uppercase tracking-[0.2em] transition-all border ${language === 'fr' ? 'border-red-600 text-red-100 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}>
                      FR
                    </button>
                    <button onClick={() => setLanguage('zh')} className={`flex-1 py-3 text-xs font-royal font-bold uppercase tracking-[0.2em] transition-all border ${language === 'zh' ? 'border-red-600 text-red-100 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}>
                      中文
                    </button>
                  </div>
                </div>

              </div>
            )}

            <div className="flex gap-6">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('VS_RESUME_GAME'))} 
                className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]"
              >
                {UI_DICT.resume[language]}
              </button>
              
              <button 
                onClick={handleReturnToMenu} 
                className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-zinc-600 border-zinc-800 hover:text-red-500 hover:border-red-900 transition-all"
              >
                {UI_DICT.quitRun[language]}
              </button>
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-red-800 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
              {UI_DICT.vesselShattered[language]}
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-red-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">{UI_DICT.descentHalted[language]} {finalLevel}</p>
              <span className="w-8 h-px bg-red-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={handleRestart} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">{UI_DICT.resurrect[language]}</button>
              <button onClick={handleReturnToMenu} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em]">{UI_DICT.newVessel[language]}</button>
            </div>
          </div>
        </div>
      )}

      {isVictory && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-4 text-amber-500 drop-shadow-[0_0_20px_rgba(217,119,6,0.5)]">
              {UI_DICT.eclipseSurvived[language]}
            </h2>
            <div className="flex items-center gap-4 mb-12">
              <span className="w-8 h-px bg-amber-900/50"></span>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
                {UI_DICT.timeAlive[language]}: {formatTime(finalTime)}
              </p>
              <span className="w-8 h-px bg-amber-900/50"></span>
            </div>

            <div className="flex gap-6 mt-4">
              <button onClick={handleReturnToMenu} className="btn-pure px-10 py-4 text-xs uppercase tracking-[0.3em] text-amber-500 hover:text-amber-400">
                {UI_DICT.ascend[language]}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLevelUp && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <h2 className="font-royal text-3xl font-black uppercase tracking-[0.4em] text-zinc-200 mb-2">{UI_DICT.evolution[language]}</h2>
            <div className="flex gap-8 mt-8">
              {currentChoices.map((reward) => (
                <div key={reward.id} onClick={() => selectReward(reward)} className="qliphoth-node w-56 flex flex-col items-center text-center cursor-pointer group">
                  <div className="text-4xl mb-6 mt-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {reward.icon.includes('.png') ? <img src={reward.icon} alt={reward.id} className="w-16 h-16 object-contain" /> : reward.icon}
                  </div>
                  <h3 className="font-royal text-sm font-bold uppercase tracking-widest text-zinc-300 mb-2">{t(reward.title)}</h3>
                  
                  {reward.isUpgrade ? (
                    <div className="text-[10px] text-amber-600 font-bold tracking-[0.2em] uppercase mb-2 animate-pulse">
                      {UI_DICT.lvl[language]} {reward.currentLevel} ➔ {reward.currentLevel + 1}
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase mb-2">
                      {UI_DICT.lvl[language]} 1
                    </div>
                  )}

                  <div className="w-4 h-px bg-red-900/40 mb-3"></div>
                  <p className="text-[10px] text-zinc-500 tracking-widest leading-relaxed uppercase">{t(reward.desc)}</p>
                </div>
              ))}
            </div>
            {hasRerollUpgrade && (
              <div className="mt-12 flex flex-col items-center">
                <button 
                  onClick={handleReroll}
                  disabled={rerollsRemaining === 0}
                  className={`px-8 py-3 font-royal uppercase tracking-widest text-xs transition-all border ${
                    rerollsRemaining > 0 
                      ? 'border-red-900/80 text-red-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-300' 
                      : 'border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Reroll Destinies ({rerollsRemaining} Left)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}