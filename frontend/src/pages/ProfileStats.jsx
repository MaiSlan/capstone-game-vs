import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { MONSTER_DB } from '../data/MonsterDB';
import { CHARACTER_DB } from '../data/CharacterDB';

// --- LOCALIZATION DICTIONARY ---
const UI_DICT = {
  loading: { en: 'Consulting the Archives...', fr: 'Consultation des Archives...', zh: '查阅档案中...' },
  identity: { en: 'Vessel Identity', fr: 'Identité du Réceptacle', zh: '容器身份' },
  claimName: { en: 'Claim a True Name', fr: 'Réclamer un Vrai Nom', zh: '宣告真名' },
  nameless: { en: 'Nameless Entity', fr: 'Entité Sans Nom', zh: '无名实体' },
  inscribing: { en: 'Inscribing...', fr: 'Inscription...', zh: '铭刻中...' },
  sealMoniker: { en: 'Seal Moniker', fr: 'Sceller le Surnom', zh: '封印代号' },
  cooldownMsg: { en: 'Moniker locked for 30 days', fr: 'Surnom verrouillé pour 30 jours', zh: '代号锁定30天' },
  successMsg: { en: 'Moniker inscribed permanently.', fr: 'Surnom inscrit de façon permanente.', zh: '代号已永久铭刻。' },
  combatArchives: { en: 'Combat Archives', fr: 'Archives de Combat', zh: '战斗档案' },
  totalRuns: { en: 'Total Runs', fr: 'Parties Totales', zh: '总局数' },
  winRate: { en: 'Win Rate', fr: 'Taux de Victoire', zh: '胜率' },
  totalWealth: { en: 'Total Wealth', fr: 'Richesse Totale', zh: '总财富' },
  signatureOp: { en: 'Signature Operator', fr: 'Opérateur Signature', zh: '招牌操作员' },
  bestiaryArchives: { en: 'Bestiary Archives', fr: 'Archives du Bestiaire', zh: '怪物图鉴档案' },
  slain: { en: 'Slain', fr: 'Tués', zh: '击杀' },
  encountered: { en: 'Encountered', fr: 'Rencontrés', zh: '遭遇' },
  noEntities: { en: 'No Entities Encountered', fr: 'Aucune Entité Rencontrée', zh: '未遭遇任何实体' },
  none: { en: 'None', fr: 'Aucun', zh: '无' },
  unknown: { en: 'Unknown Entity', fr: 'Entité Inconnue', zh: '未知实体' }
};

