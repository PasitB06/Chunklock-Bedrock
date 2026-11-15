import { Player, world } from "@minecraft/server";
import { chunkAt } from "./regions.js";

const key = (dimension: string, x: number, z: number) => `chunklock:open:${dimension}:${x}:${z}`;
export const isOpenCell = (dimension: string, x: number, z: number) =>
  world.getDynamicProperty(key(dimension, x, z)) === true;
export const isLocked = (dimension: string, x: number, z: number) => !isOpenCell(dimension, chunkAt(x), chunkAt(z));

// Existing marker records remain unchanged. Access is a separate persistent layer.
export function seedPlayer(player: Player) {
  const id = `chunklock:seeded_visuals:${player.dimension.id}`;
  if (player.getDynamicProperty(id) === true) return;
  world.setDynamicProperty(key(player.dimension.id, chunkAt(player.location.x), chunkAt(player.location.z)), true);
  player.setDynamicProperty(id, true);
}
