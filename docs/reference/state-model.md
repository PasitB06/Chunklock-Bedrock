# Shared data, state and pricing

This page describes the **Java reference**, primarily `load`, `init_locked_chunk_unlock_item`,
`check_submit_chunk_item` and `unlock_current_chunk`. Full local source locators appear in [functions.md](functions.md).

## Ownership and lifetime

| Owner | Important data | Lifetime and consumers |
| --- | --- | --- |
| Chunk marker | ChunkX/Z, PosX/Z, locked/unlocked, data.source, cost and difficulty tag | Persistent chunk identity shared by initialization, collision, payment and presentation |
| Player | UUID scores, playerInit, personal progress, trigger scores, hideChunkUnlockTitle | Player-owned initialization, commands and progress |
| Safe-position marker | Actual position, rotation and owner UUID scores | Retained until replaced by the next safe position |
| Player2d marker | Player X/Z on the dimension's lookup plane | Created in pre_tick and removed in post_tick |
| `#global` fake player | Difficulty, total/per-dimension unlocks, rerolls and tick counter | Shared world-level scoreboard values |
| Submitted item entity | Item.id/count, Thrower, itemProcessed and temporary scores | Used during payment, then consumed or returned |
| Projectile entity | Owner UUID scores, projectileInit and projectileCollided | Owner association and locked-border checks |
| `chunkItemInit` armor stand | Random result in equipment.mainhand | Created for selection, copied and deleted |
| Item/text/block displays and interactions | Side, icon, displayed cost, color and hitbox | Presentation/input helpers, not authoritative permission or pricing data |
| `chunklock:master` storage | stored_item_name | Temporary translation key for the current interaction |

Chunk markers outlive presentation helpers removed when players leave. Remaining cost is authoritative on the scoreboard,
not in the item icon's displayed stack count.

## Coordinates and dimensions

`find_chunk_coords` stores Pos[0]/Pos[2] scaled by 0.0625 into ChunkX/Z.
`find_chunk_center` calculates `center = chunkCoordinate * 16 + 8`.
The TypeScript equivalent must use floor-based chunk coordinates, including negative positions.
Compare boundaries -17, -16, -1, 0, 15 and 16; do not substitute truncation toward zero.

| Reference dimension | Chunk/player2d lookup Y | Player Y accepted by render predicate |
| --- | --- | --- |
| Overworld | 128 | -63 through 318 |
| Nether | 64 | 0 through 127 |
| End | 64 | 0 through 255 |

These are the snapshot's constants, not universal world-height guarantees for all Minecraft versions.
Current-chunk lookup uses radius 12; payment's nearest-locked-chunk lookup uses radius 15.
Display rendering looks for an unlocked neighbor at distance 16-17 and uses side-specific search offsets.

## All objectives declared by load

| Objectives | Meaning |
| --- | --- |
| `ChunkX`, `ChunkZ` | Executor/marker chunk coordinates |
| `PosX`, `PosZ` | Calculated chunk-center coordinates |
| `Uuid1`, `Uuid2`, `Uuid3`, `Uuid4` | Four UUID components for players, owners and matching markers |
| `Temp` | Declared but no other command uses it in this snapshot |
| `Integers` | #1, #2, #4, #8, #16, #32, #64, #128 constants for arithmetic |
| `ChunklockChunkItemCount` | Marker remaining cost or submitted stack size, depending on score holder |
| `ChunklockChunkItemOverflowCount` | Submitted excess retained for return |
| `ChunklockChunkItemTest` | Whether replacing comparison.id changed the value |
| `ChunklockChunkItemHasThrower` | Whether the item has a Thrower |
| `ChunklockTotalUnlockedChunks` | World/personal totals; also stores temporary multiplier/modulo values on other fake players |
| `ChunklockOverworldUnlockedChunks` | World or player Overworld progress |
| `ChunklockNetherUnlockedChunks` | World or player Nether progress |
| `ChunklockEndUnlockedChunks` | World or player End progress |
| `ChunklockChunksRerolled` | World or player reroll-command count |
| `ChunklockTickCounter` | Four-tick update schedule |
| `ChunklockDifficulty` | #global difficulty level 1/2/3/4 |
| `ChunkReroll` | Player reroll trigger |
| `ChunkDifficulty` | Difficulty-menu trigger |
| `ChunkUninstall` | Datapack uninstall trigger |
| `ChunkSpreadPlayers` | Player-spread trigger |
| `ChunkHideUnlockTitle`, `ChunkShowUnlockTitle` | Unlock-title preference triggers |

