import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { CHARACTER_DB } from '../data/CharacterDB';
import { REWARD_DB } from '../data/RewardDB';

const ROTATION_FRAMES = [
  { x: 1, y: 517 },   // 0: South 
  { x: 517, y: 1 },   // 1: South-East
  { x: 1, y: 1 },     // 2: East
  { x: 259, y: 1 },   // 3: North-East
  { x: 259, y: 259 }, // 4: North 
  { x: 1, y: 259 },   // 5: North-West
  { x: 259, y: 517 }, // 6: West
  { x: 517, y: 259 }  // 7: South-West
];

const PALADIN_FRAMES = [
  { x: 517, y: 259 }, // 0: South
  { x: 1, y: 1 },     // 1: South-East (Fallback to East)
  { x: 1, y: 1 },     // 2: East
  { x: 259, y: 1 },   // 3: North-East
  { x: 259, y: 259 }, // 4: North
  { x: 1, y: 259 },   // 5: North-West
  { x: 1, y: 517 },   // 6: West
  { x: 517, y: 1 }    // 7: South-West
];

const ROSTER_UI = [
  { id: 'witch', cost: 0, img: 'assets/characters/witch/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
  { id: 'viking', cost: 0, img: 'assets/characters/viking/standing.png', hasRotation: true, frames: ROTATION_FRAMES }, 
  { id: 'paladin', cost: 3, img: 'assets/characters/paladin/standing.png', hasRotation: true, frames: PALADIN_FRAMES },
  { id: 'pirate', cost: 5, img: 'assets/characters/pirate/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
  { id: 'berserker', cost: 10, img: 'assets/characters/berserker/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
  { id: 'drifter', cost: 15, img: 'assets/characters/drifter/Cira.png', hasRotation: false, frames: ROTATION_FRAMES },
];

const InteractiveSprite = ({ spritesheetUrl, frames, isActive }) => {
  const [frameIdx, setFrameIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(null);

  const handlePointerDown = (e) => {
    if (!isActive) return; 
    setIsDragging(true);
    lastX.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastX.current;
    if (Math.abs(deltaX) > 12) { 
      setFrameIdx((prev) => {
        let next = prev + (deltaX > 0 ? -1 : 1);
        if (next > 7) next = 0;
        if (next < 0) next = 7;
        return next;
      });
      lastX.current = e.clientX;
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const frame = frames[frameIdx];

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`shrink-0 filter drop-shadow-[0_10px_20px_rgba(0,0,0,1)] ${isActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        backgroundImage: `url('${spritesheetUrl}')`,
        backgroundPosition: `-${frame.x}px -${frame.y}px`,
        backgroundSize: '774px 774px', 
        width: '256px', height: '256px',
        transform: 'scale(0.75)',
        transformOrigin: 'center center'
      }}
    />
  );
};

export default function CharacterSelect({ selectedCharacter, setSelectedCharacter }) {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const [goldBalance, setGoldBalance] = useState(0);
  const [unlockedChars, setUnlockedChars] = useState(['witch', 'viking']);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // --- FIX 1: Added loading state ---
  
  const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        if(!token) {
            setIsLoading(false);
            return;
        }
        const response = await fetch(`${API_URL}/api/v1/shop/roster`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setGoldBalance(data.gold_balance);
          setUnlockedChars(data.unlocked);
        }
      } catch (err) {
        console.error("Failed to fetch roster:", err);
      } finally {
        setIsLoading(false); // --- FIX 1: Stop loading once data arrives ---
      }
    };
    fetchRoster();
  }, []);

  useEffect(() => {
    if (selectedCharacter && CHARACTER_DB[selectedCharacter]) {
      const maxQuotes = CHARACTER_DB[selectedCharacter].quotes.length;
      setQuoteIndex(Math.floor(Math.random() * maxQuotes));
    }
  }, [selectedCharacter]);

  // --- FIX 1: Return loading screen if fetching data ---
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center font-grim text-zinc-500 uppercase tracking-[0.4em] gap-4">
        <PublicNavbar />
        <span className="text-4xl text-red-900/30 font-royal animate-pulse">✦</span>
        Consulting the Archives...
      </div>
    );
  }

  const activeCharUI = ROSTER_UI.find(c => c.id === selectedCharacter);
  const activeCharData = selectedCharacter ? CHARACTER_DB[selectedCharacter] : null;
  const activeRelicData = activeCharData ? REWARD_DB.weapons[activeCharData.id]?.find(w => w.id === activeCharData.weaponId) : null;
  const isCurrentlyLocked = selectedCharacter && !unlockedChars.includes(selectedCharacter);

  const handleUnlock = async () => {
    if (!activeCharUI || goldBalance < activeCharUI.cost || isPurchasing) return;
    setIsPurchasing(true);

    try {
      const token = sessionStorage.getItem('game_token');
      const response = await fetch(`${API_URL}/api/v1/shop/unlock`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ character_id: selectedCharacter, cost: activeCharUI.cost })
      });

      if (response.ok) {
        setGoldBalance(prev => prev - activeCharUI.cost);
        setUnlockedChars(prev => [...prev, selectedCharacter]);
      } else {
        console.error("Unlock rejected by the abyss.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    // --- FIX 2: Reverted to min-h-screen and increased top padding (pt-28) ---
    <div className="bg-pure-abyss min-h-screen pt-28 pb-12 font-grim relative text-zinc-400 overflow-x-hidden flex flex-col">
      <PublicNavbar />

      <main className="w-full max-w-7xl mx-auto px-4 z-10 flex flex-col items-center relative">
        
        {/* Header & Gold Display */}
        <header className="text-center flex flex-col items-center mb-10 shrink-0">
          <h1 className="font-royal text-4xl md:text-5xl font-black uppercase tracking-[0.3em] mb-3 text-red-800/90 drop-shadow-[0_0_20px_rgba(139,0,0,0.3)]">
            Designate a Sacrifice
          </h1>
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-amber-900/50"></span>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-500 font-bold flex items-center gap-2">
              Wealth: <span className="text-white text-lg">{goldBalance}</span> Gold
            </p>
            <span className="w-12 h-px bg-amber-900/50"></span>
          </div>
        </header>
        
        {/* Roster Grid */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 xl:gap-6 mb-8 w-full shrink-0">
          {ROSTER_UI.map((char) => {
            const isLocked = !unlockedChars.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            let cardClasses = `w-40 sm:w-44 xl:w-48 h-64 flex flex-col items-center p-4 cursor-pointer transition-all duration-300 relative bg-black/60 backdrop-blur-md shrink-0 `;
            
            if (isSelected && !isLocked) {
              cardClasses += `border border-red-700 shadow-[0_0_30px_rgba(139,0,0,0.6)] scale-105 transform translate-y-[-8px] z-10`;
            } else if (isSelected && isLocked) {
              cardClasses += `border border-zinc-700 shadow-[inset_0_0_30px_rgba(139,0,0,0.4)] z-10 opacity-90 grayscale brightness-75 ring-1 ring-red-900/50 animate-pulse`;
            } else if (!isSelected && isLocked) {
              cardClasses += `border border-zinc-900/80 opacity-40 grayscale brightness-50`;
            } else {
              cardClasses += `border border-zinc-900/80 hover:border-red-900/50 hover:bg-black/80`;
            }

            return (
              <div 
                key={char.id}
                onClick={() => setSelectedCharacter(char.id)}
                className={cardClasses}
              >
                {!isLocked && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-red-900/60 shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
                )}

                <div className="relative w-full flex-1 mb-2 overflow-hidden">
                  {char.hasRotation ? (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <InteractiveSprite
                        spritesheetUrl={char.img}
                        frames={char.frames} 
                        isActive={!isLocked && isSelected} 
                      />
                    </div>
                  ) : char.img ? (
                    <img src={char.img} alt={char.id} className="object-contain w-full h-full drop-shadow-[0_5px_15px_rgba(0,0,0,1)]" />
                  ) : (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="text-4xl text-red-900/30 font-royal">✦</span>
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent"></div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-3 bg-zinc-950 border-y border-zinc-800 shadow-[0_5px_15px_rgba(0,0,0,1)] rotate-45 opacity-90"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-3 bg-zinc-950 border-y border-zinc-800 shadow-[0_5px_15px_rgba(0,0,0,1)] -rotate-45 opacity-90"></div>
                      
                      <span className="relative z-30 text-[9px] font-royal uppercase tracking-[0.5em] text-red-900/60 font-black mt-32 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                        Bound
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="w-full text-center pt-2 pb-1 mt-auto border-t border-red-900/30 font-royal font-bold text-xs uppercase tracking-widest text-zinc-200 z-10 bg-black/40">
                  {CHARACTER_DB[char.id]?.name || 'Sealed'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Info Panel */}
        <div className="min-h-[12rem] w-full max-w-4xl flex flex-col items-center justify-start mb-6 shrink-0">
          {activeCharUI && activeCharData ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
              
              {/* --- FIX 3: Hide Quotes if Character is Locked --- */}
              {!isCurrentlyLocked ? (
                <p className="text-xs md:text-sm text-zinc-100 drop-shadow-[0_2px_8px_rgba(220,38,38,0.8)] tracking-[0.15em] font-semibold mb-4 text-center italic bg-black/40 px-8 py-2 rounded-md border-l-2 border-r-2 border-red-900/50">
                  "{activeCharData.quotes[quoteIndex]}"
                </p>
              ) : (
                <p className="text-xs md:text-sm text-zinc-600 tracking-[0.4em] font-bold mb-4 text-center italic bg-black/40 px-8 py-2 rounded-md border-y border-zinc-900/50 opacity-50">
                  [...]
                </p>
              )}
              
              <div className="flex flex-col md:flex-row w-full justify-center items-stretch gap-8 border-y border-red-900/30 py-4 bg-black/20 px-8">
                
                {isCurrentlyLocked ? (
                  <div className="w-full flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1 font-bold">Seal of the Void</span>
                    <h3 className="font-royal text-xl text-amber-500 tracking-[0.2em] mb-3">Tribute Required: {activeCharUI.cost} Gold</h3>
                    <button 
                      onClick={handleUnlock}
                      disabled={goldBalance < activeCharUI.cost || isPurchasing}
                      className={`btn-pure px-8 py-2 font-royal text-xs uppercase tracking-[0.3em] transition-all
                        ${goldBalance >= activeCharUI.cost ? 'text-amber-500 border-amber-900/50 hover:bg-amber-900/20 hover:border-amber-500' : 'text-zinc-600 border-zinc-800 opacity-50 cursor-not-allowed'}
                      `}
                    >
                      {isPurchasing ? 'Shattering Bindings...' : 'Break the Seal'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center items-center gap-8 md:pr-8 md:border-r border-red-900/30">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1 font-bold">Vitality</span>
                        <span className="font-royal text-2xl text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">{activeCharData.hp}</span>
                      </div>
                      <div className="w-px h-10 bg-red-900/40 relative"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1 font-bold">Agility</span>
                        <span className="font-royal text-2xl text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">{activeCharData.speed}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-start max-w-sm text-center md:text-left">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1 font-bold">Starting Relic</span>
                      <span className="font-royal text-lg text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)] mb-0.5">
                        {activeCharData.weaponName}
                      </span>
                      <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                        {activeRelicData ? activeRelicData.desc : "The abyss yields no secrets."}
                      </p>
                    </div>
                  </>
                )}

              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.5em] text-zinc-700 font-bold">
              Awaiting Vessel...
            </div>
          )}
        </div>

        {/* --- FIX 2: Adjusted buttons margin to pull them up naturally --- */}
        <div className="flex gap-12 items-center pb-6 mt-6">
          <button 
            onClick={() => navigate('/home')} 
            className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
          >
            Abandon
          </button>
          
          <button 
            onClick={() => navigate('/play')} 
            disabled={!activeCharUI || isCurrentlyLocked}
            className="btn-pure px-12 py-4 border border-red-900/50 hover:bg-red-950/30 hover:border-red-600 transition-all rounded-sm font-royal text-sm uppercase tracking-[0.4em] text-red-100 disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,0,0,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
          >
            Brand Them
          </button>
        </div>
      </main>
    </div>
  );
}