import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="bg-dentelle min-h-screen pt-32 pb-12 font-grim relative">
      <DashboardNavbar />

      {/* Main Content wrapped to stay above the CSS shadow vignette */}
      <main className="w-full max-w-5xl mx-auto px-6 z-10 flex flex-col gap-16 relative">
        
        <header className="text-center flex flex-col items-center mt-6">
          <h1 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.3em] mb-4 text-red-800 drop-shadow-[0_0_15px_rgba(139,0,0,0.2)]">
            THE TARTARUS NODE
          </h1>
          {/* Pale text for readability */}
          <p className="text-sm max-w-xl text-zinc-400 tracking-[0.1em] font-light leading-relaxed">
            Even in the deepest abyss, the threads of fate weave a pattern. Break the cycle, or become part of the design.
          </p>
        </header>

        <div className="flex justify-center mt-2">
          <button 
            onClick={() => navigate('/select')} 
            className="btn-gothic px-12 py-4 rounded-full font-royal text-lg uppercase tracking-[0.3em]"
          >
            DESCEND
          </button>
        </div>

        {/* The Qliphoth Data Nodes */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { label: 'SOULS OFFERED', value: playerStats.runs },
            { label: 'DEEPEST DESCENT', value: playerStats.bestTime },
            { label: 'ENTITIES PURGED', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="qliphoth-node flex flex-col items-center justify-center pt-10 pb-6">
              {/* Red for the structural label */}
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 text-red-900/80">
                {stat.label}
              </span>
              {/* Crisp, pale white for the actual data */}
              <span className="font-royal text-4xl font-black text-zinc-200 tracking-wider">
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* Active Vessels Array */}
        <section className="flex flex-col gap-8 items-center mt-10">
          <div className="flex items-center gap-4">
            <span className="text-red-900">✧</span>
            <h2 className="font-royal text-xs font-bold uppercase tracking-[0.4em] text-red-700">
              MANIFESTED VESSELS
            </h2>
            <span className="text-red-900">✧</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="px-10 py-3 font-medium uppercase tracking-[0.2em] text-sm
                border border-red-900/30 bg-black/40 text-zinc-300 rounded-full hover:border-red-700 transition-colors cursor-pointer">
                {hero}
              </div>
            ))}
            <div className="px-10 py-3 font-medium uppercase tracking-[0.2em] text-xs
              border border-dashed border-red-900/40 text-red-900/60 rounded-full cursor-not-allowed">
              + BOUND
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}