import { Dimension, Entity, system, world } from "@minecraft/server";
import { isOpenCell, seedPlayer } from "./access.js";
import { collectUnionOpenCells, wallEdges } from "./regions.js";
import { getPlayers2D, Player2D } from "./state-cache.js";

const TYPE = "chunklock:border_wall";
const MAX_WALLS = 264;
const SPAWN_BUDGET = 16;
const WALL_CHUNK_RADIUS = 4;
const MAX_WALL_DISTANCE_SQ = 68 * 68;
const ANCHOR_STEP = 64;
const dimensions = ["overworld", "nether", "the_end"];
let failedAt = -Infinity;
let started = false;

type WallCandidate = {
  dimension: Dimension;
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  distanceSq: number;
  ownerId: string;
  rank: number;
};

const wallState = new WeakMap<Entity, { x: number; y: number; z: number; rotation: number }>();

function anchorAltitude(dimension: Dimension, playerY: number): number {
  const min = dimension.heightRange?.min ?? -64;
  const max = (dimension.heightRange?.max ?? 320) - 1;
  const snapped = Math.round(playerY / ANCHOR_STEP) * ANCHOR_STEP;
  return Math.max(min, Math.min(max, snapped));
}

function alignWall(entity: Entity, wall: { x: number; y: number; z: number; rotation: number }) {
  const velocity = entity.getVelocity?.();
  if (velocity && (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0)) entity.clearVelocity();
  const current = entity.location;
  if (
    current &&
    (Math.abs(current.x - wall.x) > 0.01 || Math.abs(current.y - wall.y) > 0.01 || Math.abs(current.z - wall.z) > 0.01)
  ) {
    entity.teleport({ x: wall.x, y: wall.y, z: wall.z }, { checkForBlocks: false, keepVelocity: false });
  }
  const previous = wallState.get(entity);
  if (!previous || previous.rotation !== wall.rotation) {
    entity.setProperty("chunklock:wall_yaw", wall.rotation);
    entity.setRotation({ x: 0, y: 0 });
  }
  wallState.set(entity, { x: wall.x, y: wall.y, z: wall.z, rotation: wall.rotation });
}

function assignFairRanks(candidates: WallCandidate[]) {
  const byOwner = new Map<string, WallCandidate[]>();
  for (const candidate of candidates) {
    const list = byOwner.get(candidate.ownerId);
    if (list) list.push(candidate);
    else byOwner.set(candidate.ownerId, [candidate]);
  }
  for (const list of byOwner.values()) {
    list.sort((a, b) => a.distanceSq - b.distanceSq);
    for (let index = 0; index < list.length; index++) list[index].rank = index;
  }
}

export function refreshWalls() {
  const players = getPlayers2D();
  const grouped = new Map<string, Player2D[]>();
  for (const snapshot of players) {
    seedPlayer(snapshot.player);
    const list = grouped.get(snapshot.dimensionId);
    if (list) list.push(snapshot);
    else grouped.set(snapshot.dimensionId, [snapshot]);
  }

  const allWanted: WallCandidate[] = [];
  const loadedDimensions = new Map<string, Dimension>();
  for (const name of dimensions) {
    let dimension: Dimension;
    try {
      dimension = world.getDimension(name);
    } catch {
      continue;
    }
    loadedDimensions.set(dimension.id, dimension);
    const localPlayers = grouped.get(dimension.id) ?? [];
    if (localPlayers.length === 0) continue;

    const cells = collectUnionOpenCells(
      localPlayers.map((p) => ({ x: p.cx, z: p.cz })),
      WALL_CHUNK_RADIUS,
      (x, z) => isOpenCell(dimension.id, x, z)
    );
    for (const edge of wallEdges(cells, (x, z) => isOpenCell(dimension.id, x, z))) {
      let nearest: Player2D | undefined;
      let minDistanceSq = MAX_WALL_DISTANCE_SQ;
      for (const snapshot of localPlayers) {
        const dx = edge.x - snapshot.x;
        const dz = edge.z - snapshot.z;
        const distanceSq = dx * dx + dz * dz;
        if (distanceSq <= minDistanceSq) {
          minDistanceSq = distanceSq;
          nearest = snapshot;
        }
      }
      if (!nearest) continue;
      allWanted.push({
        dimension,
        id: `v5:${edge.key}`,
        x: edge.x,
        y: anchorAltitude(dimension, nearest.y),
        z: edge.z,
        rotation: edge.axis === "x" ? 0 : 90,
        distanceSq: minDistanceSq,
        ownerId: nearest.player.id ?? nearest.dimensionId,
        rank: 0,
      });
    }
  }

  assignFairRanks(allWanted);
  allWanted.sort((a, b) => a.rank - b.rank || a.distanceSq - b.distanceSq);
  const selected = allWanted.slice(0, MAX_WALLS);

  const wantedByDim = new Map<string, Map<string, WallCandidate>>();
  for (const wall of selected) {
    let map = wantedByDim.get(wall.dimension.id);
    if (!map) {
      map = new Map();
      wantedByDim.set(wall.dimension.id, map);
    }
    map.set(wall.id, wall);
  }

  let spawnBudget = SPAWN_BUDGET;
  let active = 0;
  const pending: WallCandidate[] = [];
  for (const [dimensionId, dimension] of loadedDimensions) {
    const wanted = wantedByDim.get(dimensionId) ?? new Map<string, WallCandidate>();
    const found = new Set<string>();
    for (const entity of dimension.getEntities({ type: TYPE })) {
      const id = entity.getDynamicProperty("chunklock:wall_key");
      if (typeof id !== "string" || !wanted.has(id) || found.has(id) || active >= MAX_WALLS) {
        entity.remove();
      } else {
        alignWall(entity, wanted.get(id)!);
        found.add(id);
        active++;
      }
    }
    for (const [id, wall] of wanted) if (!found.has(id)) pending.push(wall);
  }

  pending.sort((a, b) => a.rank - b.rank || a.distanceSq - b.distanceSq);
  for (const wall of pending) {
    if (spawnBudget <= 0 || active >= MAX_WALLS) break;
    let entity: Entity | undefined;
    try {
      entity = wall.dimension.spawnEntity(TYPE, { x: wall.x, y: wall.y, z: wall.z });
      alignWall(entity, wall);
      entity.setDynamicProperty("chunklock:wall_key", wall.id);
      active++;
      spawnBudget--;
    } catch (error) {
      if (entity) entity.remove();
      if (
        error instanceof Error &&
        (error.name === "LocationOutOfWorldBoundariesError" ||
          error.name === "LocationInUnloadedChunkError" ||
          error.name === "UnloadedChunksError")
      ) {
        continue;
      }
      // Resource/behavior load failures must be visible, rather than silently hidden.
      if (system.currentTick - failedAt >= 200) {
        console.warn(`[Chunklock] Could not create border wall: ${error}`);
        for (const snapshot of players)
          snapshot.player.sendMessage("Wall failed to load. Check both packs and the Content Log.");
        failedAt = system.currentTick;
      }
      break;
    }
  }
}

export function startWalls() {
  if (started) return;
  started = true;
  refreshWalls();
  system.runInterval(refreshWalls, 10);
}
