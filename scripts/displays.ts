import { Dimension, Entity, system, world } from "@minecraft/server";
import { displayIconIndex, displayShape } from "./display-icons-data.js";
import { isOpenCell } from "./access.js";
import { getChunkRequirement, formatItemDisplayName } from "./requirements.js";
import { collectUnionOpenCells, WallEdge, wallEdges } from "./regions.js";
import { getPlayers2D, Player2D } from "./state-cache.js";

const TYPE = "chunklock:requirement_display";
const MAX_DISPLAYS = 110;
const MAX_DISPLAYS_PER_PLAYER = 10;
const SPAWN_BUDGET = 8;
const VIEW_DISTANCE_SQ = 24 * 24;
const OPEN_SIDE_OFFSET = 0.01;
const DISPLAY_ELEVATION = -0.15;
const Y_DEADBAND = 0.2;
const dimensions = ["overworld", "nether", "the_end"];
let failedAt = -Infinity;
let started = false;

type DisplayCandidate = {
  dimension: Dimension;
  key: string;
  lockedX: number;
  lockedZ: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  distanceSq: number;
  rank: number;
  itemId: string;
  remainingCost: number;
};

const displayState = new WeakMap<Entity, { key: string; icon: number; shape: number; yaw: number }>();

const candidateKey = (edge: WallEdge) => `plaque3:${edge.key}:${edge.lockedCell.x}:${edge.lockedCell.z}`;

function positionOnOpenSide(edge: WallEdge): { x: number; z: number } {
  if (edge.side === "north") return { x: edge.x, z: edge.z + OPEN_SIDE_OFFSET };
  if (edge.side === "east") return { x: edge.x - OPEN_SIDE_OFFSET, z: edge.z };
  if (edge.side === "south") return { x: edge.x, z: edge.z - OPEN_SIDE_OFFSET };
  return { x: edge.x + OPEN_SIDE_OFFSET, z: edge.z };
}

function openSideRotation(edge: WallEdge): number {
  if (edge.side === "north") return 0;
  if (edge.side === "east") return 90;
  if (edge.side === "south") return 180;
  return 270;
}

function updateDisplay(entity: Entity, candidate: DisplayCandidate) {
  const prev = displayState.get(entity);
  if (!prev || prev.key !== candidate.key) {
    entity.setDynamicProperty("chunklock:display_key", candidate.key);
    entity.setDynamicProperty("chunklock:display:cx", candidate.lockedX);
    entity.setDynamicProperty("chunklock:display:cz", candidate.lockedZ);
  }

  const label = `${formatItemDisplayName(candidate.itemId)}\n× ${candidate.remainingCost}`;
  if (entity.nameTag !== label) entity.nameTag = label;

  const icon = displayIconIndex(candidate.itemId);
  const shape = displayShape(candidate.itemId);
  if (!prev || prev.icon !== icon) entity.setProperty("chunklock:display_icon_v2", icon);
  if (!prev || prev.shape !== shape) entity.setProperty("chunklock:display_shape", shape);

  const current = entity.location;
  if (
    !prev ||
    Math.abs(current.x - candidate.x) > 0.01 ||
    Math.abs(current.z - candidate.z) > 0.01 ||
    Math.abs(current.y - candidate.y) > Y_DEADBAND
  ) {
    entity.teleport({ x: candidate.x, y: candidate.y, z: candidate.z });
  }

  if (!prev || prev.yaw !== candidate.rotation) {
    entity.setProperty?.("chunklock:display_yaw", candidate.rotation);
    entity.setRotation({ x: 0, y: candidate.rotation });
  }
  displayState.set(entity, { key: candidate.key, icon, shape, yaw: candidate.rotation });
}

function candidateForEdge(
  dimension: Dimension,
  edge: WallEdge,
  snapshot: Player2D,
  distanceSq: number
): DisplayCandidate | undefined {
  const requirement = getChunkRequirement(dimension.id, edge.lockedCell.x, edge.lockedCell.z);
  if (!requirement) return undefined;
  const position = positionOnOpenSide(edge);
  const minY = dimension.heightRange?.min ?? -64;
  const maxY = (dimension.heightRange?.max ?? 320) - 1;
  const y = Math.max(minY, Math.min(maxY, snapshot.headY + DISPLAY_ELEVATION));
  return {
    dimension,
    key: candidateKey(edge),
    lockedX: edge.lockedCell.x,
    lockedZ: edge.lockedCell.z,
    x: position.x,
    y,
    z: position.z,
    rotation: openSideRotation(edge),
    distanceSq,
    rank: 0,
    itemId: requirement.itemId,
    remainingCost: requirement.remainingCost,
  };
}

