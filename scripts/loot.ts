import { ItemTypes } from "@minecraft/server";
import { LOOT_TABLES, LootEntry, LootFunction, LootTable } from "./loot-tables-data.js";

const GRAVEL_TABLE_ID = "minecraft:blocks/gravel";
const FALLBACK_BIOME_TABLE_ID = "chunklock:biome/all_biome";
const FALLBACK_ITEM_ID = "minecraft:stone";

const GRAVEL_TABLE: LootTable = {
  pools: [
    {
      rolls: 1,
      entries: [
        { type: "item", name: "minecraft:gravel", weight: 9, functions: [{ function: "set_count", count: 1 }] },
        { type: "item", name: "minecraft:flint", weight: 1, functions: [{ function: "set_count", count: 1 }] },
      ],
    },
  ],
};

const BIOME_ALIASES: Readonly<Record<string, string>> = {
  mesa: "badlands",
  mesa_bryce: "eroded_badlands",
  mesa_plateau: "wooded_badlands",
  mesa_plateau_stone: "wooded_badlands",
  roofed_forest: "dark_forest",
  ice_plains: "snowy_plains",
  ice_plains_spikes: "ice_spikes",
  hell: "nether_wastes",
  soulsand_valley: "soul_sand_valley",
  mushroom_island: "mushroom_fields",
  swampland: "swamp",
  extreme_hills: "windswept_hills",
};

// Keep only aliases that are needed to translate a Java source ID into a Bedrock item ID.
const ITEM_ID_MAP: Readonly<Record<string, string>> = {
  "minecraft:grass": "minecraft:short_grass",
};

export type LootRoll = Readonly<{ sourceItemId: string; baseCount: number }>;
export type CostScalingMode = "standard" | "compressed" | "unique";
export type BedrockItemResolution = Readonly<{
  sourceItemId: string;
  itemId: string;
  usedFallback: boolean;
}>;

function randomValue(random: () => number): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("Loot random source must return a finite value in [0, 1)");
  }
  return value;
}

function chooseEntry(entries: readonly LootEntry[], random: () => number): LootEntry {
  if (entries.length === 0) throw new Error("Cannot roll an empty loot pool");
  const totalWeight = entries.reduce((total, entry) => total + entry.weight, 0);
  const target = randomValue(random) * totalWeight;
  let cumulativeWeight = 0;
  for (const entry of entries) {
    cumulativeWeight += entry.weight;
    if (target < cumulativeWeight) return entry;
  }
  return entries[entries.length - 1];
}

function applyFunctions(result: LootRoll, functions: readonly LootFunction[], random: () => number): LootRoll {
  let baseCount = result.baseCount;
  for (const lootFunction of functions) {
    if (lootFunction.function !== "set_count") throw new Error(`Unsupported loot function: ${lootFunction.function}`);
    const count = lootFunction.count;
    if (typeof count === "number") {
      baseCount = count;
    } else {
      baseCount = count.min + Math.floor(randomValue(random) * (count.max - count.min + 1));
    }
  }
  return { sourceItemId: result.sourceItemId, baseCount };
}

function rollTable(tableId: string, random: () => number, ancestry: ReadonlySet<string>): LootRoll {
  if (ancestry.has(tableId)) throw new Error(`Cyclic loot-table reference: ${[...ancestry, tableId].join(" -> ")}`);
  const table = tableId === GRAVEL_TABLE_ID ? GRAVEL_TABLE : LOOT_TABLES[tableId];
  if (!table) throw new Error(`Unknown loot table: ${tableId}`);
  if (table.pools.length !== 1 || table.pools[0].rolls !== 1) {
    throw new Error(`Loot table must have one pool with one roll: ${tableId}`);
  }

  const selected = chooseEntry(table.pools[0].entries, random);
  const result: LootRoll =
    selected.type === "item"
      ? { sourceItemId: selected.name, baseCount: 1 }
      : rollTable(selected.value, random, new Set([...ancestry, tableId]));
  return applyFunctions(result, selected.functions, random);
}

export function rollLootTable(tableId: string, random: () => number = Math.random): LootRoll {
  return rollTable(tableId, random, new Set());
}

export function resolveBiomeTable(bedrockBiomeId: string): string {
  const rawId = bedrockBiomeId.includes(":") ? bedrockBiomeId.slice(bedrockBiomeId.indexOf(":") + 1) : bedrockBiomeId;
  const biomeKey = BIOME_ALIASES[rawId] ?? rawId;
  const candidate = `chunklock:biome/${biomeKey}`;
  return LOOT_TABLES[candidate] ? candidate : FALLBACK_BIOME_TABLE_ID;
}

export function resolveBedrockItemId(sourceItemId: string): BedrockItemResolution {
  const candidate = ITEM_ID_MAP[sourceItemId] ?? sourceItemId;
  let available = false;
  try {
    available = ItemTypes.get(candidate) !== undefined;
  } catch {
    available = false;
  }
  return {
    sourceItemId,
    itemId: available ? candidate : FALLBACK_ITEM_ID,
    usedFallback: !available,
  };
}

export function getDifficultyMultiplier(difficulty: 1 | 2 | 3 | 4): number {
  return difficulty <= 2 ? 1 : difficulty === 3 ? 4 : 16;
}

export function calculateRemainingCost(
  baseCount: number,
  dimensionId: string,
  unlockedCount: number,
  difficulty: 1 | 2 | 3 | 4,
  scalingMode: CostScalingMode = "standard"
): number {
  if (!Number.isSafeInteger(baseCount) || baseCount < 0)
    throw new RangeError("base count must be a non-negative integer");
  if (!Number.isSafeInteger(unlockedCount) || unlockedCount < 0) {
    throw new RangeError("unlocked count must be a non-negative integer");
  }
  if (![1, 2, 3, 4].includes(difficulty)) throw new RangeError("difficulty must be between 1 and 4");
  if (difficulty === 1) return baseCount;

  const dimensionKey = dimensionId.startsWith("minecraft:") ? dimensionId.slice("minecraft:".length) : dimensionId;
  const step = dimensionKey === "the_end" ? 32 : 16;
  const dimensionMultiplier = Math.floor(unlockedCount / step) + 1;
  const difficultyMultiplier = getDifficultyMultiplier(difficulty);
  if (scalingMode === "compressed") {
    const compressedMultiplier = Math.max(1, Math.min(Math.floor(Math.sqrt(dimensionMultiplier)), 24));
    return baseCount * compressedMultiplier * difficultyMultiplier;
  }
  if (scalingMode === "unique") {
    const uniqueMultiplier = Math.min(Math.max(1, Math.ceil(dimensionMultiplier / 32)), 4);
    return baseCount * uniqueMultiplier * difficultyMultiplier;
  }
  return baseCount * dimensionMultiplier * difficultyMultiplier;
}
