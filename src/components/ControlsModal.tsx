import React from 'react';
import { X, Keyboard, Smartphone, MousePointer, RotateCcw, Undo2, Play, Lightbulb } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Irányítás & Billentyűk
            </h2>
            <p className="text-sm text-slate-400">
              Billentyűzet, egér és érintőképernyős vezérlés
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm">
          {/* Keyboard Section */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Billentyűzet Kiosztás
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
              {/* Movement */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Mozgás / Tolás:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    Nyilak
                  </kbd>
                  <span className="text-slate-500">/</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    WASD
                  </kbd>
                </div>
              </div>

              {/* Undo */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Undo2 className="w-3.5 h-3.5 text-sky-400" />
                  Visszavonás:
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    U
                  </kbd>
                  <span className="text-slate-500">vagy</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    Z
                  </kbd>
                </div>
              </div>

              {/* Restart */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  Pálya Újrakezdése:
                </span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  R
                </kbd>
              </div>

              {/* Menu */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Főmenü / Szünet:</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  ESC
                </kbd>
              </div>

              {/* Hint */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  Tipp Kérése:
                </span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  H
                </kbd>
              </div>

              {/* Next level */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Következő szint:
                </span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  SPACE
                </kbd>
              </div>
            </div>
          </div>

          {/* Touch & Mobile */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Érintőképernyő és Mobil
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>
                  <strong>Virtuális D-Pad:</strong> A képernyő alsó részén megjelenő iránygombokkal könnyedén léptetheted a karaktert.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>
                  <strong>Ujjhúzás (Swipe):</strong> Bármelyik irányba suhintva a képernyőn a játékos arrafelé lép vagy tolni próbál.
                </span>
              </li>
            </ul>
          </div>

          {/* Mouse Click Navigation */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Egér Kattintás
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kattints közvetlenül egy szomszédos mezőre a képernyőn a gyors lépéshez vagy ládatoláshoz.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
};
