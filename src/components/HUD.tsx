import React from 'react';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  Music,
  Volume2,
  VolumeX,
  Menu,
  Clock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { WorldTheme } from '../types/game';

interface HUDProps {
  levelId: number;
  levelTitle: string;
  worldName: string;
  theme: WorldTheme;
  moves: number;
  pushes: number;
  parMoves: number;
  timeSec: number;
  canUndo: boolean;
  canRedo: boolean;
  isMusicPlaying: boolean;
  isMuted: boolean;
  isSolvingHint: boolean;
  hasDeadlock: boolean;
  currentTrackTitle: string;
  onUndo: () => void;
  onRedo: () => void;
  onRestart: () => void;
  onHint: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
  onOpenMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  levelId,
  levelTitle,
  worldName,
  theme,
  moves,
  pushes,
  parMoves,
  timeSec,
  canUndo,
  canRedo,
  isMusicPlaying,
  isMuted,
  isSolvingHint,
  hasDeadlock,
  currentTrackTitle,
  onUndo,
  onRedo,
  onRestart,
  onHint,
  onToggleMusic,
  onOpenSettings,
  onOpenMenu,
}) => {
  // Format seconds into MM:SS
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-3 pb-2 select-none">
      {/* Top Bar: Level title, current world, and quick action icons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-xl">
        {/* Left: Level & Theme Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Főmenü (ESC)"
          >
            <Menu className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Menü</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {levelId}. Szint
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {worldName}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
              {levelTitle}
            </h1>
          </div>
        </div>

        {/* Center: Music Now Playing indicator */}
        <div
          onClick={onOpenSettings}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition"
          title="Kattints a zene és hangbeállításokhoz"
        >
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 font-medium truncate max-w-[180px]">
              {currentTrackTitle.split('(')[0]}
            </span>
          </div>
          {isMusicPlaying && !isMuted ? (
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-bounce" />
              <span className="w-0.5 h-3 bg-pink-400 rounded-full animate-bounce delay-75" />
              <span className="w-0.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-150" />
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-semibold uppercase">
              Szünet
            </span>
          )}
        </div>

        {/* Right: Audio toggles & Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition ${
              isMusicPlaying && !isMuted
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isMusicPlaying ? 'Zene szüneteltetése' : 'Zene elindítása'}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title="Hang és Grafika Beállítások"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary Bar: Counters, Deadlock Alert, & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1">
        {/* Stats: Moves, Pushes, Par, Time */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-800 text-slate-200">
            <span className="text-slate-400 text-xs">Lépés:</span>
            <span className="font-bold text-sky-400 text-sm">{moves}</span>
            <span className="text-slate-500 text-[11px]">(cél: {parMoves})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-800 text-slate-200">
            <span className="text-slate-400 text-xs">Tolás:</span>
            <span className="font-bold text-amber-400 text-sm">{pushes}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{timeFormatted}</span>
          </div>
        </div>

        {/* Action Controls: Undo, Redo, Restart, Hint */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              canUndo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 active:scale-95'
                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="Lépés visszavonása (U vagy Z)"
          >
            <Undo2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Vissza</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-xl text-xs font-semibold border transition ${
              canRedo
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 active:scale-95'
                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            title="Újra előre"
          >
            <Redo2 className="w-3.5 h-3.5 text-sky-400" />
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 active:scale-95 transition"
            title="Pálya újrakezdése (R)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Újra</span>
          </button>

          <button
            onClick={onHint}
            disabled={isSolvingHint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95 transition"
            title="Tipp kérése (Megmutatja a következő optimális lépést)"
          >
            <Lightbulb
              className={`w-3.5 h-3.5 text-amber-300 ${
                isSolvingHint ? 'animate-spin' : ''
              }`}
            />
            <span>Tipp</span>
          </button>
        </div>
      </div>

      {/* Deadlock Warning Banner if a box is trapped */}
      {hasDeadlock && (
        <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-between gap-2 text-xs text-red-200 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-400">Figyelem:</span>
            <span>Egy doboz beragadt a sarokba és nem mozdítható!</span>
          </div>
          <button
            onClick={onUndo}
            className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold transition text-[11px]"
          >
            Visszavonás (U)
          </button>
        </div>
      )}
    </header>
  );
};
