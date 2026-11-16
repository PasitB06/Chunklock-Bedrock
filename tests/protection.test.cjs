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

test("wall edges report open and locked cells on all sides of a negative chunk", () => {
  const edges = load("regions").wallEdges([{ x: -2, z: -1 }], () => false);
  const bySide = new Map(edges.map((edge) => [edge.side, edge]));

  assert.equal(edges.length, 4);
  for (const side of ["north", "east", "south", "west"]) {
    const edge = bySide.get(side);
    assert.ok(edge, `${side} edge exists`);
    assert.equal(edge.openCell.x, -2);
    assert.equal(edge.openCell.z, -1);
  }
  assert.deepEqual(
    ["north", "east", "south", "west"].map((side) => {
      const edge = bySide.get(side);
      return [side, edge.lockedCell.x, edge.lockedCell.z, edge.x, edge.z];
    }),
    [
      ["north", -2, -2, -24, -16],
      ["east", -1, -1, -16, -8],
      ["south", -2, 0, -24, 0],
      ["west", -3, -1, -32, -8],
    ]
  );
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
  const messages = [];
  const actions = [];
  const player = {
    id: "p",
    dimension: { id: "minecraft:overworld" },
    location: { x: 8, y: 64, z: 8 },
    getDynamicProperty: (k) => playerProps.get(k),
    setDynamicProperty: (k, v) => playerProps.set(k, v),
    onScreenDisplay: { setActionBar: (m) => actions.push(m) },
    sendMessage: (m) => messages.push(m),
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
  const requirementDisplay = {
    player,
    target: {
      typeId: "chunklock:requirement_display",
      dimension: player.dimension,
      location: { x: 17, y: 64, z: 8 },
    },
    cancel: false,
  };
  callbacks.playerInteractWithEntity(requirementDisplay);
  assert.equal(requirementDisplay.cancel, false, "payment clicks must reach the requirement display handler");
  let impacted;
  callbacks.explosion({
    getImpactedBlocks: () => [block(8), block(16)],
    setImpactedBlocks: (blocks) => {
      impacted = blocks;
    },
  });
  assert.equal(impacted.length, 1);
  assert.equal(impacted[0].location.x, 8);
  assert.deepEqual(messages, []);
  assert.deepEqual(actions, []);
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
          velocity: { x: 0, y: 0, z: 0 },
          getVelocity: () => e.velocity,
          clearVelocity: () => { e.velocity = { x: 0, y: 0, z: 0 }; },
          teleport: (next, options) => { e.location = { ...next }; e.lastTeleport = options; },
          setRotation: () => {},
          setProperty: (k, v) => state.set(k, v),
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
  assert.equal(player.dimension.getEntities().length, 4, "one full-column helper per border edge");
  const initialIds = player.dimension.getEntities().map((e) => e.getDynamicProperty("chunklock:wall_key"));
  player.location.y = 120;
  intervals[0]();
  assert.equal(player.dimension.getEntities().length, 4);
  assert.deepEqual(
    player.dimension.getEntities().map((e) => e.getDynamicProperty("chunklock:wall_key")),
    initialIds,
    "ascending must retain every border wall"
  );
  player.location.y = 400;
  intervals[0]();
  assert.equal(player.dimension.getEntities().length, 4);
  assert.ok(
    player.dimension.getEntities().every((e) => e.location.y >= 0 && e.location.y < 128),
    "anchors must stay strictly within dimension height bounds"
  );
  player.location.y = 64;
  intervals[0]();
  const drifting = player.dimension.getEntities()[0];
  const anchor = { ...drifting.location };
  drifting.location = { x: anchor.x, y: anchor.y + 0.2, z: anchor.z };
  drifting.velocity = { x: 0, y: 0.1, z: 0 };
  assert.equal(typeof intervals[1], "function", "a lightweight per-tick anchor pass is scheduled");
  intervals[1]();
  assert.deepEqual(drifting.location, anchor);
  assert.deepEqual(drifting.velocity, { x: 0, y: 0, z: 0 });
  assert.equal(drifting.lastTeleport.checkForBlocks, false);
  assert.equal(drifting.lastTeleport.keepVelocity, false);
  load("walls", api).startWalls();
  assert.equal(player.dimension.getEntities().length, 4, "reload must adopt existing helpers");
  props.set("chunklock:open:minecraft:overworld:4:0", true);
  intervals[0]();
  assert.ok(
    player.dimension.getEntities().some((e) => e.location.x >= 64),
    "distant open borders within 96 blocks must also receive walls"
  );
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
  for (const typeId of ["chunklock:border_wall", "chunklock:requirement_display"]) {
    for (const cause of ["fall", "suffocation", "void", "entityAttack"]) {
      const helper = {
        hurtEntity: {
          typeId,
          dimension: { id: "minecraft:overworld" },
          location: { x: 8, z: 8 },
        },
        damageSource: { cause },
        cancel: false,
      };
      callbacks.entityHurt(helper);
      assert.equal(helper.cancel, true, `${typeId} must survive ${cause} even on the open side`);
    }
  }
});

test("wall geometry uses a single non-overlapping column with no translucent edge caps", () => {
  const root = path.join(__dirname, "..");
  const geometry = JSON.parse(
    fs.readFileSync(path.join(root, "resource_packs/chunklock/models/entity/border_wall.geo.json"), "utf8")
  )["minecraft:geometry"][0];
  assert.equal(geometry.description.visible_bounds_width, 48);
  assert.equal(geometry.description.visible_bounds_height, 800);
  const cubes = geometry.bones[0].cubes;
  assert.equal(cubes.length, 1);
  const cube = cubes[0];
  assert.equal(cube.origin[0], -128);
  assert.equal(cube.origin[1], -6144);
  assert.equal(cube.origin[2], -0.15);
  assert.equal(cube.size[0], 256);
  assert.equal(cube.size[1], 12288);
  assert.equal(cube.size[2], 0.3);
  assert.deepEqual(Object.keys(cube.uv).sort(), ["north", "south"]);
  const material = JSON.parse(
    fs.readFileSync(path.join(root, "resource_packs/chunklock/materials/entity.material"), "utf8")
  ).materials["chunklock_border_wall:entity_alphablend"];
  assert.ok(material["+states"].includes("DisableDepthWrite"));
  const animation = JSON.parse(
    fs.readFileSync(path.join(root, "resource_packs/chunklock/animations/border_wall.animation.json"), "utf8")
  ).animations["animation.chunklock.border_wall.align"];
  assert.equal(animation.bones.wall.rotation[1], "query.property('chunklock:wall_yaw') - query.body_y_rotation");
  const rpManifest = JSON.parse(fs.readFileSync(path.join(root, "resource_packs/chunklock/manifest.json"), "utf8"));
  assert.deepEqual(rpManifest.capabilities, ["pbr"]);
  const wallController = JSON.parse(
    fs.readFileSync(
      path.join(root, "resource_packs/chunklock/render_controllers/border_wall.render_controllers.json"),
      "utf8"
    )
  ).render_controllers["controller.render.chunklock.border_wall"];
  assert.deepEqual(wallController.textures, [
    "query.graphics_mode_is_any('deferred') ? Texture.vibrant : Texture.default",
  ]);
});

test("wall helpers breathe in terrain and use an unconditional damage sensor", () => {
  const file = path.join(__dirname, "../behavior_packs/chunklock/entities/border_wall.json");
  const components = JSON.parse(fs.readFileSync(file, "utf8"))["minecraft:entity"].components;
  assert.equal(components["minecraft:breathable"].breathes_solids, true);
  assert.equal(components["minecraft:breathable"].breathes_water, true);
  assert.ok(components["minecraft:body_rotation_axis_aligned"]);
  assert.ok(components["minecraft:health"].value >= 100);
  const sensor = components["minecraft:damage_sensor"].triggers[0];
  assert.equal(sensor.deals_damage, "no");
  assert.equal(sensor.cause, undefined);
});

test("combat permits real hitbox overlap with open terrain but rejects boundary-only contact", () => {
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
    system: { currentTick: 0, run: () => {} },
    Direction: {},
  };
  load("protection", api).startProtection();
  for (const cause of ["entityAttack", "projectile"]) {
    for (const [x, z, allowed] of [
      [16.1, 8, true],
      [-0.1, 8, true],
      [8, 16.1, true],
      [8, -0.1, true],
      [16.1, 16.1, true],
      [16.5, 8, false],
      [17, 8, false],
    ]) {
      const target = {
        dimension: { id: "minecraft:overworld" },
        location: { x, z },
        getAABB: () => ({ center: { x, y: 1, z }, extent: { x: 0.5, y: 1, z: 0.5 } }),
      };
      const event = { hurtEntity: target, damageSource: { cause }, cancel: false };
      callbacks.entityHurt(event);
      assert.equal(event.cancel, !allowed, `${cause} at ${x},${z}`);
    }
  }
});

