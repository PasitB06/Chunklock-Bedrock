import { system, world } from "@minecraft/server";
import { ensureChunkRequirement, requirementPropertyId } from "./requirements.js";

// Prototype counterparts: init_chunk_marker, init_neighbors, tick_chunk_marker.
const PREFIX = "chunklock:cell:";
const LIMIT = 4096;
let total = 0;

export function startChunks() {
  total = world.getDynamicPropertyIds().filter((id) => id.startsWith(PREFIX)).length;
  system.runInterval(() => {
    let budget = 8;
    let requirementBudget = 8;
    const processed = new Set<string>();
    const requirementsProcessed = new Set<string>();
    for (const player of world.getAllPlayers()) {
      const dimension = player.dimension;
      const cx = Math.floor(player.location.x / 16);
      const cz = Math.floor(player.location.z / 16);
      const key = (x: number, z: number) => `${PREFIX}${dimension.id}:${x}:${z}`;
      const ensure = (x: number, z: number) => {
        const id = key(x, z);
        if (world.getDynamicProperty(id) !== undefined) return;
        if (budget <= 0 || total >= LIMIT) return;
        try {
          if (!dimension.getBlock({ x: x * 16 + 8, y: Math.floor(player.location.y), z: z * 16 + 8 })) return;
        } catch {
          return;
        }
        world.setDynamicProperty(id, 1);
        budget--;
        total++;
      };
      ensure(cx, cz);
      // Snapshot existing nearby records before creating neighbors.
      const seeds: number[][] = [];
      for (let x = cx - 2; x <= cx + 2; x++) {
        for (let z = cz - 2; z <= cz + 2; z++) {
          if (processed.has(key(x, z)) || world.getDynamicProperty(key(x, z)) === undefined) continue;
          if (Math.abs(x * 16 + 8 - player.location.x) > 24 || Math.abs(z * 16 + 8 - player.location.z) > 24) continue;
          seeds.push([x, z]);
          processed.add(key(x, z));
        }
      }
      for (const [x, z] of seeds) {
        for (const [dx, dz] of [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ])
          ensure(x + dx, z + dz);
      }
      player.onScreenDisplay.setActionBar(
        `[Chunklock prototype] Chunk ${cx}, ${cz} | Center ${cx * 16 + 8}, ${cz * 16 + 8} | Records ${total}/${LIMIT}`
      );
      for (let x = cx - 2; x <= cx + 2; x++) {
        for (let z = cz - 2; z <= cz + 2; z++) {
          if (world.getDynamicProperty(key(x, z)) === undefined) continue;
          if (Math.abs(x * 16 + 8 - player.location.x) <= 24 && Math.abs(z * 16 + 8 - player.location.z) <= 24) {
            const requirementId = requirementPropertyId(dimension.id, x, z);
            if (!requirementsProcessed.has(requirementId)) {
              const hasRequirement = world.getDynamicProperty(requirementId) !== undefined;
              if (hasRequirement || requirementBudget > 0) {
                requirementsProcessed.add(requirementId);
                const result = ensureChunkRequirement(dimension, x, z);
                if (!hasRequirement && result !== "skipped") requirementBudget--;
              }
            }
          }
          try {
            dimension.spawnParticle("minecraft:basic_flame_particle", {
              x: x * 16 + 8,
              y: player.location.y + 1,
              z: z * 16 + 8,
            });
          } catch {
            /* Debug presentation may be unavailable in unloaded terrain. */
          }
        }
      }
    }
  }, 10);
}
