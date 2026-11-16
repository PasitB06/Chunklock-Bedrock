import { CostScalingMode, resolveBiomeTable, rollLootTable } from "./loot.js";
import { lookupPlaneY } from "./state-cache.js";

export type ProgressionTierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ProgressionRollResult = Readonly<{
  sourceItemId: string;
  baseCount: number;
  tableId: string;
  scalingMode: CostScalingMode;
  tier: ProgressionTierIndex;
}>;

type TierPoolEntry =
  | { type: "item"; itemId: string; min: number; max: number; weight: number }
  | { type: "table"; tableId: string; weight: number };

const TIER_THRESHOLDS: readonly number[] = [0, 16, 48, 112, 256, 512, 1024, 2048];
const BIOME_BLEND_WEIGHTS: readonly number[] = [1, 0.6, 0.35, 0.2, 0.1, 0.05, 0, 0];
const CAVE_LOOKUP_CHANCES: readonly number[] = [0, 0.05, 0.15, 0.25, 0.3, 0.3, 0, 0];

const UNIQUE_ITEMS = new Set<string>([
  "minecraft:nether_star",
  "minecraft:beacon",
  "minecraft:elytra",
  "minecraft:enchanted_golden_apple",
  "minecraft:echo_shard",
  "minecraft:end_crystal",
  "minecraft:trident",
  "minecraft:totem_of_undying",
  "minecraft:heart_of_the_sea",
  "minecraft:conduit",
  "minecraft:nautilus_shell",
]);

const UNIQUE_SUFFIXES = [
  "_helmet",
  "_chestplate",
  "_leggings",
  "_boots",
  "_sword",
  "_pickaxe",
  "_axe",
  "_shovel",
  "_hoe",
];

const COMPRESSED_ITEMS = new Set<string>([
  "minecraft:coal_block",
  "minecraft:copper_block",
  "minecraft:iron_block",
  "minecraft:gold_block",
  "minecraft:redstone_block",
  "minecraft:lapis_block",
  "minecraft:quartz_block",
  "minecraft:amethyst_block",
  "minecraft:diamond_block",
  "minecraft:netherite_ingot",
  "minecraft:netherite_block",
  "minecraft:crying_obsidian",
]);

const itemEntry = (itemId: string, min: number, max: number, weight: number): TierPoolEntry => ({
  type: "item",
  itemId,
  min,
  max,
  weight,
});

const tableEntry = (tableId: string, weight: number): TierPoolEntry => ({
  type: "table",
  tableId,
  weight,
});

