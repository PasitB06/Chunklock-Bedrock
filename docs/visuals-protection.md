# Translucent border walls and block protection

## Reference and Bedrock replacement

Java counterparts are `chunk_init/init_locked_chunk`, `chunk_proximity/on_chunk_become_relevant`, `on_chunk_cease_relevant` and their interaction helpers. Java `block_display` and `interaction` commands are not used.

The Bedrock replacement is an original simple custom entity, `chunklock:border_wall`, rendered with a 16 by 64 block tiled slab and a procedural cyan RGBA texture. It uses a custom `chunklock_border_wall:entity_alphablend` material in `resource_packs/chunklock/materials/entity.material` that adds `DisableDepthWrite` and `DisableAlphaWrite` so overlapping translucent walls do not occlude walls behind them in the depth buffer. Its ultra-thin 0.1-unit depth (`[-0.05, +0.05]`) with matching 0.05-unit corner extensions (`[-128.05, +128.05]`), `minecraft:body_rotation_axis_aligned` component, and `animation.chunklock.border_wall.align` bone rotation lock keep perpendicular walls flush at chunk corners.

Geometry, client entity, material, animation, render controller and texture live under `resource_packs/chunklock`; the passive server definition is under `behavior_packs/chunklock/entities`. Rebuild the assets with `python tools/build_wall_assets.py`. A data module accompanies the script module, with Behavior Pack version 0.2.9 and Resource Pack version 0.2.4 retaining their existing pack UUIDs.

Official material reference: [Creating new entity types](https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity).

## Access and existing worlds

Marker records remain entity-free and unchanged. Access uses separate world dynamic properties, keyed by dimension and chunk coordinates. On this feature's first encounter with each player in each dimension, their current chunk becomes open and a persistent player flag prevents walking/rejoining from unlocking more chunks. This also provides a starting area in worlds used to test the earlier marker prototype. Each newly encountered player can contribute a starting chunk; access is shared globally.

Every other chunk is treated as locked, including chunks without a marker record. No payment/unlock command is provided yet. `collision.ts` checks every player once per tick and teleports non-Spectator players back when their current position enters a locked chunk. Block protection applies in locked terrain regardless of player location or Creative mode.

## Movement collision

The Java behavior is implemented by `post_tick_player`, which refreshes a player's safe-position marker while the current chunk is open, and `collision/player_chunk_collision` -> `exit_locked_chunk`, which teleports the player to that marker when their current chunk is locked. `tick_player` calls the collision function every tick and skips Spectator mode.

The Bedrock counterpart is `scripts/collision.ts`, started once from `main.ts` after access seeding. Each one-tick interval captures the current position and rotation for every connected player. Positions are held per player and dimension; an open current chunk replaces the previous safe position, while a locked current chunk sends non-Spectator players back to that dimension's previous safe position while retaining their current viewing rotation. Position checks convert world coordinates to chunk coordinates through `isLocked`, including negative positions; access storage itself is keyed by integer chunk coordinates. A recovered spawn point or nearest known open cell is used if no in-memory checkpoint exists. Safe positions persist on the player and refresh once per second so they survive world or script reloads. Input is not disabled, and movement may press against the boundary and cause repeated short teleports. Spectator movement is exempt, matching the Java reference.

This subsystem is new Bedrock script behavior connected to the existing dimension-aware open-cell properties. It does not modify marker records, grant access on movement after a dimension is seeded, or change block placement/mining protection. The one-tick script interval is the closest available equivalent to Java's tick flow; the stable API has no distinct end-of-tick callback. Runtime checks should cover all four edges, diagonal entry, negative coordinates, jumping/flying, knockback, respawn, dimension changes and world rejoin.

## Rendering lifecycle and limits

`walls.ts` inspects a five-by-five chunk window around each player. It creates faces only between open and locked cells, never between two open cells or all pairs of locked cells. Faces must be within 40 horizontal blocks of a player, and vertical 64-block segments are bounded to segments whose vertical midpoint is within 96 blocks of a player. Priority combines vertical and horizontal distance so nearby segments are scheduled first. Four helpers can spawn per ten-tick refresh, with at most 192 loaded helpers retained across the three vanilla dimensions. Existing helpers have their position and cardinal rotation re-applied during reconciliation.

