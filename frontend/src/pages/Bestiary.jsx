import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { MONSTER_DB } from '../data/MonsterDB';

export default function Bestiary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBestiary = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bestiary/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            console.error("Auth failed - Token might be invalid or missing");
            return; // Stop here, don't try to set data
        }

        const data = await response.json();
        
        // Defensive check: Ensure data is actually an array
        if (Array.isArray(data)) {
            setData(data);
        } else {
            console.warn("Expected array, got:", data);
            setData([]); // Default to empty if unexpected format
        }
      } catch (err) { 
        console.error("Error fetching bestiary:", err); 
      }
    };
    fetchBestiary();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-200 pt-24">
      <PublicNavbar />
      <h2 className="text-center font-royal text-5xl text-red-800 mb-12">Bestiary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 max-w-5xl mx-auto">
        {Object.values(MONSTER_DB).map((m) => {
          const stats = data.find(d => d.monster_id === m.id) || { kills: 0, encounters: 0, wins: 0 };
          const isUnlocked = stats.kills > 0 || stats.encounters > 0;
          
          return (
            <div key={m.id} className={`p-4 border ${isUnlocked ? 'border-red-900' : 'border-zinc-800'} bg-zinc-950`}>
              <div className={!isUnlocked ? 'grayscale brightness-0 contrast-200' : ''}>
                <img src={`assets/monsters/${m.spriteKey}.png`} alt={m.name} className="w-20 h-20 mx-auto object-contain" />
              </div>
              <h3 className="text-center mt-2 font-bold">{isUnlocked ? m.name : '???'}</h3>
              
              <div className="text-[10px] text-center mt-2 text-zinc-500">
                {isUnlocked ? (
                  <>
                    <p>Kills: {stats.kills}</p>
                    {stats.encounters > 0 && <p>Boss Wins: {stats.wins}/{stats.encounters}</p>}
                  </>
                ) : <p>Locked</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}