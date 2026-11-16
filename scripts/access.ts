import { Player, world } from "@minecraft/server";
import { chunkAt } from "./regions.js";
import { isOpenCached, isPlayerSeededCached, markOpenCached, markPlayerSeededCached } from "./state-cache.js";

const key = (dimension: string, x: number, z: number) => `chunklock:open:${dimension}:${x}:${z}`;
export const isOpenCell = (dimension: string, x: number, z: number) => isOpenCached(dimension, x, z);
export const isLocked = (dimension: string, x: number, z: number) => !isOpenCell(dimension, chunkAt(x), chunkAt(z));

function readCount(owner: Player | typeof world, propertyId: string): number {
  const value = owner.getDynamicProperty(propertyId);
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function counterUpdate(owner: Player | typeof world, propertyId: string): [() => void, () => void] {
  const previous = owner.getDynamicProperty(propertyId);
  const next = readCount(owner, propertyId) + 1;
  return [() => owner.setDynamicProperty(propertyId, next), () => owner.setDynamicProperty(propertyId, previous)];
}

export function unlockChunk(player: Player, dimension: string, x: number, z: number): boolean {
  const openProperty = key(dimension, x, z);
  if (isOpenCached(dimension, x, z)) return false;

  const updates = [
    counterUpdate(world, `chunklock:progress:unlocked:${dimension}`),
    counterUpdate(world, "chunklock:progress:unlocked:total"),
    counterUpdate(player, `chunklock:progress:player:unlocked:${dimension}`),
    counterUpdate(player, "chunklock:progress:player:unlocked:total"),
  ];
  const applied: (() => void)[] = [];
  try {
    for (const [apply, rollback] of updates) {
      apply();
      applied.push(rollback);
    }
    world.setDynamicProperty(openProperty, true);
    markOpenCached(dimension, x, z);
    return true;
  } catch (error) {
    for (const rollback of applied.reverse()) {
      try {
        rollback();
      } catch {
        // Preserve the original dynamic-property error for the payment handler.
      }
    }
    throw error;
  }
}

// Existing marker records remain unchanged. Access is a separate persistent layer.
export function seedPlayer(player: Player) {
  const dimensionId = player.dimension.id;
  if (typeof player.id === "string" && isPlayerSeededCached(player.id, dimensionId)) return;
  const id = `chunklock:seeded_visuals:${dimensionId}`;
  if (player.getDynamicProperty(id) === true) {
    if (typeof player.id === "string") markPlayerSeededCached(player.id, dimensionId);
    return;
  }
  const cx = chunkAt(player.location.x);
  const cz = chunkAt(player.location.z);
  world.setDynamicProperty(key(dimensionId, cx, cz), true);
  markOpenCached(dimensionId, cx, cz);
  player.setDynamicProperty(id, true);
  if (typeof player.id === "string") markPlayerSeededCached(player.id, dimensionId);
}
