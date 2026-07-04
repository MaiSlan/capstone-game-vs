// src/pages/BoneFireShop.jsx
import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';

// --- LOCALIZATION DICTIONARY ---
const UI_DICT = {
  loading: { en: 'Stoking the flames...', fr: 'Attisant les flammes...', zh: '拨旺火焰...' },
  shopTitle: { en: 'The BoneFire', fr: 'Le Feu de Camp', zh: '营火' },
  bank: { en: 'Bank', fr: 'Banque', zh: '金库' },
  gold: { en: 'Gold', fr: 'Or', zh: '金币' },
  lvl: { en: 'LVL', fr: 'NIV', zh: '等级' },
  maximized: { en: 'Maximized', fr: 'Maximisé', zh: '已满级' },
  unlocked: { en: 'Unlocked', fr: 'Déverrouillé', zh: '已解锁' },
  tribute: { en: 'Tribute', fr: 'Tribut', zh: '献祭' },
  insufficient: { en: 'Insufficient gold.', fr: 'Or insuffisant.', zh: '金币不足。' },
  errorMsg: { en: 'The transaction was rejected.', fr: 'La transaction a été rejetée.', zh: '交易被拒绝。' },
  
  // Upgrade Translations
  upg_vitality_title: { en: 'Vitality', fr: 'Vitalité', zh: '生命力' },
  upg_vitality_desc: { en: '+10% Base HP per level', fr: '+10% PV de Base par niveau', zh: '每级 +10% 基础生命值' },
  upg_might_title: { en: 'Might', fr: 'Puissance', zh: '力量' },
  upg_might_desc: { en: '+5% Base Damage per level', fr: '+5% Dégâts de Base par niveau', zh: '每级 +5% 基础伤害' },
  upg_haste_title: { en: 'Haste', fr: 'Hâte', zh: '急速' },
  upg_haste_desc: { en: '+2% Attack Speed per level', fr: '+2% Vitesse d\'Attaque par niveau', zh: '每级 +2% 攻击速度' },
  upg_greed_title: { en: 'Greed', fr: 'Avidité', zh: '贪婪' },
  upg_greed_desc: { en: '+10% Gold Drop Rate per level', fr: '+10% Taux d\'Or par niveau', zh: '每级 +10% 金币掉落率' },
  upg_reroll_title: { en: 'Fate\'s Dice', fr: 'Dé du Destin', zh: '命运之骰' },
  upg_reroll_desc: { en: 'Grants one reroll per level-up.', fr: 'Accorde une relance par montée de niveau.', zh: '每次升级获得一次重置机会。' },
};

// 1. ADD THE REROLL UPGRADE
const UPGRADE_CATALOG = [
  { id: 'vitality', titleKey: 'upg_vitality_title', descKey: 'upg_vitality_desc', baseCost: 100, maxLevel: 5, icon: 'assets/items/equipable/ring.png' },
  { id: 'might', titleKey: 'upg_might_title', descKey: 'upg_might_desc', baseCost: 150, maxLevel: 5, icon: 'assets/items/equipable/dagger.png' },
  { id: 'haste', titleKey: 'upg_haste_title', descKey: 'upg_haste_desc', baseCost: 120, maxLevel: 5, icon: 'assets/items/equipable/boots.png' },
  { id: 'greed', titleKey: 'upg_greed_title', descKey: 'upg_greed_desc', baseCost: 200, maxLevel: 5, icon: 'assets/items/equipable/coin_purse.png' },
  { id: 'reroll', titleKey: 'upg_reroll_title', descKey: 'upg_reroll_desc', baseCost: 1000, maxLevel: 1, icon: 'assets/items/equipable/necklace.png' } // High flat cost, max level 1
];

