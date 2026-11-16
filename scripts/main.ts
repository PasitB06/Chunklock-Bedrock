import { system, world } from "@minecraft/server";
import { startChunks } from "./chunks.js";
import { startProtection } from "./protection.js";
import { startWalls } from "./walls.js";
import { startProjectiles } from "./projectiles.js";
import { startWallDiagnostics } from "./wall-diagnostics.js";
import { startCollision } from "./collision.js";
import { startRequirementDisplays } from "./displays.js";
import { startPayments } from "./payment.js";

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

// A small smoke check: each player sees this once when joining the world.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) {
    system.run(() => {
      player.sendMessage("Bedrock add-on is ready.");
    });
  }
});
