const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");

function load(name, api = {}, modules = {}, cache = {}) {
  if (cache[name]) return cache[name];
  const file = path.join(__dirname, "../scripts", name + ".ts");
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  cache[name] = module.exports;
  vm.runInNewContext(
    code,
    {
      module,
      exports: module.exports,
      console,
      require: (id) => {
        if (id === "@minecraft/server") return api;
        const dependency = id.replace(/^\.\//, "").replace(/\.js$/, "");
        if (modules[dependency]) return modules[dependency];
        return load(dependency, api, modules, cache);
      },
    },
    { filename: file }
  );
  return module.exports;
}

const item = (name, weight = 1, functions = []) => ({ type: "item", name, weight, functions });
const child = (value, weight = 1, functions = []) => ({ type: "loot_table", value, weight, functions });
const count = (value) => ({ function: "set_count", count: value });
const table = (...entries) => ({ pools: [{ rolls: 1, entries }] });
const plain = (value) => JSON.parse(JSON.stringify(value));

function makeLoot(
  tables,
  validItems = ["minecraft:stone", "minecraft:dirt", "minecraft:oak_log", "minecraft:short_grass"]
) {
  const valid = new Set(validItems);
  const api = { ItemTypes: { get: (itemId) => (valid.has(itemId) ? { id: itemId } : undefined) } };
  return load("loot", api, { "loot-tables-data": { LOOT_TABLES: tables } });
}

function makeRequirementHarness({
  properties = {},
  biomeId = "minecraft:plains",
  dimensionId = "minecraft:overworld",
  validItems,
} = {}) {
  const props = new Map(Object.entries(properties));
  const biomeCalls = [];
  const players = [];
  let biomeUnavailable = false;
  const dimension = {
    id: dimensionId,
    getBlock: () => ({}),
    getBiome: (location) => {
      biomeCalls.push({ ...location });
      if (biomeUnavailable) throw new Error("unloaded biome location");
      return { id: biomeId };
    },
    spawnParticle: () => {},
  };
  const world = {
    getDynamicProperty: (key) => props.get(key),
    setDynamicProperty: (key, value) => props.set(key, value),
    getDynamicPropertyIds: () => [...props.keys()],
    getAllPlayers: () => players,
  };
  const tables = {
    "chunklock:biome/all_biome": table(item("minecraft:stone", 1, [count(1)])),
    "chunklock:biome/plains": table(item("minecraft:oak_log", 1, [count(2)])),
  };
  const loot = makeLoot(tables, validItems);
  const api = { world };
  const modules = { loot };
  const requirements = load("requirements", api, modules);
  return {
    props,
    biomeCalls,
    dimension,
    players,
    world,
    requirements,
    setBiomeUnavailable: (value) => (biomeUnavailable = value),
    loadChunks: (system) => load("chunks", { world, system }, { ...modules, system }).startChunks(),
  };
}

test("weighted rolls preserve table order and select by the configured weights", () => {
  const loot = makeLoot({
    "chunklock:biome/test": table(item("minecraft:stone", 2), item("minecraft:diamond", 8)),
  });

  assert.deepEqual(plain(loot.rollLootTable("chunklock:biome/test", () => 0)), {
    sourceItemId: "minecraft:stone",
    baseCount: 1,
  });
  assert.deepEqual(plain(loot.rollLootTable("chunklock:biome/test", () => 0.2)), {
    sourceItemId: "minecraft:diamond",
    baseCount: 1,
  });
});

test("nested tables roll independently and parent set_count overrides the child result", () => {
  const loot = makeLoot({
    "chunklock:biome/test": table(child("chunklock:generic/item", 1, [count(3)])),
    "chunklock:generic/item": table(item("minecraft:dirt", 1, [count({ min: 2, max: 4 })])),
  });
  const values = [0, 0, 0.99];
  let index = 0;

  assert.deepEqual(plain(loot.rollLootTable("chunklock:biome/test", () => values[index++])), {
    sourceItemId: "minecraft:dirt",
    baseCount: 3,
  });
});

test("set_count ranges include both endpoints", () => {
  const loot = makeLoot({
    "chunklock:biome/test": table(item("minecraft:dirt", 1, [count({ min: 1, max: 3 })])),
  });

  assert.equal(loot.rollLootTable("chunklock:biome/test", () => 0).baseCount, 1);
  assert.equal(loot.rollLootTable("chunklock:biome/test", () => 0.999999).baseCount, 3);
});

test("vanilla gravel table adapter rolls gravel and flint with 9-to-1 weights", () => {
  const loot = makeLoot({
    "chunklock:biome/test": table(child("minecraft:blocks/gravel")),
  });

  assert.deepEqual(plain(loot.rollLootTable("chunklock:biome/test", () => 0.89)), {
    sourceItemId: "minecraft:gravel",
    baseCount: 1,
  });
  assert.deepEqual(plain(loot.rollLootTable("chunklock:biome/test", () => 0.9)), {
    sourceItemId: "minecraft:flint",
    baseCount: 1,
  });
});

test("biome resolver uses exact table IDs, known legacy aliases, and all-biome fallback", () => {
  const biomeTables = [
    "all_biome",
    "badlands",
    "eroded_badlands",
    "wooded_badlands",
    "dark_forest",
    "snowy_plains",
    "ice_spikes",
    "nether_wastes",
    "soul_sand_valley",
    "mushroom_fields",
    "swamp",
    "windswept_hills",
  ];
  const tables = Object.fromEntries(
    biomeTables.map((name) => [`chunklock:biome/${name}`, table(item("minecraft:stone"))])
  );
  const loot = makeLoot(tables);

  assert.equal(loot.resolveBiomeTable("minecraft:snowy_plains"), "chunklock:biome/snowy_plains");
  assert.equal(loot.resolveBiomeTable("minecraft:mesa"), "chunklock:biome/badlands");
  assert.equal(loot.resolveBiomeTable("minecraft:mesa_bryce"), "chunklock:biome/eroded_badlands");
  assert.equal(loot.resolveBiomeTable("minecraft:mesa_plateau"), "chunklock:biome/wooded_badlands");
  assert.equal(loot.resolveBiomeTable("minecraft:mesa_plateau_stone"), "chunklock:biome/wooded_badlands");
  assert.equal(loot.resolveBiomeTable("minecraft:ice_plains"), "chunklock:biome/snowy_plains");
  assert.equal(loot.resolveBiomeTable("minecraft:ice_plains_spikes"), "chunklock:biome/ice_spikes");
  assert.equal(loot.resolveBiomeTable("minecraft:roofed_forest"), "chunklock:biome/dark_forest");
  assert.equal(loot.resolveBiomeTable("minecraft:hell"), "chunklock:biome/nether_wastes");
  assert.equal(loot.resolveBiomeTable("minecraft:soulsand_valley"), "chunklock:biome/soul_sand_valley");
  assert.equal(loot.resolveBiomeTable("minecraft:mushroom_island"), "chunklock:biome/mushroom_fields");
  assert.equal(loot.resolveBiomeTable("minecraft:swampland"), "chunklock:biome/swamp");
  assert.equal(loot.resolveBiomeTable("minecraft:extreme_hills"), "chunklock:biome/windswept_hills");
  assert.equal(loot.resolveBiomeTable("minecraft:unmapped_biome"), "chunklock:biome/all_biome");
});

test("item resolver returns supported mapped IDs and preserves source ID on stone fallback", () => {
  const loot = makeLoot({});

  assert.deepEqual(plain(loot.resolveBedrockItemId("minecraft:short_grass")), {
    sourceItemId: "minecraft:short_grass",
    itemId: "minecraft:short_grass",
    usedFallback: false,
  });
  assert.deepEqual(plain(loot.resolveBedrockItemId("minecraft:grass")), {
    sourceItemId: "minecraft:grass",
    itemId: "minecraft:short_grass",
    usedFallback: false,
  });
  assert.deepEqual(plain(loot.resolveBedrockItemId("minecraft:java_only_item")), {
    sourceItemId: "minecraft:java_only_item",
    itemId: "minecraft:stone",
    usedFallback: true,
  });
});

test("every compiled source table resolves and produces one positive-count item", () => {
  const api = { ItemTypes: { get: (itemId) => ({ id: itemId }) } };
  const loot = load("loot", api);
  const tables = load("loot-tables-data", api).LOOT_TABLES;

  for (const tableId of Object.keys(tables)) {
    const result = loot.rollLootTable(tableId, () => 0.37);
    assert.ok(result.sourceItemId.startsWith("minecraft:"), tableId);
    assert.ok(Number.isInteger(result.baseCount) && result.baseCount > 0, tableId);
  }
});

test("cost scaling preserves all difficulties and dimension thresholds", () => {
  const loot = makeLoot({});

  assert.equal(loot.calculateRemainingCost(3, "minecraft:overworld", 15, 1), 3);
  assert.equal(loot.calculateRemainingCost(3, "minecraft:overworld", 16, 2), 6);
  assert.equal(loot.calculateRemainingCost(3, "minecraft:nether", 16, 3), 24);
  assert.equal(loot.calculateRemainingCost(3, "minecraft:overworld", 16, 4), 96);
  assert.equal(loot.calculateRemainingCost(3, "minecraft:the_end", 31, 2), 3);
  assert.equal(loot.calculateRemainingCost(3, "minecraft:the_end", 32, 3), 24);
  assert.throws(() => loot.calculateRemainingCost(-1, "minecraft:overworld", 0, 2), /base count/);
});

test("roller rejects invalid random values and cyclic table references", () => {
  const loot = makeLoot({
    "chunklock:biome/loop": table(child("chunklock:biome/loop")),
  });

  assert.throws(() => loot.rollLootTable("chunklock:biome/loop", () => 0), /Cyclic loot-table reference/);
  assert.throws(() => loot.rollLootTable("chunklock:biome/loop", () => 1), /random source/);
});

test("getChunkRequirement returns only validated saved requirements", () => {
  const requirement = {
    schemaVersion: 1,
    state: "locked",
    biomeId: "minecraft:plains",
    tableId: "chunklock:biome/plains",
    sourceItemId: "minecraft:oak_log",
    itemId: "minecraft:oak_log",
    baseCount: 2,
    remainingCost: 16,
    difficulty: 2,
  };
  const harness = makeRequirementHarness({
    properties: {
      "chunklock:req:minecraft:overworld:-2:3": JSON.stringify(requirement),
      "chunklock:req:minecraft:overworld:4:5": "{broken",
    },
  });

  assert.deepEqual(
    plain(harness.requirements.getChunkRequirement("minecraft:overworld", -2, 3)),
    requirement
  );
  assert.equal(harness.requirements.getChunkRequirement("minecraft:overworld", 4, 5), undefined);
  assert.equal(harness.requirements.getChunkRequirement("minecraft:overworld", 8, 9), undefined);
});

test("formatItemDisplayName converts namespaced snake case into readable words", () => {
  const harness = makeRequirementHarness();

  assert.equal(harness.requirements.formatItemDisplayName("minecraft:oak_log"), "Oak Log");
  assert.equal(harness.requirements.formatItemDisplayName("custom:ancient_debris"), "Ancient Debris");
});

test("locked cells persist one biome-aware requirement and leave open access state unchanged", () => {
  const cellKey = "chunklock:cell:minecraft:overworld:0:0";
  const reqKey = "chunklock:req:minecraft:overworld:0:0";
  const harness = makeRequirementHarness({ properties: { [cellKey]: 1 } });

  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 0, 0), "created");
  const requirement = JSON.parse(harness.props.get(reqKey));
  assert.deepEqual(requirement, {
    schemaVersion: 1,
    state: "locked",
    biomeId: "minecraft:plains",
    tableId: "chunklock:biome/plains",
    sourceItemId: "minecraft:oak_log",
    itemId: "minecraft:oak_log",
    baseCount: 2,
    remainingCost: 2,
    difficulty: 2,
  });
  assert.deepEqual(harness.biomeCalls[0], { x: 8, y: 128, z: 8 });
  assert.equal(harness.props.get("chunklock:open:minecraft:overworld:0:0"), undefined);
  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 0, 0), "existing");
  assert.equal(harness.biomeCalls.length, 1, "existing requirements must not reroll");
});

