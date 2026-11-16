const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");

function load(name, api, modules = {}, cache = {}) {
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
        return modules[dependency] ?? load(dependency, api, modules, cache);
      },
    },
    { filename: file }
  );
  return module.exports;
}

function makeCommandHarness() {
  const props = new Map();
  const enums = new Map();
  const registered = new Map();
  const scheduled = [];
  const runCommands = [];
  const worldMessages = [];
  const removedEntities = [];
  const removedObjectives = [];
  let startupCallback;
  let wallRefreshes = 0;
  let displayRefreshes = 0;
  let resetCollisionCalls = 0;
  let rollCall = 0;

  const helperEntities = [
    { typeId: "chunklock:border_wall", remove: () => removedEntities.push("border_wall") },
    { typeId: "chunklock:requirement_display", remove: () => removedEntities.push("requirement_display") },
  ];

  const makeDim = (id) => ({
    id,
    getBiome: () => ({ id: "minecraft:plains" }),
    getEntities: ({ type }) => helperEntities.filter((entity) => entity.typeId === type),
    runCommand: (cmd) => {
      runCommands.push({ dimensionId: id, cmd });
      for (const player of players) {
        player.location = { x: 168, y: 70, z: -24 };
      }
    },
  });

  const dims = {
    "minecraft:overworld": makeDim("minecraft:overworld"),
    "minecraft:nether": makeDim("minecraft:nether"),
    "minecraft:the_end": makeDim("minecraft:the_end"),
  };

  const makePlayer = (id, name = id) => {
    const playerProps = new Map();
    const messages = [];
    const actions = [];
    const spawnPoints = [];
    return {
      id,
      name,
      dimension: dims["minecraft:overworld"],
      location: { x: 8.5, y: 64, z: 8.5 },
      getViewDirection: () => ({ x: 1, y: 0, z: 0 }),
      getDynamicProperty: (key) => playerProps.get(key),
      setDynamicProperty: (key, value) => (value === undefined ? playerProps.delete(key) : playerProps.set(key, value)),
      getDynamicPropertyIds: () => [...playerProps.keys()],
      sendMessage: (msg) => messages.push(msg),
      onScreenDisplay: { setActionBar: (msg) => actions.push(msg) },
      setSpawnPoint: (loc) => spawnPoints.push(loc),
      playerProps,
      messages,
      actions,
      spawnPoints,
    };
  };

  const players = [makePlayer("p1", "Steve")];

  const api = {
    CommandPermissionLevel: { Any: 0, GameDirectors: 1, Admin: 2 },
    CustomCommandParamType: { Enum: "Enum", Integer: "Integer" },
    CustomCommandStatus: { Success: 0, Failure: 1 },
    world: {
      getAllPlayers: () => players,
      getDimension: (id) => dims[id],
      getDefaultSpawnLocation: () => ({ x: 0, y: 64, z: 0 }),
      getDynamicProperty: (k) => props.get(k),
      setDynamicProperty: (k, v) => (v === undefined ? props.delete(k) : props.set(k, v)),
      getDynamicPropertyIds: () => [...props.keys()],
      sendMessage: (msg) => worldMessages.push(msg),
      scoreboard: {
        removeObjective: (id) => removedObjectives.push(id),
      },
    },
    system: {
      currentTick: 10,
      run: (fn) => scheduled.push(fn),
      beforeEvents: {
        startup: {
          subscribe: (fn) => {
            startupCallback = fn;
          },
        },
      },
    },
  };

  const loot = {
    calculateRemainingCost: (base, _dim, unlocked, difficulty) => {
      if (difficulty === 1) return base;
      const mult = difficulty === 3 ? 4 : difficulty === 4 ? 16 : 1;
      return base * (Math.floor(unlocked / 16) + 1) * mult;
    },
    resolveBedrockItemId: (sourceItemId) => ({ itemId: sourceItemId, sourceItemId }),
    resolveBiomeTable: () => "chunklock:biome/plains",
    rollLootTable: () => {
      rollCall++;
      return rollCall === 1
        ? { sourceItemId: "minecraft:oak_log", baseCount: 2 }
        : { sourceItemId: "minecraft:cobblestone", baseCount: 4 };
    },
  };

  const moduleCache = {
    loot,
    walls: { refreshWalls: () => wallRefreshes++ },
    displays: { refreshRequirementDisplays: () => displayRefreshes++ },
    collision: {
      resetCollisionCheckpoints: (p) => {
        resetCollisionCalls++;
        if (p) p.playerProps.delete("chunklock:collision:safe_positions");
      },
    },
  };

  const access = load("access", api, moduleCache, moduleCache);
  const requirements = load("requirements", api, moduleCache, moduleCache);
  const commands = load("commands", api, moduleCache, moduleCache);
  commands.startCommands();

  const registry = {
    registerEnum: (name, values) => enums.set(name, values),
    registerCommand: (definition, callback) => registered.set(definition.name, { definition, callback }),
  };
  startupCallback({ customCommandRegistry: registry });

  const invoke = (name, origin, ...args) => {
    const entry = registered.get(name);
    assert.ok(entry, `Command ${name} must be registered`);
    const result = entry.callback(origin, ...args);
    while (scheduled.length) scheduled.shift()();
    return result;
  };

  return {
    access,
    api,
    dims,
    displayRefreshes: () => displayRefreshes,
    enums,
    invoke,
    players,
    props,
    registered,
    removedEntities,
    removedObjectives,
    requirements,
    resetCollisionCalls: () => resetCollisionCalls,
    runCommands,
    wallRefreshes: () => wallRefreshes,
    worldMessages,
  };
}

