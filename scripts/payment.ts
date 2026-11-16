import {
  Container,
  Entity,
  EntityEquippableComponent,
  EntityInventoryComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  world,
} from "@minecraft/server";
import { formatDimensionDisplayName, getDimensionUnlockedCount, isOpenCell, unlockChunk } from "./access.js";
import { refreshRequirementDisplays } from "./displays.js";
import { broadcastGlobalNotice, clearActionNotice, showActionNotice } from "./notices.js";
import {
  deleteChunkRequirement,
  formatItemDisplayName,
  getChunkRequirement,
  setChunkRequirementRemainingCost,
} from "./requirements.js";
import { refreshWalls } from "./walls.js";

const DISPLAY_TYPE = "chunklock:requirement_display";
const COOLDOWN_TICKS = 5;
const cooldowns = new Map<string, number>();
const useSuppressedUntil = new Map<string, number>();
let started = false;

type PaymentSource =
  | { kind: "inventory"; container: Container; slot: number; stack: ItemStack }
  | { kind: "offhand"; equippable: EntityEquippableComponent; stack: ItemStack };

type PaymentEntry = PaymentSource & {
  originalStack: ItemStack;
  remainingStack?: ItemStack;
};

function actionBar(player: Player, message: string) {
  showActionNotice(player, message);
  try {
    player.sendMessage(message);
  } catch {
    /* The player may have left before the scheduled action runs. */
  }
}

function soundAndParticle(target: Entity, sound: string, pitch: number, particle: string) {
  try {
    target.dimension.playSound(sound, target.location, { volume: 1, pitch });
  } catch {
    /* Feedback must not interrupt a payment state update. */
  }
  try {
    target.dimension.spawnParticle(particle, target.location);
  } catch {
    /* Feedback must not interrupt a payment state update. */
  }
}

function restoreRequirement(dimension: string, cx: number, cz: number, remainingCost: number) {
  try {
    setChunkRequirementRemainingCost(dimension, cx, cz, remainingCost);
  } catch (error) {
    console.error(`[Chunklock] Could not restore a chunk requirement after failed payment: ${error}`);
  }
}

function writePaymentEntry(entry: PaymentEntry, stack: ItemStack | undefined) {
  if (entry.kind === "inventory") {
    entry.container.setItem(entry.slot, stack);
    return;
  }
  if (!entry.equippable.setEquipment(EquipmentSlot.Offhand, stack)) {
    throw new Error("Could not update the player's offhand stack.");
  }
}

function restorePaymentEntries(entries: PaymentEntry[]) {
  for (const entry of [...entries].reverse()) {
    try {
      writePaymentEntry(entry, entry.originalStack.clone());
    } catch (error) {
      console.error(`[Chunklock] Could not restore an inventory stack after failed payment: ${error}`);
    }
  }
}

function applyPaymentEntries(entries: PaymentEntry[]): (() => void) | undefined {
  const attempted: PaymentEntry[] = [];
  try {
    for (const entry of entries) {
      attempted.push(entry);
      writePaymentEntry(entry, entry.remainingStack?.clone());
    }
  } catch (error) {
    restorePaymentEntries(attempted);
    console.warn(`[Chunklock] Could not update inventory stacks for payment: ${error}`);
    return undefined;
  }

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    restorePaymentEntries(entries);
  };
}

function matchingSources(
  player: Player,
  itemId: string,
  equippable: EntityEquippableComponent | undefined
): PaymentSource[] {
  const sources: PaymentSource[] = [];
  const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent | undefined;
  const container = inventory?.container;

  if (container) {
    const visited = new Set<number>();
    const selectedSlot = player.selectedSlotIndex;
    const slots: number[] = [];
    if (Number.isSafeInteger(selectedSlot) && selectedSlot >= 0 && selectedSlot < container.size) {
      slots.push(selectedSlot);
    }
    for (let slot = 0; slot < container.size; slot++) slots.push(slot);

    for (const slot of slots) {
      if (visited.has(slot)) continue;
      visited.add(slot);
      const stack = container.getItem(slot);
      if (stack?.typeId === itemId && stack.amount > 0) {
        sources.push({ kind: "inventory", container, slot, stack });
      }
    }
  }

  const offhand = equippable?.getEquipment(EquipmentSlot.Offhand);
  if (offhand?.typeId === itemId && offhand.amount > 0 && equippable) {
    sources.push({ kind: "offhand", equippable, stack: offhand });
  }
  return sources;
}

