import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="bg-demonic-hellscape min-h-screen pt-24 pb-12 font-grim relative overflow-hidden text-zinc-400">
      <DashboardNavbar />

      <main className="w-full max-w-5xl mx-auto px-6 z-10 flex flex-col gap-16 relative">
        
        {/* Dark Title Area */}
        <header className="text-center flex flex-col items-center mt-8">
          <h1 className="font-royal text-6xl md:text-7xl font-black uppercase tracking-[0.2em] mb-4 
            bg-gradient-to-b from-zinc-500 via-red-950 to-black text-transparent bg-clip-text drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
            THE ABYSS
          </h1>
          <p className="text-lg max-w-xl text-red-950 tracking-widest font-bold">
            "IN THIS WORLD, IS THE DESTINY OF MANKIND CONTROLLED BY SOME TRANSCENDENTAL ENTITY OR LAW?"
          </p>
        </header>

        {/* The Iron CTA Button */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => navigate('/select')} 
            className="btn-iron-slab px-14 py-5 font-black text-xl uppercase tracking-[0.3em]"
          >
            OFFER SACRIFICE (PLAY)
          </button>
        </div>

        {/* Gooey Data Slabs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {[
            { label: 'SOULS OFFERED', value: playerStats.runs },
            { label: 'ECLIPSE DURATION', value: playerStats.bestTime },
            { label: 'CORPSES PILED', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="wet-goo-card flex flex-col items-center justify-center p-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-red-950">
                {stat.label}
              </span>
              <span className="font-royal text-4xl font-black text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* Roster Area */}
        <section className="flex flex-col gap-6 items-center mt-8">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-900 pb-2">
            SURVIVING VESSELS
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="px-8 py-3 font-bold uppercase tracking-widest text-sm
                bg-black/80 border-l-2 border-red-900 text-zinc-500 shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                {hero}
              </div>
            ))}
            <div className="px-8 py-3 uppercase tracking-widest text-xs flex items-center justify-center
              bg-transparent border border-dashed border-zinc-900 text-zinc-800">
              + CONDEMNED
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}