import { Dimension, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
import { calculateRemainingCost, resolveBedrockItemId, resolveBiomeTable, rollLootTable } from "./loot.js";
import {
  deleteRequirementCached,
  getRequirementCached,
  hasCellRecord,
  lookupPlaneY,
  setRequirementCached,
} from "./state-cache.js";

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
    VALID_DIFFICULTIES.includes(requirement.difficulty as number)
  );
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
  if (!hasCellRecord(dimensionId, cx, cz)) return "skipped";
  if (isOpenCell(dimensionId, cx, cz)) return "skipped";

  const cached = getRequirementCached(dimensionId, cx, cz, isValidRequirement);
  if (cached.state === "present") return "existing";
  if (cached.state === "corrupt") return "deferred";

  const propertyId = requirementPropertyId(dimensionId, cx, cz);
  try {
    const biomeId = dimension.getBiome({ x: cx * 16 + 8, y: lookupPlaneY(dimensionId), z: cz * 16 + 8 }).id;
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
    setRequirementCached(dimensionId, cx, cz, requirement);
    return "created";
  } catch {
    return "deferred";
  }
}