test("open cells and missing cell records never receive requirements", () => {
  const cellKey = "chunklock:cell:minecraft:overworld:0:0";
  const open = makeRequirementHarness({
    properties: { [cellKey]: 1, "chunklock:open:minecraft:overworld:0:0": true },
  });
  assert.equal(open.requirements.ensureChunkRequirement(open.dimension, 0, 0), "skipped");
  assert.equal(open.props.has("chunklock:req:minecraft:overworld:0:0"), false);
  assert.equal(open.biomeCalls.length, 0);

  const missing = makeRequirementHarness();
  assert.equal(missing.requirements.ensureChunkRequirement(missing.dimension, 0, 0), "skipped");
  assert.equal(missing.biomeCalls.length, 0);
});

test("new requirements use the saved difficulty and that dimension's credited unlock count", () => {
  const properties = {
    "chunklock:cell:minecraft:overworld:1:0": 1,
    "chunklock:difficulty": 3,
    "chunklock:progress:unlocked:minecraft:overworld": 16,
  };
  const harness = makeRequirementHarness({ properties });

  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 1, 0), "created");
  const requirement = JSON.parse(harness.props.get("chunklock:req:minecraft:overworld:1:0"));
  assert.equal(requirement.difficulty, 3);
  assert.equal(requirement.remainingCost, 16);
});

