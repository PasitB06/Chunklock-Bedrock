import {
  CommandPermissionLevel,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandRegistry,
  CustomCommandResult,
  CustomCommandStatus,
  Dimension,
  Entity,
  Player,
  system,
  world,
} from "@minecraft/server";
import {
  getDimensionUnlockedCount,
  getHideUnlockTitle,
  getPlayerRerolledCount,
  getPlayerUnlockedCount,
  getTotalUnlockedCount,
  isOpenCell,
  markPlayerSeeded,
  openExemptChunk,
  recordReroll,
  seedPlayer,
  setHideUnlockTitle,
} from "./access.js";
import { resetCollisionCheckpoints } from "./collision.js";
import { refreshRequirementDisplays } from "./displays.js";
import { broadcastGlobalNotice, clearActionNotice, showActionNotice } from "./notices.js";
import { chunkAt } from "./regions.js";
import {
  ChunklockDifficulty,
  DIFFICULTY_NAMES,
  formatItemDisplayName,
  getChunkRequirement,
  getDifficulty,
  rerollChunkRequirement,
  setDifficulty,
} from "./requirements.js";
import { hasCellRecord, invalidateStateCache } from "./state-cache.js";
import { refreshWalls } from "./walls.js";

const DIFFICULTY_ENUM = "chunklock:difficulty_level";
const TITLE_ENUM = "chunklock:title_visibility";
const RESET_ENUM = "chunklock:reset_action";
const DIMENSION_IDS = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"] as const;
const HELPER_TYPES = ["chunklock:border_wall", "chunklock:requirement_display"] as const;
const DIFFICULTY_VALUES: Record<string, ChunklockDifficulty> = {
  easy: 1,
  normal: 2,
  hard: 3,
  impossible: 4,
};

let started = false;

function failure(message: string): CustomCommandResult {
  return { status: CustomCommandStatus.Failure, message };
}

function success(message?: string): CustomCommandResult {
  return message ? { status: CustomCommandStatus.Success, message } : { status: CustomCommandStatus.Success };
}

function resolvePlayer(origin: CustomCommandOrigin): Player | undefined {
  const entity = origin.sourceEntity as Partial<Player> | undefined;
  if (!entity || typeof entity.getViewDirection !== "function") return undefined;
  return origin.sourceEntity as Player;
}

function safeRefreshPresentation() {
  try {
    refreshWalls();
  } catch {
    /* Refresh failure must not interrupt command execution. */
  }
  try {
    refreshRequirementDisplays();
  } catch {
    /* Refresh failure must not interrupt command execution. */
  }
}

function clearDynamicPropertiesWithPrefix(owner: {
  getDynamicPropertyIds?: () => string[];
  setDynamicProperty: (id: string, value: undefined) => void;
}) {
  if (typeof owner.getDynamicPropertyIds !== "function") return;
  for (const id of owner.getDynamicPropertyIds()) {
    if (id.startsWith("chunklock:")) owner.setDynamicProperty(id, undefined);
  }
}

