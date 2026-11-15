# Complete reference file catalog

Generated from local reference data by `python tools/reference_docs.py`. Do not edit generated content.


Read **275 files**; counts by type: `{"advancement":24,"function":76,"loot_table":151,"predicate":22,"tags/function":2}`

Each file's responsibility appears below. source-index.json records UTF-8/LF hashes and extracted resource references.

These are static resource references, not evidence that a branch or command executed in a game.

Java paths below identify local-only reference files outside this repository; they are source locators, not GitHub links.


## advancement

| File | Responsibility |
| --- | --- |
| `chunklock:main/chunk_dye` (`java_mod/data/chunklock/advancement/main/chunk_dye.json`) | Advancement: {"text":"Chunk Dyer"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_ancient_debris` (`java_mod/data/chunklock/advancement/main/chunk_item_ancient_debris.json`) | Advancement: {"text":"A Hefty Price"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_coal` (`java_mod/data/chunklock/advancement/main/chunk_item_coal.json`) | Advancement: {"text":"A Coal Cost"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_diamond` (`java_mod/data/chunklock/advancement/main/chunk_item_diamond.json`) | Advancement: {"text":"A Shiny Tribute"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_emerald` (`java_mod/data/chunklock/advancement/main/chunk_item_emerald.json`) | Advancement: {"text":"A Green Gift"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_gold_ingot` (`java_mod/data/chunklock/advancement/main/chunk_item_gold_ingot.json`) | Advancement: {"text":"A Golden Gift"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_iron_ingot` (`java_mod/data/chunklock/advancement/main/chunk_item_iron_ingot.json`) | Advancement: {"text":"An Ironic Tribute"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_nether_brick` (`java_mod/data/chunklock/advancement/main/chunk_item_nether_brick.json`) | Advancement: {"text":"Just Another Brick in The Chunk"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_pufferfish` (`java_mod/data/chunklock/advancement/main/chunk_item_pufferfish.json`) | Advancement: {"text":"A Puffy Price"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunk_item_stone` (`java_mod/data/chunklock/advancement/main/chunk_item_stone.json`) | Advancement: {"text":"A Stone Cold Offer"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:impossible"}} |
| `chunklock:main/chunks_end_unlocked_1y` (`java_mod/data/chunklock/advancement/main/chunks_end_unlocked_1y.json`) | Advancement: {"text":"Chunklock Endgame"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockEndUnlockedChunks":{"min":1}}}]}}} |
| `chunklock:main/chunks_nether_unlocked_1` (`java_mod/data/chunklock/advancement/main/chunks_nether_unlocked_1.json`) | Advancement: {"text":"Nether Chunker"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockNetherUnlockedChunks":{"min":1}}}]}}} |
| `chunklock:main/chunks_overworld_unlocked_1` (`java_mod/data/chunklock/advancement/main/chunks_overworld_unlocked_1.json`) | Advancement: {"text":"The Grass is Always Chunkier"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockOverworldUnlockedChunks":{"min":1}}}]}}} |
| `chunklock:main/chunks_unlocked_1` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_1.json`) | Advancement: {"text":"Chunk Novice"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":16}}}]}}} |
| `chunklock:main/chunks_unlocked_2` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_2.json`) | Advancement: {"text":"Chunk Explorer"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":64}}}]}}} |
| `chunklock:main/chunks_unlocked_3` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_3.json`) | Advancement: {"text":"Chunk Pro"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":128}}}]}}} |
| `chunklock:main/chunks_unlocked_4` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_4.json`) | Advancement: {"text":"Chunk Master"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":256}}}]}}} |
| `chunklock:main/chunks_unlocked_5` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_5.json`) | Advancement: {"text":"Chunk Legend"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":512}}}]}}} |
| `chunklock:main/chunks_unlocked_6` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_6.json`) | Advancement: {"text":"Chunk God"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":1024}}}]}}} |
| `chunklock:main/chunks_unlocked_7` (`java_mod/data/chunklock/advancement/main/chunks_unlocked_7.json`) | Advancement: {"text":"Chunklock Champion"}; criteria: {"chunksUnlocked":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":2048}}}]}}} |
| `chunklock:main/made_by_avidmc` (`java_mod/data/chunklock/advancement/main/made_by_avidmc.json`) | Advancement: {"text":"By AvidMc"}; criteria: {"requirement":{"trigger":"minecraft:tick"}} |
| `chunklock:main/made_by_quillbee` (`java_mod/data/chunklock/advancement/main/made_by_quillbee.json`) | Advancement: {"text":"And Quillbee"}; criteria: {"requirement":{"trigger":"minecraft:tick"}} |
| `chunklock:main/root` (`java_mod/data/chunklock/advancement/main/root.json`) | Advancement: {"text":"Chunklock"}; criteria: {"unlock_one_chunk":{"trigger":"minecraft:location","conditions":{"player":[{"condition":"minecraft:entity_scores","entity":"this","scores":{"ChunklockTotalUnlockedChunks":{"min":1}}}]}}} |
| `chunklock:util/change_dimension` (`java_mod/data/chunklock/advancement/util/change_dimension.json`) | Advancement: {}; criteria: {"requirement":{"trigger":"minecraft:changed_dimension"}} |

## function

| File | Responsibility |
| --- | --- |
| `chunklock:chunk_difficulty/set_difficulty_easy` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_easy.mcfunction`) | Selects level 1 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty. |
| `chunklock:chunk_difficulty/set_difficulty_hard` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_hard.mcfunction`) | Selects level 3 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty. |
| `chunklock:chunk_difficulty/set_difficulty_impossible` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_impossible.mcfunction`) | Selects level 4 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty. |
| `chunklock:chunk_difficulty/set_difficulty_normal` (`java_mod/data/chunklock/function/chunk_difficulty/set_difficulty_normal.mcfunction`) | Selects level 2 before the first credited unlock; resets the datapack if changing levels and announces the new difficulty. |
| `chunklock:chunk_init/init_chunk_marker` (`java_mod/data/chunklock/function/chunk_init/init_chunk_marker.mcfunction`) | Computes chunk coordinates and center, positions the marker, sets locked/unlocked state and exempts central End chunks without an End Crystal. |
| `chunklock:chunk_init/init_containing_chunk` (`java_mod/data/chunklock/function/chunk_init/init_containing_chunk.mcfunction`) | Creates a marker at the execution position: currentPlayer produces an unlocked chunk; other callers produce a locked chunk. Centers the marker afterward. |
| `chunklock:chunk_init/init_locked_chunk` (`java_mod/data/chunklock/function/chunk_init/init_locked_chunk.mcfunction`) | Creates dimension-colored border block displays, then initializes the required unlock item and cost. |
| `chunklock:chunk_init/init_locked_chunk_unlock_item` (`java_mod/data/chunklock/function/chunk_init/init_locked_chunk_unlock_item.mcfunction`) | Uses a temporary armor stand to roll loot, stores data.source and remaining cost, records the difficulty tag and applies dimension/difficulty scaling. |
| `chunklock:chunk_init/init_neighbor_east` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_east.mcfunction`) | Creates the eastern chunk at the caller's prepared position, then tags the original marker with initNeighborEast. |
| `chunklock:chunk_init/init_neighbor_north` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_north.mcfunction`) | Creates the northern chunk at the caller's prepared position, then tags the original marker with initNeighborNorth. |
| `chunklock:chunk_init/init_neighbor_south` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_south.mcfunction`) | Creates the southern chunk at the caller's prepared position, then tags the original marker with initNeighborSouth. |
| `chunklock:chunk_init/init_neighbor_west` (`java_mod/data/chunklock/function/chunk_init/init_neighbor_west.mcfunction`) | Creates the western chunk at the caller's prepared position, then tags the original marker with initNeighborWest. |
| `chunklock:chunk_init/init_neighbors` (`java_mod/data/chunklock/function/chunk_init/init_neighbors.mcfunction`) | Checks north/east/south/west independently, avoids duplicate markers, waits for loaded areas and records initNeighborsDone once all sides are initialized. |
| `chunklock:chunk_items/check_render_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_east.mcfunction`) | Creates an eastern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag. |
| `chunklock:chunk_items/check_render_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_north.mcfunction`) | Creates a northern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag. |
| `chunklock:chunk_items/check_render_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_south.mcfunction`) | Creates a southern item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag. |
| `chunklock:chunk_items/check_render_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/check_render_chunk_item_west.mcfunction`) | Creates a western item display with a text passenger when that side is not rendered and a player is inside the caller's bounds; records its rendered tag. |
| `chunklock:chunk_items/check_submit_chunk_item` (`java_mod/data/chunklock/function/chunk_items/check_submit_chunk_item.mcfunction`) | Finds the nearest locked marker, compares item IDs, identifies the thrower's UUID, dispatches success/failure, returns leftovers and clears shared context. |
| `chunklock:chunk_items/kill_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_east.mcfunction`) | Removes chunkSideEast entities within the caller's bounds and clears the marker's rendered tag. |
| `chunklock:chunk_items/kill_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_north.mcfunction`) | Removes chunkSideNorth entities within the caller's bounds and clears the marker's rendered tag. |
| `chunklock:chunk_items/kill_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_south.mcfunction`) | Removes chunkSideSouth entities within the caller's bounds and clears the marker's rendered tag. |
| `chunklock:chunk_items/kill_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_item_west.mcfunction`) | Removes chunkSideWest entities within the caller's bounds and clears the marker's rendered tag. |
| `chunklock:chunk_items/kill_chunk_items` (`java_mod/data/chunklock/function/chunk_items/kill_chunk_items.mcfunction`) | Positions execution bounds on all four sides and invokes each side's item/text display cleanup. |
| `chunklock:chunk_items/render_chunk_items` (`java_mod/data/chunklock/function/chunk_items/render_chunk_items.mcfunction`) | Requires a nearby unlocked neighbor, then checks each side for display creation using side-specific execution positions. |
| `chunklock:chunk_items/reset_chunk_items` (`java_mod/data/chunklock/function/chunk_items/reset_chunk_items.mcfunction`) | Rerolls a marker's unlock requirement and updates existing displays. |
| `chunklock:chunk_items/roll_chunk_unlock_item` (`java_mod/data/chunklock/function/chunk_items/roll_chunk_unlock_item.mcfunction`) | Rolls the all_biome fallback, then replaces the armor stand's held item using the loot table matching the biome at its position. |
| `chunklock:chunk_items/submit_chunk_item_failure` (`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_failure.mcfunction`) | Plays incorrect-item sound and particles; the caller returns the item to its thrower. |
| `chunklock:chunk_items/submit_chunk_item_success` (`java_mod/data/chunklock/function/chunk_items/submit_chunk_item_success.mcfunction`) | Subtracts the submitted amount, consumes required items, preserves excess, unlocks when the remaining cost is nonpositive or refreshes displays if payment is incomplete. |
| `chunklock:chunk_items/update_chunk_item_east` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_east.mcfunction`) | Copies data.source to the eastern item display and binds its text display to the remaining-cost score. |
| `chunklock:chunk_items/update_chunk_item_north` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_north.mcfunction`) | Copies data.source to the northern item display and binds its text display to the remaining-cost score. |
| `chunklock:chunk_items/update_chunk_item_south` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_south.mcfunction`) | Copies data.source to the southern item display and binds its text display to the remaining-cost score. |
| `chunklock:chunk_items/update_chunk_item_west` (`java_mod/data/chunklock/function/chunk_items/update_chunk_item_west.mcfunction`) | Copies data.source to the western item display and binds its text display to the remaining-cost score. |
| `chunklock:chunk_items/update_chunk_items` (`java_mod/data/chunklock/function/chunk_items/update_chunk_items.mcfunction`) | Updates only rendered sides of a marker that is still locked. |
| `chunklock:chunk_proximity/on_chunk_become_relevant` (`java_mod/data/chunklock/function/chunk_proximity/on_chunk_become_relevant.mcfunction`) | Creates vertically stacked interaction hitboxes for clicks and mining protection when players approach a locked chunk. |
| `chunklock:chunk_proximity/on_chunk_cease_relevant` (`java_mod/data/chunklock/function/chunk_proximity/on_chunk_cease_relevant.mcfunction`) | Removes item/text displays and interaction hitboxes when the locked chunk no longer has relevant nearby players. |
| `chunklock:chunk_proximity/tick_relevant_chunk` (`java_mod/data/chunklock/function/chunk_proximity/tick_relevant_chunk.mcfunction`) | Renders unlock indicators and processes previously unprocessed item entities within the chunk's search bounds. |
| `chunklock:collision/exit_locked_chunk` (`java_mod/data/chunklock/function/collision/exit_locked_chunk.mcfunction`) | Matches the player's prevPosMarker using all four UUID scores, retains current viewing rotation and teleports the player back to that marker. |
| `chunklock:collision/player_chunk_collision` (`java_mod/data/chunklock/function/collision/player_chunk_collision.mcfunction`) | Finds currentChunk, restores the safe position if it is locked, then clears currentChunk. |
| `chunklock:collision/refresh_position_marker` (`java_mod/data/chunklock/function/collision/refresh_position_marker.mcfunction`) | Deletes the player's previous UUID-matched position marker and creates a new safe-position marker carrying the same owner UUID. |
| `chunklock:dimension/on_change_dimension` (`java_mod/data/chunklock/function/dimension/on_change_dimension.mcfunction`) | Adds awaitingDimensionLoad through @p and revokes @s's dimension-change advancement so the next transition can be detected. |
| `chunklock:dimension/on_dimension_loaded` (`java_mod/data/chunklock/function/dimension/on_dimension_loaded.mcfunction`) | Unlocks the destination chunk if it is locked after loading, then clears awaitingDimensionLoad. |
| `chunklock:init_player` (`java_mod/data/chunklock/function/init_player.mcfunction`) | Stores the player's UUID in four scores, enables command triggers and adds playerInit. |
| `chunklock:load` (`java_mod/data/chunklock/function/load.mcfunction`) | Creates objectives, integer constants and command triggers, defaults difficulty to Normal, and sets the respawn radius. |
| `chunklock:pearl/pearl_entered_locked_chunk` (`java_mod/data/chunklock/function/pearl/pearl_entered_locked_chunk.mcfunction`) | Creates particles and sound, then kills the pearl to prevent teleporting through a locked border. |
| `chunklock:pearl/tick_ender_pearl` (`java_mod/data/chunklock/function/pearl/tick_ender_pearl.mcfunction`) | Checks an ender pearl's current chunk and dispatches destruction when it enters a locked chunk. |
| `chunklock:post_tick` (`java_mod/data/chunklock/function/post_tick.mcfunction`) | Refreshes every player's safe position, then removes temporary player2d markers. |
| `chunklock:post_tick_player` (`java_mod/data/chunklock/function/post_tick_player.mcfunction`) | Records the latest safe position only outside locked chunks, then releases the currentChunk context. |
| `chunklock:pre_tick` (`java_mod/data/chunklock/function/pre_tick.mcfunction`) | Runs pre_tick_player for every player before the main update. |
| `chunklock:pre_tick_player` (`java_mod/data/chunklock/function/pre_tick_player.mcfunction`) | Creates player2d on the dimension's lookup plane and initializes the starting chunk when no nearby marker exists. |
| `chunklock:projectile/init_projectile` (`java_mod/data/chunklock/function/projectile/init_projectile.mcfunction`) | Copies the projectile's four Owner UUID components into scores and adds projectileInit. |
| `chunklock:projectile/projectile_entered_locked_chunk` (`java_mod/data/chunklock/function/projectile/projectile_entered_locked_chunk.mcfunction`) | Plays a sound, stops Motion, sets inGround/DealtDamage and adds projectileCollided to prevent repeated checks. |
| `chunklock:projectile/tick_player_projectile` (`java_mod/data/chunklock/function/projectile/tick_player_projectile.mcfunction`) | Finds the player's projectile's current chunk and stops the projectile if the chunk is locked. |
| `chunklock:tick` (`java_mod/data/chunklock/function/tick.mcfunction`) | Updates players, projectiles, pearls and displays every tick; updates markers, proximity and interactions every four ticks. |
| `chunklock:tick_chunk_interactions` (`java_mod/data/chunklock/function/tick_chunk_interactions.mcfunction`) | Handles interaction clicks: dye changes the border color; other clicks show the item and remaining cost. Clears interaction state afterward. |
| `chunklock:tick_chunk_item_displays` (`java_mod/data/chunklock/function/tick_chunk_item_displays.mcfunction`) | Adjusts an item display's Y coordinate to the nearest player passing the dimension's render-height predicate. |
| `chunklock:tick_chunk_marker` (`java_mod/data/chunklock/function/tick_chunk_marker.mcfunction`) | Initializes loaded neighboring chunks when a player2d marker is nearby and propagation is incomplete. |
| `chunklock:tick_chunk_player_proximity_check` (`java_mod/data/chunklock/function/tick_chunk_player_proximity_check.mcfunction`) | Compares current and previous proximity, then activates, deactivates or updates relevant locked chunks. |
| `chunklock:tick_item_in_chunk` (`java_mod/data/chunklock/function/tick_item_in_chunk.mcfunction`) | Sends player-thrown items for payment checks and marks items without a Thrower as already processed. |
| `chunklock:tick_player` (`java_mod/data/chunklock/function/tick_player.mcfunction`) | Handles dimension readiness, locked-chunk collision, UUID-matched projectiles and player command triggers. |
| `chunklock:utils/done_with_current_chunk` (`java_mod/data/chunklock/function/utils/done_with_current_chunk.mcfunction`) | Clears the temporary currentChunk tag when a context-dependent operation finishes. |
| `chunklock:utils/dye_chunk` (`java_mod/data/chunklock/function/utils/dye_chunk.mcfunction`) | Selects the main-hand dye color, recolors the nearest locked marker's border displays, consumes one dye and grants the chunk_dye advancement. |
| `chunklock:utils/find_chunk_center` (`java_mod/data/chunklock/function/utils/find_chunk_center.mcfunction`) | Multiplies ChunkX/Z by 16 and adds 8 to produce chunk-center PosX/Z. |
| `chunklock:utils/find_chunk_coords` (`java_mod/data/chunklock/function/utils/find_chunk_coords.mcfunction`) | Computes ChunkX/ChunkZ from entity Pos scaled by 0.0625 through data get and scoreboard storage. |
| `chunklock:utils/find_current_chunk` (`java_mod/data/chunklock/function/utils/find_current_chunk.mcfunction`) | Tags the nearest chunk marker within 12 blocks on the dimension's lookup plane as currentChunk; callers must invoke done_with_current_chunk afterward. |
| `chunklock:utils/find_nearest_locked_chunk` (`java_mod/data/chunklock/function/utils/find_nearest_locked_chunk.mcfunction`) | Tags the nearest locked marker within 15 blocks on the dimension's lookup plane as currentChunk; used for item payments. |
| `chunklock:utils/render_chunk_auto_unlock_message` (`java_mod/data/chunklock/function/utils/render_chunk_auto_unlock_message.mcfunction`) | Announces an unlock without attributing a payer, such as a locked portal destination becoming accessible. |
| `chunklock:utils/render_chunk_difficulty_message` (`java_mod/data/chunklock/function/utils/render_chunk_difficulty_message.mcfunction`) | Shows clickable difficulty commands; after the first credited unlock, shows the restriction and reset link instead. |
| `chunklock:utils/render_chunk_unlock_message` (`java_mod/data/chunklock/function/utils/render_chunk_unlock_message.mcfunction`) | Announces the payer and global unlock number, handles milestones 1/8/16/32/64/128 and respects hideChunkUnlockTitle. |
| `chunklock:utils/reroll_chunk` (`java_mod/data/chunklock/function/utils/reroll_chunk.mcfunction`) | Allows rerolling only on Easy, selects a nearby locked marker in front of the player and increments reroll counters. |
| `chunklock:utils/reset` (`java_mod/data/chunklock/function/utils/reset.mcfunction`) | Runs uninstall, re-enables file/chunklock and invokes load again. |
| `chunklock:utils/set_chunk_unlock_count_below_name` (`java_mod/data/chunklock/function/utils/set_chunk_unlock_count_below_name.mcfunction`) | Displays ChunklockTotalUnlockedChunks below player names using below_name. |
| `chunklock:utils/spread_players` (`java_mod/data/chunklock/function/utils/spread_players.mcfunction`) | Runs spreadplayers for all players and assigns their resulting locations as new spawn points. |
| `chunklock:utils/translate_item_name/display_item_name` (`java_mod/data/chunklock/function/utils/translate_item_name/display_item_name.mcfunction`) | Uses a macro to show remaining cost and the translated item name to a chunkInteractor who is not using dye. |
| `chunklock:utils/translate_item_name/store_item_name` (`java_mod/data/chunklock/function/utils/translate_item_name/store_item_name.mcfunction`) | Creates an item through an ID macro, extracts its translation key into chunklock:master storage and deletes the temporary item. |
| `chunklock:utils/uninstall` (`java_mod/data/chunklock/function/utils/uninstall.mcfunction`) | Removes selected objectives, temporary item-name storage, chunklock entities and playerInit, then disables file/chunklock; it does not erase every state value. |
| `chunklock:utils/unlock_current_chunk` (`java_mod/data/chunklock/function/utils/unlock_current_chunk.mcfunction`) | Marks the chunk unlocked, removes visuals/interactions, increments world/payer progress and dispatches messages and advancements. |

