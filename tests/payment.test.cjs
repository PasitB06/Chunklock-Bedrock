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

class TestContainer {
  constructor(items = [], onWrite = () => {}) {
    this.size = 36;
    this.items = Array.from({ length: this.size }, (_, slot) => items[slot]?.clone());
    this.onWrite = onWrite;
  }

  getItem(slot) {
    return this.items[slot]?.clone();
  }

  setItem(slot, stack) {
    this.onWrite(slot, stack);
    this.items[slot] = stack?.clone();
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

function makeHarness({ remainingCost = 10, inventory = [], offhand, players } = {}) {
  const props = new Map([
    ["chunklock:cell:minecraft:overworld:1:0", 1],
    ["chunklock:req:minecraft:overworld:1:0", JSON.stringify(makeRequirement(remainingCost))],
  ]);
  const callbacks = {};
  const scheduled = [];
  const sounds = [];
  const particles = [];
  let rejectContainerWriteAt = 0;
  let containerWrites = 0;
  const dimension = {
    id: "minecraft:overworld",
    playSound: (id, location, options) => sounds.push({ id, location, options }),
    spawnParticle: (id, location) => particles.push({ id, location }),
  };
  const makePlayer = (id, items = [], heldOffhand) => {
    const container = new TestContainer(items, (slot) => {
      containerWrites++;
      if (containerWrites === rejectContainerWriteAt) throw new Error("inventory write failed");
    });
    let offhandStack = heldOffhand?.clone();
    const player = {
      id,
      dimension,
      selectedSlotIndex: 0,
      actions: [],
      messages: [],
      get mainhand() {
        return container.getItem(player.selectedSlotIndex);
      },
      set mainhand(value) {
        container.setItem(player.selectedSlotIndex, value);
      },
      get offhand() {
        return offhandStack?.clone();
      },
      get inventory() {
        return container;
      },
      getDynamicProperty: (key) => player.props.get(key),
      setDynamicProperty: (key, value) => {
        if (value === undefined) player.props.delete(key);
        else player.props.set(key, value);
      },
      getComponent: (componentId) => {
        if (componentId === "minecraft:inventory") return { container };
        if (componentId === "minecraft:equippable") {
          return {
            getEquipment: (slot) => {
              if (slot === "Mainhand") return container.getItem(player.selectedSlotIndex);
              if (slot === "Offhand") return offhandStack?.clone();
              return undefined;
            },
            setEquipment: (slot, value) => {
              if (slot === "Mainhand") container.setItem(player.selectedSlotIndex, value);
              else if (slot === "Offhand") offhandStack = value?.clone();
              return true;
            },
          };
        }
        return undefined;
      },
      onScreenDisplay: { setActionBar: (text) => player.actions.push(text) },
      sendMessage: (text) => player.messages.push(text),
    };
    player.props = new Map();
    return player;
  };
  const activePlayers = players ?? [makePlayer("player-1", inventory, offhand)];
  const world = {
    beforeEvents: {
      playerInteractWithBlock: { subscribe: (fn) => { callbacks.block = fn; } },
      itemUse: { subscribe: (fn) => { callbacks.use = fn; } },
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
    EquipmentSlot: { Mainhand: "Mainhand", Offhand: "Offhand" },
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
  const notices = load("notices", api);
  const payment = load("payment", api, { access, notices, requirements, walls, displays });
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
    api,
    callbacks,
    click,
    dimension,
    displayRefreshes: () => displayRefreshes,
    flush,
    makePlayer,
    notices,
    particles,
    payment,
    props,
    requirements,
    setRejectContainerWriteAt: (writeNumber) => (rejectContainerWriteAt = writeNumber),
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

function itemAt(player, slot) {
  return player.inventory.getItem(slot);
}

test("empty and incorrect inventory items are retained and report the requirement", () => {
  const harness = makeHarness();
  const player = harness.activePlayers[0];
  harness.payment.startPayments();
  const emptyClick = harness.click();
  assert.equal(emptyClick.cancel, true);
  harness.flush();
  assert.equal(player.actions.at(-1), "This chunk requires Oak Log × 10.");
  assert.equal(savedRequirement(harness).remainingCost, 10);

  harness.system.currentTick += 5;
  player.inventory.setItem(3, new TestItemStack("minecraft:dirt", 4));
  harness.click();
  harness.flush();
  assert.equal(itemAt(player, 3).typeId, "minecraft:dirt");
  assert.equal(itemAt(player, 3).amount, 4);
  assert.match(player.actions.at(-1), /requires Oak Log/);
  assert.equal(harness.sounds.at(-1).id, "note.didgeridoo");
  assert.equal(harness.particles.at(-1).id, "minecraft:basic_smoke_particle");
});

test("one click pays across multiple inventory stacks with excess left in the last stack", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:oak_log", 64);
  inventory[1] = new TestItemStack("minecraft:oak_log", 64);
  inventory[2] = new TestItemStack("minecraft:oak_log", 16);
  const harness = makeHarness({ remainingCost: 130, inventory });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(harness.activePlayers[0], 0), undefined);
  assert.equal(itemAt(harness.activePlayers[0], 1), undefined);
  assert.equal(itemAt(harness.activePlayers[0], 2).amount, 14);
  assert.equal(harness.activePlayers[0].actions.at(-1), "Chunk unlocked.");
  assert.equal(harness.sounds.at(-1).id, "random.levelup");
  assert.equal(harness.sounds.at(-1).options.pitch, 1);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.get("chunklock:progress:unlocked:minecraft:overworld"), 1);
  assert.equal(harness.props.get("chunklock:progress:unlocked:total"), 1);
  assert.equal(harness.activePlayers[0].props.get("chunklock:progress:player:unlocked:minecraft:overworld"), 1);
  assert.equal(harness.activePlayers[0].props.get("chunklock:progress:player:unlocked:total"), 1);
  assert.equal(harness.wallRefreshes(), 1);
  assert.equal(harness.displayRefreshes(), 1);
});

test("selected slot is consumed before earlier numbered slots", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:oak_log", 20);
  inventory[1] = new TestItemStack("minecraft:oak_log", 5);
  const harness = makeHarness({ remainingCost: 5, inventory });
  const player = harness.activePlayers[0];
  player.selectedSlotIndex = 1;
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(player, 1), undefined);
  assert.equal(itemAt(player, 0).amount, 20);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
});