test("commands register with proper permissions, cheatsRequired flags and enums", () => {
  const h = makeCommandHarness();
  assert.deepEqual([...h.enums.get("chunklock:difficulty_level")], ["easy", "normal", "hard", "impossible"]);
  assert.equal(h.registered.has("chunklock:titles"), false, "center-screen title commands must not exist");
  assert.deepEqual([...h.enums.get("chunklock:reset_action")], ["confirm"]);

  for (const playerCmd of ["chunklock:reroll", "chunklock:status"]) {
    const def = h.registered.get(playerCmd).definition;
    assert.equal(def.permissionLevel, h.api.CommandPermissionLevel.Any);
    assert.equal(def.cheatsRequired, false);
  }
  for (const adminCmd of ["chunklock:difficulty", "chunklock:spreadplayers", "chunklock:reset"]) {
    const def = h.registered.get(adminCmd).definition;
    assert.equal(def.permissionLevel, h.api.CommandPermissionLevel.GameDirectors);
    assert.equal(def.cheatsRequired, true);
  }
});

test("reroll works only on Easy, targets looked-at locked chunk, and increments counters", () => {
  const h = makeCommandHarness();
  const player = h.players[0];
  h.props.set("chunklock:open:minecraft:overworld:0:0", true);
  h.props.set("chunklock:cell:minecraft:overworld:1:0", 1);
  h.requirements.ensureChunkRequirement(h.dims["minecraft:overworld"], 1, 0);

  const rejectedNormal = h.invoke("chunklock:reroll", { sourceEntity: player });
  assert.equal(rejectedNormal.status, h.api.CustomCommandStatus.Failure);

  h.invoke("chunklock:difficulty", { sourceEntity: player }, "easy");
  player.getViewDirection = () => ({ x: 0, y: 1, z: 0 });
  const rejectedDown = h.invoke("chunklock:reroll", { sourceEntity: player });
  assert.equal(rejectedDown.status, h.api.CustomCommandStatus.Failure);

  player.getViewDirection = () => ({ x: 1, y: 0, z: 0 });
  const ok = h.invoke("chunklock:reroll", { sourceEntity: player });
  assert.equal(ok.status, h.api.CustomCommandStatus.Success);

  const rerolled = h.requirements.getChunkRequirement("minecraft:overworld", 1, 0);
  assert.equal(rerolled.itemId, "minecraft:cobblestone");
  assert.equal(rerolled.remainingCost, 4);
  assert.equal(h.access.getWorldRerolledCount(), 1);
  assert.equal(h.access.getPlayerRerolledCount(player), 1);
  assert.ok(h.displayRefreshes() >= 2);
});

test("difficulty locks after first unlock and status summarizes counts", () => {
  const h = makeCommandHarness();
  const player = h.players[0];
  h.props.set("chunklock:cell:minecraft:overworld:1:0", 1);
  h.requirements.ensureChunkRequirement(h.dims["minecraft:overworld"], 1, 0);

  const hardRes = h.invoke("chunklock:difficulty", { sourceEntity: player }, "hard");
  assert.equal(hardRes.status, h.api.CustomCommandStatus.Success);
  assert.equal(h.requirements.getChunkRequirement("minecraft:overworld", 1, 0).remainingCost, 8);
  assert.equal(h.worldMessages.at(-1), "Chunklock difficulty set to Hard.");

  h.access.unlockChunk(player, "minecraft:overworld", 1, 0);
  const blocked = h.invoke("chunklock:difficulty", { sourceEntity: player }, "easy");
  assert.equal(blocked.status, h.api.CustomCommandStatus.Failure);

  const status = h.invoke("chunklock:status", { sourceEntity: player });
  assert.equal(status.status, h.api.CustomCommandStatus.Success);
  assert.match(status.message, /Difficulty: Hard/);
  assert.match(status.message, /Global unlocks: 1 \(Overworld #1, Nether #0, The End #0\)/);
  assert.match(status.message, /Your unlocks: 1/);
});

test("spreadplayers opens landing chunks without credit and reset wipes all Chunklock state", () => {
  const h = makeCommandHarness();
  const player = h.players[0];
  const badRadius = h.invoke("chunklock:spreadplayers", { sourceEntity: player }, 5, 2);
  assert.equal(badRadius.status, h.api.CustomCommandStatus.Failure);

  const spreadOk = h.invoke("chunklock:spreadplayers", { sourceEntity: player });
  assert.equal(spreadOk.status, h.api.CustomCommandStatus.Success);
  assert.equal(h.runCommands[0].cmd, "spreadplayers 8 8 200 500 @a");
  assert.equal(h.access.isOpenCell("minecraft:overworld", 10, -2), true);
  assert.equal(h.access.getTotalUnlockedCount(), 0);
  assert.equal(player.spawnPoints.length, 1);
  assert.ok(h.resetCollisionCalls() >= 1);

  h.props.set("chunklock:progress:unlocked:total", 5);
  player.setDynamicProperty("chunklock:milestones", '["first_overworld"]');
  const resetFail = h.invoke("chunklock:reset", { sourceEntity: player }, "nope");
  assert.equal(resetFail.status, h.api.CustomCommandStatus.Failure);

  const resetOk = h.invoke("chunklock:reset", { sourceEntity: player }, "confirm");
  assert.equal(resetOk.status, h.api.CustomCommandStatus.Success);
  assert.equal(h.props.has("chunklock:progress:unlocked:total"), false);
  assert.equal(player.getDynamicProperty("chunklock:milestones"), undefined);
  assert.ok(h.removedEntities.includes("border_wall"));
  assert.ok(h.removedEntities.includes("requirement_display"));
  assert.deepEqual([...h.removedObjectives], ["chunklock:unlocked"]);
  // Player at (168, 70, -24) was re-seeded into chunk (10, -2).
  assert.equal(h.access.isOpenCell("minecraft:overworld", 10, -2), true);
});
