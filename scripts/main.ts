import { system, world } from "@minecraft/server";
import { formatGlobalJoinNotice } from "./access.js";
import { startChunks } from "./chunks.js";
import { startCollision } from "./collision.js";
import { startCommands } from "./commands.js";
import { startRequirementDisplays } from "./displays.js";
import { startPayments } from "./payment.js";
import { startProjectiles } from "./projectiles.js";
import { startProtection } from "./protection.js";
import { startWallDiagnostics } from "./wall-diagnostics.js";
import { startWalls } from "./walls.js";

startCommands();
startProtection();
system.run(() => {
  startWallDiagnostics();
  startCollision();
  startPayments();
  startProjectiles();
  startChunks();
  system.runTimeout(startWalls, 3);
  system.runTimeout(startRequirementDisplays, 6);
});

// Announce the global Chunklock progress summary once when a player joins the world.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) {
    system.run(() => {
      try {
        player.sendMessage(formatGlobalJoinNotice());
      } catch {
        /* The player may have left before the scheduled join notice runs. */
      }
    });
  }
});
