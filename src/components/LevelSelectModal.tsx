import React, { useState } from 'react';
import { X, Lock, Star, Play, CheckCircle2, Music, Sparkles, RefreshCw } from 'lucide-react';
import { getLevelMetadata, regenerateLevel } from '../game/levels';
import { LevelStats, WorldTheme } from '../types/game';
import { WORLD_THEMES } from '../game/themes';
import { Translations } from '../game/i18n';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelId: number;
  levelStats: Record<number, LevelStats>;
  t: Translations;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  onRerollLevel?: (levelId: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  currentLevelId,
  levelStats,
  t,
  onClose,
  onSelectLevel,
  onRerollLevel,
}) => {
  const initialChapter = Math.min(5, Math.max(1, Math.floor((currentLevelId - 1) / 30) + 1));
  const initialWorld = Math.min(30, Math.max(1, Math.floor((currentLevelId - 1) / 5) + 1));

  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [selectedWorldTab, setSelectedWorldTab] = useState<number>(initialWorld);
  const [, setRefreshTrigger] = useState(0);

  if (!isOpen) return null;

  const chapters = [
    { id: 1, range: '1–30', title: `${t.world} 1–6`, desc: '1–30' },
    { id: 2, range: '31–60', title: `${t.world} 7–12`, desc: '31–60' },
    { id: 3, range: '61–90', title: `${t.world} 13–18`, desc: '61–90' },
    { id: 4, range: '91–120', title: `${t.world} 19–24`, desc: '91–120' },
    { id: 5, range: '121–150', title: `${t.world} 25–30`, desc: '121–150' },
  ];

  const allWorlds = Array.from({ length: 30 }, (_, i) => {
    const worldId = i + 1;
    const startLvl = (worldId - 1) * 5 + 1;
    const levels = [startLvl, startLvl + 1, startLvl + 2, startLvl + 3, startLvl + 4];
    const themeId = ((worldId - 1) % 5) + 1;
    const cycleRoman = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'][Math.floor((worldId - 1) / 5)];
    const theme = WORLD_THEMES[themeId] || WORLD_THEMES[1];
    const translatedWorldName = t.worldNames[(themeId - 1) % t.worldNames.length];
    return {
      worldId,
      themeId,
      name: `${translatedWorldName} ${cycleRoman}`,
      subtitle: theme.subtitle,
      trackName: theme.trackName,
      levels,
      startLvl,
      endLvl: startLvl + 4,
    };
  });

  const visibleWorlds = allWorlds.filter(
    (w) => w.worldId >= (selectedChapter - 1) * 6 + 1 && w.worldId <= selectedChapter * 6
  );

  const activeWorld = allWorlds.find((w) => w.worldId === selectedWorldTab) || visibleWorlds[0] || allWorlds[0];

  const handleReroll = (e: React.MouseEvent, lvlId: number) => {
    e.stopPropagation();
    regenerateLevel(lvlId);
    setRefreshTrigger((prev) => prev + 1);
    if (onRerollLevel) {
      onRerollLevel(lvlId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition z-10"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0 pr-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.levelSelect}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                150 {t.level}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              30 {t.worldsCount.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Chapter Switcher Tabs (1-30, 31-60, etc.) */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4 shrink-0">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapter(ch.id);
                const firstWorldInChapter = (ch.id - 1) * 6 + 1;
                setSelectedWorldTab(firstWorldInChapter);
              }}
              className={`py-2 px-1 text-center rounded-xl transition flex flex-col items-center justify-center ${
                selectedChapter === ch.id
                  ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold">{ch.range}</span>
            </button>
          ))}
        </div>

        {/* World selector pills inside the chosen chapter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 shrink-0 scrollbar-none">
          {visibleWorlds.map((w) => {
            const isSelected = w.worldId === activeWorld.worldId;
            const completedInWorld = w.levels.filter((l) => levelStats[l]?.completed).length;

            return (
              <button
                key={w.worldId}
                onClick={() => setSelectedWorldTab(w.worldId)}
                className={`py-1.5 px-3 rounded-xl border text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/70'
                }`}
              >
                <span>{w.worldId}. {w.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    completedInWorld === 5
                      ? 'bg-emerald-500/20 text-emerald-300 font-mono'
                      : 'bg-slate-900/60 text-slate-400'
                  }`}
                >
                  {completedInWorld}/5
                </span>
              </button>
            );
          })}
        </div>

        {/* Active World Card Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900 border border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
              {activeWorld.worldId}. {t.world} ({activeWorld.startLvl}–{activeWorld.endLvl}. {t.level})
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              {activeWorld.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-pink-300 bg-pink-950/40 border border-pink-500/30 px-2.5 py-1 rounded-xl">
            <Music className="w-3.5 h-3.5" />
            <span>{activeWorld.trackName}</span>
          </div>
        </div>

        {/* Levels Grid (5 Levels for the Active World) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-y-auto p-1 flex-1">
          {activeWorld.levels.map((lvlId) => {
            const stats = levelStats[lvlId];
            const isCompleted = stats?.completed;
            const stars = stats?.stars || 0;
            const isCurrent = lvlId === currentLevelId;
            const meta = getLevelMetadata(lvlId);

            return (
              <div
                key={lvlId}
                onClick={() => {
                  onSelectLevel(lvlId);
                  onClose();
                }}
                className={`relative p-3.5 rounded-2xl border transition flex flex-col justify-between cursor-pointer group select-none ${
                  isCurrent
                    ? 'bg-sky-950/50 border-sky-400 shadow-xl shadow-sky-500/10'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black font-mono text-white">
                      #{lvlId}
                    </span>

                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {meta.parMoves} {t.par.toLowerCase()}
                      </span>
                    )}
                  </div>

                  {/* Level stats info: Boxes and Size */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{t.pushes}:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {meta.numBoxes} {t.pushes.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{t.par}:</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {meta.parMoves}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stars Rating & Play Button */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleReroll(e, lvlId)}
                      title="Regenerate this level"
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <div className="w-6 h-6 rounded-lg bg-sky-500 group-hover:bg-sky-400 text-slate-950 flex items-center justify-center transition">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
