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
  { id: 'witch', status: 'unlocked', img: 'assets/characters/witch/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
  { id: 'viking', status: 'unlocked', img: 'assets/characters/viking/standing.png', hasRotation: true, frames: ROTATION_FRAMES }, 
  { id: 'paladin', status: 'locked', img: 'assets/characters/paladin/standing.png', hasRotation: true, frames: PALADIN_FRAMES },
  { id: 'pirate', status: 'locked', img: 'assets/characters/pirate/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
  { id: 'berserker', status: 'locked', img: 'assets/characters/berserker/standing.png', hasRotation: true, frames: ROTATION_FRAMES },
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
        width: '256px',                
        height: '256px',
        transform: 'scale(0.85)', 
        transformOrigin: 'center center'
      }}
    />
  );
};

export default function CharacterSelect({ selectedCharacter, setSelectedCharacter }) {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (selectedCharacter && CHARACTER_DB[selectedCharacter]) {
      const maxQuotes = CHARACTER_DB[selectedCharacter].quotes.length;
      setQuoteIndex(Math.floor(Math.random() * maxQuotes));
    }
  }, [selectedCharacter]);

  const activeCharUI = ROSTER_UI.find(c => c.id === selectedCharacter);
  const activeCharData = selectedCharacter ? CHARACTER_DB[selectedCharacter] : null;
  
  // --- NEW: Fetch the specific weapon data for the active character ---
  const activeRelicData = activeCharData 
    ? REWARD_DB.weapons[activeCharData.id]?.find(w => w.id === activeCharData.weaponId) 
    : null;

  return (
    <div className="bg-pure-abyss min-h-screen pt-28 pb-12 font-grim relative text-zinc-400 overflow-x-hidden">
      <PublicNavbar />

      {/* Increased max-w to 7xl so all 5 cards fit perfectly in one row on desktop */}
      <main className="w-full max-w-7xl mx-auto px-4 z-10 flex flex-col items-center relative">
        
        <header className="text-center flex flex-col items-center mb-12">
          <h1 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.3em] mb-4 text-red-800/90 drop-shadow-[0_0_20px_rgba(139,0,0,0.3)]">
            Designate a Sacrifice
          </h1>
          <p className="text-xs max-w-lg text-zinc-400 tracking-[0.4em] uppercase font-bold">
            The Interstice demands a vessel. Choose their torment.
          </p>
        </header>
        
        {/* Adjusted gap and flex-nowrap on large screens to force alignment */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 xl:gap-8 mb-12 w-full">
          {ROSTER_UI.map((char) => (
            <div 
              key={char.id}
              onClick={() => char.status === 'unlocked' && setSelectedCharacter(char.id)}
              className={`w-44 sm:w-48 xl:w-52 h-72 flex flex-col items-center p-4 cursor-pointer transition-all duration-300 relative
                bg-black/60 backdrop-blur-md shrink-0
                ${selectedCharacter === char.id 
                  ? 'border border-red-700 shadow-[0_0_30px_rgba(139,0,0,0.6)] scale-105 transform translate-y-[-8px] z-10' 
                  : 'border border-zinc-900/80 hover:border-red-900/50 hover:bg-black/80'}
                ${char.status === 'locked' ? 'cursor-not-allowed opacity-30 grayscale' : ''}
              `}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-red-900/60 shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>

              {/* --- THE FIX: Absolute positioning container prevents flexbox breakage --- */}
              <div className="relative w-full flex-1 mb-2">
                {char.hasRotation ? (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <InteractiveSprite
                      spritesheetUrl={char.img}
                      frames={char.frames} 
                      isActive={selectedCharacter === char.id} 
                    />
                  </div>
                ) : char.img ? (
                  <img src={char.img} alt={char.id} className="object-contain w-full h-full drop-shadow-[0_5px_15px_rgba(0,0,0,1)]" />
                ) : (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-4xl text-red-900/30 font-royal">✦</span>
                  </div>
                )}
              </div>
              
              <div className="w-full text-center pt-3 mt-auto border-t border-red-900/30 font-royal font-bold text-sm uppercase tracking-widest text-zinc-200 z-10 bg-black/40">
                {CHARACTER_DB[char.id]?.name || 'Sealed'}
              </div>
            </div>
          ))}
        </div>

        {/* --- THE FIX: Reworked selected character info panel --- */}
        <div className="min-h-[16rem] w-full max-w-4xl flex flex-col items-center justify-start mb-10">
          {activeCharUI && activeCharUI.status === 'unlocked' && activeCharData ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
              
              <p className="text-sm md:text-base text-zinc-100 drop-shadow-[0_2px_8px_rgba(220,38,38,0.8)] tracking-[0.15em] font-semibold mb-6 text-center italic bg-black/40 px-8 py-3 rounded-md border-l-2 border-r-2 border-red-900/50">
                "{activeCharData.quotes[quoteIndex]}"
              </p>
              
              {/* Dual-column layout: Stats on left, Weapon Description on right */}
              <div className="flex flex-col md:flex-row w-full justify-center items-stretch gap-8 border-y border-red-900/30 py-6 bg-black/20 px-8">
                
                {/* Stats Block */}
                <div className="flex justify-center items-center gap-8 md:pr-8 md:border-r border-red-900/30">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2 font-bold">Vitality</span>
                    <span className="font-royal text-3xl text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">{activeCharData.hp}</span>
                  </div>
                  <div className="w-px h-12 bg-red-900/40 relative"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2 font-bold">Agility</span>
                    <span className="font-royal text-3xl text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">{activeCharData.speed}</span>
                  </div>
                </div>

                {/* Relic Lore Block */}
                <div className="flex flex-col justify-center items-center md:items-start max-w-sm text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-1 font-bold">Starting Relic</span>
                  <span className="font-royal text-xl text-red-100 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)] mb-1">
                    {activeCharData.weaponName}
                  </span>
                  <p className="text-xs text-zinc-400 italic leading-relaxed">
                    {activeRelicData ? activeRelicData.desc : "The abyss yields no secrets."}
                  </p>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.5em] text-zinc-700 font-bold">
              Awaiting Vessel...
            </div>
          )}
        </div>

        <div className="flex gap-12 items-center pb-8">
          <button 
            onClick={() => navigate('/home')} 
            className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all duration-300"
          >
            Abandon
          </button>
          
          <button 
            onClick={() => navigate('/play')} 
            disabled={!activeCharUI || activeCharUI.status === 'locked'}
            className="btn-pure px-14 py-5 border border-red-900/50 hover:bg-red-950/30 hover:border-red-600 transition-all rounded-sm font-royal text-base uppercase tracking-[0.4em] text-red-100 disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,0,0,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
          >
            Brand Them
          </button>
        </div>
      </main>
    </div>
  );
}