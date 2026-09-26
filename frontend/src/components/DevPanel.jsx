import { useEffect, useState } from 'react';
import { TIMELINE_DB } from '../data/TimeLineDB';
import { MONSTER_DB } from '../data/MonsterDB';

// ==========================================
// DEV PANEL (admin accounts only)
// ==========================================
// PlayArea only mounts this for is_admin accounts during combat, so the
// Ctrl+Shift+D listener below never exists for anyone else. Actions are sent
// to Phaser's DevToolsManager over the window event bridge (VS_DEV_COMMAND),
// which reports back with VS_DEV_STATE. Dev-only tool: English labels only.

const TOGGLE_HINT = 'Ctrl+Shift+D';
const MAX_SKIP_MINUTE = 20;

// Time-skip presets come straight from the spawn timeline, so they follow any
// pacing changes: one per boss / sub-boss entry, plus the Eclipse.
const SKIP_PRESETS = TIMELINE_DB
  .filter(event => event.pattern === 'boss')
  .map(event => ({
    minute: Math.floor(event.startTime / 60),
    label: event.monsterId === 'TRIGGER_ECLIPSE'
      ? 'The Eclipse'
      : (MONSTER_DB[event.monsterId]?.name?.en || event.monsterId)
  }));

const sendCommand = (detail) => {
  window.dispatchEvent(new CustomEvent('VS_DEV_COMMAND', { detail }));
};

const formatMinute = (minute) => `${String(minute).padStart(2, '0')}:00`;

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const [devModeUsed, setDevModeUsed] = useState(false);
  const [customMinute, setCustomMinute] = useState(19);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault(); // Chrome/Firefox otherwise bookmark all tabs
        setIsOpen(open => !open);
      }
    };
    const handleDevState = (e) => {
      setGodMode(e.detail.godMode);
      setDevModeUsed(e.detail.devModeUsed);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('VS_DEV_STATE', handleDevState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('VS_DEV_STATE', handleDevState);
    };
  }, []);

  if (!isOpen) return null;

  // Blur after clicking so Space (dash) doesn't re-press the focused button
  const act = (detail) => (e) => {
    e.currentTarget.blur();
    sendCommand(detail);
  };

  const buttonClass = 'btn-pure w-full px-3 py-2 border border-zinc-700 hover:border-amber-600 hover:bg-amber-950/30 rounded-sm text-left text-xs uppercase tracking-widest text-zinc-200 transition-colors';

  return (
    <div className="absolute top-24 right-6 z-40 w-72 pointer-events-auto bg-black/90 border border-amber-700/50 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.8)] p-3 backdrop-blur-md font-mono text-zinc-200">
      <div className="flex justify-between items-center mb-3">
        <span className="text-amber-500 text-sm font-bold uppercase tracking-[0.3em]">Dev Mode</span>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-200 text-xs">{TOGGLE_HINT} ✕</button>
      </div>

      {devModeUsed && (
        <p className="mb-3 text-[10px] leading-snug text-amber-400/80 border border-amber-900/50 bg-amber-950/20 p-2 rounded-sm">
          Dev tools used: this run's gold, stats and bestiary won't be saved.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button className={buttonClass} onClick={act({ action: 'god_mode', enabled: !godMode })}>
          God Mode: <span className={godMode ? 'text-green-400' : 'text-zinc-500'}>{godMode ? 'On' : 'Off'}</span>
          <span className="block text-[10px] normal-case tracking-normal text-zinc-500">x5 damage and XP, 250 speed, 5000 HP</span>
        </button>

        <button className={buttonClass} onClick={act({ action: 'max_weapons' })}>
          Max Weapons
          <span className="block text-[10px] normal-case tracking-normal text-zinc-500">Every weapon of this hero at max level</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800">
        <span className="block mb-2 text-[10px] uppercase tracking-widest text-zinc-500">Skip to minute</span>
        <div className="flex flex-col gap-1">
          {SKIP_PRESETS.map(({ minute, label }, i) => (
            <button key={i} className={buttonClass} onClick={act({ action: 'skip_to_minute', minute })}>
              <span className="text-amber-500">{formatMinute(minute)}</span> {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            min={0}
            max={MAX_SKIP_MINUTE}
            value={customMinute}
            onChange={(e) => setCustomMinute(e.target.value)}
            className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-sm text-xs text-zinc-200"
          />
          <button
            className="btn-pure flex-1 px-3 py-1 border border-zinc-700 hover:border-amber-600 rounded-sm text-xs uppercase tracking-widest"
            onClick={act({ action: 'skip_to_minute', minute: Math.min(MAX_SKIP_MINUTE, Math.max(0, Number(customMinute) || 0)) })}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
