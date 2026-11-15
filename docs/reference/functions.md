# Function responsibilities and relationships

Generated from local reference data by `python tools/reference_docs.py`. Do not edit generated content.


call = command invocation; click_command = user-activated command in a message; entrypoint = function tag; reward_function = advancement reward.

Read execute as/at/positioned and conditions in the source as well; the static graph does not capture all execution context.

Java paths below identify local-only reference files outside this repository; they are source locators, not GitHub links.

## chunklock:chunk_difficulty/set_difficulty_easy

`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_easy.mcfunction`

Selects level 1 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty.

Commands: 5; total lines: 7

Called/referenced by: click_command: `java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| click_command | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 1 |
| call | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 4 |

## chunklock:chunk_difficulty/set_difficulty_hard

`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_hard.mcfunction`

Selects level 3 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty.

Commands: 5; total lines: 7

Called/referenced by: click_command: `java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| click_command | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 1 |
| call | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 4 |

## chunklock:chunk_difficulty/set_difficulty_impossible

`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_impossible.mcfunction`

Selects level 4 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty.

Commands: 5; total lines: 7

Called/referenced by: click_command: `java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| click_command | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 1 |
| call | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 4 |

## chunklock:chunk_difficulty/set_difficulty_normal

`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_normal.mcfunction`

Selects level 2 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty.

Commands: 5; total lines: 7

Called/referenced by: click_command: `java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| click_command | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 1 |
| call | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 4 |

## chunklock:chunk_init/init_chunk_marker

`java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`

Computes chunk coordinates and center, positions the marker, sets locked/unlocked state and exempts central End chunks without an End Crystal.

Commands: 7; total lines: 21

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_chunk_coords` (`java_mod/data/chunklock/function/utils/find_chunk_coords.mcfunction`) | 2 |
| call | `chunklock:utils/find_chunk_center` (`java_mod/data/chunklock/function/utils/find_chunk_center.mcfunction`) | 5 |
| call | `chunklock:chunk_init/init_locked_chunk` (`java_mod/data/chunklock/function/chunk_init/init_locked_chunk.mcfunction`) | 21 |

## chunklock:chunk_init/init_containing_chunk

`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`

Creates a marker at the execution position: currentPlayer produces an unlocked chunk; other callers produce a locked chunk. Centers the marker afterward.

Commands: 3; total lines: 8

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_neighbor_east.mcfunction`; call: `java_mod/data/chunklock/function/chunk_init/init_neighbor_north.mcfunction`; call: `java_mod/data/chunklock/function/chunk_init/init_neighbor_south.mcfunction`; call: `java_mod/data/chunklock/function/chunk_init/init_neighbor_west.mcfunction`; call: `java_mod/data/chunklock/function/pre_tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_chunk_marker` (`java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`) | 8 |

## chunklock:chunk_init/init_locked_chunk

`java_mod/data/chunklock/function/chunk_init/init_locked_chunk.mcfunction`

Creates dimension-colored border block displays, then initializes the required unlock item and cost.

Commands: 11; total lines: 39

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_locked_chunk_unlock_item` (`java_mod/data/chunklock/function/chunk_init/init_locked_chunk_unlock_item.mcfunction`) | 39 |

## chunklock:chunk_init/init_locked_chunk_unlock_item

`java_mod/data/chunklock/function/chunk_init/init_locked_chunk_unlock_item.mcfunction`

Uses a temporary armor stand to roll loot, stores data.source and remaining cost, records the difficulty tag and applies dimension/difficulty scaling.

Commands: 29; total lines: 73

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_locked_chunk.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/roll_chunk_unlock_item` (`java_mod/data/chunklock/function/chunk_items/roll_chunk_unlock_item.mcfunction`) | 11 |

## chunklock:chunk_init/init_neighbor_east

`java_mod/data/chunklock/function/chunk_init/init_neighbor_east.mcfunction`

Creates the eastern chunk at the caller's prepared position, then tags the original marker with initNeighborEast.

Commands: 2; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | 1 |

## chunklock:chunk_init/init_neighbor_north

`java_mod/data/chunklock/function/chunk_init/init_neighbor_north.mcfunction`

Creates the northern chunk at the caller's prepared position, then tags the original marker with initNeighborNorth.

Commands: 2; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | 1 |

## chunklock:chunk_init/init_neighbor_south

`java_mod/data/chunklock/function/chunk_init/init_neighbor_south.mcfunction`

Creates the southern chunk at the caller's prepared position, then tags the original marker with initNeighborSouth.

Commands: 2; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | 1 |

## chunklock:chunk_init/init_neighbor_west

`java_mod/data/chunklock/function/chunk_init/init_neighbor_west.mcfunction`

Creates the western chunk at the caller's prepared position, then tags the original marker with initNeighborWest.

Commands: 2; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | 1 |

## chunklock:chunk_init/init_neighbors

`java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`

Checks north/east/south/west independently, avoids duplicate markers, waits for loaded areas and records initNeighborsDone once all sides are initialized.

Commands: 9; total lines: 26

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_marker.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_neighbor_north` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_north.mcfunction`) | 11 |
| call | `chunklock:chunk_init/init_neighbor_east` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_east.mcfunction`) | 15 |
| call | `chunklock:chunk_init/init_neighbor_south` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_south.mcfunction`) | 19 |
| call | `chunklock:chunk_init/init_neighbor_west` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_west.mcfunction`) | 23 |

## chunklock:chunk_items/check_render_chunk_item_east

`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_east.mcfunction`

Creates an eastern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag.

Commands: 5; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/update_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_east.mcfunction`) | 15 |

## chunklock:chunk_items/check_render_chunk_item_north

`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_north.mcfunction`

Creates a northern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag.

