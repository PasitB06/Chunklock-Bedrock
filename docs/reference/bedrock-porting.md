# Mapping Java responsibilities to Bedrock

This is a responsibility map and future verification guide, not a list of completed gameplay systems.
Read [runtime-flow](runtime-flow.md), [state-model](state-model.md) and the relevant local Java source before implementing a system.

## Current status

The [chunk prototype](../chunk-prototype.md) implements persistent dimension-aware records, bounded cardinal expansion near players and debug center particles/action-bar coordinates. Chunk records remain entity-free; optional translucent wall helpers and block/right-click protection are described in [visuals and protection](../visuals-protection.md). Runtime diagnostics confirmed and corrected helper suffocation deaths; 24 loaded helpers retained full health and stable IDs in a stationary test. Full visual alignment and performance remain unverified. Stable API 2.6.0 cancels attack damage to targets wholly in locked cells before damage is applied; positive collision-box overlap with open terrain permits combat (regression-tested, gameplay verification pending), in addition to best-effort projectile removal. Movement locking, payment and progression remain unimplemented.

## Responsibility map

| Responsibility | Java reference | Required Bedrock behavior | Status |
| --- | --- | --- | --- |
| Initialization/scheduling | load, pre_tick, tick, post_tick | Idempotent setup and suitable every-tick/four-tick work separation | Not implemented |
| Joining players | init_player, pre_tick_player | Initialize each player and find/create their starting chunk in the correct dimension | Readiness message only; no Chunklock initialization |
| Chunk identity | chunk_init/*, find_chunk_coords/center | Dimension-aware persistent records with floor-based centers | Experimental prototype; manual verification pending |
| Neighbor expansion | init_neighbors and directional helpers | Bounded player-nearby cardinal propagation with loaded-center checks | Experimental prototype; manual verification pending |
| Weighted selection | roll_chunk_unlock_item, loot_table/* | Preserve nested weights/count evaluation and map supported item/biome identifiers | Not implemented |
| Price scaling | init_locked_chunk_unlock_item | Separate dimension counters and roll-time costs; preserve or explicitly revise the four difficulty formulas | Not implemented |
| Movement/mining protection | collision/*, interaction helpers | Locked-block breaking/right-click cancellation and adjacent placement checks | Block protection implemented for testing; movement protection not implemented |
| Player proximity | tick_chunk_player_proximity_check, chunk_proximity/* | Relevant-state transitions and bounded presentation/payment work | Not implemented |
| Borders and prices | render/update/kill helpers, block/item/text displays | Nearby dark-blue translucent custom wall entities with deduplicated segments | Walls implemented; suffocation fix verified with stable live helper IDs; full alignment pending; price display not implemented |
| Item payments | tick_item_in_chunk, check_submit/success/failure | Proven payer ownership, ID validation, deductions and single-return handling for excess/wrong items | Not implemented |
| Unlocking and totals | unlock_current_chunk | One state transition, helper cleanup and correct world/payer credits | Not implemented |
| Dimension transitions | util/change_dimension, dimension/* | Destination readiness and separate paid/automatic starting access | Not implemented |
| Projectiles/pearls | projectile/*, pearl/* | Bounded component tracking with swept-cell and velocity lookahead checks | Pre-damage guard added in 0.2.1; projectile removal remains best-effort |
| Commands and difficulty | triggers, chunk_difficulty/*, reroll | Permission-aware commands/menus and the post-first-unlock restriction | Not implemented |
| Item names and dye | translate_item_name/*, dye predicates, dye_chunk | Localization and dye handling through supported Bedrock mechanisms, without Java NBT/macros | Not implemented |
| Milestones/advancements | advancements, render messages | Add-on-owned progression separating world/personal totals; not native Java advancements | Not implemented |
| Reset/uninstall | utils/reset, utils/uninstall | Explicit state-removal scope and permissions; no Java datapack enable/disable commands | Not implemented |

## Behavioral contracts to preserve

- Chunk identity includes dimension. Equal X/Z coordinates in Overworld and Nether must not share state.
- Locked state and remaining cost survive presentation cleanup and players leaving the area.
- Safe positions belong to individual players. Java's shared scratch tags are not a required implementation pattern.
- Keep the rolled price; do not reroll or recalculate it during payment or after unrelated global progress changes.
- Identify the payer from ownership evidence rather than proximity alone.
- Return surviving items at most once and credit each unlock at most once.
- Distinguish starting chunks, End exceptions, paid unlocks and portal auto-unlocks, including their credit effects.
- Reducing expensive update frequency must not remove essential permission checks.

## Compatibility to check during implementation

The project pins `@minecraft/server` 2.6.0. Installed package type definitions establish the API surface used by this build.
They include `system.runInterval`, `world.afterEvents.playerSpawn`, `world.afterEvents.playerDimensionChange`,
`world.beforeEvents.playerBreakBlock`, world dynamic-property methods and Entity.teleport.
API availability is not evidence of behavior parity; inspect execution timing and restrictions when using each API.

Java marker data, arbitrary NBT, Owner/Thrower arrays, display/interaction entities, macros, trigger objectives and advancements
do not imply that their syntax or mechanics work unchanged in Bedrock.
Choose supported equivalents that fulfill the table's responsibilities. Do not add beta dependencies without a concrete task need.

Open questions to resolve when the relevant system is implemented:

1. Persistence and migration of many chunk records across world reloads and updates.
2. A stable payment mechanism with reliable payer identity. If thrown items cannot meet the contract, explain and agree on an alternative.
3. Border, price and interaction presentation for multiple players at different heights.
4. Projectile and teleport protection without gaps between position checks.
5. Mapping every Java item/biome identifier to the target Bedrock registry.

## Verification expectations

| System | Required evidence |
| --- | --- |
| Coordinates | -17/-16/-1/0/15/16 boundaries; different dimensions do not collide |
| Starting/neighbor chunks | No duplicate records, bounded propagation and the selected reference behavior |
| Pricing/selection | U=0/15/16/31/32 boundaries, all difficulties, nested weights/counts and no reroll on payment |
| Payment | Wrong/insufficient/exact/excess stacks, concurrent players, owner disconnect and repeat processing |
| Locked areas | Walking, sprinting, teleport, respawn, dimension changes, Spectator and missing safe positions |
| Presentation/proximity | Approach/leave/return without duplicate helpers; correct chunk at different player heights |
| Progress | Separate global/personal totals and correct paid/automatic/starting unlock credit |
| Persistence | World rejoin and chunk unload/reload retain requirement and unlocked state |

Update the status table with implementation file links and validation evidence when a capability is completed.
Distinguish static/build checks from actual Minecraft gameplay testing.
