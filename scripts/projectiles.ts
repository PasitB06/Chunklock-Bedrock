import { Entity, system, Vector3, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
import { segmentTouchesLocked } from "./regions.js";
import { getPlayers2D } from "./state-cache.js";

const MAX_PLAYER_DISTANCE_SQ = 96 * 96;

// Best-effort prevention: stable API 2.6 has no cancellable pre-projectile-hit event.
const tracked = new Map<string, { entity: Entity; previous: Vector3; idle: number }>();
function adopt(entity: Entity) {
  try {
    if (!entity.getComponent("minecraft:projectile")) return;
    if (tracked.has(entity.id)) return;
    if (tracked.size >= 256) {
      // Capacity is a work limit, not permission to delete a safe projectile.
      return;
    }
    tracked.set(entity.id, { entity, previous: entity.location, idle: 0 });
  } catch {
    /* Entity may have despawned before adoption. */
  }
}

function hasNearbyPlayer2D(dimensionId: string, x: number, z: number): boolean {
  for (const snapshot of getPlayers2D()) {
    if (snapshot.dimensionId !== dimensionId) continue;
    const dx = snapshot.x - x;
    const dz = snapshot.z - z;
    if (dx * dx + dz * dz <= MAX_PLAYER_DISTANCE_SQ) return true;
  }
  return false;
}

export function startProjectiles() {
  world.afterEvents.entitySpawn.subscribe((event) => adopt(event.entity));
  system.runInterval(() => {
    const scannedCenters: { dimensionId: string; x: number; z: number }[] = [];
    for (const snapshot of getPlayers2D()) {
      const covered = scannedCenters.some(
        (center) =>
          center.dimensionId === snapshot.dimensionId &&
          (center.x - snapshot.x) ** 2 + (center.z - snapshot.z) ** 2 <= 32 * 32
      );
      if (covered) continue;
      scannedCenters.push({ dimensionId: snapshot.dimensionId, x: snapshot.x, z: snapshot.z });
      for (const entity of snapshot.dimension.getEntities({
        location: { x: snapshot.x, y: snapshot.y, z: snapshot.z },
        maxDistance: 64,
      })) {
        adopt(entity);
      }
    }
  }, 40);
  system.runInterval(() => {
    for (const [id, entry] of tracked) {
      try {
        const entity = entry.entity;
        const current = entity.location;
        const velocity = entity.getVelocity();
        const dimensionId = entity.dimension.id;
        const locked = (x: number, z: number) => !isOpenCell(dimensionId, x, z);
        if (segmentTouchesLocked(entry.previous, current, locked)) {
          entity.remove();
          tracked.delete(id);
        } else {
          entry.previous = current;
          entry.idle = Math.hypot(velocity.x, velocity.y, velocity.z) < 0.001 ? entry.idle + 1 : 0;
          if (entry.idle >= 5 || !hasNearbyPlayer2D(dimensionId, current.x, current.z)) {
            tracked.delete(id);
          }
        }
      } catch {
        tracked.delete(id);
      }
    }
  }, 1);
}
