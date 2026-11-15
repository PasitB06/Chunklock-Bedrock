# Entity-free chunk propagation prototype

Java counterparts: init_chunk_marker, init_containing_chunk, init_neighbors and tick_chunk_marker. Local Java source remains outside this repository.

World dynamic-property keys store dimension and floor-based X/Z coordinates; value 1 identifies the prototype schema. Centers are derived as coordinate * 16 + 8. Chunk records use no armor stands, marker entities, arbitrary NBT, terrain changes or forced chunk loading. The later [visuals feature](visuals-protection.md) adds separate temporary wall helpers.

Every 10 ticks, player chunks seed records. Recorded centers within 24 blocks on each horizontal axis request four cardinal neighbors. A center block lookup at player height must succeed before creation; unloaded targets are retried. Search is bounded to a five-by-five window, with at most eight creations per update shared across players and a hard limit of 4096 persistent records. There is no recursive expansion. Each player's seed list is snapshotted before neighbor creation. Record keys deduplicate players and isolate dimensions. The total is restored from property IDs on world reload.

This is an experimental slice, not a measured performance result. Always-on debug particles show nearby recorded centers at player height, and an action bar shows coordinates, center and total records. Presentation is temporary and does not place blocks. No chunk locking, payment or progression is implemented.

## Manual test

1. Activate Chunklock Behavior and Chunklock Resources in a new Creative test world.
2. Check the action-bar coordinates and flame particles at recorded centers.
3. Stand still: the count should settle; walk to new terrain: the count should grow in bounded steps.
4. Cross coordinates -17/-16/-1/0/15/16 and change dimensions.
5. Leave and re-enter the world to check persistence; test multiple players for duplicate prevention.

Creation intentionally stops at 4096 records. Use a new test world for a clean experiment. Unloaded-center checks can delay discovery. Gameplay correctness and server performance await manual testing.

Reference: [World dynamic properties](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/world?view=minecraft-bedrock-stable).
