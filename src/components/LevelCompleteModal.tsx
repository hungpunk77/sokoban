import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, RotateCcw, ArrowRight, Grid, Sparkles, Clock } from 'lucide-react';
import { LevelData } from '../types/game';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: LevelData;
  moves: number;
  pushes: number;
  timeSec: number;
  stars: number;
  isNewBest: boolean;
  hasNextLevel: boolean;
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
  onNextLevel,
  onRestart,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
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
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
          SZINT TELJESÍTVE!
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          {level.id}. {level.title} • {level.worldName}
        </p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all transform ${
                starIdx <= stars
                  ? 'scale-110 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  starIdx <= stars ? 'fill-amber-400' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* Stats card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">
              Lépések
            </div>
            <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">
              {moves}
            </div>
            <div className="text-[10px] text-slate-500">Par: {level.parMoves}</div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">
              Tolások
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              {pushes}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">
              Idő
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {timeFormatted}
            </div>
          </div>
        </div>

        {/* New Record Banner */}
        {isNewBest && (
          <div className="mb-6 py-1.5 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Új Egyéni Rekord!
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-6 rounded-2xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-95 text-base"
            >
              <span>Következő Szint</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl text-purple-200 text-sm font-bold mb-2">
              Gratulálunk! Minden szintet teljesítettél!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRestart}
              className="py-2.5 px-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition text-xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Újrajátszás</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="py-2.5 px-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition text-xs active:scale-95"
            >
              <Grid className="w-4 h-4 text-sky-400" />
              <span>Pályák</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