test("projectiles can reach exposed border hitboxes before crossing locked terrain", () => {
  let spawn,
    tick,
    removed = 0;
  const api = {
    world: {
      afterEvents: { entitySpawn: { subscribe: (fn) => (spawn = fn) } },
      getAllPlayers: () => [],
      getDynamicProperty: (key) => (key.endsWith(":0:0") ? true : undefined),
    },
    system: {
      runInterval: (fn, n) => {
        if (n === 1) tick = fn;
      },
    },
  };
  load("projectiles", api).startProjectiles();
  const arrow = {
    id: "border",
    location: { x: 15, y: 1, z: 8 },
    getComponent: () => ({}),
    getVelocity: () => ({ x: 2, y: 0, z: 0 }),
    dimension: { id: "minecraft:overworld", getPlayers: () => [{}] },
    remove: () => removed++,
  };
  spawn({ entity: arrow });
  tick();
  assert.equal(removed, 0, "lookahead must not remove an arrow still on the open side");
  arrow.location = { x: 17, y: 1, z: 8 };
  tick();
  assert.equal(removed, 1, "an actual crossing must still be intercepted");
});

test("collision allows free movement within open chunks and teleports back on locked entry", () => {
  const props = new Map();
  const playerProps = new Map();
  const intervals = [];
  const teleports = [];
  const dimension = {
    id: "minecraft:overworld",
    heightRange: { min: -64, max: 320 },
    getTopmostBlock: ({ x, z }) => ({ location: { x: Math.floor(x), y: 63, z: Math.floor(z) } }),
  };
  let gameMode = "Survival";
  let rotation = { x: 0, y: 90 };
  const player = {
    id: "p1",
    dimension,
    location: { x: 8.5, y: 64, z: 8.5 },
    getRotation: () => rotation,
    getGameMode: () => gameMode,
    getSpawnPoint: () => undefined,
    getDynamicProperty: (k) => playerProps.get(k),
    setDynamicProperty: (k, v) => playerProps.set(k, v),
    teleport: (loc, opts) => {
      teleports.push({ location: { ...loc }, rotation: { ...opts.rotation } });
      player.location = { ...loc };
    },
  };
  const api = {
    GameMode: { Spectator: "Spectator", Survival: "Survival" },
    world: {
      getAllPlayers: () => [player],
      getDimension: () => dimension,
      getDynamicProperty: (k) => props.get(k),
      setDynamicProperty: (k, v) => props.set(k, v),
      getDynamicPropertyIds: () => [...props.keys()],
      afterEvents: { playerLeave: { subscribe: () => {} } },
    },
    system: {
      currentTick: 1,
      runInterval: (fn) => intervals.push(fn),
    },
  };
  load("collision", api).startCollision();
  const tick = intervals[0];
  assert.equal(teleports.length, 0, "seeding at center must not teleport");

  // Walk away from center toward the eastern and southern edges of open chunk (0, 0).
  player.location = { x: 15.8, y: 64, z: 14.2 };
  api.system.currentTick = 2;
  tick();
  assert.equal(teleports.length, 0, "walking within open chunk must not pull player back to center");

  // Step across the border into locked chunk (1, 0) while turning the camera.
  player.location = { x: 16.2, y: 64, z: 14.2 };
  rotation = { x: 10, y: 135 };
  api.system.currentTick = 3;
  tick();
  assert.equal(teleports.length, 1, "stepping into a locked chunk must trigger teleport back");
  assert.deepEqual(teleports[0].location, { x: 15.8, y: 64, z: 14.2 });
  assert.deepEqual(teleports[0].rotation, { x: 10, y: 135 }, "current viewing rotation must be retained");

  // Negative open chunk (-1, 0) allows movement up to -0.1 and blocks -16.1.
  props.set("chunklock:open:minecraft:overworld:-1:0", true);
  player.location = { x: -0.2, y: 64, z: 4.5 };
  api.system.currentTick = 4;
  tick();
  assert.equal(teleports.length, 1);
  player.location = { x: -16.1, y: 64, z: 4.5 };
  api.system.currentTick = 5;
  tick();
  assert.equal(teleports.length, 2);
  assert.deepEqual(teleports[1].location, { x: -0.2, y: 64, z: 4.5 });

  // Spectator mode is exempt from collision pullback.
  gameMode = "Spectator";
  player.location = { x: 32.5, y: 64, z: 32.5 };
  api.system.currentTick = 6;
  tick();
  assert.equal(teleports.length, 2, "Spectator must bypass locked chunk pullback");
});