export default function ProfileStats() {
  const [stats, setStats] = useState(null);
  const [bestiary, setBestiary] = useState([]);
  
  // --- Localization State ---
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');

  // --- Username State ---
  const [newUsername, setNewUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // --- Cooldown Logic (30 Days) ---
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  useEffect(() => {
    // Check if the user recently changed their name
    const lastChange = localStorage.getItem('vs_last_name_change');
    if (lastChange) {
      const daysPassed = (Date.now() - parseInt(lastChange)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 30) setIsOnCooldown(true);
    }

    // Listen for language changes from the Navbar
    const handleSettingsUpdate = (e) => {
      if (e.detail && e.detail.language) setLanguage(e.detail.language);
    };
    
    // Some Navbars dispatch a generic storage event if they just setItem, so we listen to both
    const handleStorageUpdate = () => {
      setLanguage(localStorage.getItem('vs_lang') || 'en');
    };

    window.addEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('VS_UPDATE_SETTINGS', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        if (!token) return;

        const [statsRes, bestRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/stats/data`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/v1/stats/bestiary`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const statsData = await statsRes.json();
        const bestiaryData = await bestRes.json();

        setStats(statsData);
        setNewUsername(statsData.display_name || '');
        setBestiary(Array.isArray(bestiaryData) ? bestiaryData : []);
      } catch (err) {
        console.error("Failed to consult archives:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const t = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || isOnCooldown) return;
    
    setIsUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      const token = sessionStorage.getItem('game_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/update_username`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_username: newUsername })
      });

      if (!response.ok) throw new Error("Failed to inscribe name.");

      // Set cooldown lock in local storage
      localStorage.setItem('vs_last_name_change', Date.now().toString());
      setIsOnCooldown(true);

      setMessage({ text: t(UI_DICT.successMsg), type: "success" });
      setStats(prev => ({ ...prev, display_name: newUsername }));
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
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

  const winRate = stats?.total_runs > 0 ? Math.round((stats.total_wins / stats.total_runs) * 100) : 0;
  
  // Safely grab the translated signature character name
  const signatureKey = stats?.most_played_character;
  const signatureName = signatureKey && CHARACTER_DB[signatureKey] 
    ? t(CHARACTER_DB[signatureKey].name) 
    : t(UI_DICT.none);

  return (
    <div className="min-h-screen bg-[#050202] text-zinc-200 pt-32 p-8 md:p-12 font-grim selection:bg-red-900/30 flex flex-col items-center">
      <PublicNavbar />
      
      {/* Pushed down further from the Navbar */}
      <div className="w-full max-w-5xl flex flex-col gap-16 mt-12">
        
        {/* --- SECTION 1: IDENTITY --- */}
        <section className="flex flex-col items-center w-full max-w-md mx-auto">
          <h2 className="font-royal text-3xl font-black uppercase tracking-[0.3em] text-red-800/90 drop-shadow-[0_0_15px_rgba(139,0,0,0.3)] mb-2">
            {t(UI_DICT.identity)}
          </h2>
          <div className="w-12 h-px bg-red-900/50 mb-8"></div>

          <form onSubmit={handleUpdateUsername} className="w-full flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2 text-center">
                {t(UI_DICT.claimName)}
              </label>
              <input 
                type="text" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={t(UI_DICT.nameless)}
                disabled={isOnCooldown}
                className="w-full bg-transparent border-b border-zinc-800 text-zinc-200 py-3 text-center focus:outline-none focus:border-red-800 transition-colors duration-300 font-royal tracking-[0.2em] uppercase text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                required 
              />
            </div>

            {message.text && (
              <div className={`text-[10px] uppercase tracking-[0.2em] text-center p-3 border ${message.type === 'success' ? 'border-amber-900/30 text-amber-500/80 bg-transparent' : 'border-red-900/30 text-red-500/80 bg-transparent'}`}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isUpdating || newUsername === stats?.display_name || isOnCooldown}
              className="w-full py-3 border border-zinc-800/80 text-zinc-400 font-royal text-xs uppercase tracking-[0.3em] disabled:opacity-30 disabled:cursor-not-allowed hover:border-red-900/50 hover:text-red-500 transition-all duration-300 relative group"
            >
              {isUpdating ? t(UI_DICT.inscribing) : t(UI_DICT.sealMoniker)}
              
              {/* Tooltip explaining the cooldown */}
              {isOnCooldown && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] text-red-500 bg-red-950/80 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {t(UI_DICT.cooldownMsg)}
                </span>
              )}
            </button>
          </form>
        </section>

        {/* --- SECTION 2: GLOBAL STATS --- */}
        <section className="w-full">
          <div className="flex items-center gap-4 mb-6 opacity-60">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">{t(UI_DICT.combatArchives)}</h3>
            <div className="flex-1 h-px bg-zinc-900"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label={t(UI_DICT.totalRuns)} value={stats?.total_runs || 0} />
            <StatCard label={t(UI_DICT.winRate)} value={`${winRate}%`} />
            <StatCard label={t(UI_DICT.totalWealth)} value={stats?.total_gold_earned || 0} />
            <StatCard label={t(UI_DICT.signatureOp)} value={signatureName} />
          </div>
        </section>

        {/* --- SECTION 3: BESTIARY DOSSIER --- */}
        <section className="w-full mb-12">
          <div className="flex items-center gap-4 mb-6 opacity-60">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">{t(UI_DICT.bestiaryArchives)}</h3>
            <div className="flex-1 h-px bg-zinc-900"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestiary.filter(b => b.encounters > 0).length > 0 ? (
              bestiary.filter(b => b.encounters > 0).map(b => {
                // Safely grab the localized monster name
                const monsterDbEntry = MONSTER_DB[b.monster_id];
                const localizedMonsterName = monsterDbEntry ? t(monsterDbEntry.name) : t(UI_DICT.unknown);

                return (
                  <div key={b.monster_id} className="flex flex-col border border-zinc-900/80 p-5 hover:border-red-900/30 transition-colors bg-transparent">
                    <p className="uppercase text-[10px] tracking-[0.3em] text-zinc-500 mb-2 font-bold">
                      {localizedMonsterName}
                    </p>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">{t(UI_DICT.slain)}</span>
                        <span className="text-2xl font-royal tracking-widest text-zinc-200">{b.kills}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">{t(UI_DICT.encountered)}</span>
                        <span className="text-xl font-royal tracking-widest text-zinc-500">{b.encounters}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-xs uppercase tracking-[0.4em] text-zinc-700 italic border border-zinc-900/50">
                {t(UI_DICT.noEntities)}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col border border-zinc-900/80 p-5 hover:border-red-900/30 transition-colors bg-transparent">
      <p className="text-zinc-500 uppercase tracking-[0.2em] text-[9px] mb-2 font-bold">{label}</p>
      <p className="text-2xl font-royal text-zinc-200 tracking-widest">{value}</p>
    </div>
  );
}