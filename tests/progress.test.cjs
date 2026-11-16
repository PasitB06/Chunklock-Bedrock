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

function makeProgressHarness() {
  const worldProps = new Map();
  const objectives = new Map();
  const displaySlots = new Map();
  const worldMessages = [];
  let spawnCallback;

  const makePlayer = (id, name = id) => {
    const props = new Map();
    const messages = [];
    const titles = [];
    const sounds = [];
    return {
      id,
      name,
      getDynamicProperty: (key) => props.get(key),
      setDynamicProperty: (key, value) => (value === undefined ? props.delete(key) : props.set(key, value)),
      sendMessage: (msg) => messages.push(msg),
      playSound: (idArg, opts) => sounds.push({ id: idArg, ...opts }),
      onScreenDisplay: {
        setTitle: (title, options) => titles.push({ title, ...options }),
      },
      props,
      messages,
      titles,
      sounds,
    };
  };

  const p1 = makePlayer("p1", "Steve");
  const p2 = makePlayer("p2", "Alex");
  const players = [p1, p2];

  const api = {
    DisplaySlotId: { BelowName: "BelowName", List: "List" },
    ObjectiveSortOrder: { Descending: 1 },
    world: {
      getAllPlayers: () => players,
      getDynamicProperty: (k) => worldProps.get(k),
      setDynamicProperty: (k, v) => (v === undefined ? worldProps.delete(k) : worldProps.set(k, v)),
      sendMessage: (msg) => worldMessages.push(msg),
      afterEvents: {
        playerSpawn: { subscribe: (fn) => (spawnCallback = fn) },
      },
      scoreboard: {
        getObjective: (id) => objectives.get(id),
        addObjective: (id, displayName) => {
          const scores = new Map();
          const obj = {
            id,
            displayName,
            scores,
            setScore: (participant, score) => scores.set(participant.id, score),
          };
          objectives.set(id, obj);
          return obj;
        },
        setObjectiveAtDisplaySlot: (slot, setting) => displaySlots.set(slot, setting),
      },
    },
  };

  const cache = {};
  const access = load("access", api, {}, cache);
  const progress = load("progress", api, {}, cache);

  return {
    access,
    api,
    displaySlots,
    objectives,
    p1,
    p2,
    progress,
    spawnCallback: () => spawnCallback,
    worldMessages,
    worldProps,
  };
}

test("startProgress configures BelowName and List scoreboard slots and syncs on spawn", () => {
  const h = makeProgressHarness();
  h.p1.props.set("chunklock:progress:player:unlocked:total", 4);
  h.progress.startProgress();

  const objective = h.objectives.get("chunklock:unlocked");
  assert.ok(objective);
  assert.equal(objective.displayName, "Chunks");
  assert.equal(h.displaySlots.get("BelowName").objective, objective);
  assert.equal(h.displaySlots.get("List").objective, objective);
  assert.equal(objective.scores.get("p1"), 4);
  assert.equal(objective.scores.get("p2"), 0);

  h.p2.props.set("chunklock:progress:player:unlocked:total", 7);
  h.spawnCallback()({ player: h.p2, initialSpawn: true });
  assert.equal(objective.scores.get("p2"), 7);
});

