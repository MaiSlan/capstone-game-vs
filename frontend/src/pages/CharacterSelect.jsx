import { useNavigate } from 'react-router-dom';

const ROSTER = [
  { id: 'witch', name: 'Witch', status: 'unlocked', color: 'border-pink-500', bg: 'bg-pink-900/20', img: 'assets/characters/witch.png' },
  { id: 'viking', name: 'Viking', status: 'unlocked', color: 'border-blue-500', bg: 'bg-blue-900/20', img: 'assets/characters/viking.png' },
  { id: 'locked_1', name: '???', status: 'locked', color: 'border-zinc-700', bg: 'bg-zinc-900/50', img: null },
  { id: 'locked_2', name: '???', status: 'locked', color: 'border-zinc-700', bg: 'bg-zinc-900/50', img: null },
  { id: 'locked_3', name: '???', status: 'locked', color: 'border-zinc-700', bg: 'bg-zinc-900/50', img: null },
];

export default function CharacterSelect({ selectedCharacter, setSelectedCharacter }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-4xl font-bold text-pink-400 mb-8">Select Your Hero</h1>
      
      <div className="flex gap-6 mb-12">
        {ROSTER.map((char) => (
          <div 
            key={char.id}
            onClick={() => char.status === 'unlocked' && setSelectedCharacter(char.id)}
            className={`w-40 h-56 rounded-xl border-4 flex flex-col items-center justify-between p-4 cursor-pointer transition-all duration-200
              ${char.bg} ${char.color}
              ${selectedCharacter === char.id ? 'scale-110 shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'opacity-70 hover:opacity-100'}
              ${char.status === 'locked' ? 'cursor-not-allowed opacity-40 grayscale' : ''}
            `}
          >
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              {char.img ? (
                <img src={char.img} alt={char.name} className="object-contain w-full h-full" />
              ) : (
                <span className="text-5xl">🔒</span>
              )}
            </div>
            <div className="w-full text-center py-2 mt-2 bg-black/60 rounded font-bold text-sm">
              {char.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition">BACK</button>
        <button onClick={() => navigate('/play')} className="px-10 py-3 bg-pink-600 rounded-xl font-bold text-xl hover:bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] transition">START RUN</button>
      </div>
    </div>
  );
}