Read the score holder together with the objective: `#global` and `@s` do not own the same value.
Personal unlock credit goes to the thrower whose payment completes the unlock, not automatically to every earlier contributor.

## Shared tags and execution context

| Group | Tags/data | Relationship |
| --- | --- | --- |
| Identity | `chunklock`, `v1`, `chunkMarker` | System entities, version and chunk-marker identity |
| Chunk state | `locked`, `unlocked` | Entry/payment permission; unlock removes locked first |
| Neighbor initialization | `initNeighborNorth/East/South/West`, `initNeighborsDone` | Prevents duplicate creation and waits for individual loaded neighbors |
| Proximity | `chunkHasPlayerNearby`, `chunkHasPlayerNearbyPrev` | Relevant-state transitions |
| Rolled requirement | `ChunkEasy`, `ChunkNormal`, `ChunkHard`, `ChunkImpossible`, `data.source` | Difficulty at selection time and selected item/base count |
| Side presentation | `chunkHasNorth/East/South/WestItemRendered`, `chunkSideNorth/East/South/West` | Creation guards and update/cleanup selection |
| Display roles | `chunkUnlockItemTypeDisplay`, `chunkUnlockItemCountDisplay` | Item icon versus remaining-cost text |
| Player/dimension | `playerInit`, `awaitingDimensionLoad`, `hideChunkUnlockTitle` | Initialization, destination readiness and title preference |
| Safe position | `prevPosMarker`, `markerNeedsInit`, `currentPlayerMarker` | UUID-matched marker; the latter two are temporary context |
| Temporary work | `currentPlayer`, `currentChunk`, `chunkInteractor`, `playerIsHoldingDye`, `itemThrower` | Shared cross-function context requiring cleanup and nested-call care |
| Other entities | `player2d`, `chunkItemInit`, `itemProcessed`, `projectileInit`, `projectileCollided` | Helper lifetime and processing state |

`data.comparison` is scratch space for ID comparison. `#itemThrower` on UUID objectives temporarily stores the submitted stack's owner.
Early returns and nested cleanup affect later commands because these tags are shared.
Bedrock code should pass explicit chunk/player/item references rather than reproduce shared scratch tags across handlers.

## Actual pricing formula

Let `B` be the base count after all loot functions have run, and `U_d` the world's dimension-specific unlock total **before this requirement is rolled**.
Once the counters have initialized values:

```text
Overworld: M = floor(U_overworld / 16) + 1
Nether:    M = floor(U_nether / 16) + 1
End:       M = floor(U_end / 32) + 1

Easy (1):        R = B
Normal (2):      R = B * M
Hard (3):        R = B * M * 4
Impossible (4):  R = B * M * 16
```

The source creates objectives but does not explicitly set every global progress score to zero during load.
The formula describes the initialized-counter path; behavior before the first score exists requires gameplay verification.
For example, B=2 and U=16 produces a newly rolled Overworld cost of 4 on Normal or 16 on Hard.

Costs are calculated on **initialization/reroll**, not on every payment.
Existing requirements remain unchanged as world totals grow; newly rolled chunks can become more expensive.
Easy returns before both dimension and difficulty scaling. No explicit cost cap appears in these commands.

## Weighted selection

There are 64 biome tables, including the all_biome fallback, and 87 generic tables:
activity 1, biome 2, block 37, dimension 3, entity 12, ore 8, plant 2, rare 2, structure 8 and wood 12.

Entries in this snapshot are items or nested loot tables, and the observed loot functions are set_count.
No loot conditions were found. Nested entries have their own weights and count-setting functions.
For example, plains assigns dirt weight 50 and the passive-mob group weight 20 alongside other entries.
Weight 50 does not mean a 50% overall probability without the pool denominator.
Flattening every table into one equally likely list changes both probabilities and quantities.
A parent's set_count can overwrite a child result, so preserve evaluation order.
All entries and values are documented in [loot-tables.md](loot-tables.md).

## Progress and milestones

The 24 advancements comprise three root/credit entries, seven personal-total thresholds, three first-dimension unlocks,
nine item-specific entries, one dye entry and one dimension-event bridge.
Item-specific and dye advancements use `minecraft:impossible` and require explicit grants.
Total/dimension advancements use `minecraft:location` to test the player's scores.

Starting-chunk and End exceptions bypass credited unlocking. Portal auto-unlocks passing through `unlock_current_chunk` increment global totals.
Global announcement milestones and personal advancement thresholds must remain separate in the port.
