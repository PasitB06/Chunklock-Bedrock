import { GameMode, Player, system, world } from "@minecraft/server";
import { hasOpenCardinalNeighbor, isOpenCell } from "./access.js";
import {
  collectEndCrystalPositions,
  END_DIMENSION_ID,
  EndCrystalLookup,
  isCentralEndChunk,
  tryExemptCentralEndChunk,
} from "./end.js";
import { refreshActionNotice } from "./notices.js";
import { ensureChunkRequirement, getChunkRequirement } from "./requirements.js";
import {
  cellKey,
  ensureStateHydrated,
  getPlayers2D,
  hasCellRecord,
  isCellCompleted,
  isDebugEnabled,
  lookupPlaneY,
  markCellCompleted,
  markCellRecorded,
  totalRecordedCells,
} from "./state-cache.js";

// Prototype counterparts: init_chunk_marker, init_neighbors, tick_chunk_marker.
const PREFIX = "chunklock:cell:";
const LIMIT = 16384;
const CARDINALS: readonly [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function isSpectatorPlayer(player: Player): boolean {
  try {
    return typeof GameMode !== "undefined" && player.getGameMode?.() === GameMode.Spectator;
  } catch {
    return false;
  }
}

function hasVisibleOpenBorder(dimensionId: string, cx: number, cz: number, px: number, pz: number): boolean {
  for (const [dx, dz] of CARDINALS) {
    if (!isOpenCell(dimensionId, cx + dx, cz + dz)) continue;
    const edgeX = dx === 0 ? cx * 16 + 8 : (cx + (dx > 0 ? 1 : 0)) * 16;
    const edgeZ = dz === 0 ? cz * 16 + 8 : (cz + (dz > 0 ? 1 : 0)) * 16;
    if (Math.abs(edgeX - px) <= 24 && Math.abs(edgeZ - pz) <= 24) return true;
  }
  return false;
}

export function runChunkScan() {
  let budget = 8;
  let requirementBudget = 8;
  const processed = new Set<string>();
  const requirementsProcessed = new Set<string>();
  let endCrystalLookup: EndCrystalLookup | undefined;
  for (const snapshot of getPlayers2D()) {
    const { player, dimension, dimensionId, x: px, y: py, z: pz, cx, cz } = snapshot;
    const spectator = isSpectatorPlayer(player);
    const lookupY = lookupPlaneY(dimensionId);
    const ensure = (x: number, z: number) => {
      if (hasCellRecord(dimensionId, x, z)) return;
      if (!isOpenCell(dimensionId, x, z) && !hasOpenCardinalNeighbor(dimensionId, x, z)) return;
      if (budget <= 0 || totalRecordedCells() >= LIMIT) return;
      try {
        if (!dimension.getBlock({ x: x * 16 + 8, y: lookupY, z: z * 16 + 8 })) return;
      } catch {
        return;
      }
      world.setDynamicProperty(`${PREFIX}${dimensionId}:${x}:${z}`, 1);
      markCellRecorded(dimensionId, x, z);
      budget--;
    };

    ensure(cx, cz);
    const seeds: [number, number][] = [];
    for (let x = cx - 2; x <= cx + 2; x++) {
      for (let z = cz - 2; z <= cz + 2; z++) {
        const key = cellKey(dimensionId, x, z);
        if (processed.has(key) || isCellCompleted(dimensionId, x, z) || !isOpenCell(dimensionId, x, z)) continue;
        if (Math.abs(x * 16 + 8 - px) > 24 || Math.abs(z * 16 + 8 - pz) > 24) continue;
        seeds.push([x, z]);
        processed.add(key);
      }
    }
    for (const [x, z] of seeds) {
      for (const [dx, dz] of CARDINALS) ensure(x + dx, z + dz);
    }

    const noticeActive = refreshActionNotice(player);
    if (isDebugEnabled() && !noticeActive) {
      player.onScreenDisplay.setActionBar(
        `[Chunklock prototype] Chunk ${cx}, ${cz} | Center ${cx * 16 + 8}, ${cz * 16 + 8} | Records ${totalRecordedCells()}/${LIMIT}`
      );
    }

    for (let x = cx - 2; x <= cx + 2; x++) {
      for (let z = cz - 2; z <= cz + 2; z++) {
        const isOpen = isOpenCell(dimensionId, x, z);
        if (!isOpen && !hasCellRecord(dimensionId, x, z)) continue;
        const key = cellKey(dimensionId, x, z);
        if (!isCellCompleted(dimensionId, x, z)) {
          let endDeferred = false;
          if (!isOpen && hasVisibleOpenBorder(dimensionId, x, z, px, pz) && !requirementsProcessed.has(key)) {
            const hasRequirement = getChunkRequirement(dimensionId, x, z) !== undefined;
            if (!hasRequirement && dimensionId === END_DIMENSION_ID && isCentralEndChunk(x, z)) {
              endCrystalLookup ??= collectEndCrystalPositions(dimension);
              endDeferred = tryExemptCentralEndChunk(dimension, x, z, endCrystalLookup) === "deferred";
            }
            const canRollNew = !spectator && (hasRequirement || requirementBudget > 0);
            if (!endDeferred && !isOpenCell(dimensionId, x, z) && (hasRequirement || canRollNew)) {
              requirementsProcessed.add(key);
              const result = ensureChunkRequirement(dimension, x, z);
              if (!hasRequirement && result !== "skipped" && result !== "deferred") requirementBudget--;
              else if (result === "deferred" && !hasRequirement) requirementBudget--;
            }
          }
          const neighborsDone = CARDINALS.every(
            ([dx, dz]) => isOpenCell(dimensionId, x + dx, z + dz) || hasCellRecord(dimensionId, x + dx, z + dz)
          );
          const reqReady = isOpenCell(dimensionId, x, z) || getChunkRequirement(dimensionId, x, z) !== undefined;
          if (!endDeferred && neighborsDone && reqReady) markCellCompleted(dimensionId, x, z);
        }
        if (isDebugEnabled()) {
          try {
            dimension.spawnParticle("minecraft:basic_flame_particle", {
              x: x * 16 + 8,
              y: py + 1,
              z: z * 16 + 8,
            });
          } catch {
            /* Debug presentation may be unavailable in unloaded terrain. */
          }
        }
      }
    }
  }
}

export function startChunks() {
  ensureStateHydrated();
  system.runInterval(runChunkScan, 10);
}
