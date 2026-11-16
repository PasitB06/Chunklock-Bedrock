import { BlockTypes, Dimension, Entity, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { isOpenCell } from "./access.js";
import { getChunkRequirement, formatItemDisplayName } from "./requirements.js";
import { Cell, WallEdge, wallEdges } from "./regions.js";

const TYPE = "chunklock:requirement_display";
const MAX_DISPLAYS = 128;
const SPAWN_BUDGET = 4;
const VIEW_DISTANCE = 24;
const OPEN_SIDE_OFFSET = 0.05;
const DISPLAY_ELEVATION = 0.25;
const dimensions = ["overworld", "nether", "the_end"];
let failedAt = -Infinity;
let started = false;

const FLAT_BLOCK_ITEM_PATTERN =
  /(?:^|_)(?:sapling|propagule|door|sign|pane|rail|torch|lantern|candle|campfire|chain|ladder|bars|mushroom|fungus|roots|sprouts|vine|vines|lily|tulip|orchid|allium|bluet|cornflower|dandelion|poppy|daisy|peony|lilac|rose|sunflower|petals|torchflower|pitcher_plant|spore_blossom|fern|grass|bush|kelp|sugar_cane|bamboo|pickle|amethyst_bud|amethyst_cluster|pointed_dripstone|web|cobweb|egg|frogspawn|flower_pot|cake|bed|bell|brewing_stand|cauldron|hopper|lever|tripwire_hook|repeater|comparator|coral_fan|lichen|sculk_vein)$/;

const FLAT_NON_BLOCK_ITEM_PATTERN =
  /(?:^|_)(?:ingot|nugget|shard|seeds|boat|raft|dye|bucket|sword|pickaxe|axe|shovel|hoe|apple|beef|porkchop|chicken|mutton|rabbit|cod|salmon|bread|carrot|potato|beetroot|melon_slice|berries|cookie|pie|coal|charcoal|diamond|emerald|lapis_lazuli|quartz|redstone|raw|stick|flint|bone|string|feather|leather|ball|brick|paper|book|gunpowder|blaze|ender|tear|cream|wart|eye|flesh|prismarine|scute|shell|sac|honeycomb|bottle|bowl|arrow|bow|crossbow|rod|shears|lead|tag|saddle|minecart|frame|painting|stand|firework|disc|potion|snowball|wheat)$/;

export function isFlatDisplayItem(itemId: string): boolean {
  const shortName = itemId.startsWith("minecraft:") ? itemId.slice("minecraft:".length) : itemId;
  if (FLAT_BLOCK_ITEM_PATTERN.test(shortName)) return true;
  if (typeof BlockTypes?.get === "function") {
    try {
      return BlockTypes.get(itemId) === undefined;
    } catch {
      /* Fall back to pattern matching when BlockTypes is unavailable. */
    }
  }
  return FLAT_NON_BLOCK_ITEM_PATTERN.test(shortName);
}

type DisplayCandidate = {
  dimension: Dimension;
  key: string;
  lockedX: number;
  lockedZ: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  priority: number;
  itemId: string;
  remainingCost: number;
};

const candidateKey = (edge: WallEdge) => `${edge.key}:${edge.lockedCell.x}:${edge.lockedCell.z}`;

function positionOnOpenSide(edge: WallEdge): { x: number; z: number } {
  if (edge.side === "north") return { x: edge.x, z: edge.z + OPEN_SIDE_OFFSET };
  if (edge.side === "east") return { x: edge.x - OPEN_SIDE_OFFSET, z: edge.z };
  if (edge.side === "south") return { x: edge.x, z: edge.z - OPEN_SIDE_OFFSET };
  return { x: edge.x + OPEN_SIDE_OFFSET, z: edge.z };
}

function openSideRotation(edge: WallEdge): number {
  if (edge.side === "north") return 0;
  if (edge.side === "east") return 90;
  if (edge.side === "south") return 180;
  return 270;
}

function headLocation(player: Player) {
  try {
    return player.getHeadLocation();
  } catch {
    return { x: player.location.x, y: player.location.y + 1.62, z: player.location.z };
  }
}

function updateDisplay(entity: Entity, candidate: DisplayCandidate) {
  entity.setDynamicProperty("chunklock:display_key", candidate.key);
  entity.setDynamicProperty("chunklock:display:cx", candidate.lockedX);
  entity.setDynamicProperty("chunklock:display:cz", candidate.lockedZ);
  const label = `${formatItemDisplayName(candidate.itemId)}\n× ${candidate.remainingCost}`;
  if (entity.nameTag !== label) entity.nameTag = label;
  const equippable = entity.getComponent("minecraft:equippable");
  const held = equippable?.getEquipment(EquipmentSlot.Mainhand);
  const equippedItem = entity.getDynamicProperty("chunklock:display:item");
  if (held?.typeId !== candidate.itemId || equippedItem !== candidate.itemId) {
    equippable?.setEquipment(EquipmentSlot.Mainhand, new ItemStack(candidate.itemId, 1));
    if (typeof entity.runCommand === "function") {
      try {
        entity.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${candidate.itemId} 1`);
      } catch {
        /* Equippable component fallback already ran. */
      }
    }
    entity.setDynamicProperty("chunklock:display:item", candidate.itemId);
  }
  const current = entity.location;
  if (
    Math.abs(current.x - candidate.x) > 0.01 ||
    Math.abs(current.y - candidate.y) > 0.01 ||
    Math.abs(current.z - candidate.z) > 0.01
  ) {
    entity.teleport({ x: candidate.x, y: candidate.y, z: candidate.z });
  }
  entity.setProperty?.("chunklock:display_yaw", candidate.rotation);
  entity.setProperty?.("chunklock:display_is_2d", isFlatDisplayItem(candidate.itemId));
  entity.setRotation({ x: 0, y: candidate.rotation });
}

function candidateForEdge(dimension: Dimension, edge: WallEdge, player: Player): DisplayCandidate | undefined {
  const dx = edge.x - player.location.x;
  const dz = edge.z - player.location.z;
  const priority = Math.hypot(dx, dz);
  if (priority > VIEW_DISTANCE) return undefined;
  const requirement = getChunkRequirement(dimension.id, edge.lockedCell.x, edge.lockedCell.z);
  if (!requirement) return undefined;
  const head = headLocation(player);
  const position = positionOnOpenSide(edge);
  return {
    dimension,
    key: candidateKey(edge),
    lockedX: edge.lockedCell.x,
    lockedZ: edge.lockedCell.z,
    x: position.x,
    y: head.y + DISPLAY_ELEVATION,
    z: position.z,
    rotation: openSideRotation(edge),
    priority,
    itemId: requirement.itemId,
    remainingCost: requirement.remainingCost,
  };
}

function reportFailure(error: unknown, players: Player[]) {
  if (system.currentTick - failedAt < 200) return;
  console.warn(`[Chunklock] Could not create requirement display: ${error}`);
  for (const player of players) {
    try {
      player.sendMessage("[Chunklock] Requirement display failed. Check both packs and the Content Log.");
    } catch {
      /* The player may have left during the refresh. */
    }
  }
  failedAt = system.currentTick;
}

export function refreshRequirementDisplays() {
  let players: Player[];
  try {
    players = world.getAllPlayers();
  } catch {
    return;
  }
  const grouped = new Map<string, Player[]>();
  for (const player of players) {
    grouped.set(player.dimension.id, [...(grouped.get(player.dimension.id) ?? []), player]);
  }

  let spawnBudget = SPAWN_BUDGET;
  let active = 0;
  const pending: DisplayCandidate[] = [];
  for (const name of dimensions) {
    let dimension: Dimension;
    try {
      dimension = world.getDimension(name);
    } catch {
      continue;
    }
    const wanted = new Map<string, DisplayCandidate>();
    for (const player of grouped.get(dimension.id) ?? []) {
      const cx = Math.floor(player.location.x / 16);
      const cz = Math.floor(player.location.z / 16);
      const openCells: Cell[] = [];
      for (let x = cx - 2; x <= cx + 2; x++) {
        for (let z = cz - 2; z <= cz + 2; z++) {
          if (isOpenCell(dimension.id, x, z)) openCells.push({ x, z });
        }
      }
      for (const edge of wallEdges(openCells, (x, z) => isOpenCell(dimension.id, x, z))) {
        const candidate = candidateForEdge(dimension, edge, player);
        if (!candidate) continue;
        const previous = wanted.get(candidate.key);
        if (!previous || candidate.priority < previous.priority) wanted.set(candidate.key, candidate);
      }
    }

    const found = new Set<string>();
    let existing: Entity[];
    try {
      existing = dimension.getEntities({ type: TYPE });
    } catch {
      existing = [];
    }
    for (const entity of existing) {
      let key: unknown;
      try {
        key = entity.getDynamicProperty("chunklock:display_key");
      } catch {
        entity.remove();
        continue;
      }
      if (typeof key !== "string" || !wanted.has(key) || found.has(key) || active >= MAX_DISPLAYS) {
        entity.remove();
        continue;
      }
      try {
        updateDisplay(entity, wanted.get(key)!);
        found.add(key);
        active++;
      } catch (error) {
        entity.remove();
        reportFailure(error, players);
      }
    }
    for (const [key, candidate] of wanted) if (!found.has(key)) pending.push(candidate);
  }

  pending.sort((a, b) => a.priority - b.priority);
  for (const candidate of pending) {
    if (spawnBudget <= 0 || active >= MAX_DISPLAYS) break;
    let entity: Entity | undefined;
    try {
      entity = candidate.dimension.spawnEntity(TYPE, {
        x: candidate.x,
        y: candidate.y,
        z: candidate.z,
      });
      updateDisplay(entity, candidate);
      active++;
      spawnBudget--;
    } catch (error) {
      if (entity) entity.remove();
      reportFailure(error, players);
      break;
    }
  }
}

export function startRequirementDisplays() {
  if (started) return;
  started = true;
  refreshRequirementDisplays();
  system.runInterval(refreshRequirementDisplays, 10);
}
