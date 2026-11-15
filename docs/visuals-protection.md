# Translucent border walls and block protection

## Reference and Bedrock replacement

Java counterparts are `chunk_init/init_locked_chunk`, `chunk_proximity/on_chunk_become_relevant`, `on_chunk_cease_relevant` and their interaction helpers. Java `block_display` and `interaction` commands are not used.

The Bedrock replacement is an original simple custom entity, `chunklock:border_wall`, rendered with a 16 by 64 block tiled slab and a procedural cyan RGBA texture. The material is `entity_alphablend`. The updated 0.125-block depth separates its front/back surfaces; adjacent tiles use exact matching widths. Alpha sorting artifacts can still occur and require in-game checking.

Geometry, client entity, render controller and texture live under `resource_packs/chunklock`; the passive server definition is under `behavior_packs/chunklock/entities`. Rebuild the original assets with `python tools/build_wall_assets.py`. A data module accompanies the script module, and both packs are version 0.2.1 with their existing pack UUIDs retained.

Official material reference: [Creating new entity types](https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity).

## Access and existing worlds

Marker records remain entity-free and unchanged. Access uses separate world dynamic properties, keyed by dimension and chunk coordinates. On this feature's first encounter with each player in each dimension, their current chunk becomes open and a persistent player flag prevents walking/rejoining from unlocking more chunks. This also provides a starting area in worlds used to test the earlier marker prototype. Each newly encountered player can contribute a starting chunk; access is shared globally.

Every other chunk is treated as locked, including chunks without a marker record. No payment/unlock command is provided yet. Movement collision is not implemented: players can still walk/fly through the visual walls for debugging, but block protection applies in locked terrain regardless of player location or Creative mode.

## Rendering lifecycle and limits

`walls.ts` inspects a five-by-five chunk window around each player. It creates faces only between open and locked cells, never between two open cells or all pairs of locked cells. Faces must be within 40 horizontal blocks of a player. The entire dimension height is divided into 64-block segments; segments near player height are scheduled first. Four helpers can spawn per ten-tick refresh, with at most 128 loaded helpers retained across the three vanilla dimensions.

Helpers have no gravity, physical collision, AI or damage response. Existing loaded helpers are adopted by a persistent wall key after reload. Duplicates and loaded helpers no longer wanted are removed. Unloaded helpers are reconciled when they load again. No ticking areas or forced chunk loads are created. These limits bound the implementation; they are not performance benchmark results or a global count of unloaded entities saved on disk.

## Protection and projectile limits

`protection.ts` cancels the stable API 2.6 before-events for breaking locked blocks and right-clicking locked blocks/entities. Version 0.2.1 also cancels attack damage to locked targets through the stable pre-damage event. Item interactions on an open border block are also denied when the neighboring placement cell is locked. This is deliberately conservative: some non-placement items used on an open border face are denied too. Feedback is deferred out of the restricted callback and rate-limited. Explosion block lists exclude locked blocks.

There is no physical interaction shield. Commands, pistons, fluids, fire spread and every other indirect mutation mechanism are not claimed to be protected by these hooks. The implemented hooks do not cover every possible indirect mutation mechanism.

`projectiles.ts` tracks projectile components on spawn and adopts nearby existing projectiles every second. Each tick it checks the traversed X/Z segment and a one-velocity-step lookahead against locked cells, including intermediate cells and diagonal corner contact. It removes intercepted projectiles, with a maximum of 256 tracked entries. Entries outside 96 blocks of players are dropped. Projectile behavior inside locked areas is also suppressed.

Stationary projectiles are retired from tracking after five idle ticks. If the tracking capacity is full, additional projectiles are left untracked rather than deleted merely for exceeding the budget. This is **best-effort interception**, not a guaranteed pre-hit barrier: capacity, spawn/update ordering, projectile acceleration and same-tick collisions can allow damage before script interception. Stable API 2.6 has no cancellable pre-projectile-hit callback; the separate pre-damage guard protects target health. Do not treat after-hit callbacks as proof that damage was prevented.

## Manual verification

