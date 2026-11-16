const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");

const DISPLAY_TYPE = "chunklock:requirement_display";

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
}

function makeHarness({ players = [], properties = {} } = {}) {
  const props = new Map(Object.entries(properties));
  const entities = [];
  const intervals = [];
  let nextEntityId = 1;
  const makeEntity = (typeId, location, dimension) => {
    const dynamicProperties = new Map();
    const equipment = new Map();
    const entity = {
      id: `display-${nextEntityId++}`,
      typeId,
      dimension,
      location: { ...location },
      dynamicProperties,
      properties: new Map(),
      equipment,
      commands: [],
      runCommand: (command) => entity.commands.push(command),
      setProperty: (key, value) => entity.properties.set(key, value),
      getDynamicProperty: (key) => dynamicProperties.get(key),
      setDynamicProperty: (key, value) => {
        if (value === undefined) dynamicProperties.delete(key);
        else dynamicProperties.set(key, value);
      },
      getComponent: (id) =>
        id === "minecraft:equippable"
          ? {
              getEquipment: (slot) => equipment.get(slot),
              setEquipment: (slot, item) => {
                if (item === undefined) equipment.delete(slot);
                else equipment.set(slot, item);
                return true;
              },
            }
          : undefined,
      setRotation: (rotation) => {
        entity.rotation = { ...rotation };
      },
      teleport: (nextLocation) => {
        entity.location = { ...nextLocation };
      },
      remove: () => {
        entity.removed = true;
        const index = entities.indexOf(entity);
        if (index >= 0) entities.splice(index, 1);
      },
    };
    entities.push(entity);
    return entity;
  };

  const dimensions = new Map();
  for (const name of ["overworld", "nether", "the_end"]) {
    const id = `minecraft:${name}`;
    const dimension = {
      id,
      heightRange: { min: -64, max: 320 },
      getEntities: ({ type } = {}) =>
        entities.filter((entity) => entity.dimension === dimension && entity.typeId === type && !entity.removed),
      spawnEntity: (typeId, location) => makeEntity(typeId, location, dimension),
      spawnParticle: () => {},
    };
    dimensions.set(name, dimension);
  }
  for (const player of players) {
    if (!player.dimension) player.dimension = dimensions.get("overworld");
  }

  const world = {
    getAllPlayers: () => players,
    getDimension: (name) => dimensions.get(name),
    getDynamicProperty: (key) => props.get(key),
    setDynamicProperty: (key, value) => {
      if (value === undefined) props.delete(key);
      else props.set(key, value);
    },
  };
  const system = { currentTick: 10, runInterval: (fn, ticks) => intervals.push({ fn, ticks }) };
  const api = {
    world,
    system,
    EquipmentSlot: { Mainhand: "Mainhand" },
    ItemStack: TestItemStack,
  };
  const requirements = {
    getChunkRequirement: (dimensionId, cx, cz) => {
      const stored = props.get(`chunklock:req:${dimensionId}:${cx}:${cz}`);
      if (typeof stored !== "string") return undefined;
      try {
        const value = JSON.parse(stored);
        return value.schemaVersion === 1 && value.state === "locked" ? value : undefined;
      } catch {
        return undefined;
      }
    },
    formatItemDisplayName: (itemId) =>
      itemId
        .slice(itemId.lastIndexOf(":") + 1)
        .split("_")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" "),
  };
  const access = {
    isOpenCell: (dimensionId, cx, cz) => props.get(`chunklock:open:${dimensionId}:${cx}:${cz}`) === true,
  };
  const regions = load("regions");
  const displays = load("displays", api, { access, regions, requirements });

  return { access, api, dimensions, displays, entities, intervals, players, props, requirements, system, world };
}

function makePlayer({ x = 8, y = 64, z = 8 } = {}) {
  return {
    id: "player-1",
    location: { x, y, z },
    getHeadLocation: () => ({ x, y: y + 1.62, z }),
  };
}

