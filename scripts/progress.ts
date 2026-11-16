import { DisplaySlotId, ObjectiveSortOrder, Player, ScoreboardObjective, world } from "@minecraft/server";
import {
  getHideUnlockTitle,
  getPlayerDimensionUnlockedCount,
  getPlayerUnlockedCount,
  getTotalUnlockedCount,
} from "./access.js";
import { broadcastGlobalNotice } from "./notices.js";

export const SCOREBOARD_OBJECTIVE_ID = "chunklock:unlocked";
export const SCOREBOARD_DISPLAY_NAME = "Chunks";
const MILESTONES_PROPERTY = "chunklock:milestones";

type PersonalMilestoneSpec = Readonly<{
  id: string;
  title: string;
  description: string;
  matches: (context: { player: Player; dimensionId: string; playerTotal: number; sourceItemId?: string }) => boolean;
}>;

const COUNT_MILESTONES: readonly [number, string, string][] = [
  [16, "Chunk Novice", "Unlock 16 chunks"],
  [64, "Chunk Explorer", "Unlock 64 chunks"],
  [128, "Chunk Pro", "Unlock 128 chunks"],
  [256, "Chunk Master", "Unlock 256 chunks"],
  [512, "Chunk Legend", "Unlock 512 chunks"],
  [1024, "Chunk God", "Unlock 1024 chunks"],
  [2048, "Chunklock Champion", "Unlock 2048 chunks"],
];

const DIMENSION_MILESTONES: readonly [string, string, string, string][] = [
  [
    "minecraft:overworld",
    "first_overworld",
    "The Grass is Always Chunkier",
    "Unlock your first chunk in the Overworld",
  ],
  ["minecraft:nether", "first_nether", "Nether Chunker", "Unlock your first chunk in the Nether"],
  ["minecraft:the_end", "first_end", "Chunklock Endgame", "Unlock your first chunk in the End"],
];

const ITEM_MILESTONES: readonly [string, string, string, string][] = [
  ["minecraft:stone", "item_stone", "A Stone Cold Offer", "Unlock a chunk using a piece of Stone"],
  ["minecraft:coal", "item_coal", "A Coal Cost", "Unlock a chunk using a piece of Coal"],
  ["minecraft:iron_ingot", "item_iron_ingot", "An Ironic Tribute", "Unlock a chunk using an Iron Ingot"],
  ["minecraft:gold_ingot", "item_gold_ingot", "A Golden Gift", "Unlock a chunk using a Gold Ingot"],
  ["minecraft:emerald", "item_emerald", "A Green Gift", "Unlock a chunk using an Emerald"],
  ["minecraft:diamond", "item_diamond", "A Shiny Tribute", "Unlock a chunk using a Diamond"],
  ["minecraft:pufferfish", "item_pufferfish", "A Puffy Price", "Unlock a chunk using a Pufferfish"],
  [
    "minecraft:nether_brick",
    "item_nether_brick",
    "Just Another Brick in The Chunk",
    "Unlock a chunk using Nether Brick",
  ],
  ["minecraft:ancient_debris", "item_ancient_debris", "A Hefty Price", "Unlock a chunk using Ancient Debris"],
];

const PERSONAL_MILESTONES: readonly PersonalMilestoneSpec[] = [
  ...DIMENSION_MILESTONES.map(([dimensionKey, id, title, description]) => ({
    id,
    title,
    description,
    matches: ({ player, dimensionId }: { player: Player; dimensionId: string }) =>
      dimensionId === dimensionKey && getPlayerDimensionUnlockedCount(player, dimensionKey) >= 1,
  })),
  ...COUNT_MILESTONES.map(([threshold, title, description]) => ({
    id: `count_${threshold}`,
    title,
    description,
    matches: ({ playerTotal }: { playerTotal: number }) => playerTotal >= threshold,
  })),
  ...ITEM_MILESTONES.map(([itemId, id, title, description]) => ({
    id,
    title,
    description,
    matches: ({ sourceItemId }: { sourceItemId?: string }) => sourceItemId === itemId,
  })),
];

type GlobalMilestoneTier = Readonly<{
  matches: (total: number) => boolean;
  scope: "all" | "player";
  sound: string;
  pitch: number;
  creditNotice?: string;
}>;

const GLOBAL_MILESTONE_TIERS: readonly GlobalMilestoneTier[] = [
  {
    matches: (total) => total === 1,
    scope: "all",
    sound: "ui.toast.challenge_complete",
    pitch: 0.8,
    creditNotice: "Chunklock concept by AvidMc and Quillbee.",
  },
  {
    matches: (total) => total > 0 && total % 128 === 0,
    scope: "all",
    sound: "ui.toast.challenge_complete",
    pitch: 0.9,
  },
  { matches: (total) => total > 0 && total % 64 === 0, scope: "all", sound: "ui.toast.challenge_complete", pitch: 1 },
  { matches: (total) => total > 0 && total % 32 === 0, scope: "all", sound: "ui.toast.challenge_complete", pitch: 1.2 },
  { matches: (total) => total > 0 && total % 16 === 0, scope: "player", sound: "random.levelup", pitch: 0.8 },
  { matches: (total) => total > 0 && total % 8 === 0, scope: "player", sound: "random.levelup", pitch: 1.2 },
];

