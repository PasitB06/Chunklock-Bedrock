import { Entity, system, Vector3, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
import { segmentTouchesLocked } from "./regions.js";

// Best-effort prevention: stable API 2.0 has no cancellable pre-projectile-hit event.
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

export function startProjectiles() {
  world.afterEvents.entitySpawn.subscribe((event) => adopt(event.entity));
  system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
      for (const entity of player.dimension.getEntities({ location: player.location, maxDistance: 64 })) adopt(entity);
    }
  }, 20);
  system.runInterval(() => {
    for (const [id, entry] of tracked) {
      try {
        const entity = entry.entity;
        const current = entity.location;
        const velocity = entity.getVelocity();
        const next = { x: current.x + velocity.x, z: current.z + velocity.z };
        const locked = (x: number, z: number) => !isOpenCell(entity.dimension.id, x, z);
        if (segmentTouchesLocked(entry.previous, current, locked) || segmentTouchesLocked(current, next, locked)) {
          entity.remove();
          tracked.delete(id);
        } else {
          entry.previous = current;
          entry.idle = Math.hypot(velocity.x, velocity.y, velocity.z) < 0.001 ? entry.idle + 1 : 0;
          if (entry.idle >= 5) tracked.delete(id);
          if (!entity.dimension.getPlayers({ location: current, maxDistance: 96 }).length) tracked.delete(id);
        }
      } catch {
        tracked.delete(id);
      }
    }
  }, 1);
}
