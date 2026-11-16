import { Dimension, Player, system, world } from "@minecraft/server";
import { chunkAt } from "./regions.js";

const OPEN_PREFIX = "chunklock:open:";
const CELL_PREFIX = "chunklock:cell:";
const REQ_PREFIX = "chunklock:req:";

export type Player2D = Readonly<{
  player: Player;
  dimension: Dimension;
  dimensionId: string;
  x: number;
  y: number;
  z: number;
  cx: number;
  cz: number;
  headY: number;
}>;

const openCells = new Set<string>();
const recordedCells = new Set<string>();
const completedCells = new Set<string>();
const seededPlayers = new Set<string>();
const cachedRequirements = new Map<string, unknown>();
const openCoordsByDimension = new Map<string, { cx: number; cz: number }[]>();

let hydratedWorld: unknown;
let hydrated = false;
let debugEnabled = false;
let cachedPlayersTick = -1;
let cachedPlayers: Player2D[] = [];

export const cellKey = (dimensionId: string, cx: number, cz: number) => `${dimensionId}:${cx}:${cz}`;

export function lookupPlaneY(dimensionId: string): number {
  const key = dimensionId.startsWith("minecraft:") ? dimensionId.slice("minecraft:".length) : dimensionId;
  return key === "overworld" ? 128 : 64;
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}

export function setDebugEnabled(enabled: boolean): void {
  debugEnabled = enabled;
}

function resetAllCaches() {
  openCells.clear();
  recordedCells.clear();
  completedCells.clear();
  seededPlayers.clear();
  cachedRequirements.clear();
  openCoordsByDimension.clear();
  cachedPlayersTick = -1;
  cachedPlayers = [];
  hydrated = false;
}

/**
 * Hydrate persistent chunk access, record, and requirement sets into memory once per world instance.
 * Partial test mocks without `world.getDynamicPropertyIds` stay unhydrated and read on demand.
 */
export function ensureStateHydrated(): boolean {
  if (hydratedWorld !== world) {
    resetAllCaches();
    hydratedWorld = world;
  }
  if (hydrated) return true;
  if (typeof world.getDynamicPropertyIds !== "function") return false;

  for (const id of world.getDynamicPropertyIds()) {
    if (id.startsWith(OPEN_PREFIX)) {
      if (world.getDynamicProperty(id) === true) openCells.add(id.slice(OPEN_PREFIX.length));
    } else if (id.startsWith(CELL_PREFIX)) {
      if (world.getDynamicProperty(id) !== undefined) recordedCells.add(id.slice(CELL_PREFIX.length));
    } else if (id.startsWith(REQ_PREFIX)) {
      const value = world.getDynamicProperty(id);
      if (typeof value === "string") {
        try {
          cachedRequirements.set(id.slice(REQ_PREFIX.length), JSON.parse(value));
        } catch {
          cachedRequirements.set(id.slice(REQ_PREFIX.length), null);
        }
      } else if (value !== undefined) {
        cachedRequirements.set(id.slice(REQ_PREFIX.length), null);
      }
    }
  }
  hydrated = true;
  return true;
}

export function invalidateStateCache(): void {
  resetAllCaches();
  hydratedWorld = undefined;
}

export function isOpenCached(dimensionId: string, cx: number, cz: number): boolean {
  const key = cellKey(dimensionId, cx, cz);
  if (ensureStateHydrated()) return openCells.has(key);
  if (openCells.has(key)) return true;
  const open = world.getDynamicProperty(`${OPEN_PREFIX}${key}`) === true;
  if (open) openCells.add(key);
  return open;
}

export function markOpenCached(dimensionId: string, cx: number, cz: number): void {
  ensureStateHydrated();
  openCells.add(cellKey(dimensionId, cx, cz));
  openCoordsByDimension.delete(dimensionId);
}

export function hasCellRecord(dimensionId: string, cx: number, cz: number): boolean {
  const key = cellKey(dimensionId, cx, cz);
  if (ensureStateHydrated()) return recordedCells.has(key);
  if (recordedCells.has(key)) return true;
  const exists = world.getDynamicProperty(`${CELL_PREFIX}${key}`) !== undefined;
  if (exists) recordedCells.add(key);
  return exists;
}

export function markCellRecorded(dimensionId: string, cx: number, cz: number): void {
  ensureStateHydrated();
  recordedCells.add(cellKey(dimensionId, cx, cz));
}