test("unsupported Bedrock item IDs persist stone fallback and the original Java item ID", () => {
  const harness = makeRequirementHarness({
    properties: { "chunklock:cell:minecraft:overworld:0:0": 1 },
    validItems: ["minecraft:stone"],
  });

  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 0, 0), "created");
  const requirement = JSON.parse(harness.props.get("chunklock:req:minecraft:overworld:0:0"));
  assert.equal(requirement.sourceItemId, "minecraft:oak_log");
  assert.equal(requirement.itemId, "minecraft:stone");
});

test("unknown biomes use all_biome and End requirements use Y=64 and 32-chunk scaling", () => {
  const fallback = makeRequirementHarness({
    biomeId: "minecraft:unknown_biome",
    properties: { "chunklock:cell:minecraft:overworld:0:0": 1 },
  });
  assert.equal(fallback.requirements.ensureChunkRequirement(fallback.dimension, 0, 0), "created");
  const fallbackRequirement = JSON.parse(fallback.props.get("chunklock:req:minecraft:overworld:0:0"));
  assert.equal(fallbackRequirement.tableId, "chunklock:biome/all_biome");
  assert.equal(fallbackRequirement.itemId, "minecraft:stone");

  const end = makeRequirementHarness({
    dimensionId: "minecraft:the_end",
    biomeId: "minecraft:the_end",
    properties: {
      "chunklock:cell:minecraft:the_end:0:0": 1,
      "chunklock:progress:unlocked:minecraft:the_end": 32,
    },
  });
  assert.equal(end.requirements.ensureChunkRequirement(end.dimension, 0, 0), "created");
  assert.deepEqual(end.biomeCalls[0], { x: 8, y: 64, z: 8 });
  const endRequirement = JSON.parse(end.props.get("chunklock:req:minecraft:the_end:0:0"));
  assert.equal(endRequirement.remainingCost, 2);
});

