import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo2, RotateCcw } from 'lucide-react';
import { Direction } from '../types/game';

interface VirtualDPadProps {
  onMove: (dir: Direction) => void;
  onUndo: () => void;
  onRestart: () => void;
  canUndo: boolean;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onMove,
  onUndo,
  onRestart,
  canUndo,
}) => {
  return (
    <div className="flex sm:hidden items-center justify-between px-6 py-2 select-none w-full max-w-sm mx-auto">
      {/* Left utility buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg transition active:scale-90 ${
            canUndo
              ? 'bg-slate-800 border-slate-600 text-sky-400'
              : 'bg-slate-900 border-slate-800 text-slate-700'
          }`}
          aria-label="Visszavonás"
        >
          <Undo2 className="w-5 h-5" />
        </button>

        <button
          onClick={onRestart}
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 border border-slate-600 text-amber-400 shadow-lg active:scale-90 transition"
          aria-label="Újrakezdés"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* D-Pad Cross */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Center circle */}
        <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 absolute pointer-events-none" />

        {/* Up */}
        <button
          onClick={() => onMove('up')}
          className="absolute top-0 w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 flex items-center justify-center active:scale-90 active:bg-sky-600 transition shadow-lg"
          aria-label="Fel"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Down */}
        <button
          onClick={() => onMove('down')}
          className="absolute bottom-0 w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 flex items-center justify-center active:scale-90 active:bg-sky-600 transition shadow-lg"
          aria-label="Le"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        {/* Left */}
        <button
          onClick={() => onMove('left')}
          className="absolute left-0 w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 flex items-center justify-center active:scale-90 active:bg-sky-600 transition shadow-lg"
          aria-label="Balra"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Right */}
        <button
          onClick={() => onMove('right')}
          className="absolute right-0 w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 flex items-center justify-center active:scale-90 active:bg-sky-600 transition shadow-lg"
          aria-label="Jobbra"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