Helpers have no gravity, physical collision, AI or damage response. Existing loaded helpers are adopted by a persistent wall key after reload. Duplicates and loaded helpers no longer wanted are removed. Unloaded helpers are reconciled when they load again. No ticking areas or forced chunk loads are created. These limits bound the implementation; they are not performance benchmark results or a global count of unloaded entities saved on disk.

Current requirement display implementation: [flat icon plaques](flat-icon-plaques.md), BP 0.2.27 / RP 0.2.22. Earlier held-item descriptions below are historical; wall rendering remains unchanged.

## Requirement displays

`displays.ts` reuses `wallEdges` so each requirement icon aligns to the exact boundary between an open cell and a locked cell. It only creates a display when the locked cell has a saved requirement and the nearest player is within 24 horizontal blocks. The helper is placed 0.05 blocks into the open cell at the edge midpoint, sits 0.25 blocks above the nearest player's head height to stay clear of horizontal melee and projectile attacks, and is keyed by the locked chunk coordinates. Its 0.35 by 0.35 hitbox is limited to that elevated center point, leaving the border combat zone clear on both sides. The server definition includes `minecraft:equipment`, `minecraft:equippable`, and the client-synced `chunklock:display_yaw` (`0`, `90`, `180`, `270`) and `chunklock:display_is_2d` properties, and `displays.ts` sets the mainhand item through both `EntityEquippableComponent` and `replaceitem entity @s slot.weapon.mainhand 0` so the client renderer receives `MobEquipmentPacket`. The client geometry and `animation.chunklock.requirement_display.pose` align `root` to `chunklock:display_yaw`, center `rightArm` under the name tag (`[1.75, 1.5, 0]`), invert the 3D block hand pitch/yaw in exact parent-child order (`[-20, 0, ...]` on `rightArm` and `[0, -45, 0]` on `rightItem`), and add a `-45` degree Z-axis compensation when `chunklock:display_is_2d` is true so 2D sprites also stand upright.

The display has no gravity or physical collision, is immune to damage, and is reconciled every ten ticks with a four-entity spawn budget. At most 128 display helpers are retained. It is a presentation/input helper; persistent chunk requirement data remains authoritative. Right-clicks are canceled before the normal item action and processed after the restricted event callback. Payment checks the selected hotbar slot first, then the rest of the player's 36-slot inventory and offhand. It preserves excess items in their original slots and leaves the requirement unchanged when no matching item is present. Action-bar notices are held for 100 ticks via `notices.ts` (suppressing the ten-tick prototype coordinate bar while active) and also echoed to chat. These changes are statically tested; their rendering and interaction behavior remain to be checked in Minecraft.

## Protection and projectile limits

`protection.ts` cancels the stable API 2.6 before-events for breaking locked blocks and right-clicking locked blocks/entities. Version 0.2.1 also cancels attack damage to locked targets through the stable pre-damage event. Item interactions on an open border block are also denied when the neighboring placement cell is locked. This is deliberately conservative: some non-placement items used on an open border face are denied too. Feedback is deferred out of the restricted callback and rate-limited. Explosion block lists exclude locked blocks.

There is no physical interaction shield. Commands, pistons, fluids, fire spread and every other indirect mutation mechanism are not claimed to be protected by these hooks. The implemented hooks do not cover every possible indirect mutation mechanism.

`projectiles.ts` tracks projectile components on spawn and adopts nearby existing projectiles every second. Each tick it checks the actually traversed X/Z segment against locked cells, including intermediate cells and diagonal corner contact. It removes intercepted projectiles, with a maximum of 256 tracked entries. Entries outside 96 blocks of players are dropped. Projectile behavior inside locked areas is also suppressed.

Stationary projectiles are retired from tracking after five idle ticks. If the tracking capacity is full, additional projectiles are left untracked rather than deleted merely for exceeding the budget. This is **best-effort interception**, not a guaranteed pre-hit barrier: capacity, spawn/update ordering, projectile acceleration and same-tick collisions can allow damage before script interception. Stable API 2.6 has no cancellable pre-projectile-hit callback; the separate pre-damage guard protects target health. Do not treat after-hit callbacks as proof that damage was prevented.

## Manual verification

