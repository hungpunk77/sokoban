import React, { useState } from 'react';
import { X, Dices, Sparkles, Check, Loader2 } from 'lucide-react';
import { generateRandomSolvableLevel } from '../game/generator';
import { LevelData } from '../types/game';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGeneratedLevel: (level: LevelData) => void;
}

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  onLoadGeneratedLevel,
}) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const level = generateRandomSolvableLevel(difficulty);
      setIsGenerating(false);
      if (level) {
        onLoadGeneratedLevel(level);
        onClose();
      } else {
        alert('Nem sikerült pályát generálni, próbáld újra!');
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Bezárás"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Végtelen Generált Mód
            </h2>
            <p className="text-sm text-slate-400">
              Garantáltan megoldható egyedi pályák
            </p>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Válassz Nehézségi Szintet:
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'easy', label: 'Könnyű', desc: '3 láda (Kezdő)' },
              { id: 'normal', label: 'Normál', desc: '4 láda (Haladó)' },
              { id: 'hard', label: 'Nehéz', desc: '5 láda (Mester)' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id as 'easy' | 'normal' | 'hard')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                  difficulty === d.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span className="text-sm">{d.label}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    difficulty === d.id ? 'text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {d.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Generator explanation */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 mb-6 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            A generátor automatikusan BFS szélességi kereséssel ellenőrzi a labirintust, így a pálya garantáltan megoldható!
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 px-6 rounded-2xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Labirintus generálása és ellenőrzése...</span>
            </>
          ) : (
            <>
              <Dices className="w-5 h-5" />
              <span>Pálya Létrehozása & Indítás</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