test("unavailable biome queries retry later and corrupt stored requirements are not overwritten", () => {
  const cellKey = "chunklock:cell:minecraft:overworld:0:0";
  const reqKey = "chunklock:req:minecraft:overworld:0:0";
  const harness = makeRequirementHarness({ properties: { [cellKey]: 1 } });
  harness.setBiomeUnavailable(true);
  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 0, 0), "deferred");
  assert.equal(harness.props.has(reqKey), false);
  harness.setBiomeUnavailable(false);
  assert.equal(harness.requirements.ensureChunkRequirement(harness.dimension, 0, 0), "created");

  const broken = makeRequirementHarness({ properties: { [cellKey]: 1, [reqKey]: "{invalid" } });
  assert.equal(broken.requirements.ensureChunkRequirement(broken.dimension, 0, 0), "deferred");
  assert.equal(broken.props.get(reqKey), "{invalid");
  assert.equal(broken.biomeCalls.length, 0);
});

test("chunk scan initializes at most eight new requirements per interval and backfills later", () => {
  const properties = {};
  for (let cx = -1; cx <= 2; cx++) {
    for (let cz = -1; cz <= 2; cz++) {
      properties[`chunklock:cell:minecraft:overworld:${cx}:${cz}`] = 1;
    }
  }
  properties["chunklock:open:minecraft:overworld:1:1"] = true;
  const harness = makeRequirementHarness({ properties });
  const player = {
    dimension: harness.dimension,
    location: { x: 16, y: 64, z: 16 },
    onScreenDisplay: { setActionBar: () => {} },
  };
  harness.players.push(player);
  const intervals = [];
  harness.loadChunks({ runInterval: (callback, ticks) => intervals.push({ callback, ticks }) });

  assert.equal(intervals.length, 1);
  intervals[0].callback();
  const firstInterval = [...harness.props.keys()].filter((key) => key.startsWith("chunklock:req:")).length;
  assert.equal(firstInterval, 8);
  intervals[0].callback();
  const secondInterval = [...harness.props.keys()].filter((key) => key.startsWith("chunklock:req:")).length;
  assert.equal(secondInterval, 15, "remaining locked records are backfilled on later intervals");
});

test("chunk scan uses dimension 2D lookup plane at high altitude and disables prototype spam by default", () => {
  const harness = makeRequirementHarness();
  const blockQueries = [];
  const actions = [];
  let particles = 0;
  harness.dimension.getBlock = (loc) => {
    blockQueries.push({ ...loc });
    return {};
  };
  harness.dimension.spawnParticle = () => {
    particles++;
  };
  harness.players.push({
    dimension: harness.dimension,
    location: { x: 8, y: 400, z: 8 },
    onScreenDisplay: { setActionBar: (msg) => actions.push(msg) },
  });
  const intervals = [];
  harness.loadChunks({ currentTick: 10, runInterval: (callback, ticks) => intervals.push({ callback, ticks }) });

  intervals[0].callback();
  assert.ok(blockQueries.length > 0);
  assert.ok(blockQueries.every((loc) => loc.y === 128), "Overworld chunk checks use fixed Y=128 plane");
  assert.equal(particles, 0, "debug flame particles are off by default");
  assert.equal(actions.length, 0, "prototype action bar is off by default");
});
