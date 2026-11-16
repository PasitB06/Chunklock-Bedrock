import { Player, world } from "@minecraft/server";
import { chunkAt } from "./regions.js";
import { isOpenCached, isPlayerSeededCached, markOpenCached, markPlayerSeededCached } from "./state-cache.js";

const key = (dimension: string, x: number, z: number) => `chunklock:open:${dimension}:${x}:${z}`;
const TRACKED_DIMENSIONS = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"] as const;
const DIMENSION_DISPLAY_NAMES: Record<string, string> = {
  "minecraft:overworld": "Overworld",
  overworld: "Overworld",
  "minecraft:nether": "Nether",
  nether: "Nether",
  "minecraft:the_end": "The End",
  the_end: "The End",
};

export const isOpenCell = (dimension: string, x: number, z: number) => isOpenCached(dimension, x, z);
export const isLocked = (dimension: string, x: number, z: number) => !isOpenCell(dimension, chunkAt(x), chunkAt(z));

function readCount(owner: Player | typeof world, propertyId: string): number {
  const value = owner.getDynamicProperty(propertyId);
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

/**
 * Returns the number of paid chunk unlocks recorded for the given dimension.
 */
export function getDimensionUnlockedCount(dimension: string): number {
  return readCount(world, `chunklock:progress:unlocked:${dimension}`);
}

/**
 * Formats a dimension ID (for example `minecraft:the_end`) for player-facing notices.
 */
export function formatDimensionDisplayName(dimensionId: string): string {
  const known = DIMENSION_DISPLAY_NAMES[dimensionId];
  if (known) return known;
  const raw = dimensionId.slice(dimensionId.lastIndexOf(":") + 1);
  return raw
    .split(/[_\s]+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Builds the join notice stating that Chunklock is global and listing per-dimension unlock counts.
 */
export function formatGlobalJoinNotice(): string {
  const counts = TRACKED_DIMENSIONS.map(
    (dimensionId) => `${formatDimensionDisplayName(dimensionId)} #${getDimensionUnlockedCount(dimensionId)}`
  ).join(", ");
  return `Chunklock Global is active. Progress — ${counts}.`;
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
