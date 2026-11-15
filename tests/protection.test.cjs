const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");

function load(name, api = {}, cache = {}) {
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
      require: (id) => (id === "@minecraft/server" ? api : load(id.replace("./", "").replace(".js", ""), api, cache)),
    },
    { filename: file }
  );
  return module.exports;
}

test("negative coordinates use floor and adjacent open cells have no internal wall", () => {
  const r = load("regions");
  assert.equal(r.chunkAt(-0.1), -1);
  assert.equal(r.chunkAt(-16), -1);
  assert.equal(r.chunkAt(-16.1), -2);
  const open = (x, z) => z === 0 && (x === 0 || x === 1);
  const edges = r.wallEdges(
    [
      { x: 0, z: 0 },
      { x: 1, z: 0 },
      { x: 0, z: 0 },
    ],
    open
  );
  assert.equal(edges.length, 6);
  assert.equal(new Set(edges.map((e) => e.key)).size, 6);
  assert.ok(!edges.some((e) => e.axis === "z" && e.x === 16 && e.z === 8));
});

test("projectile sweep detects a locked intermediate chunk even if destination is open", () => {
  const r = load("regions");
  const locked = (x, z) => x === 1 && z === 0;
  assert.equal(r.segmentTouchesLocked({ x: 8, z: 8 }, { x: 40, z: 8 }, locked), true);
  assert.equal(r.segmentTouchesLocked({ x: 8, z: 8 }, { x: 10, z: 10 }, locked), false);
  assert.equal(r.segmentTouchesLocked({ x: 8, z: 8 }, { x: 24, z: 24 }, locked), true);
});

test("projectile tracking saturation does not delete safe projectiles", () => {
  let spawned;
  const intervals = [];
  const api = {
    world: {
      afterEvents: {
        entitySpawn: {
          subscribe: (fn) => {
            spawned = fn;
          },
        },
      },
      getAllPlayers: () => [],
      getDynamicProperty: () => true,
    },
    system: { runInterval: (fn, ticks) => intervals.push({ fn, ticks }) },
  };
  load("projectiles", api).startProjectiles();
  let removed = 0;
  for (let i = 0; i < 257; i++) {
    const entity = {
      id: String(i),
      getComponent: () => ({}),
      location: { x: 8, y: 64, z: 8 },
      getVelocity: () => ({ x: 0, y: 0, z: 0 }),
      dimension: { id: "minecraft:overworld", getPlayers: () => [{}] },
      remove: () => removed++,
    };
    spawned({ entity });
  }
  assert.equal(removed, 0);
  for (let i = 0; i < 6; i++) intervals.find((e) => e.ticks === 1).fn();
  assert.equal(removed, 0, "stationary open-area arrows must not be destroyed");
});

test("protection cancels locked targets and placement across a border, but permits open blocks", () => {
  const callbacks = {};
  const props = new Map();
  const signal = (name) => ({
    subscribe: (fn) => {
      callbacks[name] = fn;
    },
  });
  const world = {
    afterEvents: { playerLeave: signal("playerLeave") },
    getDynamicProperty: (key) => props.get(key),
    setDynamicProperty: (key, value) => props.set(key, value),
    beforeEvents: Object.fromEntries(
      ["playerBreakBlock", "playerInteractWithBlock", "playerInteractWithEntity", "explosion", "entityHurt"].map(
        (k) => [k, signal(k)]
      )
    ),
  };
  const api = {
    world,
    system: { run: (fn) => fn(), currentTick: 1 },
    Direction: { East: "East", West: "West", North: "North", South: "South", Up: "Up", Down: "Down" },
  };
  const access = load("access", api);
  const playerProps = new Map();
  const player = {
    id: "p",
    dimension: { id: "minecraft:overworld" },
    location: { x: 8, y: 64, z: 8 },
    getDynamicProperty: (k) => playerProps.get(k),
    setDynamicProperty: (k, v) => playerProps.set(k, v),
    sendMessage: () => {},
  };
  access.seedPlayer(player);
  player.location.x = 24;
  access.seedPlayer(player);
  assert.equal(access.isLocked("minecraft:overworld", 24, 8), true, "walking must not grant more access");
  assert.equal(access.isLocked("minecraft:nether", 8, 8), true, "dimensions must remain isolated");
  load("protection", api).startProtection();
  const block = (x) => ({ dimension: player.dimension, location: { x, y: 64, z: 8 } });
  const allowed = { player, block: block(8), cancel: false };
  callbacks.playerBreakBlock(allowed);
  assert.equal(allowed.cancel, false);
  const denied = { player, block: block(16), cancel: false };
  callbacks.playerBreakBlock(denied);
  assert.equal(denied.cancel, true);
  const placement = {
    player,
    block: block(15),
    blockFace: "East",
    itemStack: { typeId: "minecraft:stone" },
    cancel: false,
  };
  callbacks.playerInteractWithBlock(placement);
  assert.equal(placement.cancel, true);
  const chest = { player, block: block(16), blockFace: "Up", cancel: false };
  callbacks.playerInteractWithBlock(chest);
  assert.equal(chest.cancel, true);
  const mob = { player, target: { dimension: player.dimension, location: { x: 20, z: 8 } }, cancel: false };
  callbacks.playerInteractWithEntity(mob);
  assert.equal(mob.cancel, true);
  let impacted;
  callbacks.explosion({
    getImpactedBlocks: () => [block(8), block(16)],
    setImpactedBlocks: (blocks) => {
      impacted = blocks;
    },
  });
  assert.equal(impacted.length, 1);
  assert.equal(impacted[0].location.x, 8);
});