Commands: 5; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/update_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_north.mcfunction`) | 15 |

## chunklock:chunk_items/check_render_chunk_item_south

`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_south.mcfunction`

Creates a southern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag.

Commands: 5; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/update_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_south.mcfunction`) | 15 |

## chunklock:chunk_items/check_render_chunk_item_west

`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_west.mcfunction`

Creates a western item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag.

Commands: 5; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/update_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_west.mcfunction`) | 15 |

## chunklock:chunk_items/check_submit_chunk_item

`java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`

Finds the nearest locked marker, compares item IDs, identifies the thrower's UUID, dispatches success/failure, returns leftovers and clears shared context.

Commands: 19; total lines: 48

Called/referenced by: call: `java_mod/data/chunklock/function/tick_item_in_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_nearest_locked_chunk` (`java_mod/data/chunklock/function/utils/find_nearest_locked_chunk.mcfunction`) | 2 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 5 |
| call | `chunklock:chunk_items/submit_chunk_item_success` (`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_success.mcfunction`) | 28 |
| call | `chunklock:chunk_items/submit_chunk_item_failure` (`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_failure.mcfunction`) | 31 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 48 |

## chunklock:chunk_items/kill_chunk_item_east

`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_east.mcfunction`

Removes chunkSideEast entities within the caller's bounds and clears the marker's rendered tag.

Commands: 2; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`

## chunklock:chunk_items/kill_chunk_item_north

`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_north.mcfunction`

Removes chunkSideNorth entities within the caller's bounds and clears the marker's rendered tag.

Commands: 2; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`

## chunklock:chunk_items/kill_chunk_item_south

`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_south.mcfunction`

Removes chunkSideSouth entities within the caller's bounds and clears the marker's rendered tag.

Commands: 2; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`

## chunklock:chunk_items/kill_chunk_item_west

`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_west.mcfunction`

Removes chunkSideWest entities within the caller's bounds and clears the marker's rendered tag.

Commands: 2; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`

## chunklock:chunk_items/kill_chunk_items

`java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`

Positions execution bounds on all four sides and invokes each side's item/text display cleanup.

Commands: 4; total lines: 11

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_proximity/on_chunk_cease_relevant.mcfunction`; call: `java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/kill_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_north.mcfunction`) | 2 |
| call | `chunklock:chunk_items/kill_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_south.mcfunction`) | 5 |
| call | `chunklock:chunk_items/kill_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_east.mcfunction`) | 8 |
| call | `chunklock:chunk_items/kill_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_west.mcfunction`) | 11 |

## chunklock:chunk_items/render_chunk_items

`java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`

Requires a nearby unlocked neighbor, then checks each side for display creation using side-specific execution positions.

Commands: 5; total lines: 18

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_proximity/tick_relevant_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/check_render_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_north.mcfunction`) | 9 |
| call | `chunklock:chunk_items/check_render_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_south.mcfunction`) | 12 |
| call | `chunklock:chunk_items/check_render_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_east.mcfunction`) | 15 |
| call | `chunklock:chunk_items/check_render_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_west.mcfunction`) | 18 |

## chunklock:chunk_items/reset_chunk_items

`java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`

Rerolls a marker's unlock requirement and updates existing displays.

Commands: 2; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/utils/reroll_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_locked_chunk_unlock_item` (`java_mod/data/chunklock/function/chunk_init/init_locked_chunk_unlock_item.mcfunction`) | 4 |
| call | `chunklock:chunk_items/update_chunk_items` (`java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`) | 7 |

## chunklock:chunk_items/roll_chunk_unlock_item

`java_mod/data/chunklock/function/chunk_items/roll_chunk_unlock_item.mcfunction`

Rolls the all_biome fallback, then replaces the armor stand's held item using the loot table matching the biome at its position.