export default function BoneFireShop() {
  const [goldBalance, setGoldBalance] = useState(0);
  const [userUpgrades, setUserUpgrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');

  const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  useEffect(() => {
    const handleSettingsUpdate = (e) => { if (e.detail && e.detail.language) setLanguage(e.detail.language); };
    const handleStorageUpdate = () => setLanguage(localStorage.getItem('vs_lang') || 'en');
    window.addEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = sessionStorage.getItem('game_token'); 
        if (!token) return;
        const response = await fetch(`${API_URL}/api/v1/shop/data`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error(t(UI_DICT.errorMsg));
        
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
  }, [API_URL]);

  const t = (textObj) => textObj ? (textObj[language] || textObj.en || '') : '';

  const getLevel = (upgradeId) => {
    const upgrade = userUpgrades.find(u => u.upgrade_id === upgradeId);
    return upgrade ? upgrade.level : 0;
  };

  const handlePurchase = async (upgradeId, currentLevel, baseCost) => {
    // Standard scaling for multi-level, flat cost for level 1 caps
    const cost = baseCost * (currentLevel + 1); 
    
    if (goldBalance < cost) {
      setErrorMsg(t(UI_DICT.insufficient));
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    try {
      const token = sessionStorage.getItem('game_token');
      const response = await fetch(`${API_URL}/api/v1/shop/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ upgrade_id: upgradeId, cost: cost })
      });
      if (!response.ok) throw new Error(t(UI_DICT.errorMsg));

      setGoldBalance(prev => prev - cost);
      setUserUpgrades(prev => {
        const exists = prev.find(u => u.upgrade_id === upgradeId);
        if (exists) return prev.map(u => u.upgrade_id === upgradeId ? { ...u, level: u.level + 1 } : u);
        return [...prev, { upgrade_id: upgradeId, level: 1 }];
      });

    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center font-grim text-zinc-500 uppercase tracking-[0.4em] gap-4">
        <PublicNavbar />
        <span className="text-4xl text-red-900/30 font-royal animate-pulse">✦</span>
        {t(UI_DICT.loading)}
      </div>
    );
  }

  return (
    // Applied the exact pt-24 and mt-8 spacing rules from the other pages
    <div className="w-full min-h-screen bg-[#050202] flex flex-col items-center pt-24 pb-12 relative font-grim select-none text-zinc-200">
      <PublicNavbar />

      <div className="z-10 flex flex-col items-center w-full max-w-4xl animate-fade-in mt-8">
        
        <h2 className="font-royal text-4xl md:text-5xl font-black uppercase tracking-[0.4em] mb-2 text-red-800 drop-shadow-[0_0_20px_rgba(139,0,0,0.5)]">
          {t(UI_DICT.shopTitle)}
        </h2>
        
        <div className="flex items-center gap-4 mb-12">
          <span className="w-12 h-px bg-red-900/50"></span>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold flex items-center gap-2">
            {t(UI_DICT.bank)}: <span className="text-amber-500 text-sm">{goldBalance}</span> {t(UI_DICT.gold)}
          </p>
          <span className="w-12 h-px bg-red-900/50"></span>
        </div>

        {errorMsg && (
          <div className="absolute top-40 text-[10px] uppercase tracking-[0.3em] text-red-500 bg-red-950/50 px-6 py-2 border border-red-900/50 rounded animate-pulse">
            {errorMsg}
          </div>
        )}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {UPGRADE_CATALOG.map((item) => {
            const currentLevel = getLevel(item.id);
            const isMaxed = currentLevel >= item.maxLevel;
            const cost = item.baseCost * (currentLevel + 1);
            const canAfford = goldBalance >= cost;

            return (
              <div key={item.id} className="flex items-start gap-4 p-5 border border-zinc-900/80 bg-transparent hover:border-red-900/40 transition-all group">
                <div className="w-14 h-14 shrink-0 bg-black/60 border border-zinc-800/80 flex items-center justify-center shadow-inner group-hover:border-red-900/50 transition-colors">
                  <img src={item.icon} alt={item.id} className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" onError={(e) => e.target.style.display = 'none'} />
                </div>
                
                <div className="flex flex-col w-full h-full">
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="text-sm font-royal text-zinc-300 uppercase tracking-widest group-hover:text-red-400 transition-colors">{t(UI_DICT[item.titleKey])}</span>
                    
                    {/* Displaying Level properly for max-1 upgrades */}
                    <span className={`text-[9px] font-bold tracking-widest ${isMaxed ? 'text-red-500' : 'text-zinc-500'}`}>
                      {item.maxLevel === 1 
                        ? (isMaxed ? t(UI_DICT.unlocked) : "") 
                        : `${t(UI_DICT.lvl)} ${currentLevel} / ${item.maxLevel}`}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 mb-4 leading-relaxed uppercase tracking-wider">{t(UI_DICT[item.descKey])}</span>
                  
                  <div className="flex justify-end mt-auto">
                    {isMaxed ? (
                      <span className="text-[9px] uppercase tracking-widest text-red-800 font-bold opacity-70 border border-red-900/30 px-4 py-2">
                        {t(UI_DICT.maximized)}
                      </span>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(item.id, currentLevel, item.baseCost)}
                        disabled={!canAfford}
                        className={`text-[9px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
                          canAfford 
                          ? 'border-red-900/50 text-red-500 hover:bg-red-900/20 hover:border-red-500 hover:shadow-[0_0_10px_rgba(185,28,28,0.3)] cursor-pointer' 
                          : 'border-zinc-900 text-zinc-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {t(UI_DICT.tribute)} {cost} {t(UI_DICT.gold)}
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