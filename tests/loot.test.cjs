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
