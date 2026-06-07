import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function HomePage() {
  const navigate = useNavigate();

  // Placeholder data (we will fetch this from Supabase later)
  const playerStats = { runs: 42, bestTime: '14:23', kills: 8439 };
  const unlockedHeroes = ['The Witch', 'The Viking'];

  return (
    <div className="min-h-screen pt-20 transition-colors duration-500 flex flex-col items-center
      bg-slate-50 text-slate-800 
      dark:bg-zinc-950 dark:text-zinc-200 relative overflow-hidden">
      
      <DashboardNavbar />

      {/* Decorative Background Elements */}
      {/* Light Mode: Ethereal blue/gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-200/40 blur-[120px] rounded-full pointer-events-none dark:opacity-0 transition-opacity duration-700" />
      {/* Dark Mode: Sinister red/black abyss */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/20 blur-[150px] rounded-full pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700" />

      <main className="w-full max-w-5xl p-8 z-10 flex flex-col gap-12 mt-8">
        
        {/* Welcome Banner */}
        <header className="text-center">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-widest transition-colors duration-500
            text-slate-900 
            dark:text-white">
            Command Center
          </h1>
          <p className="text-lg font-medium transition-colors duration-500
            text-sky-700 
            dark:text-red-500">
            "He died doing what he wanted, no matter what, right? I bet he was happy."
          </p>
        </header>

        {/* Action CTA */}
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/select')} 
            className="px-16 py-6 rounded-2xl font-black text-3xl uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1
              bg-gradient-to-r from-amber-300 to-sky-400 text-white shadow-[0_0_30px_rgba(56,189,248,0.5)] border-2 border-white hover:shadow-[0_0_50px_rgba(56,189,248,0.8)]
              dark:from-red-800 dark:to-zinc-900 dark:text-red-500 dark:shadow-[0_0_30px_rgba(220,38,38,0.3)] dark:border-red-900 dark:hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]"
          >
            Enter the Fray
          </button>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Runs', value: playerStats.runs },
            { label: 'Best Survival Time', value: playerStats.bestTime },
            { label: 'Enemies Slaughtered', value: playerStats.kills.toLocaleString() }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl border-2 transition-colors duration-500 flex flex-col items-center
              bg-white border-sky-100 shadow-md
              dark:bg-zinc-900/50 dark:border-red-900/30 dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <span className="text-sm font-bold uppercase tracking-wider mb-2
                text-amber-500 dark:text-zinc-500">{stat.label}</span>
              <span className="text-4xl font-black
                text-slate-800 dark:text-red-500">{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Armory / Roster Preview */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 pb-2 transition-colors duration-500
            border-amber-200 text-slate-800
            dark:border-red-900/50 dark:text-zinc-400">
            The Roster
          </h2>
          <div className="flex gap-4">
            {unlockedHeroes.map((hero, i) => (
              <div key={i} className="px-6 py-4 rounded-lg border-2 font-bold transition-all duration-300
                bg-slate-100 border-sky-200 text-sky-800
                dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300">
                {hero}
              </div>
            ))}
            <div className="px-6 py-4 rounded-lg border-2 border-dashed font-bold flex items-center justify-center cursor-not-allowed
              bg-slate-50 border-slate-300 text-slate-400
              dark:bg-transparent dark:border-zinc-800 dark:text-zinc-700">
              + Locked
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}