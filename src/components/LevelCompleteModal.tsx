import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, RotateCcw, ArrowRight, Grid, Sparkles, Clock } from 'lucide-react';
import { LevelData } from '../types/game';
import { Translations } from '../game/i18n';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: LevelData;
  moves: number;
  pushes: number;
  timeSec: number;
  stars: number;
  isNewBest: boolean;
  hasNextLevel: boolean;
  t: Translations;
  onNextLevel: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  moves,
  pushes,
  timeSec,
  stars,
  isNewBest,
  hasNextLevel,
  t,
  onNextLevel,
  onRestart,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#22c55e', '#ec4899'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Victory Trophy Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          {t.levelCompleted}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {t.greatJob}
        </p>

        {/* Star Rating Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`p-3 rounded-2xl border transition transform ${
                  isEarned
                    ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/40 border-slate-700 text-slate-600 scale-95 opacity-50'
                }`}
              >
                <Star
                  className={`w-7 h-7 ${isEarned ? 'fill-amber-400' : 'fill-none'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              {t.moves}
            </span>
            <span
              className={`text-lg font-black font-mono ${
                moves <= level.parMoves ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {moves}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {t.par}: {level.parMoves}
            </span>
          </div>

          <div className="border-l border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              {t.pushes}
            </span>
            <span className="text-lg font-black font-mono text-slate-200">
              {pushes}
            </span>
          </div>

          <div className="border-l border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              {t.time}
            </span>
            <span className="text-lg font-black font-mono text-sky-400">
              {timeFormatted}
            </span>
          </div>
        </div>

        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.newRecord}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-6 rounded-2xl font-black bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-95 transition"
            >
              <span>{t.nextLevel}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRestart}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{t.replay}</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Grid className="w-4 h-4 text-sky-400" />
              <span>{t.levelSelect}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
