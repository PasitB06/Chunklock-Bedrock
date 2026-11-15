import { Player, world } from "@minecraft/server";
import { chunkAt } from "./regions.js";

const key = (dimension: string, x: number, z: number) => `chunklock:open:${dimension}:${x}:${z}`;
export const isOpenCell = (dimension: string, x: number, z: number) =>
  world.getDynamicProperty(key(dimension, x, z)) === true;
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
  if (world.getDynamicProperty(openProperty) === true) return false;

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
  const id = `chunklock:seeded_visuals:${player.dimension.id}`;
  if (player.getDynamicProperty(id) === true) return;
  world.setDynamicProperty(key(player.dimension.id, chunkAt(player.location.x), chunkAt(player.location.z)), true);
  player.setDynamicProperty(id, true);
}
