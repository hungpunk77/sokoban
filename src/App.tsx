import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getInitialLevel, getLevelById, getTotalLevels, regenerateLevel } from './game/levels';
import { useGameState } from './game/useGameState';
import { GameBoard } from './components/GameBoard';
import { HUD } from './components/HUD';
import { VirtualDPad } from './components/VirtualDPad';
import { MainMenu } from './components/MainMenu';
import { RulesModal } from './components/RulesModal';
import { ControlsModal } from './components/ControlsModal';
import { SettingsModal } from './components/SettingsModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GeneratorModal } from './components/GeneratorModal';
import {
  soundEngine,
  MUSIC_TRACKS,
  MusicTrackInfo,
} from './audio/soundEngine';
import {
  loadLevelStats,
  saveLevelStats,
  loadAudioPreferences,
  saveAudioPreferences,
  loadLanguage,
  saveLanguage,
} from './game/storage';
import { Direction, LevelData } from './types/game';
import { Language, TRANSLATIONS } from './game/i18n';
import { Music } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const t = TRANSLATIONS[language];

  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [view, setView] = useState<'menu' | 'playing'>('menu');

  // Modals state
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackNotification, setTrackNotification] = useState<string | null>(null);

  // Persistent level statistics
  const [levelStats, setLevelStats] = useState(() => loadLevelStats());

  // Initialize game state with level 1 dynamically on demand
  const initialLevel = getInitialLevel();
  const {
    level,
    player,
    playerDir,
    boxes,
    moves,
    pushes,
    isWon,
    winStats,
    timeSec,
    canUndo,
    canRedo,
    deadlockedBoxes,
    hintDirection,
    isSolvingHint,
    theme,
    move,
    undo,
    redo,
    restart,
    requestHint,
    resetToLevel,
  } = useGameState(initialLevel);

  // Load stored audio preferences on mount
  useEffect(() => {
    const prefs = loadAudioPreferences();
    setIsMuted(prefs.muted);
    setSfxVolume(prefs.sfxVolume);
    setMusicVolume(prefs.musicVolume);

    soundEngine.setMute(prefs.muted);
    soundEngine.setSfxVolume(prefs.sfxVolume);
    soundEngine.setMusicVolume(prefs.musicVolume);

    // Subscribe to sound engine track change
    const unsub = soundEngine.onTrackChange((track: MusicTrackInfo) => {
      setCurrentTrackIndex(track.id - 1);
      setTrackNotification(`${t.nowPlaying}: ${track.title}`);
      const timer = setTimeout(() => setTrackNotification(null), 3800);
      return () => clearTimeout(timer);
    });

    return () => unsub();
  }, [t.nowPlaying]);

  const handleSelectLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    saveLanguage(newLang);
  }, []);

  // Update sound engine on audio state changes
  const handleToggleMute = useCallback(() => {
    soundEngine.ensureReady();
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMute(next);
    saveAudioPreferences({ muted: next, sfxVolume, musicVolume });
  }, [isMuted, sfxVolume, musicVolume]);

  const handleSetSfxVolume = useCallback(
    (vol: number) => {
      soundEngine.ensureReady();
      setSfxVolume(vol);
      soundEngine.setSfxVolume(vol);
      saveAudioPreferences({ muted: isMuted, sfxVolume: vol, musicVolume });
    },
    [isMuted, musicVolume]
  );

  const handleSetMusicVolume = useCallback(
    (vol: number) => {
      soundEngine.ensureReady();
      setMusicVolume(vol);
      soundEngine.setMusicVolume(vol);
      saveAudioPreferences({ muted: isMuted, sfxVolume, musicVolume: vol });
    },
    [isMuted, sfxVolume]
  );

  const handleToggleMusic = useCallback(() => {
    soundEngine.ensureReady();
    const playing = soundEngine.toggleMusic();
    setIsMusicPlaying(playing);
  }, []);

  const handleSelectTrack = useCallback((idx: number) => {
    soundEngine.ensureReady();
    soundEngine.setManualTrack(idx);
    setCurrentTrackIndex(idx);
    if (!soundEngine.getIsMusicPlaying()) {
      soundEngine.startMusic();
      setIsMusicPlaying(true);
    }
  }, []);

  // Level progression
  const handleSelectLevel = useCallback(
    (lvlId: number) => {
      const target = getLevelById(lvlId);
      if (target) {
        setCurrentLevelId(lvlId);
        resetToLevel(target);
        setView('playing');
        setIsLevelSelectOpen(false);

        // Auto-start music if not yet started
        soundEngine.ensureReady();
        if (!soundEngine.getIsMusicPlaying() && !isMuted) {
          soundEngine.startMusic();
          setIsMusicPlaying(true);
        }
      }
    },
    [resetToLevel, isMuted]
  );

  const handleNextLevel = useCallback(() => {
    const nextId = currentLevelId + 1;
    const nextLevel = getLevelById(nextId);
    if (nextLevel) {
      handleSelectLevel(nextId);
    } else {
      setIsLevelSelectOpen(true);
    }
  }, [currentLevelId, handleSelectLevel]);

  const handleStartGame = useCallback(() => {
    soundEngine.ensureReady();
    if (!soundEngine.getIsMusicPlaying() && !isMuted) {
      soundEngine.startMusic();
      setIsMusicPlaying(true);
    }
    setView('playing');
  }, [isMuted]);

  // Load generated procedural level
  const handleLoadGeneratedLevel = useCallback(
    (genLevel: LevelData) => {
      resetToLevel(genLevel);
      setView('playing');
      soundEngine.ensureReady();
      if (!soundEngine.getIsMusicPlaying() && !isMuted) {
        soundEngine.startMusic();
        setIsMusicPlaying(true);
      }
    },
    [resetToLevel, isMuted]
  );

  // Reset all progress
  const handleResetProgress = useCallback(() => {
    saveLevelStats({});
    setLevelStats({});
    setCurrentLevelId(1);
    const lvl = getLevelById(1);
    if (lvl) resetToLevel(lvl);
    setIsSettingsOpen(false);
  }, [resetToLevel]);

  // Update level stats when winning
  useEffect(() => {
    if (isWon) {
      setLevelStats(loadLevelStats());
    }
  }, [isWon]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when modals are open (except Escape / Space)
      const isAnyModalOpen =
        isRulesOpen ||
        isControlsOpen ||
        isSettingsOpen ||
        isLevelSelectOpen ||
        isGeneratorOpen;

      if (e.key === 'Escape') {
        if (isAnyModalOpen) {
          setIsRulesOpen(false);
          setIsControlsOpen(false);
          setIsSettingsOpen(false);
          setIsLevelSelectOpen(false);
          setIsGeneratorOpen(false);
        } else if (view === 'playing') {
          setView('menu');
        } else {
          setView('playing');
        }
        return;
      }

      if (isAnyModalOpen) return;

      if (view === 'playing') {
        // Space to advance on win
        if (isWon && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          handleNextLevel();
          return;
        }

        // Movement keys
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          move('up');
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          move('down');
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          move('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          move('right');
        } else if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
          e.preventDefault();
          undo();
        } else if (e.key === 'y' || e.key === 'Y' || (e.ctrlKey && e.key === 'y')) {
          e.preventDefault();
          redo();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          restart();
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          requestHint();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    view,
    isWon,
    isRulesOpen,
    isControlsOpen,
    isSettingsOpen,
    isLevelSelectOpen,
    isGeneratorOpen,
    move,
    undo,
    redo,
    restart,
    requestHint,
    handleNextLevel,
  ]);

  // Touch Swipe Gesture Handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const minSwipe = 24;

    if (Math.max(absX, absY) > minSwipe) {
      if (absX > absY) {
        if (dx > 0) move('right');
        else move('left');
      } else {
        if (dy > 0) move('down');
        else move('up');
      }
    }
  };

  // Click on tile to step adjacent
  const handleTileClick = (tx: number, ty: number) => {
    const dx = tx - player.x;
    const dy = ty - player.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) move('right');
      else if (dx === -1) move('left');
      else if (dy === 1) move('down');
      else if (dy === -1) move('up');
    }
  };

  const currentTrack = MUSIC_TRACKS[currentTrackIndex] || MUSIC_TRACKS[0];

  return (
    <div
      className={`min-h-screen select-none font-sans bg-gradient-to-b ${theme.bgGradient} transition-colors duration-700 flex flex-col justify-between`}
    >
      {/* Toast notification when a new track starts */}
      {trackNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-purple-500/50 text-purple-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <Music className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          <span>{trackNotification}</span>
        </div>
      )}

      {view === 'menu' ? (
        <MainMenu
          currentLevelId={currentLevelId}
          totalLevels={getTotalLevels()}
          levelStats={levelStats}
          isMuted={isMuted}
          isMusicPlaying={isMusicPlaying}
          currentTrackTitle={currentTrack.title}
          t={t}
          onStartGame={handleStartGame}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenControls={() => setIsControlsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onStartGenerator={() => setIsGeneratorOpen(true)}
          onSelectLevel={handleSelectLevel}
          onToggleMusic={handleToggleMusic}
          onToggleMute={handleToggleMute}
        />
      ) : (
        <div className="min-h-screen flex flex-col justify-between pb-3">
          {/* In-Game HUD Header */}
          <HUD
            levelId={level.id}
            levelTitle={level.title}
            worldName={t.worldNames[(theme.id - 1) % t.worldNames.length] || level.worldName}
            theme={theme}
            moves={moves}
            pushes={pushes}
            parMoves={level.parMoves}
            timeSec={timeSec}
            canUndo={canUndo}
            canRedo={canRedo}
            isMusicPlaying={isMusicPlaying}
            isMuted={isMuted}
            isSolvingHint={isSolvingHint}
            hasDeadlock={deadlockedBoxes.length > 0}
            currentTrackTitle={currentTrack.title}
            t={t}
            onUndo={undo}
            onRedo={redo}
            onRestart={restart}
            onHint={requestHint}
            onToggleMusic={handleToggleMusic}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenMenu={() => setView('menu')}
          />

          {/* Interactive Game Board */}
          <main
            className="flex-1 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <GameBoard
              level={level}
              player={player}
              playerDir={playerDir}
              boxes={boxes}
              deadlockedBoxes={deadlockedBoxes}
              hintDirection={hintDirection}
              theme={theme}
              onTileClick={handleTileClick}
            />
          </main>

          {/* Mobile Virtual D-Pad */}
          <VirtualDPad
            onMove={move}
            onUndo={undo}
            onRestart={restart}
            canUndo={canUndo}
          />
        </div>
      )}

      {/* MODALS */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} t={t} />

      <ControlsModal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        t={t}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        t={t}
        isMuted={isMuted}
        sfxVolume={sfxVolume}
        musicVolume={musicVolume}
        currentTrackIndex={currentTrackIndex}
        isMusicPlaying={isMusicPlaying}
        onToggleMute={handleToggleMute}
        onSetSfxVolume={handleSetSfxVolume}
        onSetMusicVolume={handleSetMusicVolume}
        onSelectTrack={handleSelectTrack}
        onTogglePlayMusic={handleToggleMusic}
        onResetProgress={handleResetProgress}
      />

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        currentLevelId={currentLevelId}
        levelStats={levelStats}
        t={t}
        onClose={() => setIsLevelSelectOpen(false)}
        onSelectLevel={handleSelectLevel}
        onRerollLevel={(lvlId) => {
          if (lvlId === currentLevelId) {
            resetToLevel(getLevelById(lvlId));
          }
        }}
      />

      <LevelCompleteModal
        isOpen={isWon && !isLevelSelectOpen}
        level={level}
        moves={moves}
        pushes={pushes}
        timeSec={timeSec}
        stars={winStats?.stars || 1}
        isNewBest={winStats?.isNewBest || false}
        hasNextLevel={true}
        t={t}
        onNextLevel={handleNextLevel}
        onRestart={restart}
        onOpenLevelSelect={() => {
          setIsLevelSelectOpen(true);
        }}
      />

      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onLoadGeneratedLevel={handleLoadGeneratedLevel}
        t={t}
      />
    </div>
  );
}