test("deferred walls use the overlap material with the emissive vibrant texture", () => {
  const root = path.join(__dirname, "..");
  const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const entity = read("resource_packs/chunklock/entity/border_wall.entity.json")["minecraft:client_entity"].description;
  const controller = read("resource_packs/chunklock/render_controllers/border_wall.render_controllers.json")
    .render_controllers["controller.render.chunklock.border_wall"];
  for (const mode of ["simple", "fancy", "deferred", "raytraced"]) {
    const context = {
      query: { graphics_mode_is_any: (...modes) => modes.includes(mode) ? 1 : 0 },
      Material: entity.materials,
      Texture: entity.textures,
    };
    const material = vm.runInNewContext(controller.materials[0]["*"], context);
    const texture = vm.runInNewContext(controller.textures[0], context);
    assert.equal(material, "chunklock_border_wall", mode);
    assert.equal(texture, "textures/entity/border_wall" + (mode === "deferred" ? "_vibrant" : ""), mode);
  }
});

test("deferred walls provide emissive PBR without replacing the classic texture", () => {
  const root = path.join(__dirname, "../resource_packs/chunklock/textures/entity");
  const textureSet = JSON.parse(fs.readFileSync(path.join(root, "border_wall_vibrant.texture_set.json"), "utf8"));
  assert.equal(textureSet.format_version, "1.21.30");
  assert.equal(textureSet["minecraft:texture_set"].color, "border_wall_vibrant");
  assert.deepEqual(textureSet["minecraft:texture_set"].metalness_emissive_roughness_subsurface, [0, 255, 255, 0]);
  assert.equal(fs.existsSync(path.join(root, "border_wall.texture_set.json")), false);
});