let started = false;

function readEarnedMilestones(player: Player): Set<string> {
  try {
    const raw = player.getDynamicProperty(MILESTONES_PROPERTY);
    if (typeof raw !== "string") return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return new Set();
  }
}

function saveEarnedMilestones(player: Player, earned: Set<string>) {
  try {
    player.setDynamicProperty(MILESTONES_PROPERTY, JSON.stringify([...earned]));
  } catch {
    /* Milestone persistence must not abort payment completion. */
  }
}

function ensureObjectiveAndSlots(): ScoreboardObjective | undefined {
  const scoreboard = world.scoreboard;
  if (!scoreboard) return undefined;
  try {
    const objective =
      scoreboard.getObjective(SCOREBOARD_OBJECTIVE_ID) ??
      scoreboard.addObjective(SCOREBOARD_OBJECTIVE_ID, SCOREBOARD_DISPLAY_NAME);
    if (typeof DisplaySlotId !== "undefined" && typeof ObjectiveSortOrder !== "undefined") {
      scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.BelowName, {
        objective,
        sortOrder: ObjectiveSortOrder.Descending,
      });
      scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.List, {
        objective,
        sortOrder: ObjectiveSortOrder.Descending,
      });
    }
    return objective;
  } catch {
    return undefined;
  }
}

/**
 * Updates the Chunklock player scoreboard objective to reflect `player`'s total unlocked chunks.
 */
export function syncPlayerScoreboard(player: Player) {
  const objective = ensureObjectiveAndSlots();
  if (!objective) return;
  try {
    objective.setScore(player, getPlayerUnlockedCount(player));
  } catch {
    /* Player may be mid-disconnect when scoreboard sync runs. */
  }
}

/**
 * Re-creates scoreboard slots after a reset and syncs all connected players.
 */
export function resetProgressScoreboard() {
  ensureObjectiveAndSlots();
  try {
    for (const player of world.getAllPlayers()) syncPlayerScoreboard(player);
  } catch {
    /* Ignore enumeration errors in partial mocks. */
  }
}

function triggerGlobalMilestone(player: Player, totalUnlocked: number) {
  const tier = GLOBAL_MILESTONE_TIERS.find((candidate) => candidate.matches(totalUnlocked));
  if (!tier) return;

  if (tier.creditNotice) broadcastGlobalNotice(tier.creditNotice);

  const playerName = typeof player.name === "string" && player.name.trim().length > 0 ? player.name : "A player";
  const title = totalUnlocked === 1 ? "First Chunk Unlocked!" : `Chunk #${totalUnlocked} Unlocked!`;
  const subtitle = `By ${playerName}`;
  const recipients = tier.scope === "all" ? world.getAllPlayers() : [player];

  for (const recipient of recipients) {
    try {
      if (typeof recipient.playSound === "function") {
        recipient.playSound(tier.sound, { volume: 1, pitch: tier.pitch });
      }
    } catch {
      /* Ignore audio feedback errors during disconnect. */
    }
    if (getHideUnlockTitle(recipient)) continue;
    try {
      recipient.onScreenDisplay.setTitle?.(title, {
        fadeInDuration: 10,
        stayDuration: 50,
        fadeOutDuration: 10,
        subtitle,
      });
    } catch {
      /* Ignore HUD title errors when player UI is unavailable. */
    }
  }
}

function triggerPersonalMilestones(player: Player, dimensionId: string, sourceItemId?: string) {
  const earned = readEarnedMilestones(player);
  const playerTotal = getPlayerUnlockedCount(player);
  const newlyEarned: PersonalMilestoneSpec[] = [];

  for (const spec of PERSONAL_MILESTONES) {
    if (earned.has(spec.id)) continue;
    if (!spec.matches({ player, dimensionId, playerTotal, sourceItemId })) continue;
    earned.add(spec.id);
    newlyEarned.push(spec);
  }

  if (newlyEarned.length === 0) return;
  saveEarnedMilestones(player, earned);
  for (const spec of newlyEarned) {
    try {
      player.sendMessage(`Milestone unlocked: ${spec.title} — ${spec.description}`);
    } catch {
      /* Ignore message failures on disconnected players. */
    }
  }
}

/**
 * Syncs scoreboard and checks global + personal unlock milestones after a paid unlock succeeds.
 */
export function handlePaidUnlockProgress(player: Player, dimensionId: string, sourceItemId?: string) {
  syncPlayerScoreboard(player);
  triggerGlobalMilestone(player, getTotalUnlockedCount());
  triggerPersonalMilestones(player, dimensionId, sourceItemId);
}

/**
 * Initializes the Chunklock scoreboard slots and keeps scores synced when players spawn.
 */
export function startProgress() {
  if (started) return;
  started = true;
  resetProgressScoreboard();
  world.afterEvents?.playerSpawn?.subscribe(({ player }) => {
    syncPlayerScoreboard(player);
  });
}
