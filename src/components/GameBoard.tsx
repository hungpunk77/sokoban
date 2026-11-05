import React, { useMemo } from 'react';
import { LevelData, Position, Direction, WorldTheme } from '../types/game';
import { AlertTriangle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface GameBoardProps {
  level: LevelData;
  player: Position;
  playerDir: Direction;
  boxes: Position[];
  deadlockedBoxes: number[];
  hintDirection: Direction | null;
  theme: WorldTheme;
  onTileClick?: (x: number, y: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  player,
  playerDir,
  boxes,
  deadlockedBoxes,
  hintDirection,
  theme,
  onTileClick,
}) => {
  // Tile size dynamically calculated based on grid dimensions
  const maxDim = Math.max(level.width, level.height);
  const tileSize = maxDim <= 6 ? 64 : maxDim <= 8 ? 56 : maxDim <= 10 ? 48 : 42;

  // Set of targets for fast lookup
  const targetMap = useMemo(() => {
    const map = new Map<string, boolean>();
    level.targets.forEach((t) => map.set(`${t.x},${t.y}`, true));
    return map;
  }, [level.targets]);

  // Set of deadlocked box coordinates
  const deadlockedSet = useMemo(() => {
    const set = new Set<string>();
    deadlockedBoxes.forEach((idx) => {
      const b = boxes[idx];
      if (b) set.add(`${b.x},${b.y}`);
    });
    return set;
  }, [deadlockedBoxes, boxes]);

  return (
    <div className="relative flex items-center justify-center p-3 select-none">
      {/* Board Outer Container with glowing theme aura */}
      <div
        className="relative rounded-2xl p-3 shadow-2xl transition-all duration-300 border backdrop-blur-md"
        style={{
          backgroundColor: theme.boardBg,
          borderColor: theme.boardBorder,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${theme.targetGlow}`,
        }}
      >
        {/* Grid Cells */}
        <div
          className="grid gap-[2px] relative rounded-xl overflow-hidden shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${level.width}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${level.height}, ${tileSize}px)`,
            backgroundColor: theme.wallShadow,
          }}
        >
          {level.grid.map((row, y) =>
            row.map((cellType, x) => {
              const isWall = cellType === 'wall';
              const isTarget = targetMap.has(`${x},${y}`);
              const isEven = (x + y) % 2 === 0;

              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => onTileClick?.(x, y)}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors ${
                    isWall ? 'cursor-default' : 'hover:brightness-110'
                  }`}
                  style={{
                    width: `${tileSize}px`,
                    height: `${tileSize}px`,
                    backgroundColor: isWall
                      ? theme.wallBg
                      : isEven
                      ? theme.floorEven
                      : theme.floorOdd,
                  }}
                >
                  {/* WALL TILE 3D STYLING */}
                  {isWall ? (
                    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-1">
                      {/* Top highlight */}
                      <div
                        className="w-full h-1 rounded-sm opacity-60"
                        style={{ backgroundColor: theme.wallHighlight }}
                      />
                      {/* Brick / panel subtle texture */}
                      <div className="w-full h-full flex items-center justify-center opacity-30">
                        <div
                          className="w-3/4 h-3/4 border border-dashed rounded-sm"
                          style={{ borderColor: theme.wallHighlight }}
                        />
                      </div>
                      {/* Bottom bevel shadow */}
                      <div
                        className="w-full h-1.5 rounded-sm opacity-80"
                        style={{ backgroundColor: theme.wallShadow }}
                      />
                    </div>
                  ) : (
                    /* FLOOR TILE STYLING */
                    <>
                      {/* Floor subtle dot pattern */}
                      <div
                        className="w-1 h-1 rounded-full opacity-20 absolute"
                        style={{ backgroundColor: theme.floorAccent }}
                      />

                      {/* TARGET SPOT */}
                      {isTarget && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {/* Pulsing outer aura */}
                          <div
                            className="absolute rounded-full animate-ping opacity-30"
                            style={{
                              width: `${tileSize * 0.7}px`,
                              height: `${tileSize * 0.7}px`,
                              backgroundColor: theme.targetRing,
                            }}
                          />
                          {/* Outer concentric ring */}
                          <div
                            className="rounded-full border-2 flex items-center justify-center"
                            style={{
                              width: `${tileSize * 0.58}px`,
                              height: `${tileSize * 0.58}px`,
                              borderColor: theme.targetRing,
                              boxShadow: `0 0 12px ${theme.targetGlow}`,
                            }}
                          >
                            {/* Inner glowing core */}
                            <div
                              className="rounded-full shadow-lg"
                              style={{
                                width: `${tileSize * 0.28}px`,
                                height: `${tileSize * 0.28}px`,
                                backgroundColor: theme.targetCore,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}

          {/* DYNAMIC BOXES LAYER */}
          {boxes.map((box, idx) => {
            const isPlaced = targetMap.has(`${box.x},${box.y}`);
            const isDeadlocked = deadlockedSet.has(`${box.x},${box.y}`);

            return (
              <div
                key={`box-${idx}`}
                className="absolute transition-all duration-150 ease-out flex items-center justify-center pointer-events-none"
                style={{
                  width: `${tileSize}px`,
                  height: `${tileSize}px`,
                  transform: `translate(${box.x * (tileSize + 2)}px, ${
                    box.y * (tileSize + 2)
                  }px)`,
                  zIndex: 20,
                }}
              >
                {/* 3D Box Container */}
                <div
                  className={`relative w-[86%] h-[86%] rounded-lg flex items-center justify-center shadow-lg transition-transform ${
                    isPlaced ? 'scale-95' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isPlaced ? theme.boxDoneBase : theme.boxBase,
                    border: `2px solid ${
                      isDeadlocked
                        ? '#ef4444'
                        : isPlaced
                        ? theme.boxDoneBorder
                        : theme.boxBorder
                    }`,
                    boxShadow: isDeadlocked
                      ? '0 0 16px rgba(239, 68, 68, 0.8), 0 6px 12px rgba(0,0,0,0.6)'
                      : isPlaced
                      ? `0 0 18px ${theme.boxDoneGlow}, 0 6px 12px rgba(0,0,0,0.5)`
                      : '0 6px 14px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Top specular shine */}
                  <div
                    className="absolute top-1 left-1.5 right-1.5 h-1.5 rounded-t opacity-60"
                    style={{ backgroundColor: theme.boxHighlight }}
                  />

                  {/* Crate Cross/Diagonal Reinforcement */}
                  <svg className="w-full h-full p-1 opacity-70" viewBox="0 0 40 40">
                    <line
                      x1="6"
                      y1="6"
                      x2="34"
                      y2="34"
                      stroke={isPlaced ? '#ffffff' : theme.boxCross}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="34"
                      y1="6"
                      x2="6"
                      y2="34"
                      stroke={isPlaced ? '#ffffff' : theme.boxCross}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <rect
                      x="4"
                      y="4"
                      width="32"
                      height="32"
                      fill="none"
                      stroke={isPlaced ? '#ffffff' : theme.boxCross}
                      strokeWidth="1.5"
                      rx="3"
                    />
                  </svg>

                  {/* Sparkle or Warning Icon */}
                  {isPlaced && (
                    <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                      <Sparkles className="w-4 h-4 animate-pulse text-yellow-200" />
                    </div>
                  )}

                  {isDeadlocked && (
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-md animate-bounce">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* DYNAMIC PLAYER LAYER */}
          <div
            className="absolute transition-all duration-150 ease-out flex items-center justify-center pointer-events-none"
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              transform: `translate(${player.x * (tileSize + 2)}px, ${
                player.y * (tileSize + 2)
              }px)`,
              zIndex: 30,
            }}
          >
            {/* Animated Player Character */}
            <div
              className="relative w-[82%] h-[82%] rounded-full flex items-center justify-center shadow-2xl transition-all"
              style={{
                backgroundColor: theme.playerColor,
                boxShadow: `0 0 20px ${theme.playerGlow}, 0 6px 14px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Outer Glow Halo */}
              <div
                className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse"
              />

              {/* Character Face / Eyes based on direction */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Cap / Helmet visor */}
                <div className="absolute top-1 w-2/3 h-1.5 bg-white/40 rounded-full" />

                {/* Eyes */}
                {playerDir === 'down' && (
                  <div className="flex gap-2.5 mt-1">
                    <div className="w-2 h-2.5 bg-slate-900 rounded-full border border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full -mt-0.5" />
                    </div>
                    <div className="w-2 h-2.5 bg-slate-900 rounded-full border border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full -mt-0.5" />
                    </div>
                  </div>
                )}

                {playerDir === 'up' && (
                  <div className="w-4 h-3 bg-slate-800/80 rounded-t-lg -mt-1 border border-white/40" />
                )}

                {playerDir === 'left' && (
                  <div className="flex gap-1.5 mr-2 mt-0.5">
                    <div className="w-2 h-2.5 bg-slate-900 rounded-full border border-white flex items-start">
                      <div className="w-1 h-1 bg-white rounded-full ml-0.5 mt-0.5" />
                    </div>
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                  </div>
                )}

                {playerDir === 'right' && (
                  <div className="flex gap-1.5 ml-2 mt-0.5">
                    <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
                    <div className="w-2 h-2.5 bg-slate-900 rounded-full border border-white flex items-start">
                      <div className="w-1 h-1 bg-white rounded-full mr-0.5 mt-0.5" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HINT ARROW OVERLAY */}
          {hintDirection && (
            <div
              className="absolute transition-all duration-150 flex items-center justify-center pointer-events-none"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                transform: `translate(${
                  (player.x + (hintDirection === 'left' ? -1 : hintDirection === 'right' ? 1 : 0)) *
                  (tileSize + 2)
                }px, ${
                  (player.y + (hintDirection === 'up' ? -1 : hintDirection === 'down' ? 1 : 0)) *
                  (tileSize + 2)
                }px)`,
                zIndex: 40,
              }}
            >
              <div className="bg-amber-400 text-slate-950 p-2 rounded-full shadow-2xl animate-bounce border-2 border-white">
                {hintDirection === 'up' && <ArrowUp className="w-6 h-6 stroke-[3]" />}
                {hintDirection === 'down' && <ArrowDown className="w-6 h-6 stroke-[3]" />}
                {hintDirection === 'left' && <ArrowLeft className="w-6 h-6 stroke-[3]" />}
                {hintDirection === 'right' && <ArrowRight className="w-6 h-6 stroke-[3]" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
