import { Position, TileType, Direction } from '../types/game';

interface SolverState {
  player: Position;
  boxes: Position[];
  history: { pushDir: Direction; fromBox: Position; playerPos: Position }[];
}

const DIRS: { dir: Direction; dx: number; dy: number }[] = [
  { dir: 'up', dx: 0, dy: -1 },
  { dir: 'down', dx: 0, dy: 1 },
  { dir: 'left', dx: -1, dy: 0 },
  { dir: 'right', dx: 1, dy: 0 },
];

/**
 * Nagyteljesítményű push-alapú BFS Sokoban megoldó reachability (elérhetőségi)
 * állapot-összevonással és holtpont (deadlock) korai ágnyeséssel.
 * Akár 5 dobozos és 80+ lépéses összetett feladványokat is pillanatok alatt megold.
 */
export function solveSokobanBfs(
  grid: TileType[][],
  player: Position,
  boxes: Position[],
  targets: Position[],
  maxStates = 25000
): Direction[] | null {
  const height = grid.length;
  const width = grid[0].length;
  const targetKey = targets
    .map((t) => `${t.x},${t.y}`)
    .sort()
    .join(';');

  const isWall = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return true;
    return grid[y][x] === 'wall';
  };

  const targetSet = new Set(targets.map((t) => `${t.x},${t.y}`));

  // Előre kiszámított sarok holtpontok (fal sarok, ami nem célmező)
  const isCornerDeadlock = (x: number, y: number) => {
    if (isWall(x, y)) return true;
    if (targetSet.has(`${x},${y}`)) return false;
    const upW = isWall(x, y - 1);
    const downW = isWall(x, y + 1);
    const leftW = isWall(x - 1, y);
    const rightW = isWall(x + 1, y);
    return (upW || downW) && (leftW || rightW);
  };

  // Flood-fill a játékos által doboztolás nélkül elérhető padlómezők gyűjtésére
  function getReachable(
    p: Position,
    bSet: Set<string>
  ): { reachable: Set<string>; minCoord: string } {
    const q: [number, number][] = [[p.x, p.y]];
    const seen = new Set<string>([`${p.x},${p.y}`]);
    let minCoord = `${p.x},${p.y}`;
    let minVal = p.y * 1000 + p.x;

    let head = 0;
    while (head < q.length) {
      const [cx, cy] = q[head++];
      const val = cy * 1000 + cx;
      if (val < minVal) {
        minVal = val;
        minCoord = `${cx},${cy}`;
      }
      for (const d of DIRS) {
        const nx = cx + d.dx;
        const ny = cy + d.dy;
        const key = `${nx},${ny}`;
        if (!isWall(nx, ny) && !bSet.has(key) && !seen.has(key)) {
          seen.add(key);
          q.push([nx, ny]);
        }
      }
    }
    return { reachable: seen, minCoord };
  }

  // Játékos gyaloglási útvonala doboztolás nélkül
  function findWalkPath(
    start: Position,
    goal: Position,
    bSet: Set<string>
  ): Direction[] | null {
    if (start.x === goal.x && start.y === goal.y) return [];
    const q: { x: number; y: number; path: Direction[] }[] = [
      { x: start.x, y: start.y, path: [] },
    ];
    const seen = new Set<string>([`${start.x},${start.y}`]);
    let head = 0;
    while (head < q.length) {
      const cur = q[head++];
      if (cur.x === goal.x && cur.y === goal.y) return cur.path;
      for (const d of DIRS) {
        const nx = cur.x + d.dx;
        const ny = cur.y + d.dy;
        const key = `${nx},${ny}`;
        if (!isWall(nx, ny) && !bSet.has(key) && !seen.has(key)) {
          seen.add(key);
          q.push({ x: nx, y: ny, path: [...cur.path, d.dir] });
        }
      }
    }
    return null;
  }

  const initialBSet = new Set(boxes.map((b) => `${b.x},${b.y}`));
  const initReach = getReachable(player, initialBSet);
  const initBoxesKey = boxes
    .map((b) => `${b.x},${b.y}`)
    .sort()
    .join(';');

  if (initBoxesKey === targetKey) return [];

  const visited = new Set<string>([`${initReach.minCoord}|${initBoxesKey}`]);
  const queue: SolverState[] = [{ player, boxes: [...boxes], history: [] }];

  let head = 0;
  while (head < queue.length && head < maxStates) {
    const cur = queue[head++];
    const bSet = new Set(cur.boxes.map((b) => `${b.x},${b.y}`));
    const { reachable } = getReachable(cur.player, bSet);

    for (let bi = 0; bi < cur.boxes.length; bi++) {
      const b = cur.boxes[bi];
      for (const d of DIRS) {
        const standX = b.x - d.dx;
        const standY = b.y - d.dy;
        if (!reachable.has(`${standX},${standY}`)) continue;

        const landX = b.x + d.dx;
        const landY = b.y + d.dy;
        if (isWall(landX, landY) || bSet.has(`${landX},${landY}`)) continue;

        // Sarok holtpont szűrés
        if (isCornerDeadlock(landX, landY)) continue;

        const newBoxes = [...cur.boxes];
        newBoxes[bi] = { x: landX, y: landY };
        const newBoxesKey = newBoxes
          .map((nb) => `${nb.x},${nb.y}`)
          .sort()
          .join(';');

        // 2x2 tömör holtpont ellenőrzés
        const newBSet = new Set(newBoxes.map((nb) => `${nb.x},${nb.y}`));
        const isBlocked = (cx: number, cy: number) =>
          isWall(cx, cy) || newBSet.has(`${cx},${cy}`);

        let is2x2Dead = false;
        const offsets = [
          { dx: 0, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: -1, dy: -1 },
        ];
        for (const off of offsets) {
          const x0 = landX + off.dx;
          const y0 = landY + off.dy;
          if (
            isBlocked(x0, y0) &&
            isBlocked(x0 + 1, y0) &&
            isBlocked(x0, y0 + 1) &&
            isBlocked(x0 + 1, y0 + 1)
          ) {
            const allTargets = [
              { x: x0, y: y0 },
              { x: x0 + 1, y: y0 },
              { x: x0, y: y0 + 1 },
              { x: x0 + 1, y: y0 + 1 },
            ].every((pt) => targetSet.has(`${pt.x},${pt.y}`) || isWall(pt.x, pt.y));
            if (!allTargets) {
              is2x2Dead = true;
              break;
            }
          }
        }
        if (is2x2Dead) continue;

        const newPlayer = { x: b.x, y: b.y };
        const newReach = getReachable(newPlayer, newBSet);

        // Nyert állapot ellenőrzése
        if (newBoxesKey === targetKey) {
          const fullPath: Direction[] = [];
          let simPlayer = player;
          let simBoxes = [...boxes];
          const allSteps = [
            ...cur.history,
            {
              pushDir: d.dir,
              fromBox: b,
              playerPos: { x: standX, y: standY },
            },
          ];
          for (const step of allSteps) {
            const currentBSet = new Set(
              simBoxes.map((sb) => `${sb.x},${sb.y}`)
            );
            const walk = findWalkPath(simPlayer, step.playerPos, currentBSet);
            if (walk) fullPath.push(...walk);
            fullPath.push(step.pushDir);
            simPlayer = { x: step.fromBox.x, y: step.fromBox.y };
            const bIdx = simBoxes.findIndex(
              (sb) => sb.x === step.fromBox.x && sb.y === step.fromBox.y
            );
            const dirObj = DIRS.find((o) => o.dir === step.pushDir)!;
            simBoxes[bIdx] = {
              x: step.fromBox.x + dirObj.dx,
              y: step.fromBox.y + dirObj.dy,
            };
          }
          return fullPath;
        }

        const stateKey = `${newReach.minCoord}|${newBoxesKey}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            player: newPlayer,
            boxes: newBoxes,
            history: [
              ...cur.history,
              {
                pushDir: d.dir,
                fromBox: b,
                playerPos: { x: standX, y: standY },
              },
            ],
          });
        }
      }
    }
  }

  return null;
}
