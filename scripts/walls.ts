import { Dimension, Entity, Player, system, world } from "@minecraft/server";
import { isOpenCell, seedPlayer } from "./access.js";
import { chunkAt, wallEdges } from "./regions.js";

const TYPE = "chunklock:border_wall";
const MAX_WALLS = 192;
const VERTICAL_VIEW_RANGE = 96;
const dimensions = ["overworld", "nether", "the_end"];
let failedAt = -Infinity;

function alignWall(entity: Entity, wall: { x: number; y: number; z: number; rotation: number }) {
  const current = entity.location;
  if (
    current &&
    (Math.abs(current.x - wall.x) > 0.01 || Math.abs(current.y - wall.y) > 0.01 || Math.abs(current.z - wall.z) > 0.01)
  ) {
    entity.teleport?.({ x: wall.x, y: wall.y, z: wall.z });
  }
  entity.setProperty("chunklock:wall_yaw", wall.rotation);
  entity.setRotation({ x: 0, y: 0 });
}

export function refreshWalls() {
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
        const horizontalDistance = Math.hypot(edge.x - player.location.x, edge.z - player.location.z);
        if (horizontalDistance > 40) continue;
        for (let y = dimension.heightRange.min; y < dimension.heightRange.max; y += 64) {
          const verticalDistance = Math.abs(y + 32 - player.location.y);
          if (verticalDistance > VERTICAL_VIEW_RANGE) continue;
          const id = `v4:${edge.key}:${y}`;
          const wall = {
            dimension,
            id,
            x: edge.x,
            y,
            z: edge.z,
            rotation: edge.axis === "x" ? 0 : 90,
            priority: verticalDistance + horizontalDistance * 0.5,
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
        alignWall(entity, wanted.get(id)!);
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
      alignWall(entity, wall);
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
