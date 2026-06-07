import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="theme-canvas min-h-screen pt-24 pb-12 transition-colors duration-700 font-royal dark:font-grim relative">
      <DashboardNavbar />

      <main className="w-full max-w-6xl mx-auto px-6 z-10 flex flex-col gap-16 relative">
        
        {/* Header Section */}
        <header className="text-center flex flex-col items-center mt-10">
          <h1 className="theme-title-text text-5xl md:text-7xl font-black uppercase tracking-widest mb-4">
            Campaign Hub
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-amber-700/80 dark:text-red-500/70 tracking-wide font-medium">
            <span className="dark:hidden">"Dreams breathe life into men, and can cage them in suffering."</span>
            <span className="hidden dark:inline">"If you meet God... tell him to leave me alone."</span>
          </p>
        </header>

        {/* Master Action Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/select')} 
            className="theme-main-action px-16 py-6 rounded-full dark:rounded-sm font-bold text-2xl uppercase tracking-[0.2em]"
          >
            Commence Strike
          </button>
        </div>

        {/* Stats Section - Shape-Shifting Architecture */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Sorties', value: playerStats.runs },
            { label: 'Longest Survival', value: playerStats.bestTime },
            { label: 'Casualties', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="
              relative flex flex-col items-center justify-center p-8 transition-all duration-700
              /* LIGHT MODE: Royal Parchment / Palace Arches */
              bg-white/80 backdrop-blur-md rounded-[2rem] rounded-tl-sm border border-amber-200/50 shadow-[0_15px_30px_-10px_rgba(212,175,55,0.15)]
              /* DARK MODE: Visceral Monolith / Godhand Pillars */
              dark:bg-zinc-950/90 dark:rounded-none dark:border-0 dark:border-b-4 dark:border-red-900 dark:shadow-[inset_0_-20px_40px_-20px_rgba(220,20,60,0.3)]
            ">
              <span className="text-sm font-bold uppercase tracking-widest mb-2 text-amber-600/70 dark:text-red-500/50">
                {stat.label}
              </span>
              <span className="text-4xl font-black text-slate-800 dark:text-zinc-200">
                {stat.value}
              </span>
            </div>
          ))}
        </section>

        {/* Roster Section - Shape-Shifting Architecture */}
        <section className="flex flex-col gap-6 items-center">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-amber-600/60 dark:text-red-600/60 flex items-center gap-4">
            <span className="h-px w-12 bg-amber-200 dark:bg-red-900/50"></span>
            Active Roster
            <span className="h-px w-12 bg-amber-200 dark:bg-red-900/50"></span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="
                px-8 py-4 font-bold uppercase tracking-widest transition-all duration-500
                /* LIGHT MODE: Regal Banner */
                bg-gradient-to-b from-amber-50 to-white rounded-full border border-amber-200 text-amber-900 shadow-md
                /* DARK MODE: Scorched Iron Plate */
                dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black dark:rounded-none dark:border-l-2 dark:border-t-0 dark:border-r-0 dark:border-b-0 dark:border-red-700 dark:text-zinc-400 dark:shadow-none
              ">
                {hero}
              </div>
            ))}
            <div className="
              px-8 py-4 uppercase tracking-widest text-sm flex items-center justify-center cursor-not-allowed transition-all duration-500
              /* LIGHT MODE */
              bg-transparent border-2 border-dashed border-amber-200/50 text-amber-700/40 rounded-full
              /* DARK MODE */
              dark:bg-transparent dark:border-zinc-800 dark:text-zinc-700 dark:rounded-none
            ">
              + Sealed
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}