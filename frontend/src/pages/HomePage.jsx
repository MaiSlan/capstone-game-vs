import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="bg-pure-abyss min-h-screen pt-40 pb-12 font-grim relative">
      <PublicNavbar />

      <main className="w-full max-w-5xl mx-auto px-6 z-10 flex flex-col gap-20 relative">
        
        <header className="text-center flex flex-col items-center">
          <h1 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-6 text-red-800/90 drop-shadow-[0_0_20px_rgba(139,0,0,0.1)]">
            The Descent
          </h1>
          <p className="text-xs max-w-lg text-zinc-500 tracking-[0.2em] uppercase font-medium leading-relaxed">
            Break the cycle of the Godhand. <br/> Or become a stain upon the abyss.
          </p>
        </header>

        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/select')} 
            className="btn-pure px-14 py-4 rounded-full font-royal text-sm uppercase tracking-[0.3em]"
          >
            Commence Ritual
          </button>
        </div>

        {/* Hollow Knight style purity - No boxes, just data hanging in the void */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
          {[
            { label: 'Souls Sacrificed', value: playerStats.runs },
            { label: 'Deepest Layer', value: playerStats.bestTime },
            { label: 'Vessels Shattered', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="qliphoth-node flex flex-col items-center justify-center pt-8 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-red-900/60">
                {stat.label}
              </span>
              <span className="font-royal text-4xl font-black text-zinc-300 tracking-widest">
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* Bound Vessels */}
        <section className="flex flex-col gap-8 items-center mt-8">
          <div className="flex items-center gap-6">
            <span className="text-red-900/40">✦</span>
            <h2 className="font-royal text-[10px] font-bold uppercase tracking-[0.5em] text-red-800">
              Awakened Chibi
            </h2>
            <span className="text-red-900/40">✦</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="px-8 py-2 font-medium uppercase tracking-[0.2em] text-xs
                border-b border-red-900/30 text-zinc-400 hover:text-zinc-200 hover:border-red-700 transition-all cursor-pointer">
                {hero}
              </div>
            ))}
            <div className="px-8 py-2 font-medium uppercase tracking-[0.2em] text-[10px]
                 text-red-900/40 cursor-not-allowed">
              + Bound
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}