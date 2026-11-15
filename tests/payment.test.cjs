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

class TestItemStack {
  constructor(typeId, amount) {
    this.typeId = typeId;
    this.amount = amount;
  }

  clone() {
    return new TestItemStack(this.typeId, this.amount);
  }
}

function makeRequirement(remainingCost = 10) {
  return {
    schemaVersion: 1,
    state: "locked",
    biomeId: "minecraft:plains",
    tableId: "chunklock:biome/plains",
    sourceItemId: "minecraft:oak_log",
    itemId: "minecraft:oak_log",
    baseCount: 2,
    remainingCost,
    difficulty: 2,
  };
}

function makeHarness({ remainingCost = 10, mainhand, players } = {}) {
  const props = new Map([
    ["chunklock:cell:minecraft:overworld:1:0", 1],
    ["chunklock:req:minecraft:overworld:1:0", JSON.stringify(makeRequirement(remainingCost))],
  ]);
  const callbacks = {};
  const scheduled = [];
  const sounds = [];
  const particles = [];
  let rejectEquipmentWrite = false;
  const dimension = {
    id: "minecraft:overworld",
    playSound: (id, location, options) => sounds.push({ id, location, options }),
    spawnParticle: (id, location) => particles.push({ id, location }),
  };
  const makePlayer = (id, held) => {
    const player = {
      id,
      dimension,
      mainhand: held,
      actions: [],
      messages: [],
      getDynamicProperty: (key) => player.props.get(key),
      setDynamicProperty: (key, value) => {
        if (value === undefined) player.props.delete(key);
        else player.props.set(key, value);
      },
      getComponent: (componentId) =>
        componentId === "minecraft:equippable"
          ? {
              getEquipment: (slot) => (slot === "Mainhand" ? player.mainhand : undefined),
              setEquipment: (slot, value) => {
                if (rejectEquipmentWrite) return false;
                if (slot === "Mainhand") player.mainhand = value;
                return true;
              },
            }
          : undefined,
      onScreenDisplay: { setActionBar: (text) => player.actions.push(text) },
      sendMessage: (text) => player.messages.push(text),
    };
    player.props = new Map();
    return player;
  };
  const activePlayers = players ?? [makePlayer("player-1", mainhand)];
  const world = {
    beforeEvents: {
      playerInteractWithEntity: {
        subscribe: (callback) => {
          callbacks.interact = callback;
        },
      },
    },
    afterEvents: {
      playerLeave: {
        subscribe: (callback) => {
          callbacks.leave = callback;
        },
      },
    },
    getDynamicProperty: (key) => props.get(key),
    setDynamicProperty: (key, value) => {
      if (value === undefined) props.delete(key);
      else props.set(key, value);
    },
    getAllPlayers: () => activePlayers,
    getDimension: () => dimension,
  };
  const system = {
    currentTick: 10,
    run: (callback) => scheduled.push(callback),
  };
  const api = {
    EquipmentSlot: { Mainhand: "Mainhand" },
    GameMode: { Creative: "Creative" },
    ItemStack: TestItemStack,
    system,
    world,
  };
  const access = load("access", api);
  const loot = {
    calculateRemainingCost: () => 1,
    resolveBedrockItemId: () => ({ itemId: "minecraft:oak_log", sourceItemId: "minecraft:oak_log" }),
    resolveBiomeTable: () => "chunklock:biome/plains",
    rollLootTable: () => ({ sourceItemId: "minecraft:oak_log", baseCount: 1 }),
  };
  const requirements = load("requirements", api, { access, loot });
  let wallRefreshes = 0;
  let displayRefreshes = 0;
  const walls = { refreshWalls: () => wallRefreshes++ };
  const displays = { refreshRequirementDisplays: () => displayRefreshes++ };
  const payment = load("payment", api, { access, requirements, walls, displays });
  const target = {
    typeId: "chunklock:requirement_display",
    dimension,
    location: { x: 15.7, y: 64, z: 8 },
    getDynamicProperty: (key) => ({ "chunklock:display:cx": 1, "chunklock:display:cz": 0 })[key],
  };
  const click = (player = activePlayers[0], clickedTarget = target) => {
    const event = { cancel: false, player, target: clickedTarget };
    callbacks.interact(event);
    return event;
  };
  const flush = () => {
    while (scheduled.length) scheduled.shift()();
  };

  return {
    access,
    activePlayers,
    callbacks,
    click,
    dimension,
    displayRefreshes: () => displayRefreshes,
    flush,
    makePlayer,
    particles,
    payment,
    props,
    requirements,
    setRejectEquipmentWrite: (value) => (rejectEquipmentWrite = value),
    sounds,
    system,
    target,
    wallRefreshes: () => wallRefreshes,
    world,
  };
}

function savedRequirement(harness) {
  return harness.requirements.getChunkRequirement("minecraft:overworld", 1, 0);
}

test("empty and incorrect main-hand items are retained and report the requirement", () => {
  const harness = makeHarness();
  const player = harness.activePlayers[0];
  harness.payment.startPayments();
  const emptyClick = harness.click();
  assert.equal(emptyClick.cancel, true);
  harness.flush();
  assert.match(player.actions.at(-1), /Oak Log × 10/);
  assert.equal(savedRequirement(harness).remainingCost, 10);

  harness.system.currentTick += 5;
  player.mainhand = new TestItemStack("minecraft:dirt", 4);
  harness.click();
  harness.flush();
  assert.equal(player.mainhand.typeId, "minecraft:dirt");
  assert.equal(player.mainhand.amount, 4);
  assert.match(player.actions.at(-1), /requires Oak Log/);
  assert.equal(harness.sounds.at(-1).id, "note.didgeridoo");
});

