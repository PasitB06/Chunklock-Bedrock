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
  assert.deepEqual(display.location, { x: 15.99, y: 65.47, z: 8 });
  assert.equal(display.nameTag, "Oak Log\n\u00d7 16");
  assert.equal(display.getDynamicProperty("chunklock:display:cx"), 1);
  assert.equal(display.getDynamicProperty("chunklock:display:cz"), 0);
  assert.equal(display.properties.get("chunklock:display_yaw"), 90);
  assert.equal(display.properties.get("chunklock:display_icon_v2"), load("display-icons-data").DISPLAY_ICON_INDEX["minecraft:oak_log"]);
  assert.equal(display.properties.get("chunklock:display_shape"), 1);
  assert.deepEqual(display.rotation, { x: 0, y: 90 });
  assert.equal(display.equipment.size, 0);
  assert.deepEqual(display.commands, []);

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
  assert.equal(primary.nameTag, "Oak Log\n\u00d7 8");

  harness.props.delete("chunklock:req:minecraft:overworld:1:0");
  harness.displays.refreshRequirementDisplays();
  assert.equal(harness.entities.length, 0, "helpers without a locked requirement are removed");
});

test("flat icon catalog covers source items and selects matching texture indices", () => {
  const icons = load("display-icons-data");
  const root = path.join(__dirname, "..");
  const client = JSON.parse(fs.readFileSync(path.join(root, "resource_packs/chunklock/entity/requirement_display.entity.json"), "utf8"))["minecraft:client_entity"].description;
  const controller = JSON.parse(fs.readFileSync(path.join(root, "resource_packs/chunklock/render_controllers/requirement_display.render_controllers.json"), "utf8")).render_controllers["controller.render.chunklock.requirement_display_v2"];
  const tables = load("loot-tables-data").LOOT_TABLES;
  for (const table of Object.values(tables)) {
    for (const pool of table.pools) for (const entry of pool.entries) {
      if (entry.type !== "item") continue;
      const index = icons.DISPLAY_ICON_INDEX[entry.name];
      assert.ok(Number.isInteger(index) && index > 0, entry.name);
      assert.ok(client.textures[controller.arrays.textures["Array.icons"][index].replace("Texture.", "")], entry.name);
    }
  }
  for (const [item, expected] of [["spruce_hanging_sign", "textures/items/spruce_hanging_sign"], ["spruce_sign", "textures/items/sign_spruce"]]) {
    const index = icons.displayIconIndex(`minecraft:${item}`);
    assert.equal(client.textures[controller.arrays.textures["Array.icons"][index].replace("Texture.", "")], expected);
  }
  assert.equal(icons.displayIconIndex("other:unknown"), 0);
  assert.ok(icons.displayIconIndex("minecraft:grass") > 0);
  assert.ok(icons.displayIconIndex("minecraft:short_grass") > 0);
  assert.equal(client.enable_attachables, undefined);
});

test("plaques are horizontally centered, wall-parallel and have no held-item skeleton", () => {
  const root = path.join(__dirname, "..");
  const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  const behavior = read("behavior_packs/chunklock/entities/requirement_display.json")["minecraft:entity"];
  assert.equal(behavior.description.properties["chunklock:display_icon_v2"].client_sync, true);
  assert.equal(behavior.components["minecraft:equipment"], undefined);
  assert.equal(behavior.components["minecraft:equippable"], undefined);
  assert.deepEqual(behavior.components["minecraft:collision_box"], { width: 0.85, height: 0.85 });
  const geometry = read("resource_packs/chunklock/models/entity/requirement_display.geo.json")["minecraft:geometry"][0];
  assert.deepEqual(geometry.bones.map((bone) => bone.name), ["root"]);
  const cube = geometry.bones[0].cubes[0];
  assert.equal(cube.origin[0] + cube.size[0] / 2, 0);
  assert.equal(cube.origin[1] + cube.size[1] / 2, 6.8);
  assert.equal(cube.size[0], cube.size[1]);
  assert.equal(cube.size[0], 11);
  assert.ok(cube.size[2] <= 0.1);
  assert.deepEqual(Object.keys(cube.uv).sort(), ["north", "south"]);
  assert.deepEqual(cube.uv.south, { uv: [16, 0], uv_size: [-16, 16] });
  const pose = read("resource_packs/chunklock/animations/requirement_display.animation.json").animations["animation.chunklock.requirement_display.pose"];
  assert.deepEqual(Object.keys(pose.bones), ["root"]);
  assert.equal(pose.bones.root.rotation[0], 0);
  assert.equal(pose.bones.root.rotation[2], 0);
});

test("icon changes refresh the picture and unknown requirements retain their label", () => {
  const harness = makeHarness({players: [makePlayer()], properties: {
    "chunklock:open:minecraft:overworld:0:0": true,
    "chunklock:req:minecraft:overworld:1:0": JSON.stringify(makeRequirement()),
  }});
  harness.displays.startRequirementDisplays();
  const entity = harness.entities[0];
  const next = {...makeRequirement(3), itemId: "minecraft:lilac"};
  harness.props.set("chunklock:req:minecraft:overworld:1:0", JSON.stringify(next));
  harness.displays.refreshRequirementDisplays();
  assert.equal(entity.properties.get("chunklock:display_icon_v2"), load("display-icons-data").displayIconIndex(next.itemId));
  next.itemId = "custom:unknown";
  harness.props.set("chunklock:req:minecraft:overworld:1:0", JSON.stringify(next));
  harness.displays.refreshRequirementDisplays();
  assert.equal(entity.properties.get("chunklock:display_icon_v2"), 0);
  assert.equal(entity.nameTag, "Unknown\n× 3");
  assert.deepEqual(entity.commands, []);
});

