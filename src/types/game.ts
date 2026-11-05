export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export type TileType = 'wall' | 'floor';

export interface LevelData {
  id: number;
  title: string;
  worldId: number; // 1: Warehouse (1-5), 2: Crypt (6-10), 3: Cyberpunk (11-15), 4: Space (16-20), 5: Crystal (21-25+)
  worldName: string;
  width: number;
  height: number;
  grid: TileType[][]; // [y][x]
  playerStart: Position;
  boxesStart: Position[];
  targets: Position[];
  parMoves: number;
  author?: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface StepHistory {
  player: Position;
  playerDir: Direction;
  boxes: Position[];
  pushedBoxIndex: number | null; // index of box pushed if any
  moves: number;
  pushes: number;
}

export interface LevelStats {
  completed: boolean;
  stars: number; // 0-3
  bestMoves: number | null;
  bestPushes: number | null;
  bestTimeSec: number | null;
}

export interface WorldTheme {
  id: number;
  name: string;
  subtitle: string;
  trackName: string;
  trackBpm: number;
  trackMood: string;
  bgGradient: string;
  boardBg: string;
  boardBorder: string;
  wallBg: string;
  wallBorder: string;
  wallHighlight: string;
  wallShadow: string;
  floorEven: string;
  floorOdd: string;
  floorAccent: string;
  targetRing: string;
  targetGlow: string;
  targetCore: string;
  boxBase: string;
  boxBorder: string;
  boxCross: string;
  boxHighlight: string;
  boxDoneBase: string;
  boxDoneBorder: string;
  boxDoneGlow: string;
  playerColor: string;
  playerGlow: string;
  accentColor: string;
}

export type GameView = 'menu' | 'playing' | 'level_select' | 'rules' | 'controls' | 'settings' | 'generator';
