import React from 'react';
import {
  Play,
  Grid,
  HelpCircle,
  Keyboard,
  Sliders,
  Dices,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { LevelStats } from '../types/game';

interface MainMenuProps {
  currentLevelId: number;
  totalLevels: number;
  levelStats: Record<number, LevelStats>;
  isMuted: boolean;
  isMusicPlaying: boolean;
  currentTrackTitle: string;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenRules: () => void;
  onOpenControls: () => void;
  onOpenSettings: () => void;
  onStartGenerator: () => void;
  onSelectLevel?: (levelId: number) => void;
  onToggleMusic: () => void;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  currentLevelId,
  totalLevels,
  levelStats,
  isMuted,
  isMusicPlaying,
  currentTrackTitle,
  onStartGame,
  onOpenLevelSelect,
  onOpenRules,
  onOpenControls,
  onOpenSettings,
  onStartGenerator,
  onSelectLevel,
  onToggleMusic,
  onToggleMute,
}) => {
  // Count total completed levels and total stars
  const completedCount = Object.values(levelStats).filter((s) => s.completed).length;
  const totalStars = Object.values(levelStats).reduce((acc, s) => acc + (s.stars || 0), 0);

  const worldsPreview = [
    { num: '1-5', name: 'Ipari Raktár', music: 'Warehouse Groove', color: 'from-amber-600 to-amber-900' },
    { num: '6-10', name: 'Ősi Katakomba', music: 'Ancient Crypt', color: 'from-teal-600 to-emerald-950' },
    { num: '11-15', name: 'Cyber Neon', music: 'Neon Matrix', color: 'from-purple-600 to-indigo-950' },
    { num: '16-20', name: 'Kozmikus Állomás', music: 'Cosmic Drift', color: 'from-blue-600 to-slate-900' },
    { num: '21-25', name: 'Kristály Palota', music: 'Crystal Realm', color: 'from-emerald-500 to-teal-900' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between py-6 px-4 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar: Quick Audio Controls */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {completedCount} / {totalLevels} teljesítve
            </span>
            <span className="text-amber-400 font-bold ml-1">★ {totalStars}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition shadow flex items-center gap-1.5 text-xs font-medium ${
              isMusicPlaying && !isMuted
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Háttérzene lejátszása / szüneteltetése"
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isMusicPlaying && !isMuted ? 'Zene szól' : 'Zene szünet'}
            </span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition shadow"
            title="Hangok némítása"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="relative z-10 max-w-2xl w-full mx-auto my-auto py-8 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold tracking-widest uppercase mb-4 shadow">
          <Sparkles className="w-3.5 h-3.5" />
          Klasszikus Logikai Játék
        </div>

        {/* Big Game Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-8 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          SOKOBAN
        </h1>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3 max-w-md mx-auto mb-8">
          {/* Main Play Button */}
          <button
            onClick={onStartGame}
            className="w-full py-4 px-8 rounded-2xl font-black text-lg bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 flex items-center justify-center gap-3 shadow-xl shadow-sky-500/25 active:scale-98 transition transform"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>
              {completedCount === 0 ? 'JÁTÉK INDÍTÁSA (1. SZINT)' : `FOLYTATÁS (${currentLevelId}. SZINT)`}
            </span>
          </button>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenLevelSelect}
              className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95 shadow"
            >
              <Grid className="w-4 h-4 text-sky-400" />
              <span>Szintek & Világok</span>
            </button>

            <button
              onClick={onStartGenerator}
              className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95 shadow"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Egyéni Generátor</span>
            </button>
          </div>

          {/* Third Row: Rules & Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenRules}
              className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 border border-slate-700/70 flex items-center justify-center gap-2 transition active:scale-95 shadow"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Szabályok & Cél</span>
            </button>

            <button
              onClick={onOpenControls}
              className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 border border-slate-700/70 flex items-center justify-center gap-2 transition active:scale-95 shadow"
            >
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Irányítás</span>
            </button>
          </div>

          {/* Settings */}
          <div>
            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-2 transition shadow active:scale-98"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Zene & Hang Beállítások</span>
            </button>
          </div>
        </div>

        {/* 5-Level World & Music Showcase Carousel/Row */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span>5 Pályánként Változó Világok & Zenék:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
            {worldsPreview.map((w, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSelectLevel) {
                    onSelectLevel(idx * 5 + 1);
                  } else {
                    onOpenLevelSelect();
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/50 flex flex-col justify-between cursor-pointer transition active:scale-95 group text-left"
                title={`Kattints az ugráshoz: ${w.name} (${w.num}. szint)`}
              >
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-bold group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    {w.num}. szint
                  </span>
                  <div className="font-bold text-xs text-white mt-1.5 truncate group-hover:text-sky-300 transition">
                    {w.name}
                  </div>
                </div>
                <div className="text-[10px] text-pink-300/80 mt-1 flex items-center gap-1 truncate">
                  <Music className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{w.music}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-4">
        Sokoban • Billentyűzet, egér és érintőképernyő támogatás • Minden pálya garantáltan megoldható
      </footer>
    </div>
  );
};