test("plaque migration replaces old helpers without changing requirements or access", () => {
  const stored = JSON.stringify(makeRequirement());
  const harness = makeHarness({players: [makePlayer()], properties: {
    "chunklock:open:minecraft:overworld:0:0": true,
    "chunklock:req:minecraft:overworld:1:0": stored,
  }});
  const old = harness.dimensions.get("overworld").spawnEntity(DISPLAY_TYPE, {x: 16, y: 66, z: 8});
  old.setDynamicProperty("chunklock:display_key", "z:16:8:1:0");
  harness.displays.startRequirementDisplays();
  assert.equal(old.removed, true);
  assert.equal(harness.entities.length, 1);
  assert.ok(harness.entities[0].getDynamicProperty("chunklock:display_key").startsWith("plaque3:"));
  assert.equal(harness.props.get("chunklock:req:minecraft:overworld:1:0"), stored);
  assert.equal(harness.props.get("chunklock:open:minecraft:overworld:0:0"), true);
});

test("plaques stay on the open side with correct cardinal yaw on all four boundaries", () => {
  const properties = {"chunklock:open:minecraft:overworld:0:0": true};
  for (const [x,z] of [[0,-1],[1,0],[0,1],[-1,0]]) {
    properties[`chunklock:req:minecraft:overworld:${x}:${z}`] = JSON.stringify(makeRequirement());
  }
  const harness = makeHarness({players:[makePlayer()], properties});
  harness.displays.startRequirementDisplays();
  assert.equal(harness.entities.length, 4);
  assert.deepEqual(harness.entities.map(e=>e.properties.get("chunklock:display_yaw")).sort((a,b)=>a-b), [0,90,180,270]);
  for (const entity of harness.entities) {
    assert.ok(entity.location.x > 0 && entity.location.x < 16);
    assert.ok(entity.location.z > 0 && entity.location.z < 16);
    assert.equal(entity.equipment.size, 0);
  }
});

test("each catalog item has its own index independent of shared texture paths", () => {
  const icons = load("display-icons-data");
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "../tools/display-icon-catalog.json"), "utf8"));
  const indices = Object.keys(catalog.items).map(item => icons.DISPLAY_ICON_INDEX[item]);
  assert.equal(new Set(indices).size, indices.length);
});

test("shaped block requirements use explicit models rather than square face swatches", () => {
  const icons = load("display-icons-data");
  const root = path.join(__dirname, "..");
  const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  const behavior = read("behavior_packs/chunklock/entities/requirement_display.json")["minecraft:entity"];
  const client = read("resource_packs/chunklock/entity/requirement_display.entity.json")["minecraft:client_entity"].description;
  const geo = read("resource_packs/chunklock/models/entity/requirement_display.geo.json")["minecraft:geometry"];
  const controller = read("resource_packs/chunklock/render_controllers/requirement_display.render_controllers.json").render_controllers["controller.render.chunklock.requirement_display_v2"];

  assert.equal(geo.length, 11);
  assert.deepEqual(behavior.description.properties["chunklock:display_shape"].range, [0, 10]);
  assert.equal(controller.arrays.geometries["Array.shapes"].length, 11);
  for (let i = 0; i < 11; i++) {
    assert.equal(geo[i].description.identifier, `geometry.chunklock.requirement_shape_${i}`);
    assert.equal(client.geometry[`shape_${i}`], `geometry.chunklock.requirement_shape_${i}`);
  }
  assert.equal(geo[5].bones[0].cubes.length, 4, "fence shape has two posts and two rails");

  assert.equal(icons.displayShape("minecraft:spruce_pressure_plate"), 2);
  assert.equal(icons.displayShape("minecraft:white_carpet"), 2);
  assert.equal(icons.displayShape("minecraft:moss_carpet"), 2);
  assert.equal(icons.displayShape("minecraft:spruce_planks"), 1);
  assert.equal(icons.displayShape("minecraft:bricks"), 1);
  assert.equal(icons.displayShape("minecraft:brick"), 0);
  assert.equal(icons.displayShape("minecraft:oak_slab"), 3);
  assert.equal(icons.displayShape("minecraft:daylight_detector"), 3);
  assert.equal(icons.displayShape("minecraft:oak_stairs"), 4);
  assert.equal(icons.displayShape("minecraft:oak_fence"), 5);
  assert.equal(icons.displayShape("minecraft:cobblestone_wall"), 6);
  assert.equal(icons.displayShape("minecraft:spruce_trapdoor"), 8);
  assert.equal(icons.displayShape("minecraft:glass_pane"), 8);
  assert.equal(icons.displayShape("minecraft:red_stained_glass_pane"), 8);
  assert.equal(icons.displayShape("minecraft:white_banner"), 9);
  assert.equal(icons.displayShape("minecraft:spruce_button"), 10);
  assert.equal(icons.displayShape("minecraft:lily_of_the_valley"), 0);
  assert.equal(icons.displayShape("minecraft:sculk_vein"), 0);
  assert.equal(icons.displayShape("minecraft:tripwire_hook"), 0);
  assert.equal(icons.displayShape("minecraft:stick"), 0);
  assert.equal(icons.displayShape("other:unknown"), 0);
});
