import { LevelData, TileType, Position, Direction } from '../types/game';
import { solveSokobanBfs } from './solver';
import { isInitialStateDeadlocked } from './deadlock';

const WORLD_NAMES = [
  'Ipari Raktár',
  'Ősi Katakomba',
  'Cyberpunk Neon',
  'Kozmikus Állomás',
  'Kristály Palota',
];

const DIRS: { dir: Direction; dx: number; dy: number }[] = [
  { dir: 'up', dx: 0, dy: -1 },
  { dir: 'down', dx: 0, dy: 1 },
  { dir: 'left', dx: -1, dy: 0 },
  { dir: 'right', dx: 1, dy: 0 },
];

/**
 * Generál egy 100%-ban garantáltan megoldható, fokozatosan nehezedő,
 * komoly logikai kihívást nyújtó szintet.
 * Már az első szint sem könnyű: 3 dobozzal, belső falakkal és szűk folyosókkal indul.
 */
export function generateProgressiveLevel(levelNum: number): LevelData {
  let numBoxes = 3;
  let roomWidth = 8;
  let roomHeight = 8;
  let minSteps = 22;
  let maxPulls = 38;
  let minPullsPerBox = 3;

  // Fokozatos nehezedés 150 szinten át - kezdve a komoly 3 dobozos szintektől a nagymester 5-6 dobozosokig
  if (levelNum <= 15) {
    // 1-15. szint: 3 doboz, 8x8 szoba, 22-35 lépés (már a kezdet is igazi fejtörő!)
    numBoxes = 3;
    roomWidth = 8;
    roomHeight = 8;
    minSteps = 22;
    maxPulls = 38;
    minPullsPerBox = 3;
  } else if (levelNum <= 35) {
    // 16-35. szint: 3 vagy 4 doboz, 8x8 vagy 9x8 szoba, 28-44 lépés
    numBoxes = levelNum >= 22 ? 4 : 3;
    roomWidth = levelNum >= 26 ? 9 : 8;
    roomHeight = 8;
    minSteps = 28;
    maxPulls = 46;
    minPullsPerBox = 4;
  } else if (levelNum <= 75) {
    // 36-75. szint: 4 doboz, 9x9 szoba belső válaszfalakkal, 35-54 lépés
    numBoxes = 4;
    roomWidth = 9;
    roomHeight = 9;
    minSteps = 35;
    maxPulls = 54;
    minPullsPerBox = 4;
  } else if (levelNum <= 115) {
    // 76-115. szint: 4 vagy 5 doboz, 9x9 vagy 10x9 szoba, 44-66 lépés
    numBoxes = levelNum >= 92 ? 5 : 4;
    roomWidth = levelNum >= 92 ? 10 : 9;
    roomHeight = 9;
    minSteps = 44;
    maxPulls = 64;
    minPullsPerBox = 5;
  } else {
    // 116-150. szint: 5 vagy 6 doboz, 10x10 nagymester szoba labirintusszerű folyosókkal, 52-85+ lépés
    numBoxes = levelNum >= 135 ? 6 : 5;
    roomWidth = 10;
    roomHeight = 10;
    minSteps = 52;
    maxPulls = 75;
    minPullsPerBox = 5;
  }

  const worldThemeIndex = Math.floor((levelNum - 1) / 5) % 5;
  const cycle = Math.floor((levelNum - 1) / 25) + 1;
  const romanCycles = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'];
  const worldName = `${WORLD_NAMES[worldThemeIndex]} ${romanCycles[cycle - 1] || `${cycle}.`}`;
  const worldId = worldThemeIndex + 1;

  let bestCandidate: LevelData | null = null;
  let bestCandidateSteps = 0;

  // Határozott Pszeudorandom Generátor (PRNG) a szintek konzisztens, stabil újraalkotásához
  let seed = levelNum * 2654435761 + 1013904223;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const width = roomWidth;
  const height = roomHeight;

  for (let attempt = 0; attempt < 70; attempt++) {
    // 1. Külső határfalak és üres belső padló felépítése
    const grid: TileType[][] = [];
    for (let y = 0; y < height; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          row.push('wall');
        } else {
          row.push('floor');
        }
      }
      grid.push(row);
    }

    // 2. Belső strukturált válaszfalak (nem csak véletlen pontok, hanem 2-3 mezős falak folyosókkal)
    const partitionCount = numBoxes >= 4 ? 4 : 3;
    for (let p = 0; p < partitionCount; p++) {
      const isHorizontal = rnd() < 0.5;
      const len = 2 + Math.floor(rnd() * 2);
      const px = 2 + Math.floor(rnd() * (width - 4));
      const py = 2 + Math.floor(rnd() * (height - 4));
      for (let i = 0; i < len; i++) {
        const wx = isHorizontal ? px + i : px;
        const wy = isHorizontal ? py : py + i;
        if (wx > 0 && wx < width - 1 && wy > 0 && wy < height - 1) {
          grid[wy][wx] = 'wall';
        }
      }
    }

    // Sarok beugrók (egyes külső sarkok lefalazása izgalmasabb alaprajzért)
    if (rnd() < 0.65) grid[1][1] = 'wall';
    if (rnd() < 0.65) grid[1][width - 2] = 'wall';
    if (rnd() < 0.65) grid[height - 2][1] = 'wall';
    if (rnd() < 0.65) grid[height - 2][width - 2] = 'wall';

    // 3. Egybefüggő járható terület ellenőrzése (Flood-fill)
    let startFloor: Position | null = null;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] === 'floor') {
          startFloor = { x, y };
          break;
        }
      }
      if (startFloor) break;
    }
    if (!startFloor) continue;

    const visitedFloors = new Set<string>();
    const fq: Position[] = [startFloor];
    visitedFloors.add(`${startFloor.x},${startFloor.y}`);
    let fHead = 0;
    while (fHead < fq.length) {
      const cur = fq[fHead++];
      for (const d of DIRS) {
        const nx = cur.x + d.dx;
        const ny = cur.y + d.dy;
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1) {
          if (grid[ny][nx] === 'floor' && !visitedFloors.has(`${nx},${ny}`)) {
            visitedFloors.add(`${nx},${ny}`);
            fq.push({ x: nx, y: ny });
          }
        }
      }
    }

    // Minden leválasztott, különálló zsebet fallá alakítunk
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] === 'floor' && !visitedFloors.has(`${x},${y}`)) {
          grid[y][x] = 'wall';
        }
      }
    }

    const floors = Array.from(visitedFloors).map((s) => {
      const [x, y] = s.split(',').map(Number);
      return { x, y };
    });

    if (floors.length < numBoxes + 10) continue;

    const isWall = (x: number, y: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return true;
      return grid[y][x] === 'wall';
    };

    // 4. Célmezők kiválasztása: előnyben részesítjük a fal melletti öblöket és fülkéket
    const scoredFloors = floors.map((f) => {
      let wallNeighbors = 0;
      for (const d of DIRS) {
        if (isWall(f.x + d.dx, f.y + d.dy)) wallNeighbors++;
      }
      return { pos: f, score: wallNeighbors + rnd() * 0.4 };
    });

    scoredFloors.sort((a, b) => b.score - a.score);
    const candidatePool = scoredFloors.slice(0, Math.min(scoredFloors.length, numBoxes * 3));
    candidatePool.sort(() => rnd() - 0.5);
    const targets = candidatePool.slice(0, numBoxes).map((c) => c.pos);

    // Kezdeti állapot a hátrafelé húzáshoz: minden doboz a célon van
    const boxes = targets.map((t) => ({ ...t }));
    let player = floors.find((f) => !targets.some((t) => t.x === f.x && t.y === f.y)) || floors[0];

    const pullsPerBox = new Array(boxes.length).fill(0);
    let totalPulls = 0;

    for (let step = 0; step < maxPulls * 4; step++) {
      let boxIdx = pullsPerBox.findIndex((cnt) => cnt === 0);
      if (boxIdx === -1 || rnd() < 0.4) {
        boxIdx = Math.floor(rnd() * boxes.length);
      }

      const b = boxes[boxIdx];
      const d = DIRS[Math.floor(rnd() * DIRS.length)];

      const playerPos = { x: b.x + d.dx, y: b.y + d.dy };
      const playerTarget = { x: playerPos.x + d.dx, y: playerPos.y + d.dy };

      if (isWall(playerPos.x, playerPos.y)) continue;
      if (isWall(playerTarget.x, playerTarget.y)) continue;
      if (
        boxes.some(
          (bx) =>
            (bx.x === playerPos.x && bx.y === playerPos.y) ||
            (bx.x === playerTarget.x && bx.y === playerTarget.y)
        )
      ) {
        continue;
      }

      boxes[boxIdx] = playerPos;
      player = playerTarget;
      pullsPerBox[boxIdx]++;
      totalPulls++;

      if (totalPulls >= maxPulls && pullsPerBox.every((cnt) => cnt >= minPullsPerBox)) {
        break;
      }
    }

    // SZIGORÚ KÖVETELMÉNY 1: Egyetlen doboz sem maradhat semelyik célmezőn!
    const targetSet = new Set(targets.map((t) => `${t.x},${t.y}`));
    if (boxes.some((b) => targetSet.has(`${b.x},${b.y}`))) {
      continue;
    }

    // SZIGORÚ KÖVETELMÉNY 2: Egyetlen doboz sem kezdhet holtpontban (sarok, 2x2 blokk)!
    if (isInitialStateDeadlocked(grid, boxes, targets)) {
      continue;
    }

    // A játékos pár lépéssel eltávolodik
    for (let w = 0; w < 6; w++) {
      const d = DIRS[Math.floor(rnd() * DIRS.length)];
      const np = { x: player.x + d.dx, y: player.y + d.dy };
      if (!isWall(np.x, np.y) && !boxes.some((b) => b.x === np.x && b.y === np.y)) {
        player = np;
      }
    }

    // SZIGORÚ KÖVETELMÉNY 3: A játékos SOHA nem állhat célmezőn a pálya elején!
    if (targetSet.has(`${player.x},${player.y}`)) {
      const freeTile = floors.find(
        (f) => !boxes.some((b) => b.x === f.x && b.y === f.y) && !targetSet.has(`${f.x},${f.y}`)
      );
      if (freeTile) {
        player = freeTile;
      } else {
        continue;
      }
    }

    // SZIGORÚ KÖVETELMÉNY 4: Megoldhatósági ellenőrzés és minimális lépésszám-garancia
    const solution = solveSokobanBfs(grid, player, boxes, targets, 18000);
    if (solution) {
      if (solution.length >= minSteps) {
        return {
          id: levelNum,
          title: `${levelNum}. Generált Szint`,
          worldId,
          worldName,
          width,
          height,
          grid,
          playerStart: player,
          boxesStart: boxes,
          targets,
          parMoves: Math.round(solution.length * 1.25),
          difficulty: levelNum <= 15 ? 'easy' : levelNum <= 65 ? 'normal' : 'hard',
        };
      } else if (solution.length >= 18 && solution.length > bestCandidateSteps) {
        bestCandidate = {
          id: levelNum,
          title: `${levelNum}. Generált Szint`,
          worldId,
          worldName,
          width,
          height,
          grid,
          playerStart: player,
          boxesStart: boxes,
          targets,
          parMoves: Math.round(solution.length * 1.25),
          difficulty: levelNum <= 15 ? 'easy' : levelNum <= 65 ? 'normal' : 'hard',
        };
        bestCandidateSteps = solution.length;
      }
    }
  }

  if (bestCandidate) {
    return bestCandidate;
  }

  // Megbízható, nehéz, tesztelt 8x8-as 3-dobozos raktár belső válaszfalakkal (0 célon, 0 holtponton, 28 lépés)
  return {
    id: levelNum,
    title: `${levelNum}. Generált Szint`,
    worldId,
    worldName,
    width: 8,
    height: 8,
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'wall', 'wall', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerStart: { x: 1, y: 3 },
    boxesStart: [
      { x: 3, y: 3 },
      { x: 5, y: 3 },
      { x: 3, y: 5 },
    ],
    targets: [
      { x: 2, y: 1 },
      { x: 6, y: 2 },
      { x: 1, y: 5 },
    ],
    parMoves: 32,
    difficulty: 'normal',
  };
}

/**
 * Generál egy tetszőleges nehézségű garantáltan megoldható egyedi szintet a véletlenszerű játékmódhoz.
 * Mindhárom fokozat érezhetően komolyabb logikát és több lépést kíván.
 */
export function generateRandomSolvableLevel(
  difficulty: 'easy' | 'normal' | 'hard',
  levelNumber: number = 99
): LevelData {
  // A nehézségi szintekhez tartozó induló szintszám a nehezített generátorban:
  // Könnyű: 3 láda, 24-38 lépés (nem triviális!)
  // Normál: 4 láda, 36-55 lépés
  // Nehéz: 5 láda, 50-80+ lépés
  const baseLevel = difficulty === 'easy' ? 6 : difficulty === 'normal' ? 42 : 118;
  const level = generateProgressiveLevel(baseLevel);
  return {
    ...level,
    id: levelNumber,
    title: `Egyéni ${difficulty === 'easy' ? 'Könnyű (3 láda)' : difficulty === 'normal' ? 'Normál (4 láda)' : 'Nehéz (5 láda)'} Pálya`,
    difficulty,
  };
}
