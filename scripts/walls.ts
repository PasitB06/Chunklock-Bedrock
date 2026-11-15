import { Dimension, Entity, Player, system, world } from "@minecraft/server";
import { isOpenCell, seedPlayer } from "./access.js";
import { chunkAt, wallEdges } from "./regions.js";

const TYPE = "chunklock:border_wall";
const MAX_WALLS = 128;
const dimensions = ["overworld", "nether", "the_end"];
let failedAt = -Infinity;

function refreshWalls() {
  const players = world.getAllPlayers();
  const grouped = new Map<string, Player[]>();
  for (const player of players) {
    seedPlayer(player);
    grouped.set(player.dimension.id, [...(grouped.get(player.dimension.id) ?? []), player]);
  }
  let spawnBudget = 4;
  let active = 0;
  const pending: {
    dimension: Dimension;
    id: string;
    x: number;
    y: number;
    z: number;
    rotation: number;
    priority: number;
  }[] = [];
  for (const name of dimensions) {
    const dimension = world.getDimension(name);
    const wanted = new Map<string, (typeof pending)[number]>();
    for (const player of grouped.get(dimension.id) ?? []) {
      const cx = chunkAt(player.location.x),
        cz = chunkAt(player.location.z);
      const cells = [];
      for (let x = cx - 2; x <= cx + 2; x++)
        for (let z = cz - 2; z <= cz + 2; z++) {
          if (isOpenCell(dimension.id, x, z)) cells.push({ x, z });
        }
      for (const edge of wallEdges(cells, (x, z) => isOpenCell(dimension.id, x, z))) {
        if (Math.hypot(edge.x - player.location.x, edge.z - player.location.z) > 40) continue;
        for (let y = dimension.heightRange.min; y < dimension.heightRange.max; y += 64) {
          const id = `${edge.key}:${y}`;
          const wall = {
            dimension,
            id,
            x: edge.x,
            y,
            z: edge.z,
            rotation: edge.axis === "x" ? 0 : 90,
            priority: Math.abs(y + 32 - player.location.y),
          };
          const previous = wanted.get(id);
          if (!previous || wall.priority < previous.priority) wanted.set(id, wall);
        }
      }
    }
    const found = new Set<string>();
    for (const entity of dimension.getEntities({ type: TYPE })) {
      const id = entity.getDynamicProperty("chunklock:wall_key");
      if (typeof id !== "string" || !wanted.has(id) || found.has(id) || active >= MAX_WALLS) {
        entity.remove();
      } else {
        found.add(id);
        active++;
      }
    }
    for (const [id, wall] of wanted) if (!found.has(id)) pending.push(wall);
  }
  pending.sort((a, b) => a.priority - b.priority);
  for (const wall of pending) {
    if (spawnBudget <= 0 || active >= MAX_WALLS) break;
    let entity: Entity | undefined;
    try {
      entity = wall.dimension.spawnEntity(TYPE, { x: wall.x, y: wall.y, z: wall.z });
      entity.setRotation({ x: 0, y: wall.rotation });
      entity.setDynamicProperty("chunklock:wall_key", wall.id);
      active++;
      spawnBudget--;
    } catch (error) {
      if (entity) entity.remove();
      // Resource/behavior load failures must be visible, rather than silently hidden.
      if (system.currentTick - failedAt >= 200) {
        console.warn(`[Chunklock] Could not create border wall: ${error}`);
        for (const player of players)
          player.sendMessage("[Chunklock] Wall failed to load. Check both packs and the Content Log.");
        failedAt = system.currentTick;
      }
      break;
    }
  }
}

export function startWalls() {
  refreshWalls();
  system.runInterval(refreshWalls, 10);
}
