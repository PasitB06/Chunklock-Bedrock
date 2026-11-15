import { Dimension, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
import { calculateRemainingCost, resolveBedrockItemId, resolveBiomeTable, rollLootTable } from "./loot.js";

const CELL_PREFIX = "chunklock:cell:";
const REQUIREMENT_PREFIX = "chunklock:req:";
const DEFAULT_DIFFICULTY = 2;
const DEFAULT_UNLOCKED_COUNT = 0;
const VALID_DIFFICULTIES = [1, 2, 3, 4];

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

function cellPropertyId(dimensionId: string, cx: number, cz: number) {
  return `${CELL_PREFIX}${dimensionId}:${cx}:${cz}`;
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
    VALID_DIFFICULTIES.includes(requirement.difficulty as number)
  );
}

function lookupBiomeY(dimensionId: string): number {
  const dimensionKey = dimensionId.startsWith("minecraft:") ? dimensionId.slice("minecraft:".length) : dimensionId;
  return dimensionKey === "overworld" ? 128 : 64;
}

function readStoredRequirement(propertyId: string): EnsureRequirementResult | undefined {
  const value = world.getDynamicProperty(propertyId);
  if (value === undefined) return undefined;
  if (typeof value !== "string") return "deferred";
  try {
    return isValidRequirement(JSON.parse(value)) ? "existing" : "deferred";
  } catch {
    return "deferred";
  }
}

function readDifficulty(): 1 | 2 | 3 | 4 {
  const value = world.getDynamicProperty("chunklock:difficulty");
  return VALID_DIFFICULTIES.includes(value as number) ? (value as 1 | 2 | 3 | 4) : DEFAULT_DIFFICULTY;
}

function readUnlockedCount(dimensionId: string): number {
  const value = world.getDynamicProperty(`chunklock:progress:unlocked:${dimensionId}`);
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : DEFAULT_UNLOCKED_COUNT;
}

export function ensureChunkRequirement(dimension: Dimension, cx: number, cz: number): EnsureRequirementResult {
  const dimensionId = dimension.id;
  if (world.getDynamicProperty(cellPropertyId(dimensionId, cx, cz)) === undefined) return "skipped";
  if (isOpenCell(dimensionId, cx, cz)) return "skipped";

  const propertyId = requirementPropertyId(dimensionId, cx, cz);
  const stored = readStoredRequirement(propertyId);
  if (stored !== undefined) return stored;

  try {
    const biomeId = dimension.getBiome({ x: cx * 16 + 8, y: lookupBiomeY(dimensionId), z: cz * 16 + 8 }).id;
    const tableId = resolveBiomeTable(biomeId);
    const rolled = rollLootTable(tableId);
    const item = resolveBedrockItemId(rolled.sourceItemId);
    const difficulty = readDifficulty();
    const baseCount = rolled.baseCount;
    const remainingCost = calculateRemainingCost(baseCount, dimensionId, readUnlockedCount(dimensionId), difficulty);
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
    return "created";
  } catch {
    return "deferred";
  }
}
