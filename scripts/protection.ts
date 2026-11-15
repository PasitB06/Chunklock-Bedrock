import { Direction, Player, system, world } from "@minecraft/server";
import { isLocked } from "./access.js";

const notices = new Map<string, number>();
function notify(player: Player) {
  if (system.currentTick - (notices.get(player.id) ?? -100) < 30) return;
  notices.set(player.id, system.currentTick);
  system.run(() => {
    try {
      player.sendMessage("[Chunklock] This chunk is locked.");
    } catch {
      /* Player disconnected. */
    }
  });
}

export function startProtection() {
  // Cancel at the damage boundary, including hits before projectile polling runs.
  world.beforeEvents.entityHurt.subscribe((event) => {
    const target = event.hurtEntity;
    const source = event.damageSource;
    const attack =
      source.damagingEntity ||
      source.damagingProjectile ||
      source.cause === "entityAttack" ||
      source.cause === "projectile";
    if (attack && isLocked(target.dimension.id, target.location.x, target.location.z)) {
      event.cancel = true;
    }
  });
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { x, z } = event.block.location;
    if (isLocked(event.block.dimension.id, x, z)) {
      event.cancel = true;
      notify(event.player);
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
      notify(event.player);
    }
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const { x, z } = event.target.location;
    if (isLocked(event.target.dimension.id, x, z)) {
      event.cancel = true;
      notify(event.player);
    }
  });
  world.beforeEvents.explosion.subscribe((event) => {
    event.setImpactedBlocks(
      event.getImpactedBlocks().filter((block) => !isLocked(block.dimension.id, block.location.x, block.location.z))
    );
  });
  world.afterEvents.playerLeave.subscribe((event) => notices.delete(event.playerId));
}