const OVERWORLD_POOLS: Readonly<Record<Exclude<ProgressionTierIndex, 0>, readonly TierPoolEntry[]>> = {
  1: [
    itemEntry("minecraft:stone", 1, 2, 18),
    itemEntry("minecraft:cobblestone", 2, 4, 18),
    itemEntry("minecraft:deepslate", 1, 2, 14),
    itemEntry("minecraft:coal", 1, 2, 16),
    itemEntry("minecraft:raw_copper", 1, 2, 14),
    itemEntry("minecraft:raw_iron", 1, 1, 12),
    tableEntry("chunklock:generic/structure/abandoned_mineshaft", 8),
  ],
  2: [
    itemEntry("minecraft:coal", 1, 3, 18),
    itemEntry("minecraft:copper_ingot", 1, 2, 16),
    itemEntry("minecraft:iron_ingot", 1, 2, 18),
    itemEntry("minecraft:redstone", 2, 4, 14),
    itemEntry("minecraft:lapis_lazuli", 2, 4, 14),
    tableEntry("chunklock:generic/structure/geode", 7),
    tableEntry("chunklock:generic/structure/shipwreck", 7),
    tableEntry("chunklock:generic/structure/desert_temple", 6),
  ],
  3: [
    itemEntry("minecraft:coal_block", 1, 1, 14),
    itemEntry("minecraft:copper_block", 1, 1, 14),
    itemEntry("minecraft:iron_block", 1, 1, 16),
    itemEntry("minecraft:gold_ingot", 1, 2, 14),
    itemEntry("minecraft:redstone_block", 1, 1, 12),
    itemEntry("minecraft:lapis_block", 1, 1, 12),
    itemEntry("minecraft:amethyst_block", 1, 1, 8),
    itemEntry("minecraft:obsidian", 1, 1, 5),
    tableEntry("chunklock:generic/rare/rare", 5),
  ],
  4: [
    itemEntry("minecraft:iron_block", 1, 1, 16),
    itemEntry("minecraft:gold_block", 1, 1, 14),
    itemEntry("minecraft:obsidian", 1, 2, 12),
    itemEntry("minecraft:quartz_block", 1, 1, 12),
    itemEntry("minecraft:diamond", 1, 1, 14),
    itemEntry("minecraft:emerald", 1, 2, 10),
    itemEntry("minecraft:prismarine", 2, 4, 6),
    tableEntry("chunklock:generic/structure/ocean_monument", 3),
    tableEntry("chunklock:generic/structure/nether_fortress", 3),
    tableEntry("chunklock:generic/rare/rare", 10),
  ],
  5: [
    itemEntry("minecraft:iron_block", 1, 2, 16),
    itemEntry("minecraft:gold_block", 1, 1, 14),
    itemEntry("minecraft:redstone_block", 1, 2, 12),
    itemEntry("minecraft:diamond", 1, 2, 16),
    itemEntry("minecraft:blaze_rod", 1, 1, 10),
    itemEntry("minecraft:crying_obsidian", 1, 1, 8),
    itemEntry("minecraft:ancient_debris", 1, 1, 4),
    tableEntry("chunklock:generic/structure/bastion", 3),
    tableEntry("chunklock:generic/rare/rare", 15),
    tableEntry("chunklock:generic/rare/ultra_rare", 2),
  ],
  6: [
    itemEntry("minecraft:diamond", 1, 2, 16),
    itemEntry("minecraft:diamond_block", 1, 1, 12),
    itemEntry("minecraft:gold_block", 1, 2, 14),
    itemEntry("minecraft:ancient_debris", 1, 1, 10),
    itemEntry("minecraft:netherite_scrap", 1, 1, 10),
    itemEntry("minecraft:shulker_shell", 1, 1, 8),
    tableEntry("chunklock:generic/structure/end_city", 6),
    tableEntry("chunklock:generic/rare/rare", 20),
    tableEntry("chunklock:generic/rare/ultra_rare", 4),
  ],
  7: [
    itemEntry("minecraft:diamond_block", 1, 1, 14),
    itemEntry("minecraft:gold_block", 1, 2, 12),
    itemEntry("minecraft:obsidian", 1, 2, 10),
    itemEntry("minecraft:ender_pearl", 1, 1, 8),
    itemEntry("minecraft:ancient_debris", 1, 1, 12),
    itemEntry("minecraft:netherite_ingot", 1, 1, 7),
    itemEntry("minecraft:netherite_block", 1, 1, 2),
    itemEntry("minecraft:shulker_shell", 1, 1, 4),
    tableEntry("chunklock:generic/rare/rare", 25),
    tableEntry("chunklock:generic/rare/ultra_rare", 6),
  ],
};

const NETHER_POOLS: Readonly<Record<Exclude<ProgressionTierIndex, 0>, readonly TierPoolEntry[]>> = {
  1: [
    itemEntry("minecraft:netherrack", 2, 4, 24),
    itemEntry("minecraft:blackstone", 1, 3, 22),
    itemEntry("minecraft:basalt", 1, 3, 18),
    itemEntry("minecraft:nether_brick", 1, 2, 18),
    itemEntry("minecraft:quartz", 1, 3, 18),
  ],
  2: [
    itemEntry("minecraft:blackstone", 2, 4, 20),
    itemEntry("minecraft:magma_block", 1, 2, 18),
    itemEntry("minecraft:glowstone_dust", 2, 4, 18),
    itemEntry("minecraft:gold_ingot", 1, 2, 20),
    itemEntry("minecraft:quartz_block", 1, 1, 14),
    tableEntry("chunklock:generic/structure/nether_fortress", 10),
  ],
  3: [
    itemEntry("minecraft:quartz_block", 1, 1, 20),
    itemEntry("minecraft:glowstone", 1, 2, 18),
    itemEntry("minecraft:gold_block", 1, 1, 18),
    itemEntry("minecraft:obsidian", 1, 2, 16),
    itemEntry("minecraft:blaze_rod", 1, 1, 16),
    tableEntry("chunklock:generic/structure/bastion", 7),
    tableEntry("chunklock:generic/rare/rare", 5),
  ],
  4: [
    itemEntry("minecraft:gold_block", 1, 1, 22),
    itemEntry("minecraft:crying_obsidian", 1, 1, 18),
    itemEntry("minecraft:blaze_rod", 1, 2, 18),
    itemEntry("minecraft:ancient_debris", 1, 1, 14),
    tableEntry("chunklock:generic/structure/bastion", 18),
    tableEntry("chunklock:generic/rare/rare", 10),
  ],
  5: [
    itemEntry("minecraft:gold_block", 1, 2, 20),
    itemEntry("minecraft:crying_obsidian", 1, 1, 18),
    itemEntry("minecraft:ancient_debris", 1, 1, 20),
    itemEntry("minecraft:netherite_scrap", 1, 1, 15),
    tableEntry("chunklock:generic/structure/bastion", 10),
    tableEntry("chunklock:generic/rare/rare", 15),
    tableEntry("chunklock:generic/rare/ultra_rare", 2),
  ],
  6: [
    itemEntry("minecraft:gold_block", 1, 2, 18),
    itemEntry("minecraft:ancient_debris", 1, 1, 22),
    itemEntry("minecraft:netherite_scrap", 1, 1, 20),
    itemEntry("minecraft:netherite_ingot", 1, 1, 16),
    tableEntry("chunklock:generic/rare/rare", 20),
    tableEntry("chunklock:generic/rare/ultra_rare", 4),
  ],
  7: [
    itemEntry("minecraft:ancient_debris", 1, 1, 20),
    itemEntry("minecraft:netherite_ingot", 1, 1, 20),
    itemEntry("minecraft:netherite_block", 1, 1, 12),
    itemEntry("minecraft:nether_star", 1, 1, 9),
    itemEntry("minecraft:beacon", 1, 1, 8),
    tableEntry("chunklock:generic/rare/rare", 25),
    tableEntry("chunklock:generic/rare/ultra_rare", 6),
  ],
};