export function unmarkCellRecorded(dimensionId: string, cx: number, cz: number): void {
  const key = cellKey(dimensionId, cx, cz);
  recordedCells.delete(key);
  completedCells.delete(key);
}

export function totalRecordedCells(): number {
  if (ensureStateHydrated()) return recordedCells.size;
  return recordedCells.size;
}

export function isCellCompleted(dimensionId: string, cx: number, cz: number): boolean {
  return completedCells.has(cellKey(dimensionId, cx, cz));
}

export function markCellCompleted(dimensionId: string, cx: number, cz: number): void {
  completedCells.add(cellKey(dimensionId, cx, cz));
}

export function getRequirementCached<T>(
  dimensionId: string,
  cx: number,
  cz: number,
  validator: (value: unknown) => value is T
): { state: "present"; value: T } | { state: "corrupt" } | { state: "absent" } {
  const key = cellKey(dimensionId, cx, cz);
  if (ensureStateHydrated()) {
    if (!cachedRequirements.has(key)) return { state: "absent" };
    const entry = cachedRequirements.get(key);
    return validator(entry) ? { state: "present", value: entry } : { state: "corrupt" };
  }
  const stored = world.getDynamicProperty(`${REQ_PREFIX}${key}`);
  if (stored === undefined) return { state: "absent" };
  if (typeof stored !== "string") return { state: "corrupt" };
  try {
    const parsed: unknown = JSON.parse(stored);
    return validator(parsed) ? { state: "present", value: parsed } : { state: "corrupt" };
  } catch {
    return { state: "corrupt" };
  }
}

export function setRequirementCached(dimensionId: string, cx: number, cz: number, value: unknown): void {
  ensureStateHydrated();
  cachedRequirements.set(cellKey(dimensionId, cx, cz), value);
}

export function deleteRequirementCached(dimensionId: string, cx: number, cz: number): void {
  ensureStateHydrated();
  cachedRequirements.delete(cellKey(dimensionId, cx, cz));
}

export function isPlayerSeededCached(playerId: string, dimensionId: string): boolean {
  return seededPlayers.has(`${playerId}:${dimensionId}`);
}

export function markPlayerSeededCached(playerId: string, dimensionId: string): void {
  seededPlayers.add(`${playerId}:${dimensionId}`);
}

export function getOpenCellCoords(dimensionId: string): readonly { cx: number; cz: number }[] {
  if (!ensureStateHydrated()) {
    if (typeof world.getDynamicPropertyIds !== "function") return [];
  }
  const cached = openCoordsByDimension.get(dimensionId);
  if (cached) return cached;

  const prefix = `${dimensionId}:`;
  const coords: { cx: number; cz: number }[] = [];
  for (const key of openCells) {
    if (!key.startsWith(prefix)) continue;
    const [cx, cz] = key.slice(prefix.length).split(":").map(Number);
    if (Number.isInteger(cx) && Number.isInteger(cz)) coords.push({ cx, cz });
  }
  openCoordsByDimension.set(dimensionId, coords);
  return coords;
}

function readHeadY(player: Player, y: number): number {
  try {
    return player.getHeadLocation().y;
  } catch {
    return y + 1.62;
  }
}

/**
 * Capture a shared 2D coordinate snapshot for all connected players once per game tick.
 */
export function getPlayers2D(): readonly Player2D[] {
  const tick = typeof system?.currentTick === "number" ? system.currentTick : -1;
  if (tick >= 0 && tick === cachedPlayersTick) return cachedPlayers;

  let rawPlayers: Player[];
  try {
    rawPlayers = world.getAllPlayers();
  } catch {
    return [];
  }
  const snapshots: Player2D[] = [];
  for (const player of rawPlayers) {
    try {
      const dimension = player.dimension;
      const location = player.location;
      snapshots.push({
        player,
        dimension,
        dimensionId: dimension.id,
        x: location.x,
        y: location.y,
        z: location.z,
        cx: chunkAt(location.x),
        cz: chunkAt(location.z),
        headY: readHeadY(player, location.y),
      });
    } catch {
      /* Skip players in transitional states until the next tick. */
    }
  }
  if (tick >= 0) {
    cachedPlayersTick = tick;
    cachedPlayers = snapshots;
  }
  return snapshots;
}
