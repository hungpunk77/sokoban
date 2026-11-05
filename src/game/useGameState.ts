import { useState, useEffect, useRef, useCallback } from 'react';
import { LevelData, Position, Direction, StepHistory, WorldTheme } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { findDeadlockedBoxes } from './deadlock';
import { solveSokobanBfs } from './solver';
import { recordLevelSuccess, loadLevelStats } from './storage';
import { getThemeForLevel } from './themes';

export function useGameState(initialLevel: LevelData) {
  const [level, setLevel] = useState<LevelData>(initialLevel);
  const [player, setPlayer] = useState<Position>(initialLevel.playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('down');
  const [boxes, setBoxes] = useState<Position[]>(initialLevel.boxesStart);
  const [history, setHistory] = useState<StepHistory[]>([]);
  const [redoStack, setRedoStack] = useState<StepHistory[]>([]);

  const [moves, setMoves] = useState<number>(0);
  const [pushes, setPushes] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [timeSec, setTimeSec] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const [hintDirection, setHintDirection] = useState<Direction | null>(null);
  const [isSolvingHint, setIsSolvingHint] = useState<boolean>(false);
  const [deadlockedBoxes, setDeadlockedBoxes] = useState<number[]>([]);

  // Victory result
  const [winStats, setWinStats] = useState<{
    stars: number;
    isNewBest: boolean;
  } | null>(null);

  // Active theme based on current level
  const theme: WorldTheme = getThemeForLevel(level.id);

  // Initialize level
  const resetToLevel = useCallback((newLevel: LevelData) => {
    setLevel(newLevel);
    setPlayer(newLevel.playerStart);
    setPlayerDir('down');
    setBoxes([...newLevel.boxesStart]);
    setHistory([]);
    setRedoStack([]);
    setMoves(0);
    setPushes(0);
    setIsWon(false);
    setTimeSec(0);
    setIsTimerRunning(true);
    setHintDirection(null);
    setDeadlockedBoxes([]);
    setWinStats(null);

    // Switch music track for this level bracket
    soundEngine.setLevelTrack(newLevel.id);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || isWon) return;
    const interval = setInterval(() => {
      setTimeSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isWon]);

  // Deadlock detection effect whenever boxes change
  useEffect(() => {
    if (isWon) {
      setDeadlockedBoxes([]);
      return;
    }
    const deadlocked = findDeadlockedBoxes(level.grid, boxes, level.targets);
    setDeadlockedBoxes(deadlocked);
  }, [boxes, level.grid, level.targets, isWon]);

  // Check if player won
  const checkWin = useCallback(
    (curBoxes: Position[], finalMoves: number, finalPushes: number) => {
      const targetKeys = new Set(level.targets.map((t) => `${t.x},${t.y}`));
      const allPlaced = curBoxes.every((b) => targetKeys.has(`${b.x},${b.y}`));

      if (allPlaced && curBoxes.length > 0) {
        setIsWon(true);
        setIsTimerRunning(false);
        soundEngine.playWin();

        // Record statistics and stars
        const res = recordLevelSuccess(
          level.id,
          finalMoves,
          finalPushes,
          timeSec,
          level.parMoves
        );
        setWinStats({
          stars: res.stars,
          isNewBest: res.isNewBest,
        });
        return true;
      }
      return false;
    },
    [level.targets, level.id, level.parMoves, timeSec]
  );

  // Move command execution
  const move = useCallback(
    (dir: Direction) => {
      if (isWon) return false;

      let dx = 0;
      let dy = 0;
      if (dir === 'up') dy = -1;
      if (dir === 'down') dy = 1;
      if (dir === 'left') dx = -1;
      if (dir === 'right') dx = 1;

      setPlayerDir(dir);
      setHintDirection(null);

      const nx = player.x + dx;
      const ny = player.y + dy;

      // Bounds & Wall check
      if (nx < 0 || nx >= level.width || ny < 0 || ny >= level.height) {
        soundEngine.playBump();
        return false;
      }
      if (level.grid[ny][nx] === 'wall') {
        soundEngine.playBump();
        return false;
      }

      // Check if there is a box at target position
      const boxIndex = boxes.findIndex((b) => b.x === nx && b.y === ny);

      if (boxIndex !== -1) {
        // Pushing a box
        const nbx = nx + dx;
        const nby = ny + dy;

        // Check if box destination is wall or out of bounds
        if (nbx < 0 || nbx >= level.width || nby < 0 || nby >= level.height) {
          soundEngine.playBump();
          return false;
        }
        if (level.grid[nby][nbx] === 'wall') {
          soundEngine.playBump();
          return false;
        }

        // Check if another box is at destination (cannot push two boxes)
        if (boxes.some((b) => b.x === nbx && b.y === nby)) {
          soundEngine.playBump();
          return false;
        }

        // Valid box push!
        const newBoxes = [...boxes];
        newBoxes[boxIndex] = { x: nbx, y: nby };

        // Save step to history for undo
        const historyItem: StepHistory = {
          player: { ...player },
          playerDir,
          boxes: [...boxes],
          pushedBoxIndex: boxIndex,
          moves: moves + 1,
          pushes: pushes + 1,
        };
        setHistory((prev) => [...prev, historyItem]);
        setRedoStack([]);

        setPlayer({ x: nx, y: ny });
        setBoxes(newBoxes);
        setMoves((m) => m + 1);
        setPushes((p) => p + 1);

        // Check if newly placed box landed on target
        const isTarget = level.targets.some((t) => t.x === nbx && t.y === nby);
        const wasTarget = level.targets.some((t) => t.x === nx && t.y === ny);

        if (isTarget) {
          soundEngine.playPlace();
        } else if (wasTarget) {
          soundEngine.playRemove();
        } else {
          soundEngine.playPush();
        }

        checkWin(newBoxes, moves + 1, pushes + 1);
        return true;
      } else {
        // Normal move without push
        const historyItem: StepHistory = {
          player: { ...player },
          playerDir,
          boxes: [...boxes],
          pushedBoxIndex: null,
          moves: moves + 1,
          pushes,
        };
        setHistory((prev) => [...prev, historyItem]);
        setRedoStack([]);

        setPlayer({ x: nx, y: ny });
        setMoves((m) => m + 1);
        soundEngine.playStep();
        return true;
      }
    },
    [isWon, player, playerDir, level, boxes, moves, pushes, checkWin]
  );

  // Undo step
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];

    // Push current to redo
    const currentSnapshot: StepHistory = {
      player: { ...player },
      playerDir,
      boxes: [...boxes],
      pushedBoxIndex: previous.pushedBoxIndex,
      moves,
      pushes,
    };
    setRedoStack((prev) => [...prev, currentSnapshot]);

    setHistory((prev) => prev.slice(0, -1));
    setPlayer(previous.player);
    setPlayerDir(previous.playerDir);
    setBoxes(previous.boxes);
    setMoves(previous.moves);
    setPushes(previous.pushes);
    setIsWon(false);
    setHintDirection(null);

    soundEngine.playUndo();
  }, [history, player, playerDir, boxes, moves, pushes]);

  // Redo step
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];

    // Push current to history
    const currentSnapshot: StepHistory = {
      player: { ...player },
      playerDir,
      boxes: [...boxes],
      pushedBoxIndex: next.pushedBoxIndex,
      moves,
      pushes,
    };
    setHistory((prev) => [...prev, currentSnapshot]);

    setRedoStack((prev) => prev.slice(0, -1));
    setPlayer(next.player);
    setPlayerDir(next.playerDir);
    setBoxes(next.boxes);
    setMoves(next.moves);
    setPushes(next.pushes);
    setHintDirection(null);

    soundEngine.playStep();
    checkWin(next.boxes, next.moves, next.pushes);
  }, [redoStack, player, playerDir, boxes, moves, pushes, checkWin]);

  // Restart level
  const restart = useCallback(() => {
    setPlayer(level.playerStart);
    setPlayerDir('down');
    setBoxes([...level.boxesStart]);
    setHistory([]);
    setRedoStack([]);
    setMoves(0);
    setPushes(0);
    setIsWon(false);
    setTimeSec(0);
    setIsTimerRunning(true);
    setHintDirection(null);
    soundEngine.playRestart();
  }, [level]);

  // Request hint from BFS solver
  const requestHint = useCallback(() => {
    if (isWon || isSolvingHint) return;
    setIsSolvingHint(true);

    setTimeout(() => {
      const solution = solveSokobanBfs(level.grid, player, boxes, level.targets, 15000);
      setIsSolvingHint(false);

      if (solution && solution.length > 0) {
        setHintDirection(solution[0]);
        soundEngine.playStar();
      } else {
        soundEngine.playBump();
      }
    }, 50);
  }, [isWon, isSolvingHint, level.grid, player, boxes, level.targets]);

  return {
    level,
    player,
    playerDir,
    boxes,
    moves,
    pushes,
    isWon,
    winStats,
    timeSec,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
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
  };
}