## loot_table

| File | Responsibility |
| --- | --- |
| `chunklock:biome/all_biome` (`java_mod/data/chunklock/loot_table/biome/all_biome.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 0 table entries |
| `chunklock:biome/badlands` (`java_mod/data/chunklock/loot_table/biome/badlands.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries |
| `chunklock:biome/bamboo_jungle` (`java_mod/data/chunklock/loot_table/biome/bamboo_jungle.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries |
| `chunklock:biome/basalt_deltas` (`java_mod/data/chunklock/loot_table/biome/basalt_deltas.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries |
| `chunklock:biome/beach` (`java_mod/data/chunklock/loot_table/biome/beach.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries |
| `chunklock:biome/birch_forest` (`java_mod/data/chunklock/loot_table/biome/birch_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries |
| `chunklock:biome/cherry_grove` (`java_mod/data/chunklock/loot_table/biome/cherry_grove.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries |
| `chunklock:biome/cold_ocean` (`java_mod/data/chunklock/loot_table/biome/cold_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 7 table entries |
| `chunklock:biome/crimson_forest` (`java_mod/data/chunklock/loot_table/biome/crimson_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries |
| `chunklock:biome/dark_forest` (`java_mod/data/chunklock/loot_table/biome/dark_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 5 item entries, 7 table entries |
| `chunklock:biome/deep_cold_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_cold_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 7 table entries |
| `chunklock:biome/deep_dark` (`java_mod/data/chunklock/loot_table/biome/deep_dark.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries |
| `chunklock:biome/deep_frozen_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_frozen_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries |
| `chunklock:biome/deep_lukewarm_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_lukewarm_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/deep_ocean` (`java_mod/data/chunklock/loot_table/biome/deep_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries |
| `chunklock:biome/desert` (`java_mod/data/chunklock/loot_table/biome/desert.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries |
| `chunklock:biome/dripstone_caves` (`java_mod/data/chunklock/loot_table/biome/dripstone_caves.json`) | Selects biome-specific unlock requirements; 1 pools, 4 item entries, 3 table entries |
| `chunklock:biome/end_barrens` (`java_mod/data/chunklock/loot_table/biome/end_barrens.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 1 table entries |
| `chunklock:biome/end_highlands` (`java_mod/data/chunklock/loot_table/biome/end_highlands.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 2 table entries |
| `chunklock:biome/end_midlands` (`java_mod/data/chunklock/loot_table/biome/end_midlands.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries |
| `chunklock:biome/eroded_badlands` (`java_mod/data/chunklock/loot_table/biome/eroded_badlands.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries |
| `chunklock:biome/flower_forest` (`java_mod/data/chunklock/loot_table/biome/flower_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 4 item entries, 5 table entries |
| `chunklock:biome/forest` (`java_mod/data/chunklock/loot_table/biome/forest.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 5 table entries |
| `chunklock:biome/frozen_ocean` (`java_mod/data/chunklock/loot_table/biome/frozen_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries |
| `chunklock:biome/frozen_peaks` (`java_mod/data/chunklock/loot_table/biome/frozen_peaks.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 3 table entries |
| `chunklock:biome/frozen_river` (`java_mod/data/chunklock/loot_table/biome/frozen_river.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/grove` (`java_mod/data/chunklock/loot_table/biome/grove.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries |
| `chunklock:biome/ice_spikes` (`java_mod/data/chunklock/loot_table/biome/ice_spikes.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries |
| `chunklock:biome/jagged_peaks` (`java_mod/data/chunklock/loot_table/biome/jagged_peaks.json`) | Selects biome-specific unlock requirements; 1 pools, 1 item entries, 4 table entries |
| `chunklock:biome/jungle` (`java_mod/data/chunklock/loot_table/biome/jungle.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries |
| `chunklock:biome/lukewarm_ocean` (`java_mod/data/chunklock/loot_table/biome/lukewarm_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries |
| `chunklock:biome/lush_caves` (`java_mod/data/chunklock/loot_table/biome/lush_caves.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries |
| `chunklock:biome/mangrove_swamp` (`java_mod/data/chunklock/loot_table/biome/mangrove_swamp.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 5 table entries |
| `chunklock:biome/meadow` (`java_mod/data/chunklock/loot_table/biome/meadow.json`) | Selects biome-specific unlock requirements; 1 pools, 6 item entries, 5 table entries |
| `chunklock:biome/mushroom_fields` (`java_mod/data/chunklock/loot_table/biome/mushroom_fields.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 3 table entries |
| `chunklock:biome/nether_wastes` (`java_mod/data/chunklock/loot_table/biome/nether_wastes.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries |
| `chunklock:biome/ocean` (`java_mod/data/chunklock/loot_table/biome/ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries |
| `chunklock:biome/old_growth_birch_forest` (`java_mod/data/chunklock/loot_table/biome/old_growth_birch_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries |
| `chunklock:biome/old_growth_pine_taiga` (`java_mod/data/chunklock/loot_table/biome/old_growth_pine_taiga.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries |
| `chunklock:biome/old_growth_spruce_taiga` (`java_mod/data/chunklock/loot_table/biome/old_growth_spruce_taiga.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries |
| `chunklock:biome/plains` (`java_mod/data/chunklock/loot_table/biome/plains.json`) | Selects biome-specific unlock requirements; 1 pools, 8 item entries, 5 table entries |
| `chunklock:biome/river` (`java_mod/data/chunklock/loot_table/biome/river.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries |
| `chunklock:biome/savanna` (`java_mod/data/chunklock/loot_table/biome/savanna.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/savanna_plateau` (`java_mod/data/chunklock/loot_table/biome/savanna_plateau.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/small_end_islands` (`java_mod/data/chunklock/loot_table/biome/small_end_islands.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 1 table entries |
| `chunklock:biome/snowy_beach` (`java_mod/data/chunklock/loot_table/biome/snowy_beach.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 8 table entries |
| `chunklock:biome/snowy_plains` (`java_mod/data/chunklock/loot_table/biome/snowy_plains.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/snowy_slopes` (`java_mod/data/chunklock/loot_table/biome/snowy_slopes.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries |
| `chunklock:biome/snowy_taiga` (`java_mod/data/chunklock/loot_table/biome/snowy_taiga.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries |
| `chunklock:biome/soul_sand_valley` (`java_mod/data/chunklock/loot_table/biome/soul_sand_valley.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries |
| `chunklock:biome/sparse_jungle` (`java_mod/data/chunklock/loot_table/biome/sparse_jungle.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries |
| `chunklock:biome/stony_peaks` (`java_mod/data/chunklock/loot_table/biome/stony_peaks.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries |
| `chunklock:biome/stony_shore` (`java_mod/data/chunklock/loot_table/biome/stony_shore.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/sunflower_plains` (`java_mod/data/chunklock/loot_table/biome/sunflower_plains.json`) | Selects biome-specific unlock requirements; 1 pools, 9 item entries, 5 table entries |
| `chunklock:biome/swamp` (`java_mod/data/chunklock/loot_table/biome/swamp.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries |
| `chunklock:biome/taiga` (`java_mod/data/chunklock/loot_table/biome/taiga.json`) | Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries |
| `chunklock:biome/the_end` (`java_mod/data/chunklock/loot_table/biome/the_end.json`) | Selects biome-specific unlock requirements; 1 pools, 6 item entries, 0 table entries |
| `chunklock:biome/warm_ocean` (`java_mod/data/chunklock/loot_table/biome/warm_ocean.json`) | Selects biome-specific unlock requirements; 1 pools, 4 item entries, 4 table entries |
| `chunklock:biome/warped_forest` (`java_mod/data/chunklock/loot_table/biome/warped_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 4 item entries, 4 table entries |
| `chunklock:biome/windswept_forest` (`java_mod/data/chunklock/loot_table/biome/windswept_forest.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries |
| `chunklock:biome/windswept_gravelly_hills` (`java_mod/data/chunklock/loot_table/biome/windswept_gravelly_hills.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries |
| `chunklock:biome/windswept_hills` (`java_mod/data/chunklock/loot_table/biome/windswept_hills.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries |
| `chunklock:biome/windswept_savanna` (`java_mod/data/chunklock/loot_table/biome/windswept_savanna.json`) | Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries |
| `chunklock:biome/wooded_badlands` (`java_mod/data/chunklock/loot_table/biome/wooded_badlands.json`) | Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries |
| `chunklock:generic/activity/fishing` (`java_mod/data/chunklock/loot_table/generic/activity/fishing.json`) | Reusable weighted item group; 1 pools, 8 item entries, 0 table entries |
| `chunklock:generic/biome/desert` (`java_mod/data/chunklock/loot_table/generic/biome/desert.json`) | Reusable weighted item group; 1 pools, 2 item entries, 2 table entries |
| `chunklock:generic/biome/ocean` (`java_mod/data/chunklock/loot_table/generic/biome/ocean.json`) | Reusable weighted item group; 1 pools, 1 item entries, 4 table entries |
| `chunklock:generic/block/andesite` (`java_mod/data/chunklock/loot_table/generic/block/andesite.json`) | Reusable weighted item group; 1 pools, 7 item entries, 0 table entries |
| `chunklock:generic/block/basalt` (`java_mod/data/chunklock/loot_table/generic/block/basalt.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/block/blackstone` (`java_mod/data/chunklock/loot_table/generic/block/blackstone.json`) | Reusable weighted item group; 1 pools, 16 item entries, 0 table entries |
| `chunklock:generic/block/bone` (`java_mod/data/chunklock/loot_table/generic/block/bone.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/block/brick` (`java_mod/data/chunklock/loot_table/generic/block/brick.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/block/candle` (`java_mod/data/chunklock/loot_table/generic/block/candle.json`) | Reusable weighted item group; 1 pools, 15 item entries, 0 table entries |
| `chunklock:generic/block/clay` (`java_mod/data/chunklock/loot_table/generic/block/clay.json`) | Reusable weighted item group; 1 pools, 3 item entries, 1 table entries |
| `chunklock:generic/block/cobblestone` (`java_mod/data/chunklock/loot_table/generic/block/cobblestone.json`) | Reusable weighted item group; 1 pools, 9 item entries, 0 table entries |
| `chunklock:generic/block/concrete` (`java_mod/data/chunklock/loot_table/generic/block/concrete.json`) | Reusable weighted item group; 1 pools, 28 item entries, 0 table entries |
| `chunklock:generic/block/coral` (`java_mod/data/chunklock/loot_table/generic/block/coral.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/block/deepslate` (`java_mod/data/chunklock/loot_table/generic/block/deepslate.json`) | Reusable weighted item group; 1 pools, 16 item entries, 0 table entries |
| `chunklock:generic/block/diorite` (`java_mod/data/chunklock/loot_table/generic/block/diorite.json`) | Reusable weighted item group; 1 pools, 7 item entries, 0 table entries |
| `chunklock:generic/block/dirt` (`java_mod/data/chunklock/loot_table/generic/block/dirt.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/block/end_stone` (`java_mod/data/chunklock/loot_table/generic/block/end_stone.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/block/glass` (`java_mod/data/chunklock/loot_table/generic/block/glass.json`) | Reusable weighted item group; 1 pools, 31 item entries, 0 table entries |
| `chunklock:generic/block/glowstone` (`java_mod/data/chunklock/loot_table/generic/block/glowstone.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/block/granite` (`java_mod/data/chunklock/loot_table/generic/block/granite.json`) | Reusable weighted item group; 1 pools, 7 item entries, 0 table entries |
| `chunklock:generic/block/gravel` (`java_mod/data/chunklock/loot_table/generic/block/gravel.json`) | Reusable weighted item group; 1 pools, 2 item entries, 1 table entries |
| `chunklock:generic/block/ice` (`java_mod/data/chunklock/loot_table/generic/block/ice.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/block/kelp` (`java_mod/data/chunklock/loot_table/generic/block/kelp.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/block/moss` (`java_mod/data/chunklock/loot_table/generic/block/moss.json`) | Reusable weighted item group; 1 pools, 4 item entries, 0 table entries |
| `chunklock:generic/block/mud` (`java_mod/data/chunklock/loot_table/generic/block/mud.json`) | Reusable weighted item group; 1 pools, 6 item entries, 0 table entries |
| `chunklock:generic/block/mushroom` (`java_mod/data/chunklock/loot_table/generic/block/mushroom.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/block/nether_brick` (`java_mod/data/chunklock/loot_table/generic/block/nether_brick.json`) | Reusable weighted item group; 1 pools, 8 item entries, 0 table entries |
| `chunklock:generic/block/prismarine` (`java_mod/data/chunklock/loot_table/generic/block/prismarine.json`) | Reusable weighted item group; 1 pools, 13 item entries, 0 table entries |
| `chunklock:generic/block/pumpkin` (`java_mod/data/chunklock/loot_table/generic/block/pumpkin.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/block/purpur` (`java_mod/data/chunklock/loot_table/generic/block/purpur.json`) | Reusable weighted item group; 1 pools, 4 item entries, 0 table entries |
| `chunklock:generic/block/quartz` (`java_mod/data/chunklock/loot_table/generic/block/quartz.json`) | Reusable weighted item group; 1 pools, 12 item entries, 0 table entries |
| `chunklock:generic/block/red_sand` (`java_mod/data/chunklock/loot_table/generic/block/red_sand.json`) | Reusable weighted item group; 1 pools, 11 item entries, 0 table entries |
| `chunklock:generic/block/sand` (`java_mod/data/chunklock/loot_table/generic/block/sand.json`) | Reusable weighted item group; 1 pools, 11 item entries, 2 table entries |
| `chunklock:generic/block/sculk` (`java_mod/data/chunklock/loot_table/generic/block/sculk.json`) | Reusable weighted item group; 1 pools, 4 item entries, 0 table entries |
| `chunklock:generic/block/slime` (`java_mod/data/chunklock/loot_table/generic/block/slime.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/block/snow` (`java_mod/data/chunklock/loot_table/generic/block/snow.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/block/soul_sand` (`java_mod/data/chunklock/loot_table/generic/block/soul_sand.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/block/stone` (`java_mod/data/chunklock/loot_table/generic/block/stone.json`) | Reusable weighted item group; 1 pools, 15 item entries, 0 table entries |
| `chunklock:generic/block/terracotta` (`java_mod/data/chunklock/loot_table/generic/block/terracotta.json`) | Reusable weighted item group; 1 pools, 29 item entries, 0 table entries |
| `chunklock:generic/block/tnt` (`java_mod/data/chunklock/loot_table/generic/block/tnt.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/dimension/nether` (`java_mod/data/chunklock/loot_table/generic/dimension/nether.json`) | Reusable weighted item group; 1 pools, 3 item entries, 7 table entries |
| `chunklock:generic/dimension/overworld` (`java_mod/data/chunklock/loot_table/generic/dimension/overworld.json`) | Reusable weighted item group; 1 pools, 0 item entries, 15 table entries |
| `chunklock:generic/dimension/the_end` (`java_mod/data/chunklock/loot_table/generic/dimension/the_end.json`) | Reusable weighted item group; 1 pools, 3 item entries, 3 table entries |
| `chunklock:generic/entity/bee` (`java_mod/data/chunklock/loot_table/generic/entity/bee.json`) | Reusable weighted item group; 1 pools, 5 item entries, 1 table entries |
| `chunklock:generic/entity/cod` (`java_mod/data/chunklock/loot_table/generic/entity/cod.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/entity/common_overworld_hostile` (`java_mod/data/chunklock/loot_table/generic/entity/common_overworld_hostile.json`) | Reusable weighted item group; 1 pools, 8 item entries, 0 table entries |
| `chunklock:generic/entity/common_overworld_passive` (`java_mod/data/chunklock/loot_table/generic/entity/common_overworld_passive.json`) | Reusable weighted item group; 1 pools, 6 item entries, 1 table entries |
| `chunklock:generic/entity/ghast` (`java_mod/data/chunklock/loot_table/generic/entity/ghast.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/entity/glow_squid` (`java_mod/data/chunklock/loot_table/generic/entity/glow_squid.json`) | Reusable weighted item group; 1 pools, 1 item entries, 0 table entries |
| `chunklock:generic/entity/rabbit` (`java_mod/data/chunklock/loot_table/generic/entity/rabbit.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/entity/salmon` (`java_mod/data/chunklock/loot_table/generic/entity/salmon.json`) | Reusable weighted item group; 1 pools, 5 item entries, 0 table entries |
| `chunklock:generic/entity/sheep` (`java_mod/data/chunklock/loot_table/generic/entity/sheep.json`) | Reusable weighted item group; 1 pools, 52 item entries, 0 table entries |
| `chunklock:generic/entity/shulker` (`java_mod/data/chunklock/loot_table/generic/entity/shulker.json`) | Reusable weighted item group; 1 pools, 18 item entries, 0 table entries |
| `chunklock:generic/entity/squid` (`java_mod/data/chunklock/loot_table/generic/entity/squid.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/entity/witch` (`java_mod/data/chunklock/loot_table/generic/entity/witch.json`) | Reusable weighted item group; 1 pools, 7 item entries, 0 table entries |
| `chunklock:generic/ore/coal` (`java_mod/data/chunklock/loot_table/generic/ore/coal.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/ore/copper` (`java_mod/data/chunklock/loot_table/generic/ore/copper.json`) | Reusable weighted item group; 1 pools, 6 item entries, 0 table entries |
| `chunklock:generic/ore/diamond` (`java_mod/data/chunklock/loot_table/generic/ore/diamond.json`) | Reusable weighted item group; 1 pools, 12 item entries, 0 table entries |
| `chunklock:generic/ore/gold` (`java_mod/data/chunklock/loot_table/generic/ore/gold.json`) | Reusable weighted item group; 1 pools, 10 item entries, 0 table entries |
| `chunklock:generic/ore/iron` (`java_mod/data/chunklock/loot_table/generic/ore/iron.json`) | Reusable weighted item group; 1 pools, 20 item entries, 0 table entries |
| `chunklock:generic/ore/lapis` (`java_mod/data/chunklock/loot_table/generic/ore/lapis.json`) | Reusable weighted item group; 1 pools, 2 item entries, 0 table entries |
| `chunklock:generic/ore/netherite` (`java_mod/data/chunklock/loot_table/generic/ore/netherite.json`) | Reusable weighted item group; 1 pools, 14 item entries, 0 table entries |
| `chunklock:generic/ore/redstone` (`java_mod/data/chunklock/loot_table/generic/ore/redstone.json`) | Reusable weighted item group; 1 pools, 9 item entries, 0 table entries |
| `chunklock:generic/plant/sugarcane` (`java_mod/data/chunklock/loot_table/generic/plant/sugarcane.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/plant/watermellon` (`java_mod/data/chunklock/loot_table/generic/plant/watermellon.json`) | Reusable weighted item group; 1 pools, 3 item entries, 0 table entries |
| `chunklock:generic/rare/rare` (`java_mod/data/chunklock/loot_table/generic/rare/rare.json`) | Reusable weighted item group; 1 pools, 10 item entries, 0 table entries |
| `chunklock:generic/rare/ultra_rare` (`java_mod/data/chunklock/loot_table/generic/rare/ultra_rare.json`) | Reusable weighted item group; 1 pools, 20 item entries, 0 table entries |
| `chunklock:generic/structure/abandoned_mineshaft` (`java_mod/data/chunklock/loot_table/generic/structure/abandoned_mineshaft.json`) | Reusable weighted item group; 1 pools, 22 item entries, 1 table entries |
| `chunklock:generic/structure/bastion` (`java_mod/data/chunklock/loot_table/generic/structure/bastion.json`) | Reusable weighted item group; 1 pools, 3 item entries, 5 table entries |
| `chunklock:generic/structure/desert_temple` (`java_mod/data/chunklock/loot_table/generic/structure/desert_temple.json`) | Reusable weighted item group; 1 pools, 9 item entries, 1 table entries |
| `chunklock:generic/structure/end_city` (`java_mod/data/chunklock/loot_table/generic/structure/end_city.json`) | Reusable weighted item group; 1 pools, 7 item entries, 2 table entries |
| `chunklock:generic/structure/geode` (`java_mod/data/chunklock/loot_table/generic/structure/geode.json`) | Reusable weighted item group; 1 pools, 4 item entries, 0 table entries |
| `chunklock:generic/structure/nether_fortress` (`java_mod/data/chunklock/loot_table/generic/structure/nether_fortress.json`) | Reusable weighted item group; 1 pools, 8 item entries, 1 table entries |
| `chunklock:generic/structure/ocean_monument` (`java_mod/data/chunklock/loot_table/generic/structure/ocean_monument.json`) | Reusable weighted item group; 1 pools, 1 item entries, 1 table entries |
| `chunklock:generic/structure/shipwreck` (`java_mod/data/chunklock/loot_table/generic/structure/shipwreck.json`) | Reusable weighted item group; 1 pools, 6 item entries, 5 table entries |
| `chunklock:generic/wood/acacia` (`java_mod/data/chunklock/loot_table/generic/wood/acacia.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/bamboo` (`java_mod/data/chunklock/loot_table/generic/wood/bamboo.json`) | Reusable weighted item group; 1 pools, 19 item entries, 1 table entries |
| `chunklock:generic/wood/birch` (`java_mod/data/chunklock/loot_table/generic/wood/birch.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/cherry` (`java_mod/data/chunklock/loot_table/generic/wood/cherry.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/crimson` (`java_mod/data/chunklock/loot_table/generic/wood/crimson.json`) | Reusable weighted item group; 1 pools, 15 item entries, 1 table entries |
| `chunklock:generic/wood/dark_oak` (`java_mod/data/chunklock/loot_table/generic/wood/dark_oak.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/jungle` (`java_mod/data/chunklock/loot_table/generic/wood/jungle.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/mangrove` (`java_mod/data/chunklock/loot_table/generic/wood/mangrove.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/oak` (`java_mod/data/chunklock/loot_table/generic/wood/oak.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/spruce` (`java_mod/data/chunklock/loot_table/generic/wood/spruce.json`) | Reusable weighted item group; 1 pools, 17 item entries, 1 table entries |
| `chunklock:generic/wood/warped` (`java_mod/data/chunklock/loot_table/generic/wood/warped.json`) | Reusable weighted item group; 1 pools, 15 item entries, 1 table entries |
| `chunklock:generic/wood/wood_misc` (`java_mod/data/chunklock/loot_table/generic/wood/wood_misc.json`) | Reusable weighted item group; 1 pools, 14 item entries, 0 table entries |

## predicate

| File | Responsibility |
| --- | --- |
| `chunklock:dye/is_holding_black_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_black_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:black_dye"]}}}} |
| `chunklock:dye/is_holding_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_blue_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:blue_dye"]}}}} |
| `chunklock:dye/is_holding_brown_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_brown_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:brown_dye"]}}}} |
| `chunklock:dye/is_holding_cyan_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_cyan_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:cyan_dye"]}}}} |
| `chunklock:dye/is_holding_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_dye.json`) | Condition filter: {"condition":"minecraft:any_of","terms":[{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:red_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:blue_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:cyan_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:gray_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:lime_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:pink_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:black_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:brown_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:green_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:white_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:orange_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:purple_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:yellow_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:magenta_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:light_blue_dye"]}}}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:light_gray_dye"]}}}}]} |
| `chunklock:dye/is_holding_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_gray_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:gray_dye"]}}}} |
| `chunklock:dye/is_holding_green_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_green_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:green_dye"]}}}} |
| `chunklock:dye/is_holding_light_blue_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_blue_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:light_blue_dye"]}}}} |
| `chunklock:dye/is_holding_light_gray_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_light_gray_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:light_gray_dye"]}}}} |
| `chunklock:dye/is_holding_lime_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_lime_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:lime_dye"]}}}} |
| `chunklock:dye/is_holding_magenta_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_magenta_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:magenta_dye"]}}}} |
| `chunklock:dye/is_holding_orange_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_orange_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:orange_dye"]}}}} |
| `chunklock:dye/is_holding_pink_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_pink_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:pink_dye"]}}}} |
| `chunklock:dye/is_holding_purple_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_purple_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:purple_dye"]}}}} |
| `chunklock:dye/is_holding_red_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_red_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:red_dye"]}}}} |
| `chunklock:dye/is_holding_white_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_white_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:white_dye"]}}}} |
| `chunklock:dye/is_holding_yellow_dye` (`java_mod/data/chunklock/predicate/dye/is_holding_yellow_dye.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"equipment":{"mainhand":{"items":["minecraft:yellow_dye"]}}}} |
| `chunklock:is_in_overworld_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_overworld_chunk_render_height.json`) | Condition filter: {"condition":"minecraft:location_check","predicate":{"position":{"y":{"min":-63,"max":318}},"dimension":"minecraft:overworld"}} |
| `chunklock:is_in_the_end_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_end_chunk_render_height.json`) | Condition filter: {"condition":"minecraft:location_check","predicate":{"position":{"y":{"min":0,"max":255}},"dimension":"minecraft:the_end"}} |
| `chunklock:is_in_the_nether_chunk_render_height` (`java_mod/data/chunklock/predicate/is_in_the_nether_chunk_render_height.json`) | Condition filter: {"condition":"minecraft:location_check","predicate":{"position":{"y":{"min":0,"max":127}},"dimension":"minecraft:the_nether"}} |
| `chunklock:is_looking_at_locked_chunk` (`java_mod/data/chunklock/predicate/is_looking_at_locked_chunk.json`) | Condition filter: {"condition":"minecraft:entity_properties","entity":"this","predicate":{"type_specific":{"type":"player","looking_at":{"type":"minecraft:interaction","distance":{"absolute":{"min":0,"max":15}}}}}} |
| `chunklock:is_projectile` (`java_mod/data/chunklock/predicate/is_projectile.json`) | Condition filter: {"condition":"minecraft:any_of","terms":[{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"#minecraft:arrows"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:egg"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:splash_potion"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:lingering_potion"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:small_fireball"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:snowball"}},{"condition":"minecraft:entity_properties","entity":"this","predicate":{"type":"minecraft:trident"}}]} |

## tags/function

| File | Responsibility |
| --- | --- |
| `minecraft:load` (`java_mod/data/minecraft/tags/function/load.json`) | Game entry point; invokes functions in order: chunklock:load |
| `minecraft:tick` (`java_mod/data/minecraft/tags/function/tick.json`) | Game entry point; invokes functions in order: chunklock:pre_tick, chunklock:tick, chunklock:post_tick |