const END_POOLS: Readonly<Record<Exclude<ProgressionTierIndex, 0>, readonly TierPoolEntry[]>> = {
  1: [
    itemEntry("minecraft:end_stone", 2, 4, 38),
    itemEntry("minecraft:chorus_fruit", 1, 3, 28),
    itemEntry("minecraft:ender_pearl", 1, 1, 20),
    itemEntry("minecraft:obsidian", 1, 1, 14),
  ],
  2: [
    itemEntry("minecraft:end_stone", 2, 4, 28),
    itemEntry("minecraft:purpur_block", 1, 3, 24),
    itemEntry("minecraft:ender_pearl", 1, 2, 24),
    itemEntry("minecraft:obsidian", 1, 2, 16),
    tableEntry("chunklock:generic/structure/end_city", 8),
  ],
  3: [
    itemEntry("minecraft:purpur_block", 2, 4, 22),
    itemEntry("minecraft:ender_pearl", 1, 2, 22),
    itemEntry("minecraft:obsidian", 1, 2, 20),
    itemEntry("minecraft:shulker_shell", 1, 1, 16),
    tableEntry("chunklock:generic/structure/end_city", 15),
    tableEntry("chunklock:generic/rare/rare", 5),
  ],
  4: [
    itemEntry("minecraft:obsidian", 1, 2, 20),
    itemEntry("minecraft:ender_pearl", 1, 2, 20),
    itemEntry("minecraft:shulker_shell", 1, 1, 20),
    itemEntry("minecraft:diamond", 1, 2, 15),
    tableEntry("chunklock:generic/structure/end_city", 15),
    tableEntry("chunklock:generic/rare/rare", 10),
  ],
  5: [
    itemEntry("minecraft:shulker_shell", 1, 1, 24),
    itemEntry("minecraft:diamond", 1, 2, 20),
    itemEntry("minecraft:end_crystal", 1, 1, 15),
    itemEntry("minecraft:ancient_debris", 1, 1, 12),
    tableEntry("chunklock:generic/structure/end_city", 12),
    tableEntry("chunklock:generic/rare/rare", 15),
    tableEntry("chunklock:generic/rare/ultra_rare", 2),
  ],
  6: [
    itemEntry("minecraft:shulker_shell", 1, 1, 22),
    itemEntry("minecraft:diamond_block", 1, 1, 20),
    itemEntry("minecraft:end_crystal", 1, 1, 16),
    itemEntry("minecraft:ancient_debris", 1, 1, 18),
    tableEntry("chunklock:generic/rare/rare", 20),
    tableEntry("chunklock:generic/rare/ultra_rare", 4),
  ],
  7: [
    itemEntry("minecraft:shulker_shell", 1, 1, 18),
    itemEntry("minecraft:diamond_block", 1, 1, 18),
    itemEntry("minecraft:end_crystal", 1, 1, 12),
    itemEntry("minecraft:netherite_ingot", 1, 1, 16),
    itemEntry("minecraft:elytra", 1, 1, 5),
    tableEntry("chunklock:generic/rare/rare", 25),
    tableEntry("chunklock:generic/rare/ultra_rare", 6),
  ],
};