Commands: 65; total lines: 72

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_locked_chunk_unlock_item.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| roll_loot | `chunklock:biome/all_biome` (`java_mod/data/chunklock/loot_table/biome/all_biome.json`) | 4 |
| roll_loot | `chunklock:biome/badlands` (`java_mod/data/chunklock/loot_table/biome/badlands.json`) | 8 |
| roll_loot | `chunklock:biome/bamboo_jungle` (`java_mod/data/chunklock/loot_table/biome/bamboo_jungle.json`) | 9 |
| roll_loot | `chunklock:biome/basalt_deltas` (`java_mod/data/chunklock/loot_table/biome/basalt_deltas.json`) | 10 |
| roll_loot | `chunklock:biome/beach` (`java_mod/data/chunklock/loot_table/biome/beach.json`) | 11 |
| roll_loot | `chunklock:biome/birch_forest` (`java_mod/data/chunklock/loot_table/biome/birch_forest.json`) | 12 |
| roll_loot | `chunklock:biome/cherry_grove` (`java_mod/data/chunklock/loot_table/biome/cherry_grove.json`) | 13 |
| roll_loot | `chunklock:biome/cold_ocean` (`java_mod/data/chunklock/loot_table/biome/cold_ocean.json`) | 14 |
| roll_loot | `chunklock:biome/crimson_forest` (`java_mod/data/chunklock/loot_table/biome/crimson_forest.json`) | 15 |
| roll_loot | `chunklock:biome/dark_forest` (`java_mod/data/chunklock/loot_table/biome/dark_forest.json`) | 16 |
| roll_loot | `chunklock:biome/deep_cold_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_cold_ocean.json`) | 17 |
| roll_loot | `chunklock:biome/deep_dark` (`java_mod/data/chunklock/loot_table/biome/deep_dark.json`) | 19 |
| roll_loot | `chunklock:biome/deep_frozen_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_frozen_ocean.json`) | 20 |
| roll_loot | `chunklock:biome/deep_frozen_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_frozen_ocean.json`) | 21 |
| roll_loot | `chunklock:biome/deep_lukewarm_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_lukewarm_ocean.json`) | 22 |
| roll_loot | `chunklock:biome/deep_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_ocean.json`) | 23 |
| roll_loot | `chunklock:biome/desert` (`java_mod/data/chunklock/loot_table/biome/desert.json`) | 24 |
| roll_loot | `chunklock:biome/dripstone_caves` (`java_mod/data/chunklock/loot_table/biome/dripstone_caves.json`) | 25 |
| roll_loot | `chunklock:biome/end_barrens` (`java_mod/data/chunklock/loot_table/biome/end_barrens.json`) | 26 |
| roll_loot | `chunklock:biome/end_highlands` (`java_mod/data/chunklock/loot_table/biome/end_highlands.json`) | 27 |
| roll_loot | `chunklock:biome/end_midlands` (`java_mod/data/chunklock/loot_table/biome/end_midlands.json`) | 28 |
| roll_loot | `chunklock:biome/eroded_badlands` (`java_mod/data/chunklock/loot_table/biome/eroded_badlands.json`) | 29 |
| roll_loot | `chunklock:biome/flower_forest` (`java_mod/data/chunklock/loot_table/biome/flower_forest.json`) | 30 |
| roll_loot | `chunklock:biome/forest` (`java_mod/data/chunklock/loot_table/biome/forest.json`) | 31 |
| roll_loot | `chunklock:biome/frozen_ocean` (`java_mod/data/chunklock/loot_table/biome/frozen_ocean.json`) | 32 |
| roll_loot | `chunklock:biome/frozen_peaks` (`java_mod/data/chunklock/loot_table/biome/frozen_peaks.json`) | 33 |
| roll_loot | `chunklock:biome/frozen_river` (`java_mod/data/chunklock/loot_table/biome/frozen_river.json`) | 34 |
| roll_loot | `chunklock:biome/grove` (`java_mod/data/chunklock/loot_table/biome/grove.json`) | 35 |
| roll_loot | `chunklock:biome/ice_spikes` (`java_mod/data/chunklock/loot_table/biome/ice_spikes.json`) | 36 |
| roll_loot | `chunklock:biome/jagged_peaks` (`java_mod/data/chunklock/loot_table/biome/jagged_peaks.json`) | 37 |
| roll_loot | `chunklock:biome/jungle` (`java_mod/data/chunklock/loot_table/biome/jungle.json`) | 38 |
| roll_loot | `chunklock:biome/lukewarm_ocean` (`java_mod/data/chunklock/loot_table/biome/lukewarm_ocean.json`) | 39 |
| roll_loot | `chunklock:biome/lush_caves` (`java_mod/data/chunklock/loot_table/biome/lush_caves.json`) | 40 |
| roll_loot | `chunklock:biome/mangrove_swamp` (`java_mod/data/chunklock/loot_table/biome/mangrove_swamp.json`) | 41 |
| roll_loot | `chunklock:biome/meadow` (`java_mod/data/chunklock/loot_table/biome/meadow.json`) | 42 |
| roll_loot | `chunklock:biome/mushroom_fields` (`java_mod/data/chunklock/loot_table/biome/mushroom_fields.json`) | 43 |
| roll_loot | `chunklock:biome/nether_wastes` (`java_mod/data/chunklock/loot_table/biome/nether_wastes.json`) | 44 |
| roll_loot | `chunklock:biome/ocean` (`java_mod/data/chunklock/loot_table/biome/ocean.json`) | 45 |
| roll_loot | `chunklock:biome/old_growth_birch_forest` (`java_mod/data/chunklock/loot_table/biome/old_growth_birch_forest.json`) | 46 |
| roll_loot | `chunklock:biome/old_growth_pine_taiga` (`java_mod/data/chunklock/loot_table/biome/old_growth_pine_taiga.json`) | 47 |
| roll_loot | `chunklock:biome/old_growth_spruce_taiga` (`java_mod/data/chunklock/loot_table/biome/old_growth_spruce_taiga.json`) | 48 |
| roll_loot | `chunklock:biome/plains` (`java_mod/data/chunklock/loot_table/biome/plains.json`) | 49 |
| roll_loot | `chunklock:biome/river` (`java_mod/data/chunklock/loot_table/biome/river.json`) | 50 |
| roll_loot | `chunklock:biome/savanna_plateau` (`java_mod/data/chunklock/loot_table/biome/savanna_plateau.json`) | 51 |
| roll_loot | `chunklock:biome/savanna` (`java_mod/data/chunklock/loot_table/biome/savanna.json`) | 52 |
| roll_loot | `chunklock:biome/small_end_islands` (`java_mod/data/chunklock/loot_table/biome/small_end_islands.json`) | 53 |
| roll_loot | `chunklock:biome/snowy_beach` (`java_mod/data/chunklock/loot_table/biome/snowy_beach.json`) | 54 |
| roll_loot | `chunklock:biome/snowy_plains` (`java_mod/data/chunklock/loot_table/biome/snowy_plains.json`) | 55 |
| roll_loot | `chunklock:biome/snowy_slopes` (`java_mod/data/chunklock/loot_table/biome/snowy_slopes.json`) | 56 |
| roll_loot | `chunklock:biome/snowy_taiga` (`java_mod/data/chunklock/loot_table/biome/snowy_taiga.json`) | 57 |
| roll_loot | `chunklock:biome/soul_sand_valley` (`java_mod/data/chunklock/loot_table/biome/soul_sand_valley.json`) | 58 |
| roll_loot | `chunklock:biome/sparse_jungle` (`java_mod/data/chunklock/loot_table/biome/sparse_jungle.json`) | 59 |
| roll_loot | `chunklock:biome/stony_peaks` (`java_mod/data/chunklock/loot_table/biome/stony_peaks.json`) | 60 |
| roll_loot | `chunklock:biome/stony_shore` (`java_mod/data/chunklock/loot_table/biome/stony_shore.json`) | 61 |
| roll_loot | `chunklock:biome/sunflower_plains` (`java_mod/data/chunklock/loot_table/biome/sunflower_plains.json`) | 62 |
| roll_loot | `chunklock:biome/swamp` (`java_mod/data/chunklock/loot_table/biome/swamp.json`) | 63 |
| roll_loot | `chunklock:biome/taiga` (`java_mod/data/chunklock/loot_table/biome/taiga.json`) | 64 |
| roll_loot | `chunklock:biome/the_end` (`java_mod/data/chunklock/loot_table/biome/the_end.json`) | 65 |
| roll_loot | `chunklock:biome/warm_ocean` (`java_mod/data/chunklock/loot_table/biome/warm_ocean.json`) | 66 |
| roll_loot | `chunklock:biome/warped_forest` (`java_mod/data/chunklock/loot_table/biome/warped_forest.json`) | 67 |
| roll_loot | `chunklock:biome/windswept_forest` (`java_mod/data/chunklock/loot_table/biome/windswept_forest.json`) | 68 |
| roll_loot | `chunklock:biome/windswept_gravelly_hills` (`java_mod/data/chunklock/loot_table/biome/windswept_gravelly_hills.json`) | 69 |
| roll_loot | `chunklock:biome/windswept_hills` (`java_mod/data/chunklock/loot_table/biome/windswept_hills.json`) | 70 |
| roll_loot | `chunklock:biome/windswept_savanna` (`java_mod/data/chunklock/loot_table/biome/windswept_savanna.json`) | 71 |
| roll_loot | `chunklock:biome/wooded_badlands` (`java_mod/data/chunklock/loot_table/biome/wooded_badlands.json`) | 72 |