test("wall helpers are budgeted, deduplicated on reload and removed after players leave", () => {
  const props = new Map(),
    playerProps = new Map(),
    intervals = [];
  let players;
  const dimensions = new Map();
  for (const name of ["overworld", "nether", "the_end"]) {
    const entities = [];
    const dimension = {
      id: "minecraft:" + name,
      heightRange: { min: 0, max: 128 },
      getEntities: () => entities.filter((e) => e.alive),
      spawnEntity: (_type, location) => {
        const state = new Map();
        const e = {
          alive: true,
          location,
          setRotation: () => {},
          setDynamicProperty: (k, v) => state.set(k, v),
          getDynamicProperty: (k) => state.get(k),
          remove: () => {
            e.alive = false;
          },
        };
        entities.push(e);
        return e;
      },
    };
    dimensions.set(name, dimension);
  }
  const player = {
    dimension: dimensions.get("overworld"),
    location: { x: 8, y: 64, z: 8 },
    getDynamicProperty: (k) => playerProps.get(k),
    setDynamicProperty: (k, v) => playerProps.set(k, v),
    sendMessage: () => {},
  };
  players = [player];
  const api = {
    world: {
      getAllPlayers: () => players,
      getDimension: (n) => dimensions.get(n),
      getDynamicProperty: (k) => props.get(k),
      setDynamicProperty: (k, v) => props.set(k, v),
    },
    system: { currentTick: 10, runInterval: (fn) => intervals.push(fn) },
  };
  load("walls", api).startWalls();
  assert.equal(player.dimension.getEntities().length, 4, "four creations maximum per refresh");
  intervals[0]();
  intervals[0]();
  assert.equal(player.dimension.getEntities().length, 8, "four sides with two height segments");
  load("walls", api).startWalls();
  assert.equal(player.dimension.getEntities().length, 8, "reload must adopt existing helpers");
  players = [];
  intervals[0]();
  assert.equal(player.dimension.getEntities().length, 0);
});

test("combat guard cancels melee and same-tick projectile damage in locked cells", () => {
  const callbacks = {};
  const api = {
    world: {
      getDynamicProperty: (key) => (key.endsWith(":0:0") ? true : undefined),
      beforeEvents: Object.fromEntries(
        ["playerBreakBlock", "playerInteractWithBlock", "playerInteractWithEntity", "explosion", "entityHurt"].map(
          (k) => [k, { subscribe: (fn) => (callbacks[k] = fn) }]
        )
      ),
      afterEvents: { playerLeave: { subscribe: () => {} } },
    },
    system: { currentTick: 10, run: () => {} },
    Direction: {},
  };
  load("protection", api).startProtection();
  assert.equal(typeof callbacks.entityHurt, "function");
  for (const cause of ["entityAttack", "projectile"]) {
    const e = {
      hurtEntity: { dimension: { id: "minecraft:overworld" }, location: { x: 17, z: 8 } },
      damageSource: { cause },
      cancel: false,
    };
    callbacks.entityHurt(e);
    assert.equal(e.cancel, true);
    e.hurtEntity.location.x = 8;
    e.cancel = false;
    callbacks.entityHurt(e);
    assert.equal(e.cancel, false);
  }
  const fall = {
    hurtEntity: { dimension: { id: "minecraft:overworld" }, location: { x: 17, z: 8 } },
    damageSource: { cause: "fall" },
    cancel: false,
  };
  callbacks.entityHurt(fall);
  assert.equal(fall.cancel, false, "environmental damage must remain unchanged");
});

test("wall geometry uses bounded tiles with no translucent edge caps", () => {
  const geometry = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../resource_packs/chunklock/models/entity/border_wall.geo.json"), "utf8")
  );
  const cubes = geometry["minecraft:geometry"][0].bones[0].cubes;
  assert.equal(cubes.length, 4);
  for (const cube of cubes) {
    assert.equal(cube.size[0], 256);
    assert.ok(cube.size[1] <= 256);
    assert.ok(cube.size[2] >= 2);
    assert.deepEqual(Object.keys(cube.uv).sort(), ["north", "south"]);
  }
});
