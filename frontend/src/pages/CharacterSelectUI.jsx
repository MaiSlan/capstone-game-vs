// src/components/CharacterSelectUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CHARACTER_DB } from '../data/CharacterDB';
import { REWARD_DB } from '../data/RewardDB';

const ROSTER_CONFIG = [
  { id: 'witch', cost: 0 }, { id: 'viking', cost: 0 }, 
  { id: 'paladin', cost: 3 }, { id: 'pirate', cost: 5 },
  { id: 'berserker', cost: 10 }, { id: 'drifter', cost: 15 },
];

export default function CharacterSelectUI({ userUpgrades, onLockIn }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [selectedChar, setSelectedChar] = useState('witch');
  const [goldBalance, setGoldBalance] = useState(0);
  const [unlockedChars, setUnlockedChars] = useState(['witch', 'viking']);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  const getTrans = (obj) => {
    if (!obj) return '';
    return typeof obj === 'string' ? obj : (obj[currentLang] || obj.en || '');
  };

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        if (!token) return;
        const res = await fetch(`${API_URL}/api/v1/shop/roster`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setGoldBalance(data.gold_balance);
          setUnlockedChars(data.unlocked);
        }
      } catch (err) { console.error(err); }
    };
    fetchRoster();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('VS_PREVIEW_CHAR', {
      detail: { 
        characterId: selectedChar, 
        isLocked: !unlockedChars.includes(selectedChar) 
      }
    }));
  }, [selectedChar, unlockedChars]);

  const activeUI = ROSTER_CONFIG.find(c => c.id === selectedChar);
  const activeData = CHARACTER_DB[selectedChar];
  const activeRelic = activeData ? REWARD_DB.weapons[selectedChar]?.find(w => w.id === activeData.weaponId) : null;
  const isLocked = !unlockedChars.includes(selectedChar);

  const handleUnlock = async () => {
    if (goldBalance < activeUI.cost || isPurchasing) return;
    setIsPurchasing(true);
    try {
      const token = sessionStorage.getItem('game_token');
      const res = await fetch(`${API_URL}/api/v1/shop/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ character_id: selectedChar, cost: activeUI.cost })
      });
      if (res.ok) {
        setGoldBalance(prev => prev - activeUI.cost);
        setUnlockedChars(prev => [...prev, selectedChar]);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col p-8 xl:p-12 font-grim select-none overflow-hidden">
      
      {/* TOP: Header & Gold */}
      <div className="relative w-full flex justify-end items-start pointer-events-auto mt-16 md:mt-20 shrink-0">
        
        {/* Centered Title (Absolutely positioned to ignore flex spacing) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full text-center pointer-events-none">
          <h1 className="font-royal text-5xl font-black uppercase tracking-[0.3em] text-red-800/90 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
            {t('navbar.charSelect', 'Designate a Sacrifice')}
          </h1>
        </div>
        
        {/* Gold Display on the Right */}
        <div className="flex items-center gap-4 bg-black/50 px-8 py-3 rounded-sm border border-amber-900/50 backdrop-blur-md z-10">
          <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-bold">Wealth</span>
          <span className="font-royal text-3xl text-zinc-200">{goldBalance}</span>
        </div>

      </div>

      {/* MIDDLE: Hollow Layout */}
      <div className="flex-1 w-full flex justify-between items-center my-6">
        
        {/* LEFT: ROSTER LIST */}
        <div className="flex flex-col gap-4 pointer-events-auto w-72 mt-8">
          {ROSTER_CONFIG.map(char => {
            const charLocked = !unlockedChars.includes(char.id);
            const isSelected = selectedChar === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char.id)}
                className={`w-full text-left p-5 border transition-all duration-300 backdrop-blur-md flex justify-between items-center
                  ${isSelected ? 'bg-red-950/50 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105 ml-2' : 'bg-black/60 border-zinc-800 hover:border-red-900/60'}
                  ${charLocked ? 'opacity-50 grayscale' : ''}
                `}
              >
                <span className="font-royal text-lg uppercase tracking-widest text-zinc-200">
                  {getTrans(CHARACTER_DB[char.id]?.name) || char.id}
                </span>
                {charLocked && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Locked</span>}
              </button>
            );
          })}
        </div>

        {/* RIGHT: STATS PANEL */}
        <div className="w-[30rem] bg-black/70 border border-red-900/40 p-8 backdrop-blur-md pointer-events-auto flex flex-col gap-8 shadow-[inset_0_0_40px_rgba(139,0,0,0.3)] rounded-sm mt-8">
          {activeData && (
            <>
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Vitality</span>
                <span className="font-royal text-3xl text-zinc-100 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">{activeData.hp}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Agility</span>
                <span className="font-royal text-3xl text-zinc-100 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">{activeData.speed}</span>
              </div>
              
              <div className="flex flex-col mt-2">
                <span className="text-xs uppercase tracking-[0.4em] text-red-500 mb-2 font-black">Starting Relic</span>
                <span className="font-royal text-2xl text-zinc-100 uppercase tracking-widest mb-2">{getTrans(activeData.weaponName)}</span>
                <span className="text-sm text-zinc-400 italic leading-relaxed uppercase">{getTrans(activeRelic?.desc)}</span>
              </div>

              {!isLocked ? (
                <p className="text-sm text-zinc-300 italic tracking-widest leading-relaxed mt-4 border-l-4 border-red-800 pl-4 py-2 bg-black/40">
                  "{getTrans(activeData.quotes[0])}"
                </p>
              ) : (
                <div className="mt-6 flex flex-col items-center border-t border-red-900/40 pt-6">
                  <span className="text-xs uppercase tracking-[0.4em] text-amber-500 mb-4 font-bold">Tribute: {activeUI.cost} Gold</span>
                  <button 
                    onClick={handleUnlock}
                    disabled={goldBalance < activeUI.cost || isPurchasing}
                    className="btn-pure w-full py-4 font-royal text-sm uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed text-amber-500 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    {isPurchasing ? 'Shattering...' : 'Break Seal'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* BOTTOM CENTER: Brand Button (Absolutely positioned under the character) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button 
          onClick={() => onLockIn(selectedChar)}
          disabled={isLocked}
          className="btn-pure px-24 py-6 border border-red-900/60 hover:bg-red-950/40 transition-all rounded-sm font-royal text-2xl uppercase tracking-[0.4em] text-red-100 disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(139,0,0,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)]"
        >
          Brand Them
        </button>
      </div>

    </div>
  );
}