## chunklock:chunk_items/submit_chunk_item_failure

`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_failure.mcfunction`

Plays incorrect-item sound and particles; the caller returns the item to its thrower.

Commands: 2; total lines: 3

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`

## chunklock:chunk_items/submit_chunk_item_success

`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_success.mcfunction`

Subtracts the submitted amount, consumes required items, preserves excess, unlocks when the remaining cost is nonpositive or refreshes displays if payment is incomplete.

Commands: 13; total lines: 34

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/unlock_current_chunk` (`java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`) | 31 |
| call | `chunklock:chunk_items/update_chunk_items` (`java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`) | 34 |

## chunklock:chunk_items/update_chunk_item_east

`java_mod/data/chunklock/function/chunk_items/update_chunk_item_east.mcfunction`

Copies data.source to the eastern item display and binds its text display to the remaining-cost score.

Commands: 2; total lines: 10

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_east.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`

## chunklock:chunk_items/update_chunk_item_north

`java_mod/data/chunklock/function/chunk_items/update_chunk_item_north.mcfunction`

Copies data.source to the northern item display and binds its text display to the remaining-cost score.

Commands: 2; total lines: 10

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_north.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`

## chunklock:chunk_items/update_chunk_item_south

`java_mod/data/chunklock/function/chunk_items/update_chunk_item_south.mcfunction`

Copies data.source to the southern item display and binds its text display to the remaining-cost score.

Commands: 2; total lines: 10

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_south.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`

## chunklock:chunk_items/update_chunk_item_west

`java_mod/data/chunklock/function/chunk_items/update_chunk_item_west.mcfunction`

Copies data.source to the western item display and binds its text display to the remaining-cost score.

Commands: 2; total lines: 10

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_west.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`

## chunklock:chunk_items/update_chunk_items

`java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`

Updates only rendered sides of a marker that is still locked.

Commands: 4; total lines: 14

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`; call: `java_mod/data/chunklock/function/chunk_items/submit_chunk_item_success.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/update_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_north.mcfunction`) | 5 |
| call | `chunklock:chunk_items/update_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_south.mcfunction`) | 8 |
| call | `chunklock:chunk_items/update_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_east.mcfunction`) | 11 |
| call | `chunklock:chunk_items/update_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_west.mcfunction`) | 14 |

## chunklock:chunk_proximity/on_chunk_become_relevant

`java_mod/data/chunklock/function/chunk_proximity/on_chunk_become_relevant.mcfunction`

Creates vertically stacked interaction hitboxes for clicks and mining protection when players approach a locked chunk.

Commands: 34; total lines: 63

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`

## chunklock:chunk_proximity/on_chunk_cease_relevant

`java_mod/data/chunklock/function/chunk_proximity/on_chunk_cease_relevant.mcfunction`

Removes item/text displays and interaction hitboxes when the locked chunk no longer has relevant nearby players.

Commands: 2; total lines: 5

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/kill_chunk_items` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`) | 2 |

## chunklock:chunk_proximity/tick_relevant_chunk

`java_mod/data/chunklock/function/chunk_proximity/tick_relevant_chunk.mcfunction`

Renders unlock indicators and processes previously unprocessed item entities within the chunk's search bounds.

