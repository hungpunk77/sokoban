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
import { Translations } from '../game/i18n';

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
  t: Translations;
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
  t,
  onUndo,
  onRedo,
  onRestart,
  onHint,
  onToggleMusic,
  onOpenSettings,
  onOpenMenu,
}) => {
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-2 flex flex-col gap-2 z-20">
      {/* Top Bar: Level Title + Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Level Title & World Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition flex items-center gap-2 font-bold text-xs sm:text-sm shadow active:scale-95"
            title={t.menu}
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">{t.menu}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-white flex items-center gap-1.5">
                <span>{t.level} {levelId}</span>
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-semibold hidden md:inline">
                {worldName}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {t.par}: <strong className="text-amber-400">{parMoves}</strong> {t.moves.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Action Controls: Undo, Redo, Restart, Hint */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition shadow ${
              canUndo
                ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={`${t.undo} (U / Z)`}
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.undo}</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition shadow ${
              canRedo
                ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={`${t.redo} (Y)`}
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.redo}</span>
          </button>

          <button
            onClick={onRestart}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-bold transition shadow active:scale-95"
            title={`${t.restart} (R)`}
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.restart}</span>
          </button>

          <button
            onClick={onHint}
            disabled={isSolvingHint}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition shadow ${
              isSolvingHint
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 active:scale-95'
            }`}
            title={`${t.hint} (H)`}
          >
            <Lightbulb className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">
              {isSolvingHint ? t.calculatingHint : t.hint}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition shadow"
            title={t.settings}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Middle Stats Bar: Moves, Pushes, Par, Time */}
      <div className="grid grid-cols-4 gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-lg text-center">
        {/* Moves */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {t.moves}
          </span>
          <span
            className={`text-base sm:text-xl font-black font-mono transition ${
              moves > parMoves ? 'text-amber-400' : 'text-white'
            }`}
          >
            {moves}
          </span>
        </div>

        {/* Pushes */}
        <div className="flex flex-col items-center justify-center border-l border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {t.pushes}
          </span>
          <span className="text-base sm:text-xl font-black font-mono text-white">
            {pushes}
          </span>
        </div>

        {/* Par Target */}
        <div className="flex flex-col items-center justify-center border-l border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Trophy className="w-2.5 h-2.5 text-amber-400" />
            {t.par}
          </span>
          <span className="text-base sm:text-xl font-black font-mono text-amber-400">
            {parMoves}
          </span>
        </div>

        {/* Time */}
        <div className="flex flex-col items-center justify-center border-l border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-sky-400" />
            {t.time}
          </span>
          <span className="text-base sm:text-xl font-black font-mono text-slate-300">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Deadlock Alert Notification */}
      {hasDeadlock && (
        <div className="w-full py-1.5 px-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold flex items-center justify-between shadow animate-bounce">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>⚠️ {t.deadlockWarning}</span>
          </div>
          <button
            onClick={onUndo}
            className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
          >
            {t.undo}
          </button>
        </div>
      )}
    </header>
  );
};
