import React from 'react';
import { X, Keyboard, Smartphone, MousePointer, RotateCcw, Undo2, Play, Lightbulb } from 'lucide-react';
import { Translations } from '../game/i18n';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label={t.close}
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
              {t.controlsTitle}
            </h2>
            <p className="text-sm text-slate-400">
              {t.controlsSubtitle}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm">
          {/* Keyboard Section */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              {t.keyboardTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
              {/* Movement */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">{t.moves} / {t.pushes}:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    Arrows
                  </kbd>
                  <span className="text-slate-500">/</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    WASD
                  </kbd>
                </div>
              </div>

              {/* Undo */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">{t.undo}:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    U
                  </kbd>
                  <span className="text-slate-500">/</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                    Z
                  </kbd>
                </div>
              </div>

              {/* Restart */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">{t.restart}:</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  R
                </kbd>
              </div>

              {/* Hint */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">{t.hint}:</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono font-bold text-white shadow">
                  H
                </kbd>
              </div>
            </div>
          </div>

          {/* Mouse & Touch */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              {t.touchTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {t.touchDesc}
            </p>
          </div>

          {/* Keyboard Shortcuts Table */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.shortcutsTitle}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">Esc</kbd>
                <span>{t.keyMenu}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">M</kbd>
                <span>{t.mute}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
