import { Entity, EquipmentSlot, EntityEquippableComponent, Player, system, world } from "@minecraft/server";
import { isOpenCell, unlockChunk } from "./access.js";
import { refreshRequirementDisplays } from "./displays.js";
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
let started = false;

function actionBar(player: Player, message: string) {
  try {
    player.onScreenDisplay.setActionBar(message);
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

function restoreHand(
  equippable: EntityEquippableComponent,
  stack: NonNullable<ReturnType<EntityEquippableComponent["getEquipment"]>>
) {
  try {
    if (!equippable.setEquipment(EquipmentSlot.Mainhand, stack)) {
      console.error("[Chunklock] Could not restore a player's main-hand stack after failed payment.");
    }
  } catch (error) {
    console.error(`[Chunklock] Could not restore a player's main-hand stack after failed payment: ${error}`);
  }
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
  equippable?: EntityEquippableComponent,
  previousStack?: ReturnType<EntityEquippableComponent["getEquipment"]>
) {
  try {
    if (!setChunkRequirementRemainingCost(dimension, cx, cz, 0)) return false;
    if (!unlockChunk(player, dimension, cx, cz)) {
      restoreRequirement(dimension, cx, cz, previousCost);
      if (equippable && previousStack) restoreHand(equippable, previousStack.clone());
      return false;
    }
    try {
      deleteChunkRequirement(dimension, cx, cz);
    } catch (error) {
      console.warn(`[Chunklock] Could not remove the completed requirement ${dimension}:${cx}:${cz}: ${error}`);
    }
    soundAndParticle(target, "block.end_portal_frame.fill", 1.5, "minecraft:totem_particle");
    actionBar(player, "[Chunklock] Chunk unlocked.");
    refreshAfterPayment(true);
    return true;
  } catch (error) {
    if (!isOpenCell(dimension, cx, cz)) {
      restoreRequirement(dimension, cx, cz, previousCost);
      if (equippable && previousStack) restoreHand(equippable, previousStack.clone());
    }
    console.error(`[Chunklock] Could not unlock chunk ${dimension}:${cx}:${cz}: ${error}`);
    actionBar(player, "[Chunklock] Payment could not be completed. Try again.");
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
    actionBar(player, "[Chunklock] This chunk is already open.");
    refreshAfterPayment(false);
    return;
  }
  const requirement = getChunkRequirement(dimension, lockedX, lockedZ);
  if (!requirement || requirement.remainingCost <= 0) {
    actionBar(player, "[Chunklock] This chunk has no payable requirement.");
    refreshAfterPayment(false);
    return;
  }

  let equippable: EntityEquippableComponent | undefined;
  let held: ReturnType<EntityEquippableComponent["getEquipment"]>;
  try {
    equippable = player.getComponent("minecraft:equippable") as EntityEquippableComponent | undefined;
    held = equippable?.getEquipment(EquipmentSlot.Mainhand);
  } catch {
    actionBar(player, "[Chunklock] Could not read the item in your main hand.");
    return;
  }

  const itemName = formatItemDisplayName(requirement.itemId);
  if (!held) {
    actionBar(player, `[Chunklock] Requires ${itemName} × ${requirement.remainingCost}.`);
    return;
  }
  if (held.typeId === "minecraft:barrier") {
    finishUnlock(player, target, dimension, lockedX, lockedZ, requirement.remainingCost);
    return;
  }
  if (held.typeId !== requirement.itemId) {
    soundAndParticle(target, "note.didgeridoo", 0.7, "minecraft:basic_smoke_particle");
    actionBar(player, `[Chunklock] This chunk requires ${itemName} × ${requirement.remainingCost}.`);
    return;
  }

  const paid = Math.min(held.amount, requirement.remainingCost);
  if (paid <= 0 || !equippable) return;
  const remainingCost = requirement.remainingCost - paid;
  const previousStack = held.clone();
  const updatedStack = held.amount > paid ? held.clone() : undefined;
  if (updatedStack) updatedStack.amount = held.amount - paid;

  try {
    if (!setChunkRequirementRemainingCost(dimension, lockedX, lockedZ, remainingCost)) return;
    if (!equippable.setEquipment(EquipmentSlot.Mainhand, updatedStack)) {
      restoreRequirement(dimension, lockedX, lockedZ, requirement.remainingCost);
      actionBar(player, "[Chunklock] Could not update your held stack. Try again.");
      return;
    }
  } catch (error) {
    restoreRequirement(dimension, lockedX, lockedZ, requirement.remainingCost);
    actionBar(player, "[Chunklock] Payment could not be completed. Try again.");
    console.warn(`[Chunklock] Could not apply payment for ${dimension}:${lockedX}:${lockedZ}: ${error}`);
    return;
  }

  if (remainingCost === 0) {
    finishUnlock(player, target, dimension, lockedX, lockedZ, requirement.remainingCost, equippable, previousStack);
    return;
  }

  soundAndParticle(target, "block.end_portal_frame.fill", 1.5, "minecraft:totem_particle");
  actionBar(player, `[Chunklock] Paid ${paid} ${itemName}. ${remainingCost} remaining.`);
  refreshAfterPayment(false);
}

export function startPayments() {
  if (started) return;
  started = true;
  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId !== DISPLAY_TYPE) return;
    event.cancel = true;
    const now = system.currentTick;
    if (now - (cooldowns.get(event.player.id) ?? -COOLDOWN_TICKS) < COOLDOWN_TICKS) return;
    cooldowns.set(event.player.id, now);
    const player = event.player;
    const target = event.target;
    system.run(() => processClick(player, target));
  });
  world.afterEvents.playerLeave.subscribe(({ playerId }) => cooldowns.delete(playerId));
}
