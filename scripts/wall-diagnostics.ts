import { system, world } from "@minecraft/server";
import { isDebugEnabled, setDebugEnabled } from "./state-cache.js";

// Read-only diagnostics distinguish real entity deaths from client pose changes.
export function startWallDiagnostics() {
  let lastReport = -Infinity;
  let previousIds = "";
  for (const delay of [200, 400])
    system.runTimeout(() => {
      if (!isDebugEnabled()) return;
      const walls = ["overworld", "nether", "the_end"].flatMap((name) =>
        world.getDimension(name).getEntities({ type: "chunklock:border_wall" })
      );
      const ids = walls
        .map((entity) => entity.id)
        .sort()
        .join(",");
      const health = walls.map((entity) => entity.getComponent("minecraft:health")?.currentValue ?? 0);
      const report = `[Chunklock wall] Alive=${walls.length}, minHP=${health.length ? Math.min(...health) : 0}, IDs=${previousIds ? (ids === previousIds ? "stable" : "changed") : "baseline"}`;
      for (const player of world.getAllPlayers()) player.sendMessage(report);
      previousIds = ids;
    }, delay);
  world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId !== "chunklock:border_wall") return;
    const report = `[Chunklock wall] Entity died: ${event.damageSource.cause}`;
    console.warn(report);
    if (isDebugEnabled() && system.currentTick - lastReport >= 40) {
      for (const player of world.getAllPlayers()) player.sendMessage(report);
      lastReport = system.currentTick;
    }
  });
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "chunklock:debug") {
      const normalized = event.message.trim().toLowerCase();
      const next = normalized === "on" ? true : normalized === "off" ? false : !isDebugEnabled();
      setDebugEnabled(next);
      const status = `Debug mode ${next ? "enabled" : "disabled"}.`;
      if (event.sourceEntity) {
        try {
          (event.sourceEntity as { sendMessage?: (m: string) => void }).sendMessage?.(status);
        } catch {
          for (const player of world.getAllPlayers()) player.sendMessage(status);
        }
      } else {
        for (const player of world.getAllPlayers()) player.sendMessage(status);
      }
      return;
    }
    if (event.id !== "chunklock:wall_debug") return;
    for (const name of ["overworld", "nether", "the_end"]) {
      const dimension = world.getDimension(name);
      const walls = dimension.getEntities({ type: "chunklock:border_wall" });
      const data = walls.slice(0, 3).map((entity) => ({
        position: entity.location,
        rotation: entity.getRotation(),
        velocity: entity.getVelocity(),
        health: entity.getComponent("minecraft:health")?.currentValue,
        key: entity.getDynamicProperty("chunklock:wall_key"),
      }));
      for (const player of world.getAllPlayers())
        player.sendMessage(`[Chunklock wall] ${name}: ${walls.length} ${JSON.stringify(data)}`);
    }
  });
}