1. Save and leave the world. Restart Minecraft to refresh resource definitions, then open a new Creative test world with both Chunklock packs active. An existing test world is also supported but seeds access at the current location the first time this feature runs.
2. Wait several seconds for the four blue walls to fill their height segments. Check both sides and look up/down. They should not place or replace terrain blocks.
3. Mine/use a block inside the starting chunk: it should work. Target a block outside it: breaking/right-clicking should be denied. Try placement over the border and interacting with a chest/entity outside.
4. Fly away and return; leave/rejoin the world. Check no duplicate walls and no additional access granted by movement/rejoin. Test different player heights and dimensions.
5. Walk, jump and fly across each border into a locked cell. The player should return to the previous tick's safe position. Repeat for diagonal corners, negative coordinates, after respawn, after a dimension change and after world rejoin. Spectator mode is exempt.
6. Shoot slow/fast and close-range projectiles toward locked terrain. Record any same-tick impacts; perfect projectile prevention has not been established.
7. At a locked border, check that the requirement icon and item/count label stay centered on the wall and move with player height. Right-click with no matching item for the requirement message, then place the required item in a non-selected inventory slot and confirm it is found. Split the cost across multiple stacks and offhand; confirm payment consumes only the needed amount, leaves any excess in its original slot, updates partial cost and removes the inner border on final payment. A barrier in the selected hand should unlock without being consumed. Correct items are consumed even in Creative mode.
8. Leave and return to the border, then leave and rejoin the world. Confirm requirements and unlock state persist and that helpers do not duplicate.
9. Inspect Settings -> Creator -> Content Log if an entity/texture is missing or Minecraft reports a pack-loading error. The previous generic pack-loading warning remains unclassified until actual logs identify its source.

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

## Border-straddling mob correction

The previous damage guard classified a whole mob from `Entity.location`. A mob whose position was outside stayed invulnerable even when its body extended inside. Projectile velocity lookahead could also delete an arrow on the open side before it reached that exposed body.

`protection.ts` now reads stable API 2.6 `Entity.getAABB()` during the pre-damage callback. Positive horizontal collision-box overlap with any open chunk permits attack damage; mere contact at the boundary does not. The decision uses actual collision bounds, including size differences between mobs, negative coordinates and diagonal corners. It checks at most 64 cells; larger custom bounds fail closed. Unavailable or degenerate bounds fall back to the previous location rule. Wall helpers remain unconditionally immune. Block placement, mining, right-click interactions and access state are unchanged.

This is new Bedrock combat policy, not a claim of exact Java parity. The Java `chunk_proximity/on_chunk_become_relevant` function supplies stacked interaction shields; this port instead calls the collision-overlap policy from the pre-damage event, reads shared open-cell state and returns only a damage cancellation decision. It does not change neighboring chunks, marker records or unlock progress. A straddling target is damageable as a whole: the callback does not identify an exact melee contact point, so this does not promise per-body-part protection.

`projectiles.ts` now intercepts only actual traversed paths. Removing velocity lookahead lets arrows reach an exposed hitbox before crossing the boundary. An arrow can briefly cross before the next poll; the pre-damage guard still protects targets whose collision bounds are wholly locked. Non-damage projectile effects remain best effort.

Regression tests reproduce both previous failures and cover four border directions, diagonal overlap, exact boundary contact, wholly locked targets, and actual arrow crossings. These tests use a simulated API; the new boundary behavior still requires Minecraft gameplay verification after leaving and reopening the world. No resource restart is needed for these script-only changes.