function findLookedAtLockedChunk(player: Player): { cx: number; cz: number } | undefined {
  const direction = player.getViewDirection();
  const horizontal = Math.hypot(direction.x, direction.z);
  if (horizontal < 0.01) return undefined;

  const dx = direction.x / horizontal;
  const dz = direction.z / horizontal;
  const dimensionId = player.dimension.id;
  const origin = player.location;
  const visited = new Set<string>();

  for (let dist = 1; dist <= 9; dist += 0.5) {
    const cx = chunkAt(origin.x + dx * dist);
    const cz = chunkAt(origin.z + dz * dist);
    const key = `${cx}:${cz}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (isOpenCell(dimensionId, cx, cz)) continue;
    if (hasCellRecord(dimensionId, cx, cz) || getChunkRequirement(dimensionId, cx, cz) !== undefined) {
      return { cx, cz };
    }
  }
  return undefined;
}

function handleReroll(origin: CustomCommandOrigin): CustomCommandResult {
  const player = resolvePlayer(origin);
  if (!player) return failure("This command must be run by a player.");
  if (getDifficulty() !== 1) return failure("Reroll is only enabled on Easy difficulty.");

  const target = findLookedAtLockedChunk(player);
  if (!target) return failure("No locked chunk found in front of you within 9 blocks.");

  system.run(() => {
    const updated = rerollChunkRequirement(player.dimension, target.cx, target.cz);
    if (!updated) {
      player.sendMessage("Could not reroll that chunk right now. Make sure the area is loaded.");
      return;
    }
    recordReroll(player);
    safeRefreshPresentation();
    const message = `Rerolled chunk (${target.cx}, ${target.cz}) to ${formatItemDisplayName(updated.itemId)} × ${updated.remainingCost}.`;
    showActionNotice(player, message);
    player.sendMessage(message);
  });
  return success();
}

function handleTitles(origin: CustomCommandOrigin, mode?: string): CustomCommandResult {
  const player = resolvePlayer(origin);
  if (!player) return failure("This command must be run by a player.");

  const hidden = mode === "hide" ? true : mode === "show" ? false : !getHideUnlockTitle(player);
  system.run(() => {
    setHideUnlockTitle(player, hidden);
    const message = hidden ? "Unlock titles are now hidden." : "Unlock titles are now shown.";
    showActionNotice(player, message);
    player.sendMessage(message);
  });
  return success();
}

function handleStatus(origin: CustomCommandOrigin): CustomCommandResult {
  const difficultyName = DIFFICULTY_NAMES[getDifficulty()];
  const total = getTotalUnlockedCount();
  const overworld = getDimensionUnlockedCount("minecraft:overworld");
  const nether = getDimensionUnlockedCount("minecraft:nether");
  const end = getDimensionUnlockedCount("minecraft:the_end");
  const player = resolvePlayer(origin);
  const personalPart = player
    ? ` | Your unlocks: ${getPlayerUnlockedCount(player)} | Rerolls: ${getPlayerRerolledCount(player)}`
    : "";
  return success(
    `Difficulty: ${difficultyName} | Global unlocks: ${total} (Overworld #${overworld}, Nether #${nether}, The End #${end})${personalPart}`
  );
}

function handleDifficulty(origin: CustomCommandOrigin, level: string): CustomCommandResult {
  const next = DIFFICULTY_VALUES[level];
  if (!next) return failure("Unknown difficulty level.");
  if (getTotalUnlockedCount() > 0) {
    return failure("Cannot change difficulty after unlocking a chunk. Run /chunklock:reset confirm first.");
  }

  system.run(() => {
    setDifficulty(next);
    safeRefreshPresentation();
    broadcastGlobalNotice(`Chunklock difficulty set to ${DIFFICULTY_NAMES[next]}.`);
  });
  return success();
}

function resolveCommandDimensionAndCenter(origin: CustomCommandOrigin): {
  dimension: Dimension;
  x: number;
  z: number;
} {
  const sourceEntity = origin.sourceEntity as Entity | undefined;
  if (sourceEntity) {
    return { dimension: sourceEntity.dimension, x: sourceEntity.location.x, z: sourceEntity.location.z };
  }
  const sourceBlock = origin.sourceBlock;
  if (sourceBlock) {
    return { dimension: sourceBlock.dimension, x: sourceBlock.location.x, z: sourceBlock.location.z };
  }
  const overworld = world.getDimension("minecraft:overworld");
  const spawn = typeof world.getDefaultSpawnLocation === "function" ? world.getDefaultSpawnLocation() : { x: 0, z: 0 };
  return { dimension: overworld, x: spawn.x, z: spawn.z };
}

function handleSpreadPlayers(
  origin: CustomCommandOrigin,
  radiusArg?: number,
  minDistanceArg?: number
): CustomCommandResult {
  const radius = radiusArg ?? 500;
  const minDistance = minDistanceArg ?? 200;
  if (!Number.isInteger(radius) || radius < 16 || radius > 100000) {
    return failure("Radius must be an integer between 16 and 100000.");
  }
  if (!Number.isInteger(minDistance) || minDistance < 0 || minDistance >= radius) {
    return failure("Minimum spacing must be a non-negative integer smaller than radius.");
  }

  const { dimension, x, z } = resolveCommandDimensionAndCenter(origin);
  system.run(() => {
    try {
      dimension.runCommand(`spreadplayers ${Math.floor(x)} ${Math.floor(z)} ${minDistance} ${radius} @a`);
    } catch (error) {
      broadcastGlobalNotice(`Could not spread players: ${error}`);
      return;
    }

    for (const player of world.getAllPlayers()) {
      const playerDimension = player.dimension;
      openExemptChunk(playerDimension.id, chunkAt(player.location.x), chunkAt(player.location.z));
      markPlayerSeeded(player, playerDimension.id);
      if (typeof player.setSpawnPoint === "function") {
        try {
          player.setSpawnPoint({
            dimension: playerDimension,
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
          });
        } catch {
          /* Ignore transient spawn-point errors when a player is mid-transition. */
        }
      }
      resetCollisionCheckpoints(player);
    }
    safeRefreshPresentation();
    broadcastGlobalNotice(`Spread all players across radius ${radius} (min spacing ${minDistance}).`);
  });
  return success();
}

function handleReset(_origin: CustomCommandOrigin, confirmation: string): CustomCommandResult {
  if (confirmation !== "confirm") return failure("Run /chunklock:reset confirm to wipe all Chunklock world state.");

  system.run(() => {
    clearDynamicPropertiesWithPrefix(world);
    for (const player of world.getAllPlayers()) {
      clearDynamicPropertiesWithPrefix(player);
      clearActionNotice(player.id);
    }

    for (const dimensionId of DIMENSION_IDS) {
      try {
        const dimension = world.getDimension(dimensionId);
        for (const helperType of HELPER_TYPES) {
          for (const helper of dimension.getEntities({ type: helperType })) {
            helper.remove();
          }
        }
      } catch {
        /* Skip dimensions unavailable during reset. */
      }
    }

    try {
      world.scoreboard?.removeObjective("chunklock:unlocked");
    } catch {
      /* Objective may not exist yet. */
    }

    invalidateStateCache();
    resetCollisionCheckpoints();
    for (const player of world.getAllPlayers()) seedPlayer(player);
    safeRefreshPresentation();
    broadcastGlobalNotice("Chunklock world state has been reset.");
  });
  return success();
}

/**
 * Registers all Chunklock slash commands and enum definitions on `customCommandRegistry`.
 */
export function registerChunklockCommands(customCommandRegistry: CustomCommandRegistry) {
  customCommandRegistry.registerEnum(DIFFICULTY_ENUM, ["easy", "normal", "hard", "impossible"]);
  customCommandRegistry.registerEnum(TITLE_ENUM, ["show", "hide"]);
  customCommandRegistry.registerEnum(RESET_ENUM, ["confirm"]);

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:reroll",
      description: "Reroll the locked chunk requirement you are looking at (Easy difficulty only).",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
    },
    (origin) => handleReroll(origin)
  );

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:titles",
      description: "Show or hide center-screen milestone unlock titles for yourself.",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
      optionalParameters: [{ name: TITLE_ENUM, type: CustomCommandParamType.Enum }],
    },
    (origin, mode?: string) => handleTitles(origin, mode)
  );

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:status",
      description: "Show Chunklock difficulty, global dimension progress and personal totals.",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
    },
    (origin) => handleStatus(origin)
  );

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:difficulty",
      description: "Set Chunklock difficulty before the first chunk is unlocked.",
      permissionLevel: CommandPermissionLevel.GameDirectors,
      cheatsRequired: true,
      mandatoryParameters: [{ name: DIFFICULTY_ENUM, type: CustomCommandParamType.Enum }],
    },
    (origin, level: string) => handleDifficulty(origin, level)
  );

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:spreadplayers",
      description: "Spread all players to separate starting chunks and set their spawn points.",
      permissionLevel: CommandPermissionLevel.GameDirectors,
      cheatsRequired: true,
      optionalParameters: [
        { name: "radius", type: CustomCommandParamType.Integer },
        { name: "minDistance", type: CustomCommandParamType.Integer },
      ],
    },
    (origin, radius?: number, minDistance?: number) => handleSpreadPlayers(origin, radius, minDistance)
  );

  customCommandRegistry.registerCommand(
    {
      name: "chunklock:reset",
      description: "Reset all Chunklock chunks, progress and helpers.",
      permissionLevel: CommandPermissionLevel.GameDirectors,
      cheatsRequired: true,
      mandatoryParameters: [{ name: RESET_ENUM, type: CustomCommandParamType.Enum }],
    },
    (origin, confirmation: string) => handleReset(origin, confirmation)
  );
}

/**
 * Subscribes command registration during early startup before world initialization finishes.
 */
export function startCommands() {
  if (started) return;
  started = true;
  system.beforeEvents?.startup?.subscribe(({ customCommandRegistry }) => {
    registerChunklockCommands(customCommandRegistry);
  });
}
