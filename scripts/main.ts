import { system, world } from "@minecraft/server";

// A small smoke check: each player sees this once when joining the world.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) {
    system.run(() => {
      player.sendMessage("[Chunklock] Bedrock add-on is ready.");
    });
  }
});
