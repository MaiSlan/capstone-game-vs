import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="min-h-screen pt-20 transition-colors duration-500 flex flex-col items-center select-none font-mono
      bg-hawk-cream text-slate-800 
      dark:bg-guts-abyss dark:text-zinc-400 relative overflow-hidden">
      
      <DashboardNavbar />

      {/* Atmospheric Vignettes - Removing clean ambient circles for deep environmental overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-hawk-sky-glow/40 via-transparent to-transparent pointer-events-none dark:opacity-0 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-guts-blood-dry/20 via-transparent to-guts-abyss pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700" />

      <main className="w-full max-w-5xl p-8 z-10 flex flex-col gap-12 mt-6">
        
        {/* Deep Fantasy Header Block */}
        <header className="text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.3em] mb-4 transition-all duration-500 text-metallic-gold dark:text-metallic-iron">
            TACTICAL SLAB
          </h1>
          <div className="h-1 w-32 bg-hawk-gold-dull dark:bg-guts-blood-fresh transition-colors duration-500 mb-4" />
          <p className="text-xs italic max-w-xl transition-colors duration-500 font-serif text-slate-600 dark:text-zinc-500">
            "In this world, is the destiny of mankind controlled by some transcendental law or hand? Is it like the hand of God hovering above?"
          </p>
        </header>

        {/* Master CTA Button - Textured as a Forged Relic Stamp */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/select')} 
            className="px-14 py-5 rounded font-black text-xl uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 cursor-pointer
              texture-burnished-gold text-hawk-cream border-2 border-hawk-ivory shadow-[4px_4px_0px_#583c0a] hover:brightness-110
              dark:texture-forged-iron dark:text-guts-blood-fresh dark:border-guts-blood-dry dark:shadow-[6px_6px_0px_#000000] dark:hover:text-red-400"
          >
            ENTER THE INFESTATION
          </button>
        </div>

        {/* Stats Grid - Designed as Heavy Stone Plaques / Scorched Iron Tablets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'RUNS ATTEMPTED', value: playerStats.runs },
            { label: 'MAX SURVIVAL LIMIT', value: playerStats.bestTime },
            { label: 'FOES SLAUGHTERED', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded border-hawk-double transition-all duration-500 flex flex-col items-center justify-center text-center
              bg-hawk-ivory border-hawk-gold-dull shadow-[2px_2px_10px_rgba(146,106,30,0.1)]
              dark:bg-guts-obsidian dark:border-guts-blood-dry dark:shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]">
              <span className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 dark:text-zinc-600">
                {stat.label}
              </span>
              <span className="text-3xl font-black tracking-tighter text-hawk-royal-blue dark:text-guts-blood-fresh">
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* Roster Layout - Designed as an Unforgiving Slate Ledger */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b pb-2 transition-colors duration-500
            border-hawk-gold-dull text-slate-800
            dark:border-guts-blood-dry dark:text-zinc-500">
            OPERATIONAL COMBATANTS
          </h2>
          <div className="flex flex-wrap gap-4">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="px-6 py-3.5 rounded border font-bold uppercase tracking-wider text-xs transition-all duration-500
                bg-white border-hawk-gold-dull text-hawk-royal-blue shadow-[1px_1px_0px_#926a1e]
                dark:bg-guts-obsidian dark:border-zinc-800 dark:text-zinc-400 dark:shadow-[2px_2px_0px_#000000]">
                {hero}
              </div>
            ))}
            <div className="px-6 py-3.5 rounded border border-dashed text-xs font-bold uppercase tracking-wider flex items-center justify-center cursor-not-allowed
              bg-slate-200/50 border-slate-400 text-slate-400
              dark:bg-transparent dark:border-guts-blood-dry dark:text-zinc-700">
              + LOCKED UNIT
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}