function planPayment(sources: PaymentSource[], amount: number): PaymentEntry[] {
  let remaining = amount;
  const entries: PaymentEntry[] = [];
  for (const source of sources) {
    if (remaining <= 0) break;
    const taken = Math.min(source.stack.amount, remaining);
    const left = source.stack.amount - taken;
    const remainingStack = left > 0 ? source.stack.clone() : undefined;
    if (remainingStack) remainingStack.amount = left;
    entries.push({ ...source, originalStack: source.stack.clone(), remainingStack });
    remaining -= taken;
  }
  return entries;
}

function refreshAfterPayment(unlocked: boolean) {
  if (unlocked) {
    try {
      refreshWalls();
    } catch (error) {
      console.warn(`[Chunklock] Could not refresh border walls after payment: ${error}`);
    }
  }
  try {
    refreshRequirementDisplays();
  } catch (error) {
    console.warn(`[Chunklock] Could not refresh requirement displays after payment: ${error}`);
  }
}

function finishUnlock(
  player: Player,
  target: Entity,
  dimension: string,
  cx: number,
  cz: number,
  previousCost: number,
  rollbackPayment?: () => void
) {
  try {
    if (!setChunkRequirementRemainingCost(dimension, cx, cz, 0)) {
      rollbackPayment?.();
      return false;
    }
    if (!unlockChunk(player, dimension, cx, cz)) {
      restoreRequirement(dimension, cx, cz, previousCost);
      rollbackPayment?.();
      return false;
    }
    try {
      deleteChunkRequirement(dimension, cx, cz);
    } catch (error) {
      console.warn(`[Chunklock] Could not remove the completed requirement ${dimension}:${cx}:${cz}: ${error}`);
    }
    soundAndParticle(target, "random.levelup", 1, "minecraft:totem_particle");
    const dimensionName = formatDimensionDisplayName(dimension);
    const unlockOrder = getDimensionUnlockedCount(dimension);
    const playerName = typeof player.name === "string" && player.name.trim().length > 0 ? player.name : "A player";
    showActionNotice(player, `Global ${dimensionName} chunk #${unlockOrder} unlocked.`);
    broadcastGlobalNotice(
      `${playerName} unlocked ${dimensionName} chunk #${unlockOrder} (Global: shared by all players).`
    );
    refreshAfterPayment(true);
    return true;
  } catch (error) {
    if (!isOpenCell(dimension, cx, cz)) {
      restoreRequirement(dimension, cx, cz, previousCost);
      rollbackPayment?.();
    }
    console.error(`[Chunklock] Could not unlock chunk ${dimension}:${cx}:${cz}: ${error}`);
    actionBar(player, "Payment could not be completed. Try again.");
    refreshAfterPayment(false);
    return false;
  }
}