Commands: 2; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/render_chunk_items` (`java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`) | 4 |
| call | `chunklock:tick_item_in_chunk` (`java_mod/data/chunklock/function/tick_item_in_chunk.mcfunction`) | 7 |

## chunklock:collision/exit_locked_chunk

`java_mod/data/chunklock/function/collision/exit_locked_chunk.mcfunction`

Matches the player's prevPosMarker using all four UUID scores, retains current viewing rotation and teleports the player back to that marker.

Commands: 6; total lines: 18

Called/referenced by: call: `java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`

## chunklock:collision/player_chunk_collision

`java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`

Finds currentChunk, restores the safe position if it is locked, then clears currentChunk.

Commands: 3; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | 2 |
| call | `chunklock:collision/exit_locked_chunk` (`java_mod/data/chunklock/function/collision/exit_locked_chunk.mcfunction`) | 3 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 4 |

## chunklock:collision/refresh_position_marker

`java_mod/data/chunklock/function/collision/refresh_position_marker.mcfunction`

Deletes the player's previous UUID-matched position marker and creates a new safe-position marker carrying the same owner UUID.

Commands: 9; total lines: 21

Called/referenced by: call: `java_mod/data/chunklock/function/post_tick_player.mcfunction`

## chunklock:dimension/on_change_dimension

`java_mod/data/chunklock/function/dimension/on_change_dimension.mcfunction`

Adds awaitingDimensionLoad through @p and revokes @s's dimension-change advancement so the next transition can be detected.

Commands: 2; total lines: 5

Called/referenced by: reward_function: `java_mod/data/chunklock/advancement/util/change_dimension.json`

| Relationship | Target | Source line |
| --- | --- | --- |
| advancement_command | `chunklock:util/change_dimension` (`java_mod/data/chunklock/advancement/util/change_dimension.json`) | 5 |

## chunklock:dimension/on_dimension_loaded

`java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`

Unlocks the destination chunk if it is locked after loading, then clears awaitingDimensionLoad.

Commands: 4; total lines: 6

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | 2 |
| call | `chunklock:utils/unlock_current_chunk` (`java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`) | 3 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 4 |

## chunklock:init_player

`java_mod/data/chunklock/function/init_player.mcfunction`

Stores the player's UUID in four scores, enables command triggers and adds playerInit.

Commands: 11; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

## chunklock:load

`java_mod/data/chunklock/function/load.mcfunction`

Creates objectives, integer constants and command triggers, defaults difficulty to Normal, and sets the respawn radius.

Commands: 42; total lines: 54

Called/referenced by: call: `java_mod/data/chunklock/function/utils/reset.mcfunction`; entrypoint: `java_mod/data/minecraft/tags/function/load.json`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/set_chunk_unlock_count_below_name` (`java_mod/data/chunklock/function/utils/set_chunk_unlock_count_below_name.mcfunction`) | 37 |
| call | `chunklock:utils/render_chunk_difficulty_message` (`java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`) | 42 |

## chunklock:pearl/pearl_entered_locked_chunk

`java_mod/data/chunklock/function/pearl/pearl_entered_locked_chunk.mcfunction`

Creates particles and sound, then kills the pearl to prevent teleporting through a locked border.

Commands: 3; total lines: 17

Called/referenced by: call: `java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`

## chunklock:pearl/tick_ender_pearl

`java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`

Checks an ender pearl's current chunk and dispatches destruction when it enters a locked chunk.

Commands: 3; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | 5 |
| call | `chunklock:pearl/pearl_entered_locked_chunk` (`java_mod/data/chunklock/function/pearl/pearl_entered_locked_chunk.mcfunction`) | 6 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 7 |

## chunklock:post_tick

`java_mod/data/chunklock/function/post_tick.mcfunction`

Refreshes every player's safe position, then removes temporary player2d markers.

Commands: 2; total lines: 2

Called/referenced by: entrypoint: `java_mod/data/minecraft/tags/function/tick.json`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:post_tick_player` (`java_mod/data/chunklock/function/post_tick_player.mcfunction`) | 1 |

## chunklock:post_tick_player

`java_mod/data/chunklock/function/post_tick_player.mcfunction`

Records the latest safe position only outside locked chunks, then releases the currentChunk context.

Commands: 3; total lines: 5

Called/referenced by: call: `java_mod/data/chunklock/function/post_tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | 3 |
| call | `chunklock:collision/refresh_position_marker` (`java_mod/data/chunklock/function/collision/refresh_position_marker.mcfunction`) | 4 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 5 |

## chunklock:pre_tick

`java_mod/data/chunklock/function/pre_tick.mcfunction`

Runs pre_tick_player for every player before the main update.

Commands: 1; total lines: 1

Called/referenced by: entrypoint: `java_mod/data/minecraft/tags/function/tick.json`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:pre_tick_player` (`java_mod/data/chunklock/function/pre_tick_player.mcfunction`) | 1 |

## chunklock:pre_tick_player

`java_mod/data/chunklock/function/pre_tick_player.mcfunction`

Creates player2d on the dimension's lookup plane and initializes the starting chunk when no nearby marker exists.

Commands: 5; total lines: 26

Called/referenced by: call: `java_mod/data/chunklock/function/pre_tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | 23 |

## chunklock:projectile/init_projectile

`java_mod/data/chunklock/function/projectile/init_projectile.mcfunction`

Copies the projectile's four Owner UUID components into scores and adds projectileInit.

Commands: 5; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

## chunklock:projectile/projectile_entered_locked_chunk

`java_mod/data/chunklock/function/projectile/projectile_entered_locked_chunk.mcfunction`

Plays a sound, stops Motion, sets inGround/DealtDamage and adds projectileCollided to prevent repeated checks.

Commands: 3; total lines: 4

Called/referenced by: call: `java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`

## chunklock:projectile/tick_player_projectile

`java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`

Finds the player's projectile's current chunk and stops the projectile if the chunk is locked.

