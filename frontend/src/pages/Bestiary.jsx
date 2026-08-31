// src/pages/Bestiary.jsx
import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { MONSTER_DB } from '../data/MonsterDB';

// --- LOCALIZATION DICTIONARY ---
const UI_DICT = {
  archivesTitle: { en: 'The Archives', fr: 'Les Archives', zh: '档案' },
  standardEntities: { en: 'Standard Entities', fr: 'Entités Standards', zh: '标准实体' },
  subBosses: { en: 'Anomalies & Sub-Bosses', fr: 'Anomalies & Sous-Boss', zh: '异常与副首领' },
  eclipseLords: { en: 'The Eclipse Lords', fr: 'Les Seigneurs de l\'Éclipse', zh: '日食领主' },
  unknownEntity: { en: 'Unknown Entity', fr: 'Entité Inconnue', zh: '未知实体' },
  classified: { en: 'Classified', fr: 'Classifié', zh: '机密' },
  slain: { en: 'Slain', fr: 'Tués', zh: '击杀' },
  encounters: { en: 'Encounters', fr: 'Rencontres', zh: '遭遇' },
  baseVitality: { en: 'Base Vitality', fr: 'Vitalité de Base', zh: '基础生命力' },
  lethality: { en: 'Lethality', fr: 'Létalité', zh: '杀伤力' },
  agility: { en: 'Agility', fr: 'Agilité', zh: '敏捷' },
  missingLore: { 
    en: 'Data corrupted. Archives yield no history for this entity.', 
    fr: 'Données corrompues. Les archives ne révèlent aucune histoire pour cette entité.', 
    zh: '数据损坏。档案中没有该实体的历史记录。' 
  }
};

// Mapping the exact spawn times from TIMELINE_DB for chronological sorting
const APPEARANCE_ORDER = {
  abyssal_sludge: 0,
  blighted_gore_thrall: 75,
  night_terror: 120,
  hollowed_legionnaire: 125,
  crimson_strigoi: 180,
  ocular_sentinel: 200,
  echo_of_the_vessel: 240,
  abyssal_behemoth: 310,
  zul_karn: 600,
  obsidian_falcon: 1200,
  carmilla: 1200,
  grand_haruspex: 1200,
  elara: 1200,
  valeria: 1200
};

// Explicitly defining the separation of threats
const SUB_BOSS_IDS = ['echo_of_the_vessel', 'zul_karn'];
const ENDGAME_BOSS_IDS = ['obsidian_falcon', 'carmilla', 'grand_haruspex', 'elara', 'valeria'];

