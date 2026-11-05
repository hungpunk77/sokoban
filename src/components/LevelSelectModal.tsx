import React, { useState } from 'react';
import { X, Lock, Star, Play, CheckCircle2, Music, Sparkles, RefreshCw } from 'lucide-react';
import { getLevelMetadata, regenerateLevel } from '../game/levels';
import { LevelStats, WorldTheme } from '../types/game';
import { WORLD_THEMES } from '../game/themes';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelId: number;
  levelStats: Record<number, LevelStats>;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  onRerollLevel?: (levelId: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  currentLevelId,
  levelStats,
  onClose,
  onSelectLevel,
  onRerollLevel,
}) => {
  // Current chapter (1-5, each 30 levels) and world (1-30, each 5 levels)
  const initialChapter = Math.min(5, Math.max(1, Math.floor((currentLevelId - 1) / 30) + 1));
  const initialWorld = Math.min(30, Math.max(1, Math.floor((currentLevelId - 1) / 5) + 1));

  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [selectedWorldTab, setSelectedWorldTab] = useState<number>(initialWorld);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!isOpen) return null;

  // 5 Chapters of 30 levels = 150 levels
  const chapters = [
    { id: 1, range: '1–30', title: '1. Fejezet', desc: 'Kezdő & Alapok' },
    { id: 2, range: '31–60', title: '2. Fejezet', desc: 'Haladó Kihívások' },
    { id: 3, range: '61–90', title: '3. Fejezet', desc: 'Stratégiai Fejtörők' },
    { id: 4, range: '91–120', title: '4. Fejezet', desc: 'Mester Labirintus' },
    { id: 5, range: '121–150', title: '5. Fejezet', desc: 'Nagymester Zóna' },
  ];

  // Generate all 30 worlds (each 5 levels)
  const allWorlds = Array.from({ length: 30 }, (_, i) => {
    const worldId = i + 1;
    const startLvl = (worldId - 1) * 5 + 1;
    const levels = [startLvl, startLvl + 1, startLvl + 2, startLvl + 3, startLvl + 4];
    const themeId = ((worldId - 1) % 5) + 1;
    const cycleRoman = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'][Math.floor((worldId - 1) / 5)];
    const theme = WORLD_THEMES[themeId] || WORLD_THEMES[1];
    return {
      id: worldId,
      chapterId: Math.floor((worldId - 1) / 6) + 1,
      name: `${worldId}. ${theme.name} ${cycleRoman}`,
      shortName: `${theme.name} ${cycleRoman}`,
      levels,
      track: theme.trackName.split('(')[0].trim(),
      themeId,
    };
  });

  // Filter worlds for the selected chapter
  const currentChapterWorlds = allWorlds.filter((w) => w.chapterId === selectedChapter);
  const currentWorld =
    allWorlds.find((w) => w.id === selectedWorldTab && w.chapterId === selectedChapter) ||
    currentChapterWorlds[0] ||
    allWorlds[0];

  // Lekéri a szintek kártyainformációit villámgyorsan, UI-fagyasztás nélkül
  const currentWorldLevels = currentWorld.levels.map((id) => getLevelMetadata(id));
  const activeTheme: WorldTheme = WORLD_THEMES[currentWorld.themeId] || WORLD_THEMES[1];

  const handleJumpToCurrent = () => {
    const targetChapter = Math.min(5, Math.max(1, Math.floor((currentLevelId - 1) / 30) + 1));
    const targetWorld = Math.min(30, Math.max(1, Math.floor((currentLevelId - 1) / 5) + 1));
    setSelectedChapter(targetChapter);
    setSelectedWorldTab(targetWorld);
  };

  const isLevelUnlocked = (id: number) => {
    if (id === 1) return true;
    const prev = levelStats[id - 1];
    return prev?.completed || id <= currentLevelId;
  };

  const handleReroll = (e: React.MouseEvent, lvlId: number) => {
    e.stopPropagation();
    regenerateLevel(lvlId);
    setRefreshTrigger((t) => t + 1);
    onRerollLevel?.(lvlId);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[94vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          aria-label="Bezárás"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Title and Current Level Jump */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 pr-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              150 Generált Szint & Világ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              30 világ 5 fejezetben • 100% garantáltan megoldható, fokozatosan nehezedő logikai kihívás
            </p>
          </div>

          <button
            onClick={handleJumpToCurrent}
            className="px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300 hover:bg-sky-500/25 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Aktuális: {currentLevelId}. szint</span>
          </button>
        </div>

        {/* Chapter Range Selector Tabs (1-30, 31-60, 61-90, 91-120, 121-150) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
          {chapters.map((ch) => {
            const isChapActive = selectedChapter === ch.id;
            const completedInChap = allWorlds
              .filter((w) => w.chapterId === ch.id)
              .flatMap((w) => w.levels)
              .filter((id) => levelStats[id]?.completed).length;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapter(ch.id);
                  const firstWorldInChap = (ch.id - 1) * 6 + 1;
                  setSelectedWorldTab(firstWorldInChap);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-start min-w-[125px] cursor-pointer border ${
                  isChapActive
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{ch.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isChapActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-sky-400'
                    }`}
                  >
                    {ch.range}
                  </span>
                </div>
                <div className="text-[10px] opacity-80 mt-0.5 truncate w-full flex justify-between">
                  <span>{ch.desc}</span>
                  {completedInChap > 0 && <span>★ {completedInChap}/30</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* World Tabs for Selected Chapter (6 Worlds, 5 levels each) */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3 border-b border-slate-800">
          {currentChapterWorlds.map((w) => {
            const isTabActive = selectedWorldTab === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWorldTab(w.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isTabActive
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{w.shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isTabActive ? 'bg-indigo-950/40 text-white font-extrabold' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {w.levels[0]}–{w.levels[w.levels.length - 1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active World Info Bar */}
        <div className="mb-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentWorld.name}</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({currentWorld.levels[0]}–{currentWorld.levels[currentWorld.levels.length - 1]}. szint)
              </span>
            </h3>
            <p className="text-xs text-slate-400">{activeTheme.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs">
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span>{currentWorld.track}</span>
          </div>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
          {currentWorldLevels.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const isCurrent = lvl.id === currentLevelId;
            const stats = levelStats[lvl.id];
            const stars = stats?.stars || 0;

            return (
              <div
                key={`${lvl.id}-${refreshTrigger}`}
                onClick={() => {
                  onSelectLevel(lvl.id);
                }}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
                  isCurrent
                    ? 'bg-sky-950/40 border-sky-500/80 shadow-lg shadow-sky-500/10'
                    : stats?.completed
                    ? 'bg-slate-800/80 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        isCurrent
                          ? 'bg-sky-500 text-slate-950'
                          : stats?.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {lvl.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 truncate max-w-[130px]">
                        {lvl.numBoxes} Doboz • {lvl.width}x{lvl.height}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Par: {lvl.parMoves} lépés
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {unlocked && (
                      <button
                        onClick={(e) => handleReroll(e, lvl.id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition"
                        title="Új garantált pálya generálása erre a szintre"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!unlocked ? (
                      <div className="p-1 rounded-lg bg-slate-800 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : stats?.completed ? (
                      <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Stars and Best Score */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  {stats?.bestMoves ? (
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">
                      Rekord: {stats.bestMoves} lépés
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Még nincs kész
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Vissza a Játékhoz
          </button>
        </div>
      </div>
    </div>
  );
};
