import { GameMode, Player, Vector3, system, world } from "@minecraft/server";
import { isLocked, seedPlayer } from "./access.js";
import { getOpenCellCoords } from "./state-cache.js";

const SAFE_POSITIONS_PROPERTY = "chunklock:collision:safe_positions";
const PERSIST_INTERVAL = 20;

type SafePosition = {
  dimensionId: string;
  location: Vector3;
  rotation: { x: number; y: number };
};

const previousSafePositions = new Map<string, Map<string, SafePosition>>();
const lastPersisted = new Map<string, string>();
const nextFallbackAttempt = new Map<string, number>();

function isValidPosition(value: unknown): value is SafePosition {
  if (!value || typeof value !== "object") return false;
  const candidate = value as SafePosition;
  return (
    typeof candidate.dimensionId === "string" &&
    [
      candidate.location?.x,
      candidate.location?.y,
      candidate.location?.z,
      candidate.rotation?.x,
      candidate.rotation?.y,
    ].every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))
  );
}

function loadPositions(player: Player): Map<string, SafePosition> {
  const saved = new Map<string, SafePosition>();
  try {
    const serialized = player.getDynamicProperty(SAFE_POSITIONS_PROPERTY);
    if (typeof serialized !== "string") return saved;
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") return saved;
    for (const value of Object.values(parsed)) {
      if (isValidPosition(value)) saved.set(value.dimensionId, value);
    }
    lastPersisted.set(player.id, serialized);
  } catch {
    // An invalid or missing checkpoint is rebuilt from the current open cell.
  }
  return saved;
}

function positionsFor(player: Player): Map<string, SafePosition> {
  let positions = previousSafePositions.get(player.id);
  if (!positions) {
    positions = loadPositions(player);
    previousSafePositions.set(player.id, positions);
  }
  return positions;
}

function capture(player: Player): SafePosition {
  const location = player.location;
  const rotation = player.getRotation();
  return {
    dimensionId: player.dimension.id,
    location: { x: location.x, y: location.y, z: location.z },
    rotation: { x: rotation.x, y: rotation.y },
  };
}

function isOpenPosition(position: SafePosition): boolean {
  return !isLocked(position.dimensionId, position.location.x, position.location.z);
}

function findFallback(player: Player): SafePosition | undefined {
  const dimension = player.dimension;
  const spawn = player.getSpawnPoint();
  if (spawn?.dimension.id === dimension.id && !isLocked(dimension.id, spawn.x, spawn.z)) {
    return {
      dimensionId: dimension.id,
      location: { x: spawn.x, y: spawn.y, z: spawn.z },
      rotation: player.getRotation(),
    };
  }

  const current = player.location;
  const startHeight = Math.max(
    dimension.heightRange.min,
    Math.min(Math.floor(current.y), dimension.heightRange.max - 1)
  );
  const candidates = getOpenCellCoords(dimension.id)
    .map(({ cx, cz }) => ({ cx, cz, distance: Math.hypot(cx * 16 + 8 - current.x, cz * 16 + 8 - current.z) }))
    .sort((a, b) => a.distance - b.distance);

  for (const { cx, cz } of candidates) {
    const x = cx * 16 + 8.5;
    const z = cz * 16 + 8.5;
    try {
      const topBlock = dimension.getTopmostBlock({ x, z }, startHeight);
      if (!topBlock) continue;
      const y = topBlock.location.y + 1;
      if (y < dimension.heightRange.min || y + 1 >= dimension.heightRange.max) continue;
      return { dimensionId: dimension.id, location: { x, y, z }, rotation: player.getRotation() };
    } catch {
      // Try the next known open cell if its chunk is not currently available.
    }
  }
  return undefined;
}

function persist(player: Player, positions: Map<string, SafePosition>) {
  const serialized = JSON.stringify(Object.fromEntries(positions));
  if (lastPersisted.get(player.id) === serialized) return;
  try {
    player.setDynamicProperty(SAFE_POSITIONS_PROPERTY, serialized);
    lastPersisted.set(player.id, serialized);
  } catch (error) {
    console.warn(`[Chunklock] Could not save a collision checkpoint: ${error}`);
  }
}

function returnPlayer(player: Player, position: SafePosition) {
  try {
    const dimension = world.getDimension(position.dimensionId);
    player.teleport(position.location, {
      dimension,
      rotation: position.rotation,
      checkForBlocks: false,
      keepVelocity: false,
    });
  } catch (error) {
    console.warn(`[Chunklock] Could not return a player to a safe chunk: ${error}`);
  }
}

function checkPlayers() {
  const online = new Set<string>();
  const currentTick = system.currentTick;
  const players = world.getAllPlayers();
  for (let index = 0; index < players.length; index++) {
    const player = players[index];
    online.add(player.id);
    seedPlayer(player);

    const positions = positionsFor(player);
    const current = capture(player);
    const saved = positions.get(current.dimensionId);

    if (isOpenPosition(current)) {
      positions.set(current.dimensionId, current);
    } else if (player.getGameMode() !== GameMode.Spectator) {
      let fallback = saved && isOpenPosition(saved) ? saved : undefined;
      if (!fallback && currentTick >= (nextFallbackAttempt.get(player.id) ?? -Infinity)) {
        fallback = findFallback(player);
        nextFallbackAttempt.set(player.id, currentTick + PERSIST_INTERVAL);
        if (fallback) positions.set(fallback.dimensionId, fallback);
      }
      if (fallback) {
        fallback.rotation = current.rotation;
        returnPlayer(player, fallback);
      }
    }

    if ((currentTick + index) % PERSIST_INTERVAL === 0) persist(player, positions);
  }

  for (const playerId of previousSafePositions.keys()) {
    if (!online.has(playerId)) {
      previousSafePositions.delete(playerId);
      lastPersisted.delete(playerId);
      nextFallbackAttempt.delete(playerId);
    }
  }
}

// Mirrors Java's post_tick_player checkpoint plus collision/player_chunk_collision.
export function startCollision() {
  checkPlayers();
  system.runInterval(checkPlayers, 1);
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    previousSafePositions.delete(playerId);
    lastPersisted.delete(playerId);
    nextFallbackAttempt.delete(playerId);
  });
}
