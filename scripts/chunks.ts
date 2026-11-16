import { system, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
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
const LIMIT = 4096;
const CARDINALS: readonly [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function runChunkScan() {
  let budget = 8;
  let requirementBudget = 8;
  const processed = new Set<string>();
  const requirementsProcessed = new Set<string>();
  for (const snapshot of getPlayers2D()) {
    const { player, dimension, dimensionId, x: px, y: py, z: pz, cx, cz } = snapshot;
    const lookupY = lookupPlaneY(dimensionId);
    const ensure = (x: number, z: number) => {
      if (hasCellRecord(dimensionId, x, z)) return;
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
        if (processed.has(key) || isCellCompleted(dimensionId, x, z) || !hasCellRecord(dimensionId, x, z)) continue;
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
        if (!hasCellRecord(dimensionId, x, z)) continue;
        const key = cellKey(dimensionId, x, z);
        if (!isCellCompleted(dimensionId, x, z)) {
          if (Math.abs(x * 16 + 8 - px) <= 24 && Math.abs(z * 16 + 8 - pz) <= 24 && !requirementsProcessed.has(key)) {
            const hasRequirement = getChunkRequirement(dimensionId, x, z) !== undefined;
            if (hasRequirement || requirementBudget > 0) {
              requirementsProcessed.add(key);
              const result = ensureChunkRequirement(dimension, x, z);
              if (!hasRequirement && result !== "skipped" && result !== "deferred") requirementBudget--;
              else if (result === "deferred" && !hasRequirement) requirementBudget--;
            }
          }
          const neighborsDone = CARDINALS.every(([dx, dz]) => hasCellRecord(dimensionId, x + dx, z + dz));
          const reqReady = isOpenCell(dimensionId, x, z) || getChunkRequirement(dimensionId, x, z) !== undefined;
          if (neighborsDone && reqReady) markCellCompleted(dimensionId, x, z);
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
