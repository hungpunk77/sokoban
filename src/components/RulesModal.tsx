import React from 'react';
import { X, CheckCircle2, AlertOctagon, HelpCircle, Star, Move, Sparkles } from 'lucide-react';
import { Translations } from '../game/i18n';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, t }) => {
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
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.rulesTitle}
            </h2>
            <p className="text-sm text-slate-400">
              {t.rulesSubtitle}
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-slate-200 text-sm">
          {/* Main Objective */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-base font-bold text-sky-300 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              {t.rulesTitle}
            </h3>
            <p className="leading-relaxed text-slate-300">
              {t.rule4Desc}
            </p>
          </div>

          {/* Golden Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">
                  {t.rule1Title}
                </h4>
                <p className="text-xs text-slate-400">
                  {t.rule1Desc}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">
                  {t.rule2Title}
                </h4>
                <p className="text-xs text-slate-400">
                  {t.rule2Desc}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">
                  {t.rule3Title}
                </h4>
                <p className="text-xs text-slate-400">
                  {t.rule3Desc}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">
                  {t.rule4Title}
                </h4>
                <p className="text-xs text-slate-400">
                  {t.rule4Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Tips */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-800/60 border border-sky-800/40">
            <h3 className="font-bold text-sky-400 text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              {t.tipsTitle}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>{t.tip1}</li>
              <li>{t.tip2}</li>
              <li>{t.tip3}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/20 active:scale-95"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