test("partial payment consumes matching items across inventory slots", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:oak_log", 32);
  inventory[5] = new TestItemStack("minecraft:oak_log", 40);
  const harness = makeHarness({ remainingCost: 100, inventory });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(harness.activePlayers[0], 0), undefined);
  assert.equal(itemAt(harness.activePlayers[0], 5), undefined);
  assert.equal(savedRequirement(harness).remainingCost, 28);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
  assert.equal(harness.props.has("chunklock:progress:unlocked:total"), false);
  assert.match(harness.activePlayers[0].actions.at(-1), /Paid 72 Oak Log\. 28 remaining/);
});

test("payment scans and deducts from offhand when the main inventory is empty", () => {
  const harness = makeHarness({ remainingCost: 3, offhand: new TestItemStack("minecraft:oak_log", 7) });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(harness.activePlayers[0].offhand.amount, 4);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.has("chunklock:req:minecraft:overworld:1:0"), false);
});

test("a barrier in the selected hand unlocks without being consumed", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:barrier", 1);
  const harness = makeHarness({ inventory });
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(harness.activePlayers[0], 0).typeId, "minecraft:barrier");
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), true);
  assert.equal(harness.props.has("chunklock:req:minecraft:overworld:1:0"), false);
});

test("an inventory write failure rolls back every changed stack and the requirement", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:oak_log", 10);
  inventory[1] = new TestItemStack("minecraft:oak_log", 10);
  const harness = makeHarness({ remainingCost: 15, inventory });
  harness.setRejectContainerWriteAt(2);
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(harness.activePlayers[0], 0).amount, 10);
  assert.equal(itemAt(harness.activePlayers[0], 1).amount, 10);
  assert.equal(savedRequirement(harness).remainingCost, 15);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
});

