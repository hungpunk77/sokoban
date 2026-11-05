import { LevelData } from '../types/game';
import { generateProgressiveLevel } from './generator';

// Cache for generated levels during the active session
const levelCache = new Map<number, LevelData>();

export interface LevelMetadataInfo {
  id: number;
  numBoxes: number;
  width: number;
  height: number;
  parMoves: number;
}

/**
 * Azonnal visszadja a szint kártyaadatait (dobozok száma, méret, par)
 * anélkül, hogy lefoglalná a processzort a menü böngészése közben.
 */
export function getLevelMetadata(id: number): LevelMetadataInfo {
  if (levelCache.has(id)) {
    const l = levelCache.get(id)!;
    return {
      id: l.id,
      numBoxes: l.boxesStart.length,
      width: l.width,
      height: l.height,
      parMoves: l.parMoves,
    };
  }
  const numBoxes = id <= 20 ? 3 : id <= 75 ? 4 : id <= 125 ? 5 : 6;
  const size = id <= 25 ? 8 : id <= 90 ? 9 : 10;
  const parMoves = Math.round(28 + (id / 150) * 60);
  return { id, numBoxes, width: size, height: size, parMoves };
}

/**
 * Lekéri az induló szintet dinamikus generálással
 */
export function getInitialLevel(): LevelData {
  return getLevelById(1);
}

/**
 * Lekéri a megadott sorszámú generált pályát.
 * Ha még nem készült el, azonnal legyárt egy garantáltan megoldható,
 * fokozatosan nehezedő pályát.
 */
export function getLevelById(id: number): LevelData {
  if (levelCache.has(id)) {
    return levelCache.get(id)!;
  }
  const generated = generateProgressiveLevel(id);
  levelCache.set(id, generated);
  return generated;
}

/**
 * Újragenerál egy vadonatúj, garantáltan megoldható pályát az adott szinthez.
 */
export function regenerateLevel(id: number): LevelData {
  const generated = generateProgressiveLevel(id);
  levelCache.set(id, generated);
  return generated;
}

/**
 * Előre legenerál egy adag szintet (pl. a pályaválasztóhoz)
 */
export function getPreloadedLevels(count: number = 30): LevelData[] {
  const list: LevelData[] = [];
  for (let i = 1; i <= count; i++) {
    list.push(getLevelById(i));
  }
  return list;
}

export function getTotalLevels(): number {
  return 150; // 30 világ x 5 pálya = 150 fokozatosan nehezedő, garantáltan megoldható szint
}