function processClick(player: Player, target: Entity) {
  let dimension: string;
  let cx: unknown;
  let cz: unknown;
  try {
    dimension = target.dimension.id;
    cx = target.getDynamicProperty("chunklock:display:cx");
    cz = target.getDynamicProperty("chunklock:display:cz");
    if (player.dimension.id !== dimension || !Number.isSafeInteger(cx) || !Number.isSafeInteger(cz)) return;
  } catch {
    return;
  }

  const lockedX = cx as number;
  const lockedZ = cz as number;
  if (isOpenCell(dimension, lockedX, lockedZ)) {
    actionBar(player, "This chunk is already open.");
    refreshAfterPayment(false);
    return;
  }
  const requirement = getChunkRequirement(dimension, lockedX, lockedZ);
  if (!requirement || requirement.remainingCost <= 0) {
    actionBar(player, "This chunk has no payable requirement.");
    refreshAfterPayment(false);
    return;
  }

  const itemName = formatItemDisplayName(requirement.itemId);
  let equippable: EntityEquippableComponent | undefined;
  let sources: PaymentSource[];
  try {
    equippable = player.getComponent("minecraft:equippable") as EntityEquippableComponent | undefined;
    if (equippable?.getEquipment(EquipmentSlot.Mainhand)?.typeId === "minecraft:barrier") {
      finishUnlock(player, target, dimension, lockedX, lockedZ, requirement.remainingCost);
      return;
    }
    sources = matchingSources(player, requirement.itemId, equippable);
  } catch (error) {
    console.warn(`[Chunklock] Could not inspect the player's inventory: ${error}`);
    actionBar(player, "Could not read your inventory. Try again.");
    return;
  }

  const totalAvailable = sources.reduce((total, source) => total + source.stack.amount, 0);
  if (totalAvailable <= 0) {
    soundAndParticle(target, "note.didgeridoo", 0.7, "minecraft:basic_smoke_particle");
    actionBar(player, `This chunk requires ${itemName} × ${requirement.remainingCost}.`);
    return;
  }

  const paid = Math.min(totalAvailable, requirement.remainingCost);
  const remainingCost = requirement.remainingCost - paid;
  const entries = planPayment(sources, paid);

  try {
    if (!setChunkRequirementRemainingCost(dimension, lockedX, lockedZ, remainingCost)) {
      actionBar(player, "Payment could not be completed. Try again.");
      return;
    }
  } catch (error) {
    restoreRequirement(dimension, lockedX, lockedZ, requirement.remainingCost);
    console.warn(`[Chunklock] Could not save payment for ${dimension}:${lockedX}:${lockedZ}: ${error}`);
    actionBar(player, "Payment could not be completed. Try again.");
    return;
  }

  const rollbackPayment = applyPaymentEntries(entries);
  if (!rollbackPayment) {
    restoreRequirement(dimension, lockedX, lockedZ, requirement.remainingCost);
    actionBar(player, "Could not update your inventory. Try again.");
    return;
  }

  if (remainingCost === 0) {
    finishUnlock(player, target, dimension, lockedX, lockedZ, requirement.remainingCost, rollbackPayment);
    return;
  }

  soundAndParticle(target, "block.end_portal_frame.fill", 1.5, "minecraft:totem_particle");
  actionBar(player, `Paid ${paid} ${itemName}. ${remainingCost} remaining.`);
  refreshAfterPayment(false);
}

export function startPayments() {
  if (started) return;
  started = true;
  world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const until = useSuppressedUntil.get(event.player.id);
    if (until === undefined) return;
    if (system.currentTick < until || event.isFirstEvent === false) {
      event.cancel = true;
    } else {
      useSuppressedUntil.delete(event.player.id);
    }
  });
  world.beforeEvents.itemUse.subscribe((event) => {
    if (system.currentTick < (useSuppressedUntil.get(event.source.id) ?? 0)) event.cancel = true;
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId !== DISPLAY_TYPE) return;
    event.cancel = true;
    useSuppressedUntil.set(event.player.id, system.currentTick + 10);
    const now = system.currentTick;
    if (now - (cooldowns.get(event.player.id) ?? -COOLDOWN_TICKS) < COOLDOWN_TICKS) return;
    cooldowns.set(event.player.id, now);
    const player = event.player;
    const target = event.target;
    system.run(() => processClick(player, target));
  });
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    cooldowns.delete(playerId);
    useSuppressedUntil.delete(playerId);
    clearActionNotice(playerId);
  });
}
