# Translucent border walls and block protection

## Reference and Bedrock replacement

Java counterparts are `chunk_init/init_locked_chunk`, `chunk_proximity/on_chunk_become_relevant`, `on_chunk_cease_relevant` and their interaction helpers. Java `block_display` and `interaction` commands are not used.

The Bedrock replacement is an original simple custom entity, `chunklock:border_wall`, rendered with a thin 16.01 by 64 block cuboid and a procedural cyan RGBA texture. The material is `entity_alphablend`. The 0.02-block depth and slightly expanded width separate its surfaces from block faces. Alpha sorting artifacts can still occur and require in-game checking.

Geometry, client entity, render controller and texture live under `resource_packs/chunklock`; the passive server definition is under `behavior_packs/chunklock/entities`. Rebuild the original assets with `python tools/build_wall_assets.py`. A data module accompanies the script module, and both packs are version 0.2.0 with their existing pack UUIDs retained.

Official material reference: [Creating new entity types](https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity).

## Access and existing worlds

Marker records remain entity-free and unchanged. Access uses separate world dynamic properties, keyed by dimension and chunk coordinates. On this feature's first encounter with each player in each dimension, their current chunk becomes open and a persistent player flag prevents walking/rejoining from unlocking more chunks. This also provides a starting area in worlds used to test the earlier marker prototype. Each newly encountered player can contribute a starting chunk; access is shared globally.

Every other chunk is treated as locked, including chunks without a marker record. No payment/unlock command is provided yet. Movement collision is not implemented: players can still walk/fly through the visual walls for debugging, but block protection applies in locked terrain regardless of player location or Creative mode.

## Rendering lifecycle and limits

`walls.ts` inspects a five-by-five chunk window around each player. It creates faces only between open and locked cells, never between two open cells or all pairs of locked cells. Faces must be within 40 horizontal blocks of a player. The entire dimension height is divided into 64-block segments; segments near player height are scheduled first. Four helpers can spawn per ten-tick refresh, with at most 128 loaded helpers retained across the three vanilla dimensions.

Helpers have no gravity, physical collision, AI or damage response. Existing loaded helpers are adopted by a persistent wall key after reload. Duplicates and loaded helpers no longer wanted are removed. Unloaded helpers are reconciled when they load again. No ticking areas or forced chunk loads are created. These limits bound the implementation; they are not performance benchmark results or a global count of unloaded entities saved on disk.

## Protection and projectile limits

`protection.ts` cancels the stable API 2.0 before-events for breaking locked blocks and right-clicking locked blocks/entities. Item interactions on an open border block are also denied when the neighboring placement cell is locked. This is deliberately conservative: some non-placement items used on an open border face are denied too. Feedback is deferred out of the restricted callback and rate-limited. Explosion block lists exclude locked blocks.

There is no physical interaction shield. Melee damage to entities, commands, pistons, fluids, fire spread and every other indirect mutation mechanism are not claimed to be protected by these hooks. Stable API 2.0 does not offer every cancellable event provided by newer/experimental versions.

`projectiles.ts` tracks projectile components on spawn and adopts nearby existing projectiles every second. Each tick it checks the traversed X/Z segment and a one-velocity-step lookahead against locked cells, including intermediate cells and diagonal corner contact. It removes intercepted projectiles, with a maximum of 256 tracked entries. Entries outside 96 blocks of players are dropped. Projectile behavior inside locked areas is also suppressed.

Stationary projectiles are retired from tracking after five idle ticks. If the tracking capacity is full, additional projectiles are left untracked rather than deleted merely for exceeding the budget. This is **best-effort interception**, not a guaranteed pre-hit barrier: capacity, spawn/update ordering, projectile acceleration and same-tick collisions can allow damage before script interception. Stable API 2.0 has no cancellable pre-projectile-hit callback. Do not treat after-hit callbacks as proof that damage was prevented.

## Manual verification

1. Save and leave the world. Restart Minecraft to refresh resource definitions, then open a new Creative test world with both Chunklock packs active. An existing test world is also supported but seeds access at the current location the first time this feature runs.
2. Wait several seconds for the four cyan walls to fill their height segments. Check both sides and look up/down. They should not place or replace terrain blocks.
3. Mine/use a block inside the starting chunk: it should work. Target a block outside it: breaking/right-clicking should be denied. Try placement over the border and interacting with a chest/entity outside.
4. Fly away and return; leave/rejoin the world. Check no duplicate walls and no additional access granted by movement/rejoin. Test different player heights and dimensions.
5. Shoot slow/fast and close-range projectiles toward locked terrain. Record any same-tick impacts; perfect projectile prevention has not been established.
6. Inspect Settings -> Creator -> Content Log if an entity/texture is missing or Minecraft reports a pack-loading error. The previous generic pack-loading warning remains unclassified until actual logs identify its source.

Automated tests exercise geometry planning, negative coordinates, deduplication, access persistence, callback cancellation and projectile path traversal using a simulated Minecraft API. Build/package validation does not establish visual quality, material compatibility or game performance.
