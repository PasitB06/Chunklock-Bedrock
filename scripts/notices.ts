import { Player, system } from "@minecraft/server";

export const NOTICE_HOLD_TICKS = 100;
const activeNotices = new Map<string, { message: string; expiresAt: number }>();

function currentTick(): number {
  return typeof system?.currentTick === "number" ? system.currentTick : 0;
}

export function showActionNotice(player: Player, message: string, durationTicks = NOTICE_HOLD_TICKS) {
  if (typeof player.id === "string") {
    activeNotices.set(player.id, {
      message,
      expiresAt: currentTick() + durationTicks,
    });
  }
  try {
    player.onScreenDisplay.setActionBar(message);
  } catch {
    /* The player may have left before the scheduled action runs. */
  }
}

export function refreshActionNotice(player: Player): boolean {
  if (typeof player.id !== "string") return false;
  const notice = activeNotices.get(player.id);
  if (!notice) return false;
  if (currentTick() >= notice.expiresAt) {
    activeNotices.delete(player.id);
    return false;
  }
  try {
    player.onScreenDisplay.setActionBar(notice.message);
    return true;
  } catch {
    activeNotices.delete(player.id);
    return false;
  }
}

export function clearActionNotice(playerId: string) {
  activeNotices.delete(playerId);
}
