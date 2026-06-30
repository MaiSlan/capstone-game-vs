import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';

export default function ProfileStats() {
  const [stats, setStats] = useState({});
  const [bestiary, setBestiary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('game_token');
      // Fetch Global Stats
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stats/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(await statsRes.json());

      // Fetch Bestiary for Boss Dossier
      const bestRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bestiary/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBestiary(await bestRes.json());
    };
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24 p-8">
      <PublicNavbar />
      <h2 className="text-5xl text-red-800 mb-8">Operator Profile</h2>
      
      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Runs" value={stats.total_runs} />
        <StatCard label="Win Rate" value={`${stats.total_runs > 0 ? Math.round((stats.total_wins/stats.total_runs)*100) : 0}%`} />
        <StatCard label="Total Gold" value={stats.total_gold_earned} />
        <StatCard label="Signature Operator" value={stats.most_played_character || 'N/A'} />
      </div>

      {/* Boss Dossier */}
      <h3 className="text-2xl text-red-600 mb-4">Boss Dossier</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bestiary.filter(b => b.encounters > 0).map(b => (
          <div key={b.monster_id} className="bg-zinc-900 p-4 border border-zinc-800">
            <p className="uppercase text-xs">{b.monster_id.replace(/_/g, ' ')}</p>
            <p className="text-xl">Wins: {b.wins} / Attempts: {b.encounters}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 p-4 border-l-4 border-red-800">
      <p className="text-zinc-500 uppercase text-[10px]">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}