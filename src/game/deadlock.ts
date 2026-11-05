import { Position, TileType } from '../types/game';

/**
 * Detects common Sokoban deadlocks (corner deadlocks, wall pair deadlocks, 2x2 freeze clusters).
 */
export function findDeadlockedBoxes(
  grid: TileType[][],
  boxes: Position[],
  targets: Position[]
): number[] {
  const height = grid.length;
  const width = grid[0].length;
  const deadlockedIndices: number[] = [];

  const targetSet = new Set(targets.map((t) => `${t.x},${t.y}`));
  const boxSet = new Set(boxes.map((b) => `${b.x},${b.y}`));

  const isWall = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return true;
    return grid[y][x] === 'wall';
  };

  const isBlocked = (x: number, y: number) => {
    return isWall(x, y) || boxSet.has(`${x},${y}`);
  };

  boxes.forEach((box, index) => {
    // If the box is already on a target spot, it's not marked deadlocked
    if (targetSet.has(`${box.x},${box.y}`)) {
      return;
    }

    const upWall = isWall(box.x, box.y - 1);
    const downWall = isWall(box.x, box.y + 1);
    const leftWall = isWall(box.x - 1, box.y);
    const rightWall = isWall(box.x + 1, box.y);

    // 1. Corner deadlock: wall on (Up or Down) AND wall on (Left or Right)
    const isCorner = (upWall || downWall) && (leftWall || rightWall);
    if (isCorner) {
      deadlockedIndices.push(index);
      return;
    }

    // 2. 2x2 Block deadlock: check if box is part of a completely blocked 2x2
    const offsets = [
      { dx: 0, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: -1 },
    ];
    for (const off of offsets) {
      const x0 = box.x + off.dx;
      const y0 = box.y + off.dy;
      if (
        isBlocked(x0, y0) &&
        isBlocked(x0 + 1, y0) &&
        isBlocked(x0, y0 + 1) &&
        isBlocked(x0 + 1, y0 + 1)
      ) {
        deadlockedIndices.push(index);
        return;
      }
    }

    // 3. Wall pair deadlock: two boxes next to each other against a continuous wall
    // Horizontal pair along top/bottom wall
    if (upWall || downWall) {
      if (boxSet.has(`${box.x + 1},${box.y}`) && (isWall(box.x + 1, box.y - 1) === upWall || isWall(box.x + 1, box.y + 1) === downWall)) {
        if (!targetSet.has(`${box.x + 1},${box.y}`)) {
          deadlockedIndices.push(index);
          return;
        }
      }
    }
    // Vertical pair along left/right wall
    if (leftWall || rightWall) {
      if (boxSet.has(`${box.x},${box.y + 1}`) && (isWall(box.x - 1, box.y + 1) === leftWall || isWall(box.x + 1, box.y + 1) === rightWall)) {
        if (!targetSet.has(`${box.x},${box.y + 1}`)) {
          deadlockedIndices.push(index);
          return;
        }
      }
    }
  });

  return deadlockedIndices;
}

export function isInitialStateDeadlocked(
  grid: TileType[][],
  boxes: Position[],
  targets: Position[]
): boolean {
  return findDeadlockedBoxes(grid, boxes, targets).length > 0;
}