Commands: 3; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | 5 |
| call | `chunklock:projectile/projectile_entered_locked_chunk` (`java_mod/data/chunklock/function/projectile/projectile_entered_locked_chunk.mcfunction`) | 6 |
| call | `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | 7 |

## chunklock:tick

`java_mod/data/chunklock/function/tick.mcfunction`

Updates players, projectiles, pearls and displays every tick; updates markers, proximity and interactions every four ticks.

Commands: 11; total lines: 32

Called/referenced by: entrypoint: `java_mod/data/minecraft/tags/function/tick.json`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:init_player` (`java_mod/data/chunklock/function/init_player.mcfunction`) | 2 |
| call | `chunklock:projectile/init_projectile` (`java_mod/data/chunklock/function/projectile/init_projectile.mcfunction`) | 5 |
| test_predicate | `chunklock:is_projectile` (`java_mod/data/chunklock/predicate/is_projectile.json`) | 5 |
| call | `chunklock:tick_player` (`java_mod/data/chunklock/function/tick_player.mcfunction`) | 8 |
| call | `chunklock:pearl/tick_ender_pearl` (`java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`) | 11 |
| call | `chunklock:tick_chunk_item_displays` (`java_mod/data/chunklock/function/tick_chunk_item_displays.mcfunction`) | 14 |
| call | `chunklock:tick_chunk_marker` (`java_mod/data/chunklock/function/tick_chunk_marker.mcfunction`) | 26 |
| call | `chunklock:tick_chunk_player_proximity_check` (`java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`) | 29 |
| call | `chunklock:tick_chunk_interactions` (`java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`) | 32 |

## chunklock:tick_chunk_interactions

`java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`

Handles interaction clicks: dye changes the border color; other clicks show the item and remaining cost. Clears interaction state afterward.

Commands: 10; total lines: 24

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| test_predicate | `chunklock:dye/is_holding_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_dye.json`) | 7 |
| call | `chunklock:utils/dye_chunk` (`java_mod/data/chunklock/function/utils/dye_chunk.mcfunction`) | 8 |
| call | `chunklock:utils/translate_item_name/store_item_name` (`java_mod/data/chunklock/function/utils/translate_item_name/store_item_name.mcfunction`) | 14 |
| call | `chunklock:utils/translate_item_name/display_item_name` (`java_mod/data/chunklock/function/utils/translate_item_name/display_item_name.mcfunction`) | 17 |

## chunklock:tick_chunk_item_displays

`java_mod/data/chunklock/function/tick_chunk_item_displays.mcfunction`

Adjusts an item display's Y coordinate to the nearest player passing the dimension's render-height predicate.

Commands: 3; total lines: 6

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| test_predicate | `chunklock:is_in_overworld_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_overworld_chunk_render_height.json`) | 4 |
| test_predicate | `chunklock:is_in_overworld_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_overworld_chunk_render_height.json`) | 4 |
| test_predicate | `chunklock:is_in_the_nether_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_nether_chunk_render_height.json`) | 5 |
| test_predicate | `chunklock:is_in_the_nether_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_nether_chunk_render_height.json`) | 5 |
| test_predicate | `chunklock:is_in_the_end_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_end_chunk_render_height.json`) | 6 |
| test_predicate | `chunklock:is_in_the_end_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_end_chunk_render_height.json`) | 6 |

## chunklock:tick_chunk_marker

`java_mod/data/chunklock/function/tick_chunk_marker.mcfunction`

Initializes loaded neighboring chunks when a player2d marker is nearby and propagation is incomplete.

Commands: 1; total lines: 7

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_init/init_neighbors` (`java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`) | 7 |

## chunklock:tick_chunk_player_proximity_check

`java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`

Compares current and previous proximity, then activates, deactivates or updates relevant locked chunks.

Commands: 7; total lines: 27

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_proximity/on_chunk_become_relevant` (`java_mod/data/chunklock/function/chunk_proximity/on_chunk_become_relevant.mcfunction`) | 17 |
| call | `chunklock:chunk_proximity/on_chunk_cease_relevant` (`java_mod/data/chunklock/function/chunk_proximity/on_chunk_cease_relevant.mcfunction`) | 20 |
| call | `chunklock:chunk_proximity/tick_relevant_chunk` (`java_mod/data/chunklock/function/chunk_proximity/tick_relevant_chunk.mcfunction`) | 23 |

## chunklock:tick_item_in_chunk

`java_mod/data/chunklock/function/tick_item_in_chunk.mcfunction`

Sends player-thrown items for payment checks and marks items without a Thrower as already processed.

Commands: 3; total lines: 9

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_proximity/tick_relevant_chunk.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/check_submit_chunk_item` (`java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`) | 9 |

## chunklock:tick_player

`java_mod/data/chunklock/function/tick_player.mcfunction`

Handles dimension readiness, locked-chunk collision, UUID-matched projectiles and player command triggers.

Commands: 17; total lines: 42

Called/referenced by: call: `java_mod/data/chunklock/function/tick.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:dimension/on_dimension_loaded` (`java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`) | 5 |
| call | `chunklock:collision/player_chunk_collision` (`java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`) | 10 |
| call | `chunklock:projectile/tick_player_projectile` (`java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`) | 15 |
| call | `chunklock:utils/reroll_chunk` (`java_mod/data/chunklock/function/utils/reroll_chunk.mcfunction`) | 18 |
| call | `chunklock:utils/render_chunk_difficulty_message` (`java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`) | 22 |
| call | `chunklock:utils/spread_players` (`java_mod/data/chunklock/function/utils/spread_players.mcfunction`) | 26 |
| call | `chunklock:utils/uninstall` (`java_mod/data/chunklock/function/utils/uninstall.mcfunction`) | 38 |

## chunklock:utils/done_with_current_chunk

`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`

Clears the temporary currentChunk tag when a context-dependent operation finishes.

Commands: 1; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`; call: `java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`; call: `java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`; call: `java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`; call: `java_mod/data/chunklock/function/post_tick_player.mcfunction`; call: `java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`