function reportFailure(error: unknown, players: readonly Player2D[]) {
  if (system.currentTick - failedAt < 200) return;
  console.warn(`[Chunklock] Could not create requirement display: ${error}`);
  for (const snapshot of players) {
    try {
      snapshot.player.sendMessage("[Chunklock] Requirement display failed. Check both packs and the Content Log.");
    } catch {
      /* The player may have left during the refresh. */
    }
  }
  failedAt = system.currentTick;
}

export function refreshRequirementDisplays() {
  const players = getPlayers2D();
  const grouped = new Map<string, Player2D[]>();
  for (const snapshot of players) {
    const list = grouped.get(snapshot.dimensionId);
    if (list) list.push(snapshot);
    else grouped.set(snapshot.dimensionId, [snapshot]);
  }

  const wantedByKey = new Map<string, DisplayCandidate>();
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
      2,
      (x, z) => isOpenCell(dimension.id, x, z)
    );
    const edges = wallEdges(cells, (x, z) => isOpenCell(dimension.id, x, z));
    for (const snapshot of localPlayers) {
      const perPlayer: DisplayCandidate[] = [];
      for (const edge of edges) {
        const dx = edge.x - snapshot.x;
        const dz = edge.z - snapshot.z;
        const distanceSq = dx * dx + dz * dz;
        if (distanceSq > VIEW_DISTANCE_SQ) continue;
        const candidate = candidateForEdge(dimension, edge, snapshot, distanceSq);
        if (candidate) perPlayer.push(candidate);
      }
      perPlayer.sort((a, b) => a.distanceSq - b.distanceSq);
      const limit = Math.min(perPlayer.length, MAX_DISPLAYS_PER_PLAYER);
      for (let rank = 0; rank < limit; rank++) {
        const candidate = perPlayer[rank];
        candidate.rank = rank;
        const previous = wantedByKey.get(candidate.key);
        if (!previous || candidate.distanceSq < previous.distanceSq) {
          wantedByKey.set(candidate.key, candidate);
        }
      }
    }
  }

  const allWanted = [...wantedByKey.values()]
    .sort((a, b) => a.rank - b.rank || a.distanceSq - b.distanceSq)
    .slice(0, MAX_DISPLAYS);
  const wantedByDim = new Map<string, Map<string, DisplayCandidate>>();
  for (const candidate of allWanted) {
    let map = wantedByDim.get(candidate.dimension.id);
    if (!map) {
      map = new Map();
      wantedByDim.set(candidate.dimension.id, map);
    }
    map.set(candidate.key, candidate);
  }

  let spawnBudget = SPAWN_BUDGET;
  let active = 0;
  const pending: DisplayCandidate[] = [];
  for (const [dimensionId, dimension] of loadedDimensions) {
    const wanted = wantedByDim.get(dimensionId) ?? new Map<string, DisplayCandidate>();
    const found = new Set<string>();
    let existing: Entity[];
    try {
      existing = dimension.getEntities({ type: TYPE });
    } catch {
      existing = [];
    }
    for (const entity of existing) {
      let key: unknown;
      try {
        key = entity.getDynamicProperty("chunklock:display_key");
      } catch {
        entity.remove();
        continue;
      }
      if (typeof key !== "string" || !wanted.has(key) || found.has(key) || active >= MAX_DISPLAYS) {
        entity.remove();
        continue;
      }
      try {
        updateDisplay(entity, wanted.get(key)!);
        found.add(key);
        active++;
      } catch (error) {
        entity.remove();
        reportFailure(error, players);
      }
    }
    for (const [key, candidate] of wanted) if (!found.has(key)) pending.push(candidate);
  }

  pending.sort((a, b) => a.rank - b.rank || a.distanceSq - b.distanceSq);
  for (const candidate of pending) {
    if (spawnBudget <= 0 || active >= MAX_DISPLAYS) break;
    let entity: Entity | undefined;
    try {
      entity = candidate.dimension.spawnEntity(TYPE, {
        x: candidate.x,
        y: candidate.y,
        z: candidate.z,
      });
      updateDisplay(entity, candidate);
      active++;
      spawnBudget--;
    } catch (error) {
      if (entity) entity.remove();
      reportFailure(error, players);
      break;
    }
  }
}

export function startRequirementDisplays() {
  if (started) return;
  started = true;
  refreshRequirementDisplays();
  system.runInterval(refreshRequirementDisplays, 10);
}
