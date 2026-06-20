import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

// A local catalog defining the meta-upgrades available in the shop
const UPGRADE_CATALOG = [
  { id: 'vitality', title: 'Vitality', desc: '+10% Base HP per level', baseCost: 100, maxLevel: 5, icon: 'assets/items/equipable/ring.png' },
  { id: 'might', title: 'Might', desc: '+5% Base Damage per level', baseCost: 150, maxLevel: 5, icon: 'assets/items/equipable/dagger.png' },
  { id: 'haste', title: 'Haste', desc: '+2% Attack Speed per level', baseCost: 120, maxLevel: 5, icon: 'assets/items/equipable/boots.png' },
  { id: 'greed', title: 'Greed', desc: '+10% Gold Drop Rate per level', baseCost: 200, maxLevel: 5, icon: 'assets/items/equipable/coin_purse.png' }
];

export default function BoneFireShop() {
  const API_URL = import.meta.env.DEV ? 'http://127.0.0.1:5000' : 'https://capstone-game-vs.onrender.com';
  const [goldBalance, setGoldBalance] = useState(0);
  const [userUpgrades, setUserUpgrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch initial shop data from the FastAPI backend
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = localStorage.getItem('game_token'); 
        const response = await fetch(`${API_URL}/api/v1/shop/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to awaken the bonfire.');
        
        const data = await response.json();
        setGoldBalance(data.gold_balance);
        setUserUpgrades(data.upgrades || []);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Helper to get current level of a specific upgrade
  const getLevel = (upgradeId) => {
    const upgrade = userUpgrades.find(u => u.upgrade_id === upgradeId);
    return upgrade ? upgrade.level : 0;
  };

  // 2. Handle Purchasing
  const handlePurchase = async (upgradeId, currentLevel, baseCost) => {
    const cost = baseCost * (currentLevel + 1); 
    
    if (goldBalance < cost) {
      setErrorMsg("Insufficient souls... I mean, gold.");
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('game_token');
      const response = await fetch(`${API_URL}/api/v1/shop/purchase`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ upgrade_id: upgradeId, cost: cost })
      });
      if (!response.ok) throw new Error('The transaction was rejected by the void.');

      // Optimistically update the UI so we don't have to refetch
      setGoldBalance(prev => prev - cost);
      setUserUpgrades(prev => {
        const exists = prev.find(u => u.upgrade_id === upgradeId);
        if (exists) {
          return prev.map(u => u.upgrade_id === upgradeId ? { ...u, level: u.level + 1 } : u);
        }
        return [...prev, { upgrade_id: upgradeId, level: 1 }];
      });

    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center font-grim text-zinc-500 uppercase tracking-[0.4em]">
        <PublicNavbar />
        Stoking the flames...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center pt-24 pb-12 relative font-grim select-none text-zinc-200">
      
      <PublicNavbar />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-red-950/20 z-0 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl animate-fade-in mt-8">
        
        {/* HEADER */}
        <h2 className="font-royal text-5xl md:text-6xl font-black uppercase tracking-[0.4em] mb-2 text-red-800 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
          The BoneFire
        </h2>
        <div className="flex items-center gap-4 mb-8">
          <span className="w-12 h-px bg-red-900/50"></span>
          <p className="text-xs uppercase tracking-[0.4em] text-red-500 font-bold flex items-center gap-2">
            Bank: <span className="text-white text-lg">{goldBalance}</span> Gold
          </p>
          <span className="w-12 h-px bg-red-900/50"></span>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="absolute top-32 text-[10px] uppercase tracking-[0.3em] text-red-500 bg-red-950/50 px-6 py-2 border border-red-900/50 rounded animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* UPGRADES GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-red-900/30 bg-zinc-950/80 shadow-[inset_0_0_20px_rgba(139,0,0,0.1)] rounded-sm mb-10">
          {UPGRADE_CATALOG.map((item) => {
            const currentLevel = getLevel(item.id);
            const isMaxed = currentLevel >= item.maxLevel;
            const cost = item.baseCost * (currentLevel + 1);
            const canAfford = goldBalance >= cost;

            return (
              <div key={item.id} className="flex items-start gap-4 p-4 border border-zinc-800/80 bg-black/60 rounded-sm hover:border-red-900/50 transition-colors">
                {/* Icon Box */}
                <div className="w-14 h-14 shrink-0 bg-black/80 border border-zinc-700 flex items-center justify-center rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" />
                </div>
                
                {/* Info */}
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-sm font-royal text-zinc-200 uppercase tracking-widest">{item.title}</span>
                    <span className={`text-[10px] font-bold tracking-widest ${isMaxed ? 'text-red-500' : 'text-zinc-500'}`}>
                      LVL {currentLevel} / {item.maxLevel}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mb-3 leading-relaxed uppercase tracking-wider">{item.desc}</span>
                  
                  {/* Purchase Button / Cost */}
                  <div className="flex justify-end mt-auto">
                    {isMaxed ? (
                      <span className="text-[10px] uppercase tracking-widest text-red-700 font-bold">Maximized</span>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(item.id, currentLevel, item.baseCost)}
                        disabled={!canAfford}
                        className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
                          canAfford 
                          ? 'border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 cursor-pointer' 
                          : 'border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Tribute {cost} Gold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}