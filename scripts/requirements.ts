import { Dimension, world } from "@minecraft/server";
import { getDimensionUnlockedCount, isOpenCell } from "./access.js";
import { calculateRemainingCost, resolveBedrockItemId, resolveBiomeTable, rollLootTable } from "./loot.js";
import {
  deleteRequirementCached,
  getRequirementCached,
  hasCellRecord,
  lookupPlaneY,
  setRequirementCached,
} from "./state-cache.js";

const REQUIREMENT_PREFIX = "chunklock:req:";
export type ChunklockDifficulty = 1 | 2 | 3 | 4;
const DEFAULT_DIFFICULTY: ChunklockDifficulty = 2;
const VALID_DIFFICULTIES: readonly ChunklockDifficulty[] = [1, 2, 3, 4];
export const DIFFICULTY_NAMES: Record<ChunklockDifficulty, string> = {
  1: "Easy",
  2: "Normal",
  3: "Hard",
  4: "Impossible",
};

export type ChunkRequirement = Readonly<{
  schemaVersion: 1;
  state: "locked";
  biomeId: string;
  tableId: string;
  sourceItemId: string;
  itemId: string;
  baseCount: number;
  remainingCost: number;
  difficulty: 1 | 2 | 3 | 4;
}>;

export type EnsureRequirementResult = "created" | "existing" | "skipped" | "deferred";

export const requirementPropertyId = (dimensionId: string, cx: number, cz: number) =>
  `${REQUIREMENT_PREFIX}${dimensionId}:${cx}:${cz}`;

export function getChunkRequirement(dimensionId: string, cx: number, cz: number): ChunkRequirement | undefined {
  const cached = getRequirementCached(dimensionId, cx, cz, isValidRequirement);
  return cached.state === "present" ? cached.value : undefined;
}

export function setChunkRequirementRemainingCost(
  dimensionId: string,
  cx: number,
  cz: number,
  remainingCost: number
): boolean {
  if (!Number.isSafeInteger(remainingCost) || remainingCost < 0) return false;
  const requirement = getChunkRequirement(dimensionId, cx, cz);
  if (!requirement) return false;
  const next = { ...requirement, remainingCost };
  world.setDynamicProperty(requirementPropertyId(dimensionId, cx, cz), JSON.stringify(next));
  setRequirementCached(dimensionId, cx, cz, next);
  return true;
}

export function deleteChunkRequirement(dimensionId: string, cx: number, cz: number): boolean {
  const cached = getRequirementCached(dimensionId, cx, cz, isValidRequirement);
  if (cached.state === "absent") return false;
  world.setDynamicProperty(requirementPropertyId(dimensionId, cx, cz), undefined);
  deleteRequirementCached(dimensionId, cx, cz);
  return true;
}