## chunklock:utils/dye_chunk

`java_mod/data/chunklock/function/utils/dye_chunk.mcfunction`

Selects the main-hand dye color, recolors the nearest locked marker's border displays, consumes one dye and grants the chunk_dye advancement.

Commands: 34; total lines: 50

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| test_predicate | `chunklock:dye/is_holding_black_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_black_dye.json`) | 1 |
| test_predicate | `chunklock:dye/is_holding_black_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_black_dye.json`) | 2 |
| test_predicate | `chunklock:dye/is_holding_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_blue_dye.json`) | 4 |
| test_predicate | `chunklock:dye/is_holding_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_blue_dye.json`) | 5 |
| test_predicate | `chunklock:dye/is_holding_brown_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_brown_dye.json`) | 7 |
| test_predicate | `chunklock:dye/is_holding_brown_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_brown_dye.json`) | 8 |
| test_predicate | `chunklock:dye/is_holding_cyan_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_cyan_dye.json`) | 10 |
| test_predicate | `chunklock:dye/is_holding_cyan_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_cyan_dye.json`) | 11 |
| test_predicate | `chunklock:dye/is_holding_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_gray_dye.json`) | 13 |
| test_predicate | `chunklock:dye/is_holding_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_gray_dye.json`) | 14 |
| test_predicate | `chunklock:dye/is_holding_green_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_green_dye.json`) | 16 |
| test_predicate | `chunklock:dye/is_holding_green_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_green_dye.json`) | 17 |
| test_predicate | `chunklock:dye/is_holding_light_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_blue_dye.json`) | 19 |
| test_predicate | `chunklock:dye/is_holding_light_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_blue_dye.json`) | 20 |
| test_predicate | `chunklock:dye/is_holding_light_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_gray_dye.json`) | 22 |
| test_predicate | `chunklock:dye/is_holding_light_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_gray_dye.json`) | 23 |
| test_predicate | `chunklock:dye/is_holding_lime_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_lime_dye.json`) | 25 |
| test_predicate | `chunklock:dye/is_holding_lime_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_lime_dye.json`) | 26 |
| test_predicate | `chunklock:dye/is_holding_magenta_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_magenta_dye.json`) | 28 |
| test_predicate | `chunklock:dye/is_holding_magenta_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_magenta_dye.json`) | 29 |
| test_predicate | `chunklock:dye/is_holding_orange_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_orange_dye.json`) | 31 |
| test_predicate | `chunklock:dye/is_holding_orange_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_orange_dye.json`) | 32 |
| test_predicate | `chunklock:dye/is_holding_pink_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_pink_dye.json`) | 34 |
| test_predicate | `chunklock:dye/is_holding_pink_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_pink_dye.json`) | 35 |
| test_predicate | `chunklock:dye/is_holding_purple_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_purple_dye.json`) | 37 |
| test_predicate | `chunklock:dye/is_holding_purple_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_purple_dye.json`) | 38 |
| test_predicate | `chunklock:dye/is_holding_red_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_red_dye.json`) | 40 |
| test_predicate | `chunklock:dye/is_holding_red_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_red_dye.json`) | 41 |
| test_predicate | `chunklock:dye/is_holding_white_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_white_dye.json`) | 43 |
| test_predicate | `chunklock:dye/is_holding_white_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_white_dye.json`) | 44 |
| test_predicate | `chunklock:dye/is_holding_yellow_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_yellow_dye.json`) | 46 |
| test_predicate | `chunklock:dye/is_holding_yellow_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_yellow_dye.json`) | 47 |
| advancement_command | `chunklock:main/chunk_dye` (`java_mod/data/chunklock/advancement/main/chunk_dye.json`) | 50 |

## chunklock:utils/find_chunk_center

`java_mod/data/chunklock/function/utils/find_chunk_center.mcfunction`

Multiplies ChunkX/Z by 16 and adds 8 to produce chunk-center PosX/Z.

Commands: 6; total lines: 14

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`

## chunklock:utils/find_chunk_coords

`java_mod/data/chunklock/function/utils/find_chunk_coords.mcfunction`

Computes ChunkX/ChunkZ from entity Pos scaled by 0.0625 through data get and scoreboard storage.

Commands: 2; total lines: 8

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`

## chunklock:utils/find_current_chunk

`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`

Tags the nearest chunk marker within 12 blocks on the dimension's lookup plane as currentChunk; callers must invoke done_with_current_chunk afterward.

Commands: 3; total lines: 9

Called/referenced by: call: `java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`; call: `java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`; call: `java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`; call: `java_mod/data/chunklock/function/post_tick_player.mcfunction`; call: `java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`

## chunklock:utils/find_nearest_locked_chunk

`java_mod/data/chunklock/function/utils/find_nearest_locked_chunk.mcfunction`

Tags the nearest locked marker within 15 blocks on the dimension's lookup plane as currentChunk; used for item payments.

Commands: 3; total lines: 9

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`

## chunklock:utils/render_chunk_auto_unlock_message

`java_mod/data/chunklock/function/utils/render_chunk_auto_unlock_message.mcfunction`

Announces an unlock without attributing a payer, such as a locked portal destination becoming accessible.

Commands: 1; total lines: 5

Called/referenced by: call: `java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`

## chunklock:utils/render_chunk_difficulty_message

`java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

Shows clickable difficulty commands; after the first credited unlock, shows the restriction and reset link instead.

Commands: 7; total lines: 10