API reference: [Entity.getAABB](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable#getaabb).
## Darker blue wall appearance

The procedural wall texture now uses RGBA `(25, 95, 220, 85)` (`#195FDC`, approximately 33% texture opacity), replacing `(45, 185, 255, 30)` (approximately 12%). This is a presentation-only change requested by the user. The same wall renderer consumes the regenerated texture; geometry, immunity, protection and persistent chunk state are unchanged. Actual blended opacity depends on visible surfaces and lighting. Fully restart Minecraft to reload the resource texture. The asset was regenerated and deployed; the new appearance has not yet been verified in Minecraft.

## Lighting-independent walls and client prediction

The user reported black walls after the color adjustment. The previous `entity_alphablend` material used environmental lighting while helper anchors can be inside dark terrain. The renderer now retains alpha blending and the same PNG color/opacity, but sets `ignore_lighting: true` in the render controller, following the built-in allay example. Both packs and their dependency are version 0.2.2, retaining UUIDs. There are no anchor, collision, damage or access changes. The Java presentation counterparts remain `chunk_init/init_locked_chunk` and the proximity helper lifecycle; this lighting override is Bedrock-specific presentation behavior.

The current stable 2.6 API provides cancellable pre-break and pre-interaction hooks, already used by `protection.ts`. It has no stable world pre-placement callback in the installed type definitions; `playerPlaceBlock` is an after-event. Existing protection cancels the server operation rather than restoring broken blocks in an after-event. These server callbacks do not offer a documented way to suppress all local predicted block appearances, crack animations or hand swings. Do not claim that a before-event guarantees zero client flicker.

A client-targetable shield was discussed as a possible experiment, not a proven fix. It could also intercept attacks on mobs protruding through the border. The user chose to preserve that combat behavior, so no shield, global Adventure-mode switching, terrain replacement or new client input restriction was added. The brief predicted appearance remains a known limitation.

Primary rendering evidence: [Mojang allay render controller](https://github.com/Mojang/bedrock-samples/blob/main/resource_pack/render_controllers/allay.render_controllers.json), [render controller schema](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/visualreference/render_controller.v1.8.0?view=minecraft-bedrock-stable). Protection reference: [Working with events](https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/events?view=minecraft-bedrock-stable).

## Movement collision implementation status

The per-tick return-to-safe-position behavior is implemented in `scripts/collision.ts`. It follows the Java checkpoint/collision flow described above, with a player dynamic-property backup per dimension. A runtime report found that the first implementation passed raw block coordinates to a function expecting chunk coordinates, which made the open starting chunk appear locked and repeatedly returned the player to the fallback chunk center. The check now uses the shared world-position-to-chunk conversion (`isLocked`), retains the player's current viewing rotation on pullback, and is covered by automated regression tests; lint and build pass. Gameplay movement still needs confirmation in Minecraft.

Runtime verification on Bedrock 1.26.63: after a full restart, the final alpha-blended, lighting-independent walls appeared blue at night, with terrain, mobs and the player visible through them in third-person view. The startup report showed 24 helpers at 100 health with stable IDs. The camera was returned to first-person and the existing test world left open. This verifies the reported dark-wall case on this machine; it does not establish every graphics mode or device.


The movement collision capability was added in Behavior Pack version 0.2.3. The coordinate correction is released in Behavior Pack version 0.2.4; its resource dependency remains at 0.2.2.

## Wall orientation correction

The wall manager now synchronizes `chunklock:wall_yaw` to the client: north/south edges use 0 degrees and east/west edges use 90 degrees. The model subtracts body yaw from this explicit target rather than combining body and head angles. Versioned `v4` helper keys replace older helpers. This adapts Java border display transforms to a Bedrock entity property; access and payment state are unchanged. Automated checks cover the rotation expression; rendered alignment still requires Minecraft verification after restarting the game.

## Vibrant Visuals compatibility

Resource Pack 0.2.17 declares `capabilities: ["pbr"]`; Behavior Pack 0.2.22 depends on that resource version. The existing minimum engine version 1.26.60 exceeds the required 1.21.120. Pack UUIDs are retained so updates replace the same packs.

This is a Bedrock-only pack-loading capability with no Java function counterpart, caller, callee or gameplay input. Java `chunk_init/init_locked_chunk` creates border displays and calls requirement initialization; the Bedrock wall/display managers continue consuming the same persistent access and requirement state. This manifest change supplies renderer compatibility metadata and does not change those functions or state. Default Vibrant Visuals lighting/material parameters apply; no custom PBR textures or lighting overrides are introduced.

See Microsoft's [Vibrant Visuals resource pack guide](https://learn.microsoft.com/en-us/minecraft/creator/documents/vibrantvisuals/vvresourcepacks). Restart Minecraft after deploying, enable both updated packs, and select Vibrant Visuals in Video settings on supported hardware. Check walls from both sides and at overlapping corners, requirement icons/counts, payment and world rejoin. Custom material transparency under the Vibrant Visuals renderer is not established by manifest/build checks; these runtime checks remain pending.

## Vibrant Visuals wall opacity

Resource Pack 0.2.18 selects `border_wall_vibrant` only when the client-side Molang query `query.graphics_mode_is_any('deferred')` is true. Its blue RGBA color is (25, 95, 220, 170), increasing source alpha from 33% to 67%. Simple, Fancy and other modes retain the original `border_wall` texture byte-for-byte at alpha 85. The client entity uses format 1.21.80, the minimum required by this query. Behavior Pack 0.2.23 updates the resource dependency.

This is a Bedrock-only presentation adaptation of Java `chunk_init/init_locked_chunk` border displays. The wall manager still creates the same helpers from access state; the client render controller chooses a texture per player without changing geometry, helper counts, payment, protection or saved state. `tools/build_wall_assets.py` generates both textures and the selection expression. See the [official graphics mode query](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/queryfunctions/query_graphics_mode_is_any).

The user confirmed graphics-mode availability before this adjustment. Static checks verify texture pixels and selection; perceived opacity still needs Minecraft verification after restarting. Compare Simple/Fancy and Vibrant Visuals in daylight, shade and at overlapping wall corners. This is an alpha adjustment, not a measured renderer-equivalent opacity guarantee.

## Deferred material isolation

After BP 0.2.24 / RP 0.2.19, the user reported visible blue walls in one view and invisible walls with shadows in another. Increasing alpha did not establish consistent deferred rendering. The shared custom material adds `DisableAlphaWrite` and `DisableDepthWrite`; its deferred compatibility is a suspect, not a confirmed engine diagnosis. Microsoft's [material documentation](https://learn.microsoft.com/en-us/minecraft/creator/documents/material-files) recommends built-in materials where possible and describes the alpha-write override.

RP 0.2.20 selects vanilla `entity_alphablend` together with the existing alpha-170 texture only for `deferred`. Simple/Fancy retain the original custom overlap material and alpha-85 texture. BP 0.2.25 updates the resource dependency. This isolates one material change without altering geometry, orientation, wall counts or the requirement-display fixes in 1125060. The Java counterpart remains `chunk_init/init_locked_chunk`; the Bedrock wall manager supplies helpers and access state, while the client alone selects the material. Payment and persistent state are unaffected.

Regression checks evaluate material and texture selection for Simple, Fancy, deferred and raytraced modes. They cannot prove renderer output. Restart Minecraft, compare all four wall orientations from both sides in daylight and shade, and inspect overlapping walls. Deferred depth sorting and shadow appearance remain runtime verification items; this change does not claim to disable shadow casting or fully match the two renderers' colors.

## Deferred wall lighting correction

The vanilla-material isolation in RP 0.2.20 did not resolve the user's invisible-wall report. In a controlled Minecraft test on 2026-11-16, temporarily switching the deferred material to opaque `entity` exposed the missing wall as almost black while its perpendicular neighbor was blue. Both geometries were present. The existing `ignore_lighting: true` was therefore insufficient to preserve wall color in this deferred scene; increasing alpha or changing the blend material alone did not address the lighting difference.

RP 0.2.21 adds an explicit PBR texture set only for `border_wall_vibrant`: color references the existing alpha-170 PNG and MERS is `[0, 255, 255, 0]` (nonmetal, fully emissive, fully rough, no subsurface scattering). It retains vanilla `entity_alphablend`. This gives the wall a visible color contribution in shade instead of relying solely on incoming light. It may look brighter or bloom depending on the player's exposure settings. It does not install global lighting overrides or claim to remove cast shadows. Simple/Fancy retain the original PNG, custom material and alpha 85. BP 0.2.26 updates the resource dependency.

Java `chunk_init/init_locked_chunk` supplies explicitly bright border block displays before calling requirement initialization. This Bedrock presentation adaptation is generated by `tools/build_wall_assets.py` and selected per client by the existing render controller. Its input is the client's deferred graphics mode; its output is a local PBR material response. Wall helper scheduling, geometry, access, saved requirements and payment remain unchanged. See Microsoft's [texture set reference](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/texturesetsreference/texturesetsconcepts/texturesetsintroduction).

Runtime evidence: with the original translucent material restored and the emissive texture set applied, both perpendicular walls at the same test corner were visibly blue and see-through. No material/texture errors appeared in the enabled Content Log during the test. This verifies that scene on the development Windows client, not every device, biome, dimension, exposure setting or overlapping-wall case. The temporary opaque diagnostic was removed. Regression tests check per-mode material/texture selection and the deferred-only PBR settings.