test("click processing is debounced and concurrent players can only unlock and credit once", () => {
  const harness = makeHarness({ inventory: [new TestItemStack("minecraft:oak_log", 10)] });
  const first = harness.activePlayers[0];
  const second = harness.makePlayer("player-2", [new TestItemStack("minecraft:oak_log", 10)]);
  harness.activePlayers.push(second);
  harness.payment.startPayments();
  const firstClick = harness.click(first);
  const debouncedClick = harness.click(first);
  const concurrentClick = harness.click(second);
  assert.equal(firstClick.cancel, true);
  assert.equal(debouncedClick.cancel, true);
  assert.equal(concurrentClick.cancel, true);
  harness.flush();

  assert.equal(itemAt(first, 0), undefined);
  assert.equal(itemAt(second, 0).amount, 10);
  assert.equal(harness.props.get("chunklock:progress:unlocked:total"), 1);
  assert.equal(first.props.get("chunklock:progress:player:unlocked:total"), 1);
  assert.equal(second.props.has("chunklock:progress:player:unlocked:total"), false);
  assert.equal(harness.wallRefreshes(), 1);
});

test("failed progress persistence restores the full inventory payment", () => {
  const inventory = [];
  inventory[0] = new TestItemStack("minecraft:oak_log", 8);
  inventory[1] = new TestItemStack("minecraft:oak_log", 4);
  const harness = makeHarness({ remainingCost: 10, inventory });
  const player = harness.activePlayers[0];
  const setProperty = harness.world.setDynamicProperty;
  harness.world.setDynamicProperty = (propertyId, value) => {
    if (propertyId === "chunklock:progress:unlocked:total") throw new Error("property write failed");
    setProperty(propertyId, value);
  };
  harness.payment.startPayments();
  harness.click();
  harness.flush();

  assert.equal(itemAt(player, 0).amount, 8);
  assert.equal(itemAt(player, 1).amount, 4);
  assert.equal(savedRequirement(harness).remainingCost, 10);
  assert.equal(harness.access.isOpenCell("minecraft:overworld", 1, 0), false);
});

test("payment notices hold the action bar across chunk refreshes before expiring", () => {
  const harness = makeHarness();
  const player = harness.activePlayers[0];
  player.location = { x: 8, y: 64, z: 8 };
  harness.dimension.getBlock = () => ({});
  harness.dimension.getBiome = () => ({ id: "minecraft:plains" });
  harness.world.getDynamicPropertyIds = () => [...harness.props.keys()];
  const intervals = [];
  harness.system.runInterval = (callback, ticks) => intervals.push({ callback, ticks });

  const cache = {};
  const chunks = load("chunks", harness.api, {
    notices: harness.notices,
    requirements: harness.requirements,
  }, cache);
  const stateCache = load("state-cache", harness.api, {}, cache);
  stateCache.setDebugEnabled(true);
  chunks.startChunks();
  harness.payment.startPayments();

  harness.click();
  harness.flush();
  assert.match(player.actions.at(-1), /requires Oak Log × 10/);
  assert.match(player.messages.at(-1), /requires Oak Log × 10/);

  harness.system.currentTick += 10;
  intervals[0].callback();
  assert.match(player.actions.at(-1), /requires Oak Log × 10/, "chunk scan must not overwrite active payment notice");

  harness.system.currentTick += 90;
  intervals[0].callback();
  assert.match(player.actions.at(-1), /^\[Chunklock prototype\]/, "prototype status resumes after notice expires");
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

test("a paid display click suppresses follow-through block and item use temporarily", () => {
  const h = makeHarness();
  h.payment.startPayments();
  const player = h.activePlayers[0];
  h.click(player);
  const block = {player, cancel:false};
  h.callbacks.block(block);
  assert.equal(block.cancel, true);
  const use = {source:player, cancel:false};
  h.callbacks.use(use);
  assert.equal(use.cancel, true);
  h.api.system.currentTick += 11;
  const held = {player, cancel:false, isFirstEvent:false};
  h.callbacks.block(held);
  assert.equal(held.cancel, true);
  const later = {player, cancel:false, isFirstEvent:true};
  h.callbacks.block(later);
  assert.equal(later.cancel, false);
});