test("global milestones fire at 1, 8, 16, 32, 64, 128 and respect hide_unlock_title", () => {
  const h = makeProgressHarness();
  h.progress.startProgress();
  h.access.setHideUnlockTitle(h.p2, true);

  // Unlock #1 -> everyone hears toast + AvidMc/Quillbee credit; only p1 sees title because p2 hid titles.
  h.worldProps.set("chunklock:progress:unlocked:total", 1);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
  assert.equal(h.worldMessages[0], "Chunklock concept by AvidMc and Quillbee.");
  assert.equal(h.p1.titles.at(-1).title, "First Chunk Unlocked!");
  assert.equal(h.p1.sounds.at(-1).id, "ui.toast.challenge_complete");
  assert.equal(h.p2.titles.length, 0);
  assert.equal(h.p2.sounds.at(-1).id, "ui.toast.challenge_complete");

  // Unlock #5 -> no milestone title or sound.
  h.worldProps.set("chunklock:progress:unlocked:total", 5);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
  assert.equal(h.p1.titles.length, 1);

  // Unlock #8 -> payer-only milestone title + levelup sound.
  const p2SoundsBefore = h.p2.sounds.length;
  h.worldProps.set("chunklock:progress:unlocked:total", 8);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
  assert.equal(h.p1.titles.at(-1).title, "Chunk #8 Unlocked!");
  assert.equal(h.p1.sounds.at(-1).id, "random.levelup");
  assert.equal(h.p2.sounds.length, p2SoundsBefore);

  // Unlock #16 -> payer-only milestone title.
  h.worldProps.set("chunklock:progress:unlocked:total", 16);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
  assert.equal(h.p1.titles.at(-1).title, "Chunk #16 Unlocked!");
  assert.equal(h.p2.sounds.length, p2SoundsBefore);

  // Unlock #32, #64, #128 -> global titles & toast sounds.
  h.access.setHideUnlockTitle(h.p2, false);
  for (const total of [32, 64, 128]) {
    h.worldProps.set("chunklock:progress:unlocked:total", total);
    h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
    assert.equal(h.p1.titles.at(-1).title, `Chunk #${total} Unlocked!`);
    assert.equal(h.p2.titles.at(-1).title, `Chunk #${total} Unlocked!`);
    assert.equal(h.p2.sounds.at(-1).id, "ui.toast.challenge_complete");
  }
});

test("personal dimension, count (16..2048) and 9 item milestones including coal unlock once", () => {
  const h = makeProgressHarness();
  h.progress.startProgress();

  // First Overworld, Nether, End paid unlocks
  h.p1.props.set("chunklock:progress:player:unlocked:minecraft:overworld", 1);
  h.p1.props.set("chunklock:progress:player:unlocked:total", 1);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld", "minecraft:stone");
  assert.ok(h.p1.messages.some((m) => m.includes("The Grass is Always Chunkier")));
  assert.ok(h.p1.messages.some((m) => m.includes("A Stone Cold Offer")));

  h.p1.props.set("chunklock:progress:player:unlocked:minecraft:nether", 1);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:nether", "minecraft:nether_brick");
  assert.ok(h.p1.messages.some((m) => m.includes("Nether Chunker")));
  assert.ok(h.p1.messages.some((m) => m.includes("Just Another Brick in The Chunk")));

  h.p1.props.set("chunklock:progress:player:unlocked:minecraft:the_end", 1);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:the_end");
  assert.ok(h.p1.messages.some((m) => m.includes("Chunklock Endgame")));

  // Remaining item challenges (explicitly including minecraft:coal)
  const remainingItems = [
    ["minecraft:coal", "A Coal Cost"],
    ["minecraft:iron_ingot", "An Ironic Tribute"],
    ["minecraft:gold_ingot", "A Golden Gift"],
    ["minecraft:emerald", "A Green Gift"],
    ["minecraft:diamond", "A Shiny Tribute"],
    ["minecraft:pufferfish", "A Puffy Price"],
    ["minecraft:ancient_debris", "A Hefty Price"],
  ];
  for (const [itemId, title] of remainingItems) {
    h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld", itemId);
    assert.ok(h.p1.messages.some((m) => m.includes(title)), `Expected milestone for ${itemId}`);
  }

  // Count thresholds up to 2048
  h.p1.props.set("chunklock:progress:player:unlocked:total", 2048);
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld");
  for (const rank of [
    "Chunk Novice",
    "Chunk Explorer",
    "Chunk Pro",
    "Chunk Master",
    "Chunk Legend",
    "Chunk God",
    "Chunklock Champion",
  ]) {
    assert.ok(h.p1.messages.some((m) => m.includes(rank)), `Expected milestone ${rank}`);
  }

  // Repeating an already-earned unlock does not spam duplicate messages.
  const countBefore = h.p1.messages.length;
  h.progress.handlePaidUnlockProgress(h.p1, "minecraft:overworld", "minecraft:coal");
  assert.equal(h.p1.messages.length, countBefore);
  assert.equal(h.objectives.get("chunklock:unlocked").scores.get("p1"), 2048);
});