export function formatItemDisplayName(itemId: string): string {
  const itemName = itemId.slice(itemId.lastIndexOf(":") + 1);
  return itemName
    .split(/[_\s]+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function isValidRequirement(value: unknown): value is ChunkRequirement {
  if (typeof value !== "object" || value === null) return false;
  const requirement = value as Record<string, unknown>;
  const isNonEmptyString = (candidate: unknown) => typeof candidate === "string" && candidate.length > 0;
  return (
    requirement.schemaVersion === 1 &&
    requirement.state === "locked" &&
    isNonEmptyString(requirement.biomeId) &&
    isNonEmptyString(requirement.tableId) &&
    isNonEmptyString(requirement.sourceItemId) &&
    isNonEmptyString(requirement.itemId) &&
    Number.isSafeInteger(requirement.baseCount) &&
    (requirement.baseCount as number) >= 0 &&
    Number.isSafeInteger(requirement.remainingCost) &&
    (requirement.remainingCost as number) >= 0 &&
    VALID_DIFFICULTIES.includes(requirement.difficulty as ChunklockDifficulty)
  );
}

/**
 * Returns the active world Chunklock difficulty level (defaults to Normal = 2).
 */
export function getDifficulty(): ChunklockDifficulty {
  const value = world.getDynamicProperty("chunklock:difficulty");
  return VALID_DIFFICULTIES.includes(value as ChunklockDifficulty)
    ? (value as ChunklockDifficulty)
    : DEFAULT_DIFFICULTY;
}

function parseRequirementKey(propertyId: string): { dimensionId: string; cx: number; cz: number } | undefined {
  if (!propertyId.startsWith(REQUIREMENT_PREFIX)) return undefined;
  const suffix = propertyId.slice(REQUIREMENT_PREFIX.length);
  const lastColon = suffix.lastIndexOf(":");
  if (lastColon <= 0) return undefined;
  const secondLastColon = suffix.lastIndexOf(":", lastColon - 1);
  if (secondLastColon <= 0) return undefined;
  const dimensionId = suffix.slice(0, secondLastColon);
  const cx = Number(suffix.slice(secondLastColon + 1, lastColon));
  const cz = Number(suffix.slice(lastColon + 1));
  if (!Number.isSafeInteger(cx) || !Number.isSafeInteger(cz)) return undefined;
  return { dimensionId, cx, cz };
}

/**
 * Updates the world Chunklock difficulty and rescales existing pre-unlock requirements.
 */
export function setDifficulty(difficulty: ChunklockDifficulty): number {
  world.setDynamicProperty("chunklock:difficulty", difficulty);
  if (typeof world.getDynamicPropertyIds !== "function") return 0;

  let rescaled = 0;
  for (const propertyId of world.getDynamicPropertyIds()) {
    const coords = parseRequirementKey(propertyId);
    if (!coords) continue;
    const current = getChunkRequirement(coords.dimensionId, coords.cx, coords.cz);
    if (!current) continue;
    const remainingCost = calculateRemainingCost(current.baseCount, coords.dimensionId, 0, difficulty);
    const updated: ChunkRequirement = { ...current, difficulty, remainingCost };
    world.setDynamicProperty(propertyId, JSON.stringify(updated));
    setRequirementCached(coords.dimensionId, coords.cx, coords.cz, updated);
    rescaled++;
  }
  return rescaled;
}

function rollAndSaveRequirement(dimension: Dimension, cx: number, cz: number): ChunkRequirement | undefined {
  const dimensionId = dimension.id;
  const propertyId = requirementPropertyId(dimensionId, cx, cz);
  try {
    const biomeId = dimension.getBiome({ x: cx * 16 + 8, y: lookupPlaneY(dimensionId), z: cz * 16 + 8 }).id;
    const tableId = resolveBiomeTable(biomeId);
    const rolled = rollLootTable(tableId);
    const item = resolveBedrockItemId(rolled.sourceItemId);
    const difficulty = getDifficulty();
    const baseCount = rolled.baseCount;
    const remainingCost = calculateRemainingCost(
      baseCount,
      dimensionId,
      getDimensionUnlockedCount(dimensionId),
      difficulty
    );
    const requirement: ChunkRequirement = {
      schemaVersion: 1,
      state: "locked",
      biomeId,
      tableId,
      sourceItemId: item.sourceItemId,
      itemId: item.itemId,
      baseCount,
      remainingCost,
      difficulty,
    };
    world.setDynamicProperty(propertyId, JSON.stringify(requirement));
    setRequirementCached(dimensionId, cx, cz, requirement);
    return requirement;
  } catch {
    return undefined;
  }
}

export function ensureChunkRequirement(dimension: Dimension, cx: number, cz: number): EnsureRequirementResult {
  const dimensionId = dimension.id;
  if (!hasCellRecord(dimensionId, cx, cz)) return "skipped";
  if (isOpenCell(dimensionId, cx, cz)) return "skipped";

  const cached = getRequirementCached(dimensionId, cx, cz, isValidRequirement);
  if (cached.state === "present") return "existing";
  if (cached.state === "corrupt") return "deferred";

  return rollAndSaveRequirement(dimension, cx, cz) ? "created" : "deferred";
}

/**
 * Reroots a locked chunk's item requirement in place and refreshes the cache.
 */
export function rerollChunkRequirement(dimension: Dimension, cx: number, cz: number): ChunkRequirement | undefined {
  const dimensionId = dimension.id;
  if (isOpenCell(dimensionId, cx, cz)) return undefined;
  if (!hasCellRecord(dimensionId, cx, cz) && getChunkRequirement(dimensionId, cx, cz) === undefined) return undefined;
  return rollAndSaveRequirement(dimension, cx, cz);
}
