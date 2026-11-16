# Mapping Java responsibilities to Bedrock

This is a responsibility map and future verification guide, not a list of completed gameplay systems.
Read [runtime-flow](runtime-flow.md), [state-model](state-model.md) and the relevant local Java source before implementing a system.

## Current status

The [chunk prototype](../chunk-prototype.md) implements persistent dimension-aware records, bounded cardinal expansion near players and debug center particles/action-bar coordinates. Chunk records remain entity-free; translucent wall helpers and block/right-click protection are described in [visuals and protection](../visuals-protection.md). Runtime diagnostics confirmed and corrected helper suffocation deaths; 24 loaded helpers retained full health and stable IDs in a stationary test. Full visual alignment and performance remain unverified. Stable API 2.6.0 cancels attack damage to targets wholly in locked cells before damage is applied; positive collision-box overlap with open terrain permits combat (regression-tested, gameplay verification pending), in addition to best-effort projectile removal. Movement return-to-safe-position logic is implemented with gameplay verification pending. All 151 local Java loot tables compile into TypeScript; weighted rolling, biome/item resolution, difficulty scaling, bounded per-chunk requirement persistence, nearby requirement displays, whole-inventory payment, idempotent unlocks and world/payer totals are implemented. Script and pack checks pass; display rendering, interaction targeting and item deduction still need Minecraft gameplay verification.

## Responsibility map

| Responsibility | Java reference | Required Bedrock behavior | Status |
| --- | --- | --- | --- |
| Initialization/scheduling | load, pre_tick, tick, post_tick | Idempotent setup and suitable every-tick/four-tick work separation | Not implemented |
| Joining players | init_player, pre_tick_player | Initialize each player and find/create their starting chunk in the correct dimension | Readiness message only; no Chunklock initialization |
| Chunk identity | chunk_init/*, find_chunk_coords/center | Dimension-aware persistent records with floor-based centers | Experimental prototype; manual verification pending |
| Neighbor expansion | init_neighbors and directional helpers | Bounded player-nearby cardinal propagation with loaded-center checks | Experimental prototype; manual verification pending |
| Weighted selection | roll_chunk_unlock_item, loot_table/* | Preserve nested weights/count evaluation and map supported item/biome identifiers | [151-table compiler](../../tools/build_loot_tables.py), [roller and resolvers](../../scripts/loot.ts), and [per-chunk persistence](../../scripts/requirements.ts); all source tables smoke-rolled in [loot tests](../../tests/loot.test.cjs) |
| Price scaling | init_locked_chunk_unlock_item | Separate dimension counters and roll-time costs; preserve or explicitly revise the four difficulty formulas | [Java formula](../../scripts/loot.ts) and roll-time application in [requirements](../../scripts/requirements.ts), tested at difficulty/step boundaries in [loot tests](../../tests/loot.test.cjs) |
| Movement/mining protection | collision/*, interaction helpers | Locked-block breaking/right-click cancellation, adjacent placement checks and per-tick return to the previous safe position | Block hooks and per-tick collision implemented; movement coordinate correction awaits gameplay verification |
| Player proximity | tick_chunk_player_proximity_check, chunk_proximity/* | Relevant-state transitions and bounded presentation/payment work | Nearby chunk records and presentation are refreshed with per-interval bounds; Java transition tags are not reproduced |
| Vibrant Visuals wall visibility | Java border displays; Bedrock-only mode selection | Visible translucent walls with separate renderer materials | RP 0.2.20 selects vanilla `entity_alphablend` and alpha 170 for deferred; classic retains its original custom material and alpha 85. BP 0.2.25 updates the dependency. Mode-selection regression checked; invisible-wall report still requires runtime retest. See [material isolation](../visuals-protection.md#deferred-material-isolation) |
| Vibrant Visuals compatibility | No Java counterpart; Bedrock renderer metadata | Allow the resource pack to opt into Vibrant Visuals | Resource Pack 0.2.17 declares `pbr`; Behavior Pack 0.2.22 requires that version. Manifest/build/deployment checks only; graphics-mode availability and translucent rendering need Minecraft verification. See [rendering notes](../visuals-protection.md#vibrant-visuals-compatibility) |
| Borders and prices | render/update/kill helpers, block/item/text displays | Nearby dark-blue translucent walls and requirement icons/counts beside eligible locked borders | `chunklock:border_wall` uses `DisableDepthWrite`, cardinal rotation lock and seamless corner bounds; `chunklock:requirement_display` syncs mainhand item via `replaceitem`, renders a pedestal and upright rotating `rightItem`, and refreshes after payment; in-game verification pending |
| Item payments | tick_item_in_chunk, check_submit/success/failure | Validate the required item across the clicking player's inventory and offhand; attribute credit directly to that player | `payment.ts` cancels display clicks, debounces, prioritizes the selected slot, scans all 36 inventory slots plus offhand, deducts across matching stacks, preserves excess in place, and holds action-bar/chat notices for 100 ticks via `notices.ts`; automated checks pass, gameplay pending |
| Unlocking and totals | unlock_current_chunk | One state transition, helper cleanup and correct world/payer credits | `access.ts` opens once and records dimension/global world and payer counts; display/wall refresh is connected; automatic unlock and announcements/advancements are not implemented |
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
2. Verify that the selected requirement-display click event, inventory deduction and per-player debounce meet the payment contract in the stable API and multiplayer gameplay.
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

## Wall orientation correction

The wall manager now synchronizes `chunklock:wall_yaw` to the client: north/south edges use 0 degrees and east/west edges use 90 degrees. The model subtracts body yaw from this explicit target rather than combining body and head angles. Versioned `v4` helper keys replace older helpers. This adapts Java border display transforms to a Bedrock entity property; access and payment state are unchanged. Automated checks cover the rotation expression; rendered alignment still requires Minecraft verification after restarting the game.