1. Save and leave the world. Restart Minecraft to refresh resource definitions, then open a new Creative test world with both Chunklock packs active. An existing test world is also supported but seeds access at the current location the first time this feature runs.
2. Wait several seconds for the four cyan walls to fill their height segments. Check both sides and look up/down. They should not place or replace terrain blocks.
3. Mine/use a block inside the starting chunk: it should work. Target a block outside it: breaking/right-clicking should be denied. Try placement over the border and interacting with a chest/entity outside.
4. Fly away and return; leave/rejoin the world. Check no duplicate walls and no additional access granted by movement/rejoin. Test different player heights and dimensions.
5. Shoot slow/fast and close-range projectiles toward locked terrain. Record any same-tick impacts; perfect projectile prevention has not been established.
6. Inspect Settings -> Creator -> Content Log if an entity/texture is missing or Minecraft reports a pack-loading error. The previous generic pack-loading warning remains unclassified until actual logs identify its source.

Automated tests exercise geometry planning, negative coordinates, deduplication, access persistence, callback cancellation and projectile path traversal using a simulated Minecraft API. Build/package validation does not establish visual quality, material compatibility or game performance.


## 0.2.1 corrections after user testing

The user confirmed block breaking and placement protection, but reported corrupted translucent walls, melee hits across borders and close-range arrows damaging mobs before projectile polling could remove them.

The previous implementation subscribed only to block/right-click hooks and used API 2.0.0. A right-click hook does not cancel sword attacks. Tick-based projectile removal also cannot reliably run before a same-tick collision. This release pins stable API 2.6.0 and requires Bedrock 1.26.60 or later; the development machine has 1.26.63 installed. `world.beforeEvents.entityHurt` cancels entity/projectile attack damage when the victim is in a locked chunk. This protects target health independently of projectile tracking capacity and tick ordering. Environmental damage without an attacker is not cancelled. It does not claim to prevent every non-damage projectile side effect, knockback behavior or indirect world mutation.

The original wall used a 64-block-tall, subpixel-depth closed cuboid with six overlapping translucent face directions and stretched high-alpha texture borders. The image shows artifacts consistent with that risky layout; the exact GPU rendering cause is not proven. The replacement retains 64-block helper segments but tiles each into four 16-block-high front/back surfaces, omits edge caps, uses exact non-overlapping tile widths and a thicker two-pixel slab, and applies a uniform low-alpha cyan texture. Versioned wall keys remove previously loaded helpers during reconciliation. Rendering must be retested in Minecraft; no screenshot of the corrected model has been verified yet.

The earlier API 2.0 limitations described above are historical. The pre-damage guard supersedes the melee/close-range health-damage limitation, while the projectile polling mechanism remains best-effort for removing the projectile itself.

After deploying 0.2.1, save and close the world, fully restart Minecraft to reload resource geometry, and re-test the same sword and close-range bow cases against a mob outside the starting chunk. A mob inside the open chunk should still take normal damage. Recheck mining and placement across the border. No existing unlock or marker properties are reset.

Primary API evidence: [stable changelog, 2.6.0](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/changelog?view=minecraft-bedrock-stable#260) and [EntityHurtBeforeEvent](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeevent?view=minecraft-bedrock-stable).

## Wall suffocation correction and runtime evidence

A read-only `entityDie` listener confirmed `suffocation` deaths in the user's flat test world. Anchors can sit inside solid terrain; the dying entity's pose made the large model appear to fall and tilt, and reconciliation then spawned replacements. This was a server lifecycle defect, not proven GPU distortion.

The server definition now breathes in solids and water, has 100 health and uses an unconditional no-damage sensor. The pre-damage callback also cancels every damage cause for `chunklock:border_wall`, before applying the separate locked-target combat rules. Ordinary mobs in open chunks retain their normal damage behavior. Geometry, chunk coordinates, access and marker records are unchanged by this correction.

`wall-diagnostics.ts` is new Bedrock-only diagnostic behavior called once by `main.ts`, alongside the wall manager. It reads loaded helper IDs and health at 200 and 400 ticks, reports a baseline and comparison, and rate-limits actual death reports. It never changes access or spawns helpers. ID changes can be legitimate when players move or helpers reconcile; compare while stationary. With cheats already enabled, `/scriptevent chunklock:wall_debug` also prints up to three helper positions per dimension; enabling cheats is not required for the automatic summaries.

After a full Minecraft restart and world re-entry on Bedrock 1.26.63, the stationary test reported `Alive=24, minHP=100` twice and `IDs=stable` on the second sample. No repeated deaths or falling sheets were observed in that session. The user separately confirmed the melee and close-range bow protection. Full visual alignment at every height, dimension and view angle remains unverified; the low-alpha surface is faint at night. The existing generic pack-loading warning is still unclassified.