Called/referenced by: call: `java_mod/data/chunklock/function/load.mcfunction`; call: `java_mod/data/chunklock/function/tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| click_command | `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | 3 |
| click_command | `chunklock:chunk_difficulty/set_difficulty_easy` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_easy.mcfunction`) | 7 |
| click_command | `chunklock:chunk_difficulty/set_difficulty_normal` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_normal.mcfunction`) | 8 |
| click_command | `chunklock:chunk_difficulty/set_difficulty_hard` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_hard.mcfunction`) | 9 |
| click_command | `chunklock:chunk_difficulty/set_difficulty_impossible` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_impossible.mcfunction`) | 10 |

## chunklock:utils/render_chunk_unlock_message

`java_mod/data/chunklock/function/utils/render_chunk_unlock_message.mcfunction`

Announces the payer and global unlock number, handles milestones 1/8/16/32/64/128 and respects hideChunkUnlockTitle.

Commands: 45; total lines: 62

Called/referenced by: call: `java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`

## chunklock:utils/reroll_chunk

`java_mod/data/chunklock/function/utils/reroll_chunk.mcfunction`

Allows rerolling only on Easy, selects a nearby locked marker in front of the player and increments reroll counters.

Commands: 10; total lines: 18

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/reset_chunk_items` (`java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`) | 13 |
| call | `chunklock:chunk_items/reset_chunk_items` (`java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`) | 14 |
| call | `chunklock:chunk_items/reset_chunk_items` (`java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`) | 15 |

## chunklock:utils/reset

`java_mod/data/chunklock/function/utils/reset.mcfunction`

Runs uninstall, re-enables file/chunklock and invokes load again.

Commands: 3; total lines: 6

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_easy.mcfunction`; call: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_hard.mcfunction`; call: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_impossible.mcfunction`; call: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_normal.mcfunction`; click_command: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_easy.mcfunction`; click_command: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_hard.mcfunction`; click_command: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_impossible.mcfunction`; click_command: `java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_normal.mcfunction`; click_command: `java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:utils/uninstall` (`java_mod/data/chunklock/function/utils/uninstall.mcfunction`) | 2 |
| call | `chunklock:load` (`java_mod/data/chunklock/function/load.mcfunction`) | 6 |

## chunklock:utils/set_chunk_unlock_count_below_name

`java_mod/data/chunklock/function/utils/set_chunk_unlock_count_below_name.mcfunction`

Displays ChunklockTotalUnlockedChunks below player names using below_name.

Commands: 1; total lines: 3

Called/referenced by: call: `java_mod/data/chunklock/function/load.mcfunction`

## chunklock:utils/spread_players

`java_mod/data/chunklock/function/utils/spread_players.mcfunction`

Runs spreadplayers for all players and assigns their resulting locations as new spawn points.

Commands: 2; total lines: 2

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`

## chunklock:utils/translate_item_name/display_item_name

`java_mod/data/chunklock/function/utils/translate_item_name/display_item_name.mcfunction`

Uses a macro to show remaining cost and the translated item name to a chunkInteractor who is not using dye.

Commands: 1; total lines: 1

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`

## chunklock:utils/translate_item_name/store_item_name

`java_mod/data/chunklock/function/utils/translate_item_name/store_item_name.mcfunction`

Creates an item through an ID macro, extracts its translation key into chunklock:master storage and deletes the temporary item.

Commands: 4; total lines: 15

Called/referenced by: call: `java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`

## chunklock:utils/uninstall

`java_mod/data/chunklock/function/utils/uninstall.mcfunction`

Removes selected objectives, temporary item-name storage, chunklock entities and playerInit, then disables file/chunklock; it does not erase every state value.

Commands: 10; total lines: 12

Called/referenced by: call: `java_mod/data/chunklock/function/tick_player.mcfunction`; call: `java_mod/data/chunklock/function/utils/reset.mcfunction`

## chunklock:utils/unlock_current_chunk

`java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`

Marks the chunk unlocked, removes visuals/interactions, increments world/payer progress and dispatches messages and advancements.

Commands: 23; total lines: 35

Called/referenced by: call: `java_mod/data/chunklock/function/chunk_items/submit_chunk_item_success.mcfunction`; call: `java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`

| Relationship | Target | Source line |
| --- | --- | --- |
| call | `chunklock:chunk_items/kill_chunk_items` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`) | 9 |
| call | `chunklock:utils/render_chunk_unlock_message` (`java_mod/data/chunklock/function/utils/render_chunk_unlock_message.mcfunction`) | 24 |
| call | `chunklock:utils/render_chunk_auto_unlock_message` (`java_mod/data/chunklock/function/utils/render_chunk_auto_unlock_message.mcfunction`) | 25 |
| advancement_command | `chunklock:main/chunk_item_ancient_debris` (`java_mod/data/chunklock/advancement/main/chunk_item_ancient_debris.json`) | 28 |
| advancement_command | `chunklock:main/chunk_item_diamond` (`java_mod/data/chunklock/advancement/main/chunk_item_diamond.json`) | 29 |
| advancement_command | `chunklock:main/chunk_item_emerald` (`java_mod/data/chunklock/advancement/main/chunk_item_emerald.json`) | 30 |
| advancement_command | `chunklock:main/chunk_item_gold_ingot` (`java_mod/data/chunklock/advancement/main/chunk_item_gold_ingot.json`) | 31 |
| advancement_command | `chunklock:main/chunk_item_iron_ingot` (`java_mod/data/chunklock/advancement/main/chunk_item_iron_ingot.json`) | 32 |
| advancement_command | `chunklock:main/chunk_item_stone` (`java_mod/data/chunklock/advancement/main/chunk_item_stone.json`) | 33 |
| advancement_command | `chunklock:main/chunk_item_pufferfish` (`java_mod/data/chunklock/advancement/main/chunk_item_pufferfish.json`) | 34 |
| advancement_command | `chunklock:main/chunk_item_nether_brick` (`java_mod/data/chunklock/advancement/main/chunk_item_nether_brick.json`) | 35 |