export default function Bestiary() {
  const [data, setData] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  
  // --- Localization State ---
  const [language, setLanguage] = useState(localStorage.getItem('vs_lang') || 'en');
  
  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://capstone-game-vs.onrender.com';

  useEffect(() => {
    // Listen for language changes from the Navbar
    const handleSettingsUpdate = (e) => {
      if (e.detail && e.detail.language) setLanguage(e.detail.language);
    };
    
    // Fallback for direct storage updates
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
    const fetchBestiary = async () => {
      try {
        const token = sessionStorage.getItem('game_token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/v1/stats/bestiary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) return;

        const bestiaryData = await response.json();
        if (Array.isArray(bestiaryData)) {
            setData(bestiaryData);
        }
      } catch (err) { 
        console.error("Error fetching bestiary:", err); 
      }
    };
    fetchBestiary();
  }, [API_BASE_URL]);

  const t = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || '';
  };

  // Sort and categorize the database into three distinct tiers
  const sortedMonsters = Object.values(MONSTER_DB).sort((a, b) => APPEARANCE_ORDER[a.id] - APPEARANCE_ORDER[b.id]);
  
  const regularMonsters = sortedMonsters.filter(m => !SUB_BOSS_IDS.includes(m.id) && !ENDGAME_BOSS_IDS.includes(m.id));
  const subBossMonsters = sortedMonsters.filter(m => SUB_BOSS_IDS.includes(m.id));
  const endgameBossMonsters = sortedMonsters.filter(m => ENDGAME_BOSS_IDS.includes(m.id));

  const renderCard = (m) => {
    const stats = data.find(d => d.monster_id === m.id) || { kills: 0, encounters: 0, wins: 0 };
    const isUnlocked = stats.kills > 0 || stats.encounters > 0;
    
    return (
      <div 
        key={m.id} 
        onClick={() => isUnlocked && setSelectedMonster({ ...m, stats })}
        className={`flex flex-col border p-5 transition-all bg-transparent relative overflow-hidden ${isUnlocked ? 'border-zinc-900/80 hover:border-red-900/40 cursor-pointer group' : 'border-zinc-900/30 opacity-50'}`}
      >
        <div className={`flex-1 flex flex-col items-center transition-all duration-500 ${!isUnlocked ? 'grayscale brightness-0 opacity-20' : ''}`}>
          <img 
            src={`assets/monsters/${m.spriteKey}.png`} 
            alt={t(m.name)} 
            className="w-24 h-24 object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500" 
            onError={(e) => e.target.style.display = 'none'} 
          />
        </div>
        
        <div className="mt-4 flex flex-col w-full border-t border-zinc-900 pt-3">
          <h3 className="text-center font-royal text-sm uppercase tracking-widest text-zinc-300 mb-3 h-8 flex items-center justify-center">
            {isUnlocked ? t(m.name) : t(UI_DICT.unknownEntity)}
          </h3>
          
          {isUnlocked ? (
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">{t(UI_DICT.slain)}</span>
                <span className="text-xl font-royal tracking-widest text-zinc-200">{stats.kills}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">{t(UI_DICT.encounters)}</span>
                <span className="text-sm font-royal tracking-widest text-zinc-500 mb-0.5">{stats.encounters}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-red-900/50 font-bold">{t(UI_DICT.classified)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050202] text-zinc-200 pt-24 font-grim flex flex-col items-center select-none">
      <PublicNavbar />
      <div className="w-full max-w-5xl flex flex-col items-center mt-8 pb-20">
        <h2 className="font-royal text-4xl font-black uppercase tracking-[0.3em] text-red-800/90 drop-shadow-[0_0_15px_rgba(139,0,0,0.3)] mb-2">
          {t(UI_DICT.archivesTitle)}
        </h2>
        <div className="w-12 h-px bg-red-900/50 mb-12"></div>
        
        {/* TIER 3: THE ECLIPSE LORDS (5 cards in one row) */}
        <div className="w-full flex items-center gap-4 mb-8 opacity-70">
          <h3 className="text-xs uppercase tracking-[0.4em] text-red-700 font-bold drop-shadow-[0_0_8px_rgba(185,28,28,0.4)]">
            {t(UI_DICT.eclipseLords)}
          </h3>
          <div className="flex-1 h-px bg-red-900/30"></div>
        </div>
        <div className="grid grid-cols-5 gap-4 w-full mb-16">
          {endgameBossMonsters.map(renderCard)}
        </div>

        {/* TIER 2: SUB-BOSSES (2 cards centered) */}
        <div className="w-full flex items-center gap-4 mb-8 opacity-70">
          <h3 className="text-xs uppercase tracking-[0.4em] text-amber-700 font-bold drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]">
            {t(UI_DICT.subBosses)}
          </h3>
          <div className="flex-1 h-px bg-amber-900/30"></div>
        </div>
        <div className="flex justify-center gap-6 w-full mb-16">
          {subBossMonsters.map(renderCard)}
        </div>

        {/* TIER 1: STANDARD ENTITIES (Line of 5, then 2 centered under) */}
        <div className="w-full flex items-center gap-4 mb-8 opacity-70">
          <h3 className="text-xs uppercase tracking-[0.4em] text-zinc-400 font-bold">
            {t(UI_DICT.standardEntities)}
          </h3>
          <div className="flex-1 h-px bg-zinc-900"></div>
        </div>
        
        {/* Line of 5 */}
        <div className="grid grid-cols-5 gap-4 w-full mb-4">
          {regularMonsters.slice(0, 5).map(renderCard)}
        </div>
        {/* 2 Centered under */}
        <div className="flex justify-center gap-4 w-full">
          {regularMonsters.slice(5, 7).map(renderCard)}
        </div>
      </div>

      {/* --- THE LORE MODAL --- */}
      {selectedMonster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedMonster(null)}>
          {/* Prevent closing when clicking inside the modal content */}
          <div className="relative w-full max-w-3xl border border-red-900/40 bg-[#070303] p-8 shadow-[inset_0_0_40px_rgba(139,0,0,0.2)] flex flex-col md:flex-row gap-8 items-center" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMonster(null)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors text-2xl"
            >
              ×
            </button>

            {/* Left: Sprite Showcase */}
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 border border-zinc-800/80 bg-black/60 rounded-sm flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]"></div>
              <img 
                src={`assets/monsters/${selectedMonster.spriteKey}.png`} 
                alt={t(selectedMonster.name)} 
                className="w-32 h-32 md:w-48 md:h-48 object-contain filter drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-110 transition-transform duration-700" 
              />
            </div>

            {/* Right: Lore & Stats */}
            <div className="flex flex-col flex-1">
              <h3 className="font-royal text-3xl text-zinc-100 uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">
                {t(selectedMonster.name)}
              </h3>
              
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800/50">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">{t(UI_DICT.baseVitality)}</span>
                  <span className="font-royal text-lg text-amber-500/80">{selectedMonster.baseHp}</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">{t(UI_DICT.lethality)}</span>
                  <span className="font-royal text-lg text-red-500/80">{selectedMonster.baseDamage}</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">{t(UI_DICT.agility)}</span>
                  <span className="font-royal text-lg text-blue-500/80">{selectedMonster.baseSpeed}</span>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -top-4 -left-2 text-4xl text-zinc-800 font-serif">"</span>
                <p className="text-sm text-zinc-400 italic tracking-widest leading-loose pl-6 py-2 border-l-2 border-red-900/50">
                  {selectedMonster.lore ? t(selectedMonster.lore) : t(UI_DICT.missingLore)}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}