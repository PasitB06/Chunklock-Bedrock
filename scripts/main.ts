import { system, world } from "@minecraft/server";
import { startChunks } from "./chunks.js";
import { startProtection } from "./protection.js";
import { startWalls } from "./walls.js";
import { startProjectiles } from "./projectiles.js";
import { startWallDiagnostics } from "./wall-diagnostics.js";
import { startCollision } from "./collision.js";
import { startRequirementDisplays } from "./displays.js";

startProtection();
system.run(() => {
  startWallDiagnostics();
  startWalls();
  startRequirementDisplays();
  startCollision();
  startChunks();
  startProjectiles();
});

// A small smoke check: each player sees this once when joining the world.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) {
    system.run(() => {
      player.sendMessage("[Chunklock] Bedrock add-on is ready.");
    });
  }
});