test("a main-hand stack larger than the remaining cost leaves its excess in hand", () => {
  const harness = makeHarness({ remainingCost: 5, mainhand: new TestItemStack("minecraft:oak_log", 8) });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].mainhand.amount, 3);
  assert.equal(harness.props.has("chunklock:req:minecraft:overworld:1:0"), false);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.get("chunklock:progress:unlocked:minecraft:overworld"), 1);
  assert.equal(harness.props.get("chunklock:progress:unlocked:total"), 1);
  assert.equal(harness.activePlayers[0].props.get("chunklock:progress:player:unlocked:minecraft:overworld"), 1);
  assert.equal(harness.activePlayers[0].props.get("chunklock:progress:player:unlocked:total"), 1);
  assert.equal(harness.wallRefreshes(), 1);
  assert.equal(harness.displayRefreshes(), 1);
});

test("an exact main-hand payment consumes the stack and opens the chunk", () => {
  const harness = makeHarness({ remainingCost: 6, mainhand: new TestItemStack("minecraft:oak_log", 6) });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].mainhand, undefined);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.has("chunklock:req:minecraft:overworld:1:0"), false);
});

test("partial payment consumes only the required amount and updates the saved cost", () => {
  const harness = makeHarness({ remainingCost: 8, mainhand: new TestItemStack("minecraft:oak_log", 3) });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].mainhand, undefined);
  assert.equal(savedRequirement(harness).remainingCost, 5);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
  assert.equal(harness.props.has("chunklock:progress:unlocked:total"), false);
  assert.equal(harness.displayRefreshes(), 1);
  assert.equal(harness.sounds.at(-1).id, "block.end_portal_frame.fill");
  assert.equal(harness.particles.at(-1).id, "minecraft:totem_particle");
});

test("a held barrier unlocks without being consumed", () => {
  const barrier = new TestItemStack("minecraft:barrier", 1);
  const harness = makeHarness({ mainhand: barrier });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].mainhand, barrier);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.has("chunklock:req:minecraft:overworld:1:0"), false);
});

test("click processing is debounced and concurrent clicks unlock and credit only once", () => {
  const harness = makeHarness({ mainhand: new TestItemStack("minecraft:oak_log", 10) });
  const first = harness.activePlayers[0];
  const second = harness.makePlayer("player-2", new TestItemStack("minecraft:oak_log", 10));
  harness.activePlayers.push(second);
  harness.payment.startPayments();
  const firstClick = harness.click(first);
  const debouncedClick = harness.click(first);
  const concurrentClick = harness.click(second);
  assert.equal(firstClick.cancel, true);
  assert.equal(debouncedClick.cancel, true);
  assert.equal(concurrentClick.cancel, true);
  harness.flush();

  assert.equal(first.mainhand, undefined);
  assert.equal(second.mainhand.amount, 10);
  assert.equal(harness.props.get("chunklock:progress:unlocked:total"), 1);
  assert.equal(first.props.get("chunklock:progress:player:unlocked:total"), 1);
  assert.equal(second.props.has("chunklock:progress:player:unlocked:total"), false);
  assert.equal(harness.wallRefreshes(), 1);
});

test("failed equipment mutation preserves the requirement and does not unlock", () => {
  const harness = makeHarness({ remainingCost: 3, mainhand: new TestItemStack("minecraft:oak_log", 3) });
  harness.setRejectEquipmentWrite(true);
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].mainhand.amount, 3);
  assert.equal(savedRequirement(harness).remainingCost, 3);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
});

test("unlock progress is dimension-aware and idempotent", () => {
  const harness = makeHarness();
  const player = harness.activePlayers[0];
  assert.equal(harness.access.unlockChunk(player, "minecraft:overworld", 1, 0), true);
  assert.equal(harness.access.unlockChunk(player, "minecraft:overworld", 1, 0), false);
  assert.equal(harness.access.unlockChunk(player, "minecraft:nether", 1, 0), true);
  assert.equal(harness.props.get("chunklock:progress:unlocked:total"), 2);
  assert.equal(harness.props.get("chunklock:progress:unlocked:minecraft:overworld"), 1);
  assert.equal(harness.props.get("chunklock:progress:unlocked:minecraft:nether"), 1);
  assert.equal(player.props.get("chunklock:progress:player:unlocked:total"), 2);
  assert.equal(player.props.get("chunklock:progress:player:unlocked:minecraft:overworld"), 1);
  assert.equal(player.props.get("chunklock:progress:player:unlocked:minecraft:nether"), 1);
});

test("failed progress persistence rolls back counters and leaves the chunk locked", () => {
  const harness = makeHarness();
  const player = harness.activePlayers[0];
  const setProperty = harness.world.setDynamicProperty;
  harness.world.setDynamicProperty = (propertyId, value) => {
    if (propertyId === "chunklock:progress:unlocked:total") throw new Error("property write failed");
    setProperty(propertyId, value);
  };

  assert.throws(() => harness.access.unlockChunk(player, "minecraft:overworld", 1, 0), /property write failed/);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
  assert.equal(harness.props.has("chunklock:progress:unlocked:minecraft:overworld"), false);
  assert.equal(harness.props.has("chunklock:progress:unlocked:total"), false);
  assert.equal(player.props.has("chunklock:progress:player:unlocked:total"), false);
});
