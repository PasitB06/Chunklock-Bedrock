import { Direction, Entity, world } from "@minecraft/server";
import { isLocked, isOpenCell } from "./access.js";

// Positive horizontal hitbox overlap makes a border-straddling mob accessible.
function hasOpenHitbox(target: Entity): boolean {
  const dimension = target.dimension.id;
  try {
    const { center, extent } = target.getAABB();
    const minX = center.x - Math.abs(extent.x),
      maxX = center.x + Math.abs(extent.x);
    const minZ = center.z - Math.abs(extent.z),
      maxZ = center.z + Math.abs(extent.z);
    if (![minX, maxX, minZ, maxZ].every(Number.isFinite) || maxX <= minX || maxZ <= minZ) {
      return !isLocked(dimension, target.location.x, target.location.z);
    }
    const x0 = Math.floor(minX / 16),
      x1 = Math.ceil(maxX / 16) - 1;
    const z0 = Math.floor(minZ / 16),
      z1 = Math.ceil(maxZ / 16) - 1;
    // Bound work for unusually large custom entities; fail closed beyond the budget.
    if ((x1 - x0 + 1) * (z1 - z0 + 1) > 64) return false;
    for (let x = x0; x <= x1; x++) {
      for (let z = z0; z <= z1; z++) if (isOpenCell(dimension, x, z)) return true;
    }
    return false;
  } catch {
    // Missing/unavailable collision bounds retain the previous position-based rule.
    return !isLocked(dimension, target.location.x, target.location.z);
  }
}

export function startProtection() {
  // Cancel at the damage boundary, including hits before projectile polling runs.
  world.beforeEvents.entityHurt.subscribe((event) => {
    const target = event.hurtEntity;
    // Visual helpers can be anchored inside solid terrain. They are never mobs.
    if (target.typeId === "chunklock:border_wall" || target.typeId === "chunklock:requirement_display") {
      event.cancel = true;
      return;
    }
    const source = event.damageSource;
    const attack =
      source.damagingEntity ||
      source.damagingProjectile ||
      source.cause === "entityAttack" ||
      source.cause === "projectile";
    if (attack && !hasOpenHitbox(target)) {
      event.cancel = true;
    }
  });
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { x, z } = event.block.location;
    if (isLocked(event.block.dimension.id, x, z)) {
      event.cancel = true;
    }
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { x, z } = event.block.location;
    let dx = 0,
      dz = 0;
    if (event.blockFace === Direction.East) dx = 1;
    if (event.blockFace === Direction.West) dx = -1;
    if (event.blockFace === Direction.South) dz = 1;
    if (event.blockFace === Direction.North) dz = -1;
    if (
      isLocked(event.block.dimension.id, x, z) ||
      (event.itemStack !== undefined && isLocked(event.block.dimension.id, x + dx, z + dz))
    ) {
      event.cancel = true;
    }
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId === "chunklock:requirement_display") return;
    const { x, z } = event.target.location;
    if (isLocked(event.target.dimension.id, x, z)) {
      event.cancel = true;
    }
  });
  world.beforeEvents.explosion.subscribe((event) => {
    event.setImpactedBlocks(
      event.getImpactedBlocks().filter((block) => !isLocked(block.dimension.id, block.location.x, block.location.z))
    );
  });
}