function randomValue(random: () => number): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("Progression random source must return a finite value in [0, 1)");
  }
  return value;
}

function choosePoolEntry(pool: readonly TierPoolEntry[], random: () => number): TierPoolEntry {
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  const target = randomValue(random) * totalWeight;
  let cumulative = 0;
  for (const entry of pool) {
    cumulative += entry.weight;
    if (target < cumulative) return entry;
  }
  return pool[pool.length - 1];
}

function dimensionPoolFor(dimensionId: string, tier: Exclude<ProgressionTierIndex, 0>): readonly TierPoolEntry[] {
  const key = dimensionId.startsWith("minecraft:") ? dimensionId.slice("minecraft:".length) : dimensionId;
  if (key === "nether") return NETHER_POOLS[tier];
  if (key === "the_end") return END_POOLS[tier];
  return OVERWORLD_POOLS[tier];
}

/**
 * Resolves the progression tier (0..7) for a dimension's current unlocked chunk total.
 */
export function getProgressionTier(unlockedCount: number): ProgressionTierIndex {
  for (let tier = TIER_THRESHOLDS.length - 1; tier >= 0; tier--) {
    if (unlockedCount >= TIER_THRESHOLDS[tier]) return tier as ProgressionTierIndex;
  }
  return 0;
}

/**
 * Classifies an item ID into `standard`, `compressed`, or `unique` scaling behavior
 * so high unlock counts (`U <= 4,096+`) stay balanced without breaking `B = 16`.
 */
export function classifyCostScalingMode(itemId: string): CostScalingMode {
  if (UNIQUE_ITEMS.has(itemId) || itemId.startsWith("minecraft:music_disc_")) return "unique";
  if (UNIQUE_SUFFIXES.some((suffix) => itemId.endsWith(suffix))) return "unique";
  if (COMPRESSED_ITEMS.has(itemId)) return "compressed";
  return "standard";
}

/**
 * Selects the Y lookup height for biome sampling, giving Overworld mid-game tiers
 * a controlled chance to sample cave biomes (`Y = 0` or `-32`).
 */
export function selectBiomeLookupPlaneY(
  dimensionId: string,
  tier: ProgressionTierIndex,
  random: () => number = Math.random
): number {
  const chance = CAVE_LOOKUP_CHANCES[tier];
  if (dimensionId === "minecraft:overworld" && chance > 0 && randomValue(random) < chance) {
    return randomValue(random) < 0.5 ? 0 : -32;
  }
  return lookupPlaneY(dimensionId);
}

/**
 * Blends Java biome loot tables with curated multi-tier pools for `0..4,096+` unlocks.
 */
export function rollProgressionRequirement(
  biomeId: string,
  dimensionId: string,
  unlockedCount: number,
  random: () => number = Math.random
): ProgressionRollResult {
  const tier = getProgressionTier(unlockedCount);
  const biomeWeight = BIOME_BLEND_WEIGHTS[tier];

  if (tier === 0 || (biomeWeight > 0 && randomValue(random) < biomeWeight)) {
    const biomeTable = resolveBiomeTable(biomeId);
    const rolled = rollLootTable(biomeTable, random);
    const scalingMode = classifyCostScalingMode(rolled.sourceItemId);
    const baseCount = scalingMode === "unique" ? Math.min(1, Math.max(0, rolled.baseCount)) || 1 : rolled.baseCount;
    return {
      sourceItemId: rolled.sourceItemId,
      baseCount,
      tableId: biomeTable,
      scalingMode,
      tier,
    };
  }

  const pool = dimensionPoolFor(dimensionId, tier);
  const selected = choosePoolEntry(pool, random);
  if (selected.type === "item") {
    const count =
      selected.min === selected.max
        ? selected.min
        : selected.min + Math.floor(randomValue(random) * (selected.max - selected.min + 1));
    const scalingMode = classifyCostScalingMode(selected.itemId);
    return {
      sourceItemId: selected.itemId,
      baseCount: scalingMode === "unique" ? 1 : count,
      tableId: `chunklock:tier/${tier}`,
      scalingMode,
      tier,
    };
  }

  const nested = rollLootTable(selected.tableId, random);
  const scalingMode = classifyCostScalingMode(nested.sourceItemId);
  return {
    sourceItemId: nested.sourceItemId,
    baseCount: scalingMode === "unique" ? 1 : nested.baseCount,
    tableId: `chunklock:tier/${tier}:${selected.tableId}`,
    scalingMode,
    tier,
  };
}
