import React from 'react';
import { X, CheckCircle2, AlertOctagon, HelpCircle, Star, Music, Move, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              A Sokoban Játékszabályai
            </h2>
            <p className="text-sm text-slate-400">
              Klasszikus japán raktáros logikai fejtörő (1981)
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-slate-200 text-sm">
          {/* Main Objective */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-base font-bold text-sky-300 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              A Játék Célja
            </h3>
            <p className="leading-relaxed text-slate-300">
              A játék célja, hogy a raktáros karaktert irányítva{' '}
              <strong className="text-amber-300 font-semibold">minden dobozt</strong> eljuttass a{' '}
              <strong className="text-red-400 font-semibold">kijelölt célmezőkre</strong>.
              Amikor egy doboz a célra ér, zölden / aranyszínben felvillan! A pálya akkor van kész, ha az összes doboz a helyére került.
            </p>
          </div>

          {/* Golden Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Csak TOLNI lehet!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A dobozokat a karakter előtt tudod eltolni. HÚZNI tilos és lehetetlen!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Egyszerre 1 doboz</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Két vagy több egymás mögötti dobozt egyszerre nem lehet tolni, a karakter fizikai ereje egy ládára elegendő.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-red-200 mb-1">Vigyázz a Sarkokkal!</h4>
                <p className="text-xs text-red-300/80 leading-relaxed">
                  Ha egy dobozt olyan fal melletti sarokba tolsz, ahol nincs célmező, beragad (Deadlock)! A játék ezt piros fénnyel jelzi.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-200 mb-1">Visszavonás (U)</h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Bármikor visszavonhatod a rossz lépéseket az <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[11px]">U</kbd> billentyűvel korlátlanul!
                </p>
              </div>
            </div>
          </div>

          {/* Music & 5-level worlds */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 flex items-start gap-3">
            <Music className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-purple-200 mb-1">
                Dinamikus Zenék & Világok 5 Pályánként!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Minden 5. szint után új világba érkezel egyedi látványvilággal és teljesen új, procedurálisan komponált szintetizátor háttérzenével (Raktár, Katakomba, Neon Mátrix, Kozmosz, Kristály Palota).
              </p>
            </div>
          </div>

          {/* Stars */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="font-semibold text-white">Csillag Értékelés:</span>
            </div>
            <span className="text-xs text-slate-400">
              Teljesítsd a szintet minimális lépésszámmal a 3 csillagos mester szinthez!
            </span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/20 active:scale-95"
          >
            Értem, mehet a játék!
          </button>
        </div>
      </div>
    </div>
  );
};
