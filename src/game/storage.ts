import { LevelStats } from '../types/game';

const STATS_KEY = 'sokoban_level_stats_v1';
const AUDIO_KEY = 'sokoban_audio_prefs_v1';

export interface AudioPreferences {
  muted: boolean;
  sfxVolume: number;
  musicVolume: number;
}

export function loadLevelStats(): Record<number, LevelStats> {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      // Default: level 1 is unlocked
      return {};
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLevelStats(stats: Record<number, LevelStats>): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Storage quota or disabled
  }
}

export function recordLevelSuccess(
  levelId: number,
  moves: number,
  pushes: number,
  timeSec: number,
  parMoves: number
): { stars: number; isNewBest: boolean; allStats: Record<number, LevelStats> } {
  const allStats = loadLevelStats();
  const prev = allStats[levelId];

  // Calculate stars:
  // 3 stars: <= parMoves
  // 2 stars: <= parMoves * 1.5
  // 1 star: completed
  let stars = 1;
  if (moves <= parMoves) {
    stars = 3;
  } else if (moves <= Math.round(parMoves * 1.5)) {
    stars = 2;
  }

  const isNewBest = !prev?.bestMoves || moves < prev.bestMoves;

  allStats[levelId] = {
    completed: true,
    stars: Math.max(prev?.stars || 0, stars),
    bestMoves: prev?.bestMoves ? Math.min(prev.bestMoves, moves) : moves,
    bestPushes: prev?.bestPushes ? Math.min(prev.bestPushes, pushes) : pushes,
    bestTimeSec: prev?.bestTimeSec ? Math.min(prev.bestTimeSec, timeSec) : timeSec,
  };

  saveLevelStats(allStats);
  return { stars, isNewBest, allStats };
}

export function loadAudioPreferences(): AudioPreferences {
  try {
    const raw = localStorage.getItem(AUDIO_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    muted: false,
    sfxVolume: 0.7,
    musicVolume: 0.45,
  };
}

export function saveAudioPreferences(prefs: AudioPreferences): void {
  try {
    localStorage.setItem(AUDIO_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