function makeRequirement(remainingCost = 16) {
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

test("requirement displays appear only beside nearby locked chunks with requirements", () => {
  const player = makePlayer();
  const harness = makeHarness({
    players: [player],
    properties: {
      "chunklock:open:minecraft:overworld:0:0": true,
      "chunklock:cell:minecraft:overworld:1:0": 1,
      "chunklock:req:minecraft:overworld:1:0": JSON.stringify(makeRequirement()),
    },
  });

  harness.displays.startRequirementDisplays();

  assert.equal(harness.intervals.length, 1);
  assert.equal(harness.entities.length, 1);
  const display = harness.entities[0];
  assert.deepEqual(display.location, { x: 15.95, y: 65.87, z: 8 });
  assert.equal(display.nameTag, "Oak Log\n× 16");
  assert.equal(display.getDynamicProperty("chunklock:display:cx"), 1);
  assert.equal(display.getDynamicProperty("chunklock:display:cz"), 0);
  assert.equal(display.properties.get("chunklock:display_yaw"), 90);
  assert.equal(display.properties.get("chunklock:display_is_2d"), false);
  assert.deepEqual(display.rotation, { x: 0, y: 90 });
  assert.equal(display.equipment.get("Mainhand").typeId, "minecraft:oak_log");
  assert.equal(harness.displays.isFlatDisplayItem("minecraft:oak_log"), false);
  assert.equal(harness.displays.isFlatDisplayItem("minecraft:oak_sapling"), true);
  assert.equal(harness.displays.isFlatDisplayItem("minecraft:iron_ingot"), true);
  assert.deepEqual(display.commands, ["replaceitem entity @s slot.weapon.mainhand 0 minecraft:oak_log 1"]);

  const tooFar = makeHarness({
    players: [makePlayer({ x: -9 })],
    properties: {
      "chunklock:open:minecraft:overworld:0:0": true,
      "chunklock:req:minecraft:overworld:1:0": JSON.stringify(makeRequirement()),
    },
  });
  tooFar.displays.startRequirementDisplays();
  assert.equal(tooFar.entities.length, 0, "a player more than 24 blocks from the border gets no display");
});

test("requirement displays update helpers and remove duplicates and stale helpers", () => {
  const harness = makeHarness({
    players: [makePlayer()],
    properties: {
      "chunklock:open:minecraft:overworld:0:0": true,
      "chunklock:req:minecraft:overworld:1:0": JSON.stringify(makeRequirement()),
    },
  });
  harness.displays.startRequirementDisplays();
  const primary = harness.entities[0];
  const duplicate = harness.dimensions.get("overworld").spawnEntity(DISPLAY_TYPE, primary.location);
  duplicate.setDynamicProperty("chunklock:display_key", primary.getDynamicProperty("chunklock:display_key"));
  duplicate.setDynamicProperty("chunklock:display:cx", 1);
  duplicate.setDynamicProperty("chunklock:display:cz", 0);
  harness.props.set("chunklock:req:minecraft:overworld:1:0", JSON.stringify(makeRequirement(8)));

  harness.displays.refreshRequirementDisplays();

  assert.equal(harness.entities.length, 1);
  assert.equal(harness.entities[0].id, primary.id, "the existing helper is reused");
  assert.equal(duplicate.removed, true);
  assert.equal(primary.nameTag, "Oak Log\n× 8");

  harness.props.delete("chunklock:req:minecraft:overworld:1:0");
  harness.displays.refreshRequirementDisplays();
  assert.equal(harness.entities.length, 0, "helpers without a locked requirement are removed");
});

test("requirement display pack files define a compact helper with held-item rendering", () => {
  const root = path.join(__dirname, "..");
  const behavior = JSON.parse(
    fs.readFileSync(path.join(root, "behavior_packs/chunklock/entities/requirement_display.json"), "utf8")
  )["minecraft:entity"];
  const components = behavior.components;
  assert.deepEqual(behavior.description.properties["chunklock:display_yaw"], {
    type: "int",
    range: [0, 270],
    default: 0,
    client_sync: true,
  });
  assert.deepEqual(behavior.description.properties["chunklock:display_is_2d"], {
    type: "bool",
    default: false,
    client_sync: true,
  });
  assert.deepEqual(components["minecraft:collision_box"], { width: 0.35, height: 0.35 });
  assert.deepEqual(components["minecraft:physics"], { has_gravity: false, has_collision: false });
  assert.equal(components["minecraft:pushable"].is_pushable, false);
  assert.equal(components["minecraft:breathable"].breathes_solids, true);
  assert.equal(components["minecraft:breathable"].breathes_water, true);
  assert.equal(components["minecraft:health"].value, 100);
  assert.equal(components["minecraft:damage_sensor"].triggers[0].deals_damage, "no");
  assert.ok(components["minecraft:equipment"]);
  assert.ok(components["minecraft:equippable"].slots.length > 0);
  assert.equal(components["minecraft:nameable"].always_show, true);

  const client = JSON.parse(
    fs.readFileSync(path.join(root, "resource_packs/chunklock/entity/requirement_display.entity.json"), "utf8")
  )["minecraft:client_entity"].description;
  assert.equal(client.enable_attachables, true);
  assert.equal(client.held_item_ignores_lighting, true);
  assert.equal(client.animations.pose, "animation.chunklock.requirement_display.pose");
  assert.ok(client.render_controllers.includes("controller.render.chunklock.requirement_display"));
  const geometry = JSON.parse(
    fs.readFileSync(path.join(root, "resource_packs/chunklock/models/entity/requirement_display.geo.json"), "utf8")
  )["minecraft:geometry"][0];
  assert.equal(geometry.description.identifier, "geometry.chunklock.requirement_display");
  const rootBone = geometry.bones.find((bone) => bone.name === "root");
  const rightItemBone = geometry.bones.find((bone) => bone.name === "rightItem");
  assert.ok(rootBone.cubes.length > 0, "pedestal cube keeps the display geometry non-empty");
  assert.ok(rightItemBone);
  assert.equal(rightItemBone.neverRender, undefined);
  const controller = JSON.parse(
    fs.readFileSync(
      path.join(root, "resource_packs/chunklock/render_controllers/requirement_display.render_controllers.json"),
      "utf8"
    )
  ).render_controllers;
  assert.ok(controller["controller.render.chunklock.requirement_display"]);
});

