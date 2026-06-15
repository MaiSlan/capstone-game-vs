import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../data/components/PublicNavbar';
import { CHARACTER_DB } from '../data/CharacterDB';

// --- THE FIX: Made the frames generic so both Witch and Viking can use them ---
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

const ROSTER_UI = [
  { id: 'witch', status: 'unlocked', img: 'assets/characters/witch/standing.png', hasRotation: true },
  
  { id: 'viking', status: 'unlocked', img: 'assets/characters/viking/standing.png', hasRotation: true }, 
  
  { id: 'locked_1', status: 'locked', img: null, hasRotation: false },
  { id: 'locked_2', status: 'locked', img: null, hasRotation: false },
  { id: 'locked_3', status: 'locked', img: null, hasRotation: false },
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
      className={`shrink-0 filter drop-shadow-[0_5px_15px_rgba(0,0,0,1)] ${isActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        backgroundImage: `url('${spritesheetUrl}')`,
        backgroundPosition: `-${frame.x}px -${frame.y}px`,
        backgroundSize: '774px 774px', 
        width: '256px',                
        height: '256px',
        transform: 'scale(0.55)',      
      }}
    />
  );
};

export default function CharacterSelect({ selectedCharacter, setSelectedCharacter }) {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Whenever a new character is selected, pick a random number based on their quote array length
    if (selectedCharacter && CHARACTER_DB[selectedCharacter]) {
      const maxQuotes = CHARACTER_DB[selectedCharacter].quotes.length;
      setQuoteIndex(Math.floor(Math.random() * maxQuotes));
    }
  }, [selectedCharacter]);

  const activeCharUI = ROSTER_UI.find(c => c.id === selectedCharacter);
  const activeCharData = selectedCharacter ? CHARACTER_DB[selectedCharacter] : null;

  return (
    <div className="bg-pure-abyss min-h-screen pt-32 pb-12 font-grim relative text-zinc-400">
      <PublicNavbar />

      <main className="w-full max-w-5xl mx-auto px-6 z-10 flex flex-col items-center relative">
        
        <header className="text-center flex flex-col items-center mb-12">
          <h1 className="font-royal text-4xl md:text-5xl font-black uppercase tracking-[0.4em] mb-4 text-red-800/90 drop-shadow-[0_0_15px_rgba(139,0,0,0.1)]">
            Manifest Vessel
          </h1>
          <p className="text-[10px] max-w-lg text-zinc-500 tracking-[0.3em] uppercase font-bold">
            Choose a soul bound to the Tartarus Node.
          </p>
        </header>
        
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {ROSTER_UI.map((char) => (
            <div 
              key={char.id}
              onClick={() => char.status === 'unlocked' && setSelectedCharacter(char.id)}
              className={`w-40 h-56 flex flex-col items-center justify-between p-4 cursor-pointer transition-all duration-300 relative
                bg-black/40 backdrop-blur-sm
                ${selectedCharacter === char.id 
                  ? 'border border-red-700 shadow-[0_0_20px_rgba(139,0,0,0.4)] scale-105 transform translate-y-[-4px]' 
                  : 'border border-zinc-900/50 hover:border-red-900/50 hover:bg-black/60'}
                ${char.status === 'locked' ? 'cursor-not-allowed opacity-30 grayscale' : ''}
              `}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-red-900/50"></div>

              <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                {/* --- THE FIX: Dynamically render the spinner if the character supports it --- */}
                {char.hasRotation ? (
                  <InteractiveSprite
                    spritesheetUrl={char.img}
                    frames={ROTATION_FRAMES}
                    isActive={selectedCharacter === char.id} 
                  />
                ) : char.img ? (
                  <img src={char.img} alt={char.id} className="object-contain w-full h-full drop-shadow-[0_5px_15px_rgba(0,0,0,1)]" />
                ) : (
                  <span className="text-2xl text-red-900/30 font-royal">✦</span>
                )}
              </div>
              
              <div className="w-full text-center py-2 mt-2 border-t border-red-900/20 font-royal font-bold text-xs uppercase tracking-widest text-zinc-300">
                {CHARACTER_DB[char.id]?.name || 'Sealed'}
              </div>
            </div>
          ))}
        </div>

        <div className="h-40 w-full max-w-2xl flex flex-col items-center justify-center mb-12">
          {activeCharUI && activeCharUI.status === 'unlocked' && activeCharData ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <p className="text-[11px] text-red-900/80 tracking-[0.2em] uppercase font-bold mb-6 text-center italic">
                {activeCharData.quotes[quoteIndex]}
              </p>
              
              <div className="flex w-full justify-center gap-12 border-t border-b border-red-900/20 py-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">Vitality</span>
                  <span className="font-royal text-xl text-zinc-200">{activeCharData.hp}</span>
                </div>
                <div className="w-px bg-red-900/20 flex items-center justify-center relative">
                  <span className="absolute text-red-900/40 text-[8px]">✦</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">Agility</span>
                  <span className="font-royal text-xl text-zinc-200">{activeCharData.speed}</span>
                </div>
                <div className="w-px bg-red-900/20 flex items-center justify-center relative">
                  <span className="absolute text-red-900/40 text-[8px]">✦</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">Relic</span>
                  <span className="font-royal text-lg text-zinc-200">{activeCharData.weaponName}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-700">Awaiting Vessel...</div>
          )}
        </div>

        <div className="flex gap-8 items-center mt-auto">
          <button 
            onClick={() => navigate('/home')} 
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-300 transition-colors duration-300"
          >
            Abandon
          </button>
          
          <button 
            onClick={() => navigate('/play')} 
            disabled={!activeCharUI || activeCharUI.status === 'locked'}
            className="btn-pure px-12 py-4 rounded-full font-royal text-sm uppercase tracking-[0.3em] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Awaken
          </button>
        </div>
      </main>
    </div>
  );
}