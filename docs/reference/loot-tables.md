# Complete loot table reference

Generated from local reference data by `python tools/reference_docs.py`. Do not edit generated content.


Weights apply within the same pool/group, not across all files. A nested table adds another selection step.

A parent's set_count function can overwrite a child table's count. Preserve function order when porting to Bedrock.

Java paths below identify local-only reference files outside this repository; they are source locators, not GitHub links.

## chunklock:biome/all_biome

`java_mod/data/chunklock/loot_table/biome/all_biome.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:stone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:biome/badlands

`java_mod/data/chunklock/loot_table/biome/badlands.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/red_sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/terracotta | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:cactus | 30 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/ore/gold | 10 | [{"function":"minecraft:set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/structure/abandoned_mineshaft | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/bamboo_jungle

`java_mod/data/chunklock/loot_table/biome/bamboo_jungle.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/bamboo | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/plant/watermellon | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/jungle | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/basalt_deltas

`java_mod/data/chunklock/loot_table/biome/basalt_deltas.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/basalt | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/blackstone | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:magma_cream | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:magma_block | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/structure/nether_fortress | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/nether | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/beach

`java_mod/data/chunklock/loot_table/biome/beach.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/clay | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | minecraft:blocks/gravel | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/plant/sugarcane | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:water_bucket | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/birch_forest

`java_mod/data/chunklock/loot_table/biome/birch_forest.json`

Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/birch | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:rose_bush | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:lilac | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:peony | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:lily_of_the_valley | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/bee | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/cherry_grove

`java_mod/data/chunklock/loot_table/biome/cherry_grove.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/cherry | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:pink_petals | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/bee | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/cold_ocean

`java_mod/data/chunklock/loot_table/biome/cold_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | minecraft:blocks/gravel | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/salmon | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/crimson_forest

`java_mod/data/chunklock/loot_table/biome/crimson_forest.json`

Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:weeping_vines | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/crimson | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:crimson_fungus | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:porkchop | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/dimension/nether | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:nether_wart_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:nether_wart | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | loot_table | chunklock:generic/structure/nether_fortress | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/structure/bastion | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/dark_forest

`java_mod/data/chunklock/loot_table/biome/dark_forest.json`

Selects biome-specific unlock requirements; 1 pools, 5 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/dark_oak | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/birch | 5 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/block/mushroom | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:rose_bush | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:lilac | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:peony | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:lily_of_the_valley | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 11 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 12 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/deep_cold_ocean

`java_mod/data/chunklock/loot_table/biome/deep_cold_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | minecraft:blocks/gravel | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/sand | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/deep_dark

`java_mod/data/chunklock/loot_table/biome/deep_dark.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sculk | 10 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/deepslate | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/deep_frozen_ocean

`java_mod/data/chunklock/loot_table/biome/deep_frozen_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/ice | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | minecraft:blocks/gravel | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/deep_lukewarm_ocean

`java_mod/data/chunklock/loot_table/biome/deep_lukewarm_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sand | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/deep_ocean

`java_mod/data/chunklock/loot_table/biome/deep_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/gravel | 5 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/desert

`java_mod/data/chunklock/loot_table/biome/desert.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/biome/desert | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/dripstone_caves

`java_mod/data/chunklock/loot_table/biome/dripstone_caves.json`

Selects biome-specific unlock requirements; 1 pools, 4 item entries, 3 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dripstone_block | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:pointed_dripstone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:pointed_dripstone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:water_bucket | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/ore/copper | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/structure/abandoned_mineshaft | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/end_barrens

`java_mod/data/chunklock/loot_table/biome/end_barrens.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/dimension/the_end | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/end_highlands

`java_mod/data/chunklock/loot_table/biome/end_highlands.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:chorus_fruit | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/dimension/the_end | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/structure/end_city | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/end_midlands

`java_mod/data/chunklock/loot_table/biome/end_midlands.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/dimension/the_end | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/structure/end_city | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/eroded_badlands

`java_mod/data/chunklock/loot_table/biome/eroded_badlands.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/red_sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:cactus | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/ore/gold | 10 | [{"function":"minecraft:set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/terracotta | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/structure/abandoned_mineshaft | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/flower_forest

`java_mod/data/chunklock/loot_table/biome/flower_forest.json`

Selects biome-specific unlock requirements; 1 pools, 4 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/oak | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/birch | 100 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:allium | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:peony | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:rose_bush | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:lilac | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | loot_table | chunklock:generic/entity/bee | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/forest

`java_mod/data/chunklock/loot_table/biome/forest.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/oak | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/birch | 100 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:peony | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:rose_bush | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:lilac | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | loot_table | chunklock:generic/entity/bee | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/frozen_ocean

`java_mod/data/chunklock/loot_table/biome/frozen_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/ice | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | minecraft:blocks/gravel | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/frozen_peaks

`java_mod/data/chunklock/loot_table/biome/frozen_peaks.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 3 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/stone | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:emerald | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/frozen_river

`java_mod/data/chunklock/loot_table/biome/frozen_river.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/entity/salmon | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/dirt | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/clay | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/block/sand | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/grove

`java_mod/data/chunklock/loot_table/biome/grove.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/spruce | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:dirt | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/snow | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:emerald | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/block/dirt | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/ice_spikes

`java_mod/data/chunklock/loot_table/biome/ice_spikes.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/ice | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/snow | 10 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/dirt | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/rabbit | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/jagged_peaks

`java_mod/data/chunklock/loot_table/biome/jagged_peaks.json`

Selects biome-specific unlock requirements; 1 pools, 1 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/stone | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/ice | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:emerald | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/jungle

`java_mod/data/chunklock/loot_table/biome/jungle.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:vine | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/plant/watermellon | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/bamboo | 50 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/wood/jungle | 50 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:cocoa_beans | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/wood/oak | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/lukewarm_ocean

`java_mod/data/chunklock/loot_table/biome/lukewarm_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/dirt | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/clay | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/cod | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/lush_caves

`java_mod/data/chunklock/loot_table/biome/lush_caves.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/clay | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:vine | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:glow_berries | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:spore_blossom | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/block/moss | 20 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/mangrove_swamp

`java_mod/data/chunklock/loot_table/biome/mangrove_swamp.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/mangrove | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:vine | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/mud | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | item | minecraft:lily_pad | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | loot_table | chunklock:generic/entity/bee | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/meadow

`java_mod/data/chunklock/loot_table/biome/meadow.json`

Selects biome-specific unlock requirements; 1 pools, 6 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/oak | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/birch | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:dandelion | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:cornflower | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:poppy | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:allium | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:oxeye_daisy | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:azure_bluet | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | loot_table | chunklock:generic/entity/bee | 10 | [{"function":"set_count","count":1}] | {} |
| 11 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/mushroom_fields

`java_mod/data/chunklock/loot_table/biome/mushroom_fields.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 3 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/mushroom | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/dirt | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/nether_wastes

`java_mod/data/chunklock/loot_table/biome/nether_wastes.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/dimension/nether | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/nether_brick | 10 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:magma_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:magma_cream | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/block/mushroom | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/structure/nether_fortress | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/structure/bastion | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/block/blackstone | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/ocean

`java_mod/data/chunklock/loot_table/biome/ocean.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/entity/squid | 10 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/gravel | 5 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/glow_squid | 2 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/old_growth_birch_forest

`java_mod/data/chunklock/loot_table/biome/old_growth_birch_forest.json`

Selects biome-specific unlock requirements; 1 pools, 5 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/birch | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:rose_bush | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:lilac | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:peony | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:lily_of_the_valley | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/bee | 5 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/old_growth_pine_taiga

`java_mod/data/chunklock/loot_table/biome/old_growth_pine_taiga.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/spruce | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:sweet_berries | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:mossy_cobblestone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/block/mushroom | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/old_growth_spruce_taiga

`java_mod/data/chunklock/loot_table/biome/old_growth_spruce_taiga.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/spruce | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:sweet_berries | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:mossy_cobblestone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/block/mushroom | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/plains

`java_mod/data/chunklock/loot_table/biome/plains.json`

Selects biome-specific unlock requirements; 1 pools, 8 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/entity/common_overworld_passive | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:azure_bluet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:oxeye_daisy | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:cornflower | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:red_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:pink_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:white_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:orange_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | loot_table | chunklock:generic/entity/bee | 5 | [{"function":"set_count","count":1}] | {} |
| 12 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 13 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/river

`java_mod/data/chunklock/loot_table/biome/river.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/entity/salmon | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/dirt | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/clay | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/gravel | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/block/sand | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/savanna

`java_mod/data/chunklock/loot_table/biome/savanna.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/entity/common_overworld_passive | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/acacia | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/savanna_plateau

`java_mod/data/chunklock/loot_table/biome/savanna_plateau.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/entity/common_overworld_passive | 30 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/acacia | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/small_end_islands

`java_mod/data/chunklock/loot_table/biome/small_end_islands.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/dimension/the_end | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/snowy_beach

`java_mod/data/chunklock/loot_table/biome/snowy_beach.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/snow | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/ice | 50 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/block/clay | 20 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | minecraft:blocks/gravel | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/rabbit | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | item | minecraft:water_bucket | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/snowy_plains

`java_mod/data/chunklock/loot_table/biome/snowy_plains.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/block/snow | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/spruce | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/entity/rabbit | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/snowy_slopes

`java_mod/data/chunklock/loot_table/biome/snowy_slopes.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/spruce | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/cobblestone | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/stone | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/entity/rabbit | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/snowy_taiga

`java_mod/data/chunklock/loot_table/biome/snowy_taiga.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/block/snow | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/spruce | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:sweet_berries | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/soul_sand_valley

`java_mod/data/chunklock/loot_table/biome/soul_sand_valley.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/soul_sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/glowstone | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/basalt | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/bone | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/dimension/nether | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/structure/nether_fortress | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/ghast | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/structure/bastion | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/sparse_jungle

`java_mod/data/chunklock/loot_table/biome/sparse_jungle.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:vine | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/plant/watermellon | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/bamboo | 50 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/wood/jungle | 50 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:cocoa_beans | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/wood/oak | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/stony_peaks

`java_mod/data/chunklock/loot_table/biome/stony_peaks.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:calcite | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | loot_table | chunklock:generic/block/stone | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/granite | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/gravel | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | item | minecraft:emerald | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/stony_shore

`java_mod/data/chunklock/loot_table/biome/stony_shore.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/diorite | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/stone | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/granite | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/gravel | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/activity/fishing | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/sunflower_plains

`java_mod/data/chunklock/loot_table/biome/sunflower_plains.json`

Selects biome-specific unlock requirements; 1 pools, 9 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:sunflower | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/entity/common_overworld_passive | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | item | minecraft:azure_bluet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:oxeye_daisy | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:cornflower | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:red_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:pink_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:white_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:orange_tulip | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | loot_table | chunklock:generic/entity/bee | 5 | [{"function":"set_count","count":1}] | {} |
| 13 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 14 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/swamp

`java_mod/data/chunklock/loot_table/biome/swamp.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:lily_pad | 70 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/slime | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/witch | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:blue_orchid | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/block/mushroom | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/activity/fishing | 10 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/taiga

`java_mod/data/chunklock/loot_table/biome/taiga.json`

Selects biome-specific unlock requirements; 1 pools, 3 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/spruce | 100 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:sweet_berries | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:mossy_cobblestone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/block/mushroom | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/the_end

`java_mod/data/chunklock/loot_table/biome/the_end.json`

Selects biome-specific unlock requirements; 1 pools, 6 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:end_stone | 10 | [{"function":"set_count","count":{"min":2,"max":16}}] | {} |
| 2 | item | minecraft:end_stone_bricks | 1 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 3 | item | minecraft:end_stone_brick_slab | 1 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 4 | item | minecraft:end_stone_brick_stairs | 1 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 5 | item | minecraft:end_stone_brick_wall | 1 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 6 | item | minecraft:ender_pearl | 10 | [{"function":"set_count","count":{"min":2,"max":8}}] | {} |

## chunklock:biome/warm_ocean

`java_mod/data/chunklock/loot_table/biome/warm_ocean.json`

Selects biome-specific unlock requirements; 1 pools, 4 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:sea_pickle | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:seagrass | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | loot_table | chunklock:generic/block/sand | 20 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/biome/ocean | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | item | minecraft:tropical_fish | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:pufferfish | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/warped_forest

`java_mod/data/chunklock/loot_table/biome/warped_forest.json`

Selects biome-specific unlock requirements; 1 pools, 4 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:twisting_vines | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/wood/warped | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:warped_fungus | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:ender_pearl | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/dimension/nether | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:warped_wart_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/structure/nether_fortress | 10 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/structure/bastion | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/windswept_forest

`java_mod/data/chunklock/loot_table/biome/windswept_forest.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/cobblestone | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/oak | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/spruce | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/ore/coal | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/ore/iron | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/windswept_gravelly_hills

`java_mod/data/chunklock/loot_table/biome/windswept_gravelly_hills.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/cobblestone | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/gravel | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/ore/coal | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/ore/iron | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/windswept_hills

`java_mod/data/chunklock/loot_table/biome/windswept_hills.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 8 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/cobblestone | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/oak | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/wood/spruce | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/entity/common_overworld_passive | 10 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/ore/coal | 10 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/ore/iron | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/windswept_savanna

`java_mod/data/chunklock/loot_table/biome/windswept_savanna.json`

Selects biome-specific unlock requirements; 1 pools, 0 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 50 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/cobblestone | 50 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/stone | 50 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/wood/acacia | 20 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/wood/oak | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/dimension/overworld | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:biome/wooded_badlands

`java_mod/data/chunklock/loot_table/biome/wooded_badlands.json`

Selects biome-specific unlock requirements; 1 pools, 2 item entries, 6 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/red_sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:cactus | 40 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:coarse_dirt | 25 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/block/terracotta | 100 | [{"function":"minecraft:set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/wood/oak | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | loot_table | chunklock:generic/ore/gold | 10 | [{"function":"minecraft:set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/entity/common_overworld_hostile | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/dimension/overworld | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/activity/fishing

`java_mod/data/chunklock/loot_table/generic/activity/fishing.json`

Reusable weighted item group; 1 pools, 8 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:cod | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:salmon | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:fishing_rod | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:tropical_fish | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:pufferfish | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:nautilus_shell | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:name_tag | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:saddle | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/biome/desert

`java_mod/data/chunklock/loot_table/generic/biome/desert.json`

Reusable weighted item group; 1 pools, 2 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/sand | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:cactus | 30 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stick | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/structure/desert_temple | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/biome/ocean

`java_mod/data/chunklock/loot_table/generic/biome/ocean.json`

Reusable weighted item group; 1 pools, 1 item entries, 4 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/activity/fishing | 250 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/kelp | 20 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/structure/shipwreck | 10 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/structure/ocean_monument | 5 | [{"function":"set_count","count":1}] | {} |
| 5 | item | minecraft:water_bucket | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/andesite

`java_mod/data/chunklock/loot_table/generic/block/andesite.json`

Reusable weighted item group; 1 pools, 7 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:andesite | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:andesite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:andesite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:andesite_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:polished_andesite | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:polished_andesite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:polished_andesite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/basalt

`java_mod/data/chunklock/loot_table/generic/block/basalt.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:basalt | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:polished_basalt | 30 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:smooth_basalt | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/blackstone

`java_mod/data/chunklock/loot_table/generic/block/blackstone.json`

Reusable weighted item group; 1 pools, 16 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:blackstone | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:furnace | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:blackstone_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:blackstone_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:polished_blackstone_brick_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:polished_blackstone_brick_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:polished_blackstone_brick_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:polished_blackstone_bricks | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:polished_blackstone_button | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:polished_blackstone_pressure_plate | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:polished_blackstone_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:polished_blackstone_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:polished_blackstone_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:cracked_polished_blackstone_bricks | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:chiseled_polished_blackstone | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:gilded_blackstone | 1 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/bone

`java_mod/data/chunklock/loot_table/generic/block/bone.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:bone | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:bone_meal | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":8}}] | {} |
| 3 | item | minecraft:bone_block | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/brick

`java_mod/data/chunklock/loot_table/generic/block/brick.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:brick | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:bricks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:brick_wall | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:brick_slab | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:brick_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/candle

`java_mod/data/chunklock/loot_table/generic/block/candle.json`

Reusable weighted item group; 1 pools, 15 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:candle | 500 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:red_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:blue_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:cyan_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:gray_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:lime_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:pink_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:black_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:brown_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:green_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:white_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:orange_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:purple_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:yellow_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:magenta_candle | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/clay

`java_mod/data/chunklock/loot_table/generic/block/clay.json`

Reusable weighted item group; 1 pools, 3 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:clay_ball | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:clay | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:terracotta | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | loot_table | chunklock:generic/block/brick | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/block/cobblestone

`java_mod/data/chunklock/loot_table/generic/block/cobblestone.json`

Reusable weighted item group; 1 pools, 9 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:cobblestone | 1000 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:furnace | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:cobblestone_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:cobblestone_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:cobblestone_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:mossy_cobblestone | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:mossy_cobblestone_slab | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:mossy_cobblestone_stairs | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:mossy_cobblestone_wall | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/concrete

`java_mod/data/chunklock/loot_table/generic/block/concrete.json`

Reusable weighted item group; 1 pools, 28 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:red_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:blue_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:cyan_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:gray_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:lime_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:pink_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:black_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:brown_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:green_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:white_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:orange_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:purple_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:yellow_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:magenta_concrete_powder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:red_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:blue_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 17 | item | minecraft:cyan_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:gray_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 19 | item | minecraft:lime_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 20 | item | minecraft:pink_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 21 | item | minecraft:black_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 22 | item | minecraft:brown_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 23 | item | minecraft:green_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 24 | item | minecraft:white_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 25 | item | minecraft:orange_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 26 | item | minecraft:purple_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 27 | item | minecraft:yellow_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 28 | item | minecraft:magenta_concrete | 25 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/coral

`java_mod/data/chunklock/loot_table/generic/block/coral.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dead_fire_coral_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:dead_brain_coral_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:dead_bubble_coral_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:dead_horn_coral_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:dead_tube_coral_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/deepslate

`java_mod/data/chunklock/loot_table/generic/block/deepslate.json`

Reusable weighted item group; 1 pools, 16 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:cobbled_deepslate | 1000 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:deepslate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:deepslate_bricks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:deepslate_brick_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:deepslate_brick_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:deepslate_brick_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:deepslate_tiles | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:deepslate_tile_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:deepslate_tile_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:deepslate_tile_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:cracked_deepslate_bricks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:cracked_deepslate_tiles | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:deepslate | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:cobbled_deepslate_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:cobbled_deepslate_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:cobbled_deepslate_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/diorite

`java_mod/data/chunklock/loot_table/generic/block/diorite.json`

Reusable weighted item group; 1 pools, 7 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:diorite | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:diorite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:diorite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:diorite_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:polished_diorite | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:polished_diorite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:polished_diorite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/dirt

`java_mod/data/chunklock/loot_table/generic/block/dirt.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dirt | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:coarse_dirt | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/end_stone

`java_mod/data/chunklock/loot_table/generic/block/end_stone.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:end_stone | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:end_stone_bricks | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:end_stone_brick_slab | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:end_stone_brick_stairs | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:end_stone_brick_wall | 30 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/glass

`java_mod/data/chunklock/loot_table/generic/block/glass.json`

Reusable weighted item group; 1 pools, 31 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:glass | 1000 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:glass_pane | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:glass_bottle | 1000 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:red_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:blue_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:cyan_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:gray_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:lime_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:pink_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:black_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:brown_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:green_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:white_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:orange_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:purple_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:yellow_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 17 | item | minecraft:magenta_stained_glass | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:red_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 19 | item | minecraft:blue_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 20 | item | minecraft:cyan_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 21 | item | minecraft:gray_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 22 | item | minecraft:lime_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 23 | item | minecraft:pink_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 24 | item | minecraft:black_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 25 | item | minecraft:brown_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 26 | item | minecraft:green_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 27 | item | minecraft:white_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 28 | item | minecraft:orange_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 29 | item | minecraft:purple_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 30 | item | minecraft:yellow_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 31 | item | minecraft:magenta_stained_glass_pane | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/glowstone

`java_mod/data/chunklock/loot_table/generic/block/glowstone.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:glowstone | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:glowstone_dust | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/granite

`java_mod/data/chunklock/loot_table/generic/block/granite.json`

Reusable weighted item group; 1 pools, 7 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:granite | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:granite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:granite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:granite_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:polished_granite | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:polished_granite_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:polished_granite_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/gravel

`java_mod/data/chunklock/loot_table/generic/block/gravel.json`

Reusable weighted item group; 1 pools, 2 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:gravel | 500 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:flint | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 3 | loot_table | chunklock:generic/block/concrete | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/block/ice

`java_mod/data/chunklock/loot_table/generic/block/ice.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:packed_ice | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:blue_ice | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/kelp

`java_mod/data/chunklock/loot_table/generic/block/kelp.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:kelp | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:dried_kelp | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:dried_kelp_block | 25 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/moss

`java_mod/data/chunklock/loot_table/generic/block/moss.json`

Reusable weighted item group; 1 pools, 4 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:moss_block | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:moss_carpet | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:azalea | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:flowering_azalea | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/mud

`java_mod/data/chunklock/loot_table/generic/block/mud.json`

Reusable weighted item group; 1 pools, 6 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:mud | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:mud_bricks | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:muddy_mangrove_roots | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:mud_brick_slab | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:mud_brick_stairs | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:mud_brick_wall | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/mushroom

`java_mod/data/chunklock/loot_table/generic/block/mushroom.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:red_mushroom | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:brown_mushroom | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:mushroom_stew | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/nether_brick

`java_mod/data/chunklock/loot_table/generic/block/nether_brick.json`

Reusable weighted item group; 1 pools, 8 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:nether_brick | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:nether_brick_fence | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:nether_brick_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:nether_brick_stairs | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:red_nether_bricks | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:red_nether_brick_slab | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:red_nether_brick_stairs | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:red_nether_brick_wall | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/prismarine

`java_mod/data/chunklock/loot_table/generic/block/prismarine.json`

Reusable weighted item group; 1 pools, 13 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:prismarine_shard | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:prismarine_crystals | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:prismarine | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:sea_lantern | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:prismarine_bricks | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:prismarine_brick_slab | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:prismarine_brick_stairs | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:prismarine_slab | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:prismarine_stairs | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:prismarine_wall | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:dark_prismarine | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:dark_prismarine_slab | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:dark_prismarine_slab | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/pumpkin

`java_mod/data/chunklock/loot_table/generic/block/pumpkin.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:pumpkin | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:pumpkin_seeds | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:carved_pumpkin | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:jack_o_lantern | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:pumpkin_pie | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/purpur

`java_mod/data/chunklock/loot_table/generic/block/purpur.json`

Reusable weighted item group; 1 pools, 4 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:purpur_block | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:purpur_pillar | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:purpur_slab | 100 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 4 | item | minecraft:purpur_stairs | 100 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |

## chunklock:generic/block/quartz

`java_mod/data/chunklock/loot_table/generic/block/quartz.json`

Reusable weighted item group; 1 pools, 12 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:quartz | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:quartz_block | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:quartz_bricks | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:quartz_pillar | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:quartz_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:quartz_stairs | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:smooth_quartz | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:smooth_quartz_slab | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:smooth_quartz_stairs | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:comparator | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:observer | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:daylight_detector | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/red_sand

`java_mod/data/chunklock/loot_table/generic/block/red_sand.json`

Reusable weighted item group; 1 pools, 11 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:red_sand | 300 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:red_sandstone | 200 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:red_sandstone_slab | 80 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:red_sandstone_stairs | 80 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:red_sandstone_wall | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:cut_red_sandstone_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:cut_red_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:chiseled_red_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:smooth_red_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:smooth_red_sandstone_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:smooth_red_sandstone_stairs | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/sand

`java_mod/data/chunklock/loot_table/generic/block/sand.json`

Reusable weighted item group; 1 pools, 11 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:sand | 300 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:sandstone | 200 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:sandstone_slab | 80 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:sandstone_stairs | 80 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:sandstone_wall | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:cut_sandstone_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:cut_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:chiseled_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:smooth_sandstone | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:smooth_sandstone_slab | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:smooth_sandstone_stairs | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | loot_table | chunklock:generic/block/glass | 10 | [{"function":"set_count","count":1}] | {} |
| 13 | loot_table | chunklock:generic/block/concrete | 5 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/block/sculk

`java_mod/data/chunklock/loot_table/generic/block/sculk.json`

Reusable weighted item group; 1 pools, 4 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:sculk | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:sculk_vein | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:sculk_catalyst | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:sculk_shrieker | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/slime

`java_mod/data/chunklock/loot_table/generic/block/slime.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:slime_ball | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:slime_block | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:sticky_piston | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/snow

`java_mod/data/chunklock/loot_table/generic/block/snow.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:snowball | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:snow_block | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/block/soul_sand

`java_mod/data/chunklock/loot_table/generic/block/soul_sand.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:soul_sand | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:soul_soil | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:soul_torch | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:soul_campfire | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:soul_lantern | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/stone

`java_mod/data/chunklock/loot_table/generic/block/stone.json`

Reusable weighted item group; 1 pools, 15 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:stone | 1000 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:stone_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stone_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:smooth_stone | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:smooth_stone_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:stone_bricks | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:stone_brick_slab | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:stone_brick_stairs | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:stone_brick_wall | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:cracked_stone_bricks | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:chiseled_stone_bricks | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:mossy_stone_bricks | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:mossy_stone_brick_slab | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:mossy_stone_brick_stairs | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:mossy_stone_brick_wall | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/terracotta

`java_mod/data/chunklock/loot_table/generic/block/terracotta.json`

Reusable weighted item group; 1 pools, 29 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:terracotta | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:red_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:blue_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:cyan_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:gray_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:lime_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:pink_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:black_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:brown_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:green_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:white_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:orange_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:purple_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:yellow_terracotta | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:magenta_terracotta | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:red_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:blue_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 18 | item | minecraft:cyan_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 19 | item | minecraft:gray_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 20 | item | minecraft:lime_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 21 | item | minecraft:pink_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 22 | item | minecraft:black_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 23 | item | minecraft:brown_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 24 | item | minecraft:green_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 25 | item | minecraft:white_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 26 | item | minecraft:orange_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 27 | item | minecraft:purple_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 28 | item | minecraft:yellow_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 29 | item | minecraft:magenta_glazed_terracotta | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/block/tnt

`java_mod/data/chunklock/loot_table/generic/block/tnt.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:tnt | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:tnt_minecart | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/dimension/nether

`java_mod/data/chunklock/loot_table/generic/dimension/nether.json`

Reusable weighted item group; 1 pools, 3 item entries, 7 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:netherrack | 1000 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 2 | loot_table | chunklock:generic/block/nether_brick | 500 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/quartz | 100 | [{"function":"set_count","count":1}] | {} |
| 4 | item | minecraft:gravel | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/ore/gold | 25 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/block/glowstone | 25 | [{"function":"set_count","count":1}] | {} |
| 7 | item | minecraft:lava_bucket | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | loot_table | chunklock:generic/ore/netherite | 5 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/rare/rare | 5 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/rare/ultra_rare | 1 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/dimension/overworld

`java_mod/data/chunklock/loot_table/generic/dimension/overworld.json`

Reusable weighted item group; 1 pools, 0 item entries, 15 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/dirt | 500 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/block/cobblestone | 300 | [{"function":"set_count","count":1}] | {} |
| 3 | loot_table | chunklock:generic/block/andesite | 100 | [{"function":"set_count","count":1}] | {} |
| 4 | loot_table | chunklock:generic/block/deepslate | 50 | [{"function":"set_count","count":1}] | {} |
| 5 | loot_table | chunklock:generic/block/diorite | 100 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/block/granite | 100 | [{"function":"set_count","count":1}] | {} |
| 7 | loot_table | chunklock:generic/block/stone | 100 | [{"function":"set_count","count":1}] | {} |
| 8 | loot_table | chunklock:generic/plant/sugarcane | 25 | [{"function":"set_count","count":1}] | {} |
| 9 | loot_table | chunklock:generic/ore/iron | 15 | [{"function":"set_count","count":1}] | {} |
| 10 | loot_table | chunklock:generic/ore/coal | 15 | [{"function":"set_count","count":1}] | {} |
| 11 | loot_table | chunklock:generic/ore/redstone | 15 | [{"function":"set_count","count":1}] | {} |
| 12 | loot_table | chunklock:generic/ore/lapis | 15 | [{"function":"set_count","count":1}] | {} |
| 13 | loot_table | chunklock:generic/structure/geode | 5 | [{"function":"set_count","count":1}] | {} |
| 14 | loot_table | chunklock:generic/rare/rare | 5 | [{"function":"set_count","count":1}] | {} |
| 15 | loot_table | chunklock:generic/rare/ultra_rare | 1 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/dimension/the_end

`java_mod/data/chunklock/loot_table/generic/dimension/the_end.json`

Reusable weighted item group; 1 pools, 3 item entries, 3 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/end_stone | 1000 | [{"function":"minecraft:set_count","count":1}] | {} |
| 2 | item | minecraft:ender_pearl | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:obsidian | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:end_crystal | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/rare/rare | 5 | [{"function":"set_count","count":1}] | {} |
| 6 | loot_table | chunklock:generic/rare/ultra_rare | 1 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/entity/bee

`java_mod/data/chunklock/loot_table/generic/entity/bee.json`

Reusable weighted item group; 1 pools, 5 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:honeycomb | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:honeycomb_block | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:honey_bottle | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:honey_block | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | loot_table | chunklock:generic/block/candle | 10 | [{"function":"minecraft:set_count","count":1}] | {} |
| 6 | item | minecraft:beehive | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/cod

`java_mod/data/chunklock/loot_table/generic/entity/cod.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:cod | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:cooked_cod | 30 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:bone | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:bone_meal | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:cod_bucket | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/common_overworld_hostile

`java_mod/data/chunklock/loot_table/generic/entity/common_overworld_hostile.json`

Reusable weighted item group; 1 pools, 8 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:gunpowder | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:bone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:bone_meal | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:arrow | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:rotten_flesh | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:string | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:spider_eye | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:ender_pearl | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/entity/common_overworld_passive

`java_mod/data/chunklock/loot_table/generic/entity/common_overworld_passive.json`

Reusable weighted item group; 1 pools, 6 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:chicken | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:cooked_chicken | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:beef | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:cooked_beef | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/entity/sheep | 100 | [{"function":"set_count","count":1}] | {} |
| 6 | item | minecraft:porkchop | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:cooked_porkchop | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/entity/ghast

`java_mod/data/chunklock/loot_table/generic/entity/ghast.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:gunpowder | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:ghast_tear | 30 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/glow_squid

`java_mod/data/chunklock/loot_table/generic/entity/glow_squid.json`

Reusable weighted item group; 1 pools, 1 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:glow_ink_sac | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/entity/rabbit

`java_mod/data/chunklock/loot_table/generic/entity/rabbit.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:rabbit_hide | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:rabbit | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:cooked_rabbit | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:rabbit_stew | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:rabbit_foot | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/salmon

`java_mod/data/chunklock/loot_table/generic/entity/salmon.json`

Reusable weighted item group; 1 pools, 5 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:salmon | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:cooked_salmon | 30 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:bone | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:bone_meal | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:salmon_bucket | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/sheep

`java_mod/data/chunklock/loot_table/generic/entity/sheep.json`

Reusable weighted item group; 1 pools, 52 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:white_wool | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:mutton | 250 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:cooked_mutton | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:white_bed | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:white_banner | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:white_carpet | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:painting | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:orange_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:orange_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:orange_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:magenta_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:magenta_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:magenta_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:light_blue_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:light_blue_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:light_blue_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:yellow_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:yellow_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 19 | item | minecraft:yellow_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 20 | item | minecraft:lime_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 21 | item | minecraft:lime_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 22 | item | minecraft:lime_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 23 | item | minecraft:pink_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 24 | item | minecraft:pink_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 25 | item | minecraft:pink_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 26 | item | minecraft:gray_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 27 | item | minecraft:gray_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 28 | item | minecraft:gray_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 29 | item | minecraft:light_gray_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 30 | item | minecraft:light_gray_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 31 | item | minecraft:light_gray_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 32 | item | minecraft:cyan_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 33 | item | minecraft:cyan_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 34 | item | minecraft:cyan_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 35 | item | minecraft:purple_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 36 | item | minecraft:purple_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 37 | item | minecraft:purple_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 38 | item | minecraft:blue_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 39 | item | minecraft:blue_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 40 | item | minecraft:blue_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 41 | item | minecraft:brown_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 42 | item | minecraft:brown_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 43 | item | minecraft:brown_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 44 | item | minecraft:green_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 45 | item | minecraft:green_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 46 | item | minecraft:green_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 47 | item | minecraft:red_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 48 | item | minecraft:red_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 49 | item | minecraft:red_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 50 | item | minecraft:black_bed | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 51 | item | minecraft:black_banner | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 52 | item | minecraft:black_carpet | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/entity/shulker

`java_mod/data/chunklock/loot_table/generic/entity/shulker.json`

Reusable weighted item group; 1 pools, 18 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:shulker_shell | 250 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:shulker_box | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:red_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:blue_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:cyan_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:gray_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:lime_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:pink_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:black_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:brown_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:green_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:white_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:orange_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:purple_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:yellow_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:magenta_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 17 | item | minecraft:light_blue_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:light_gray_shulker_box | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/entity/squid

`java_mod/data/chunklock/loot_table/generic/entity/squid.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:ink_sac | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:black_dye | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/entity/witch

`java_mod/data/chunklock/loot_table/generic/entity/witch.json`

Reusable weighted item group; 1 pools, 7 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:stick | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:glass_bottle | 30 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:glowstone_dust | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:redstone | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:spider_eye | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:gunpowder | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:sugar | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/coal

`java_mod/data/chunklock/loot_table/generic/ore/coal.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:coal | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:coal_block | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/copper

`java_mod/data/chunklock/loot_table/generic/ore/copper.json`

Reusable weighted item group; 1 pools, 6 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:raw_copper | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:raw_copper_block | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:copper_ingot | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:copper_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:lightning_rod | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:spyglass | 2 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/ore/diamond

`java_mod/data/chunklock/loot_table/generic/ore/diamond.json`

Reusable weighted item group; 1 pools, 12 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:diamond | 250 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:diamond_axe | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:diamond_boots | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:diamond_chestplate | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:diamond_helmet | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:diamond_hoe | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:diamond_leggings | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:diamond_ore | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:diamond_pickaxe | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:diamond_shovel | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:diamond_sword | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:diamond_block | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/gold

`java_mod/data/chunklock/loot_table/generic/ore/gold.json`

Reusable weighted item group; 1 pools, 10 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:raw_gold | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:raw_gold_block | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:gold_ingot | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:gold_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:gold_nugget | 100 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 6 | item | minecraft:golden_boots | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:golden_chestplate | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:golden_helmet | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:golden_leggings | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:light_weighted_pressure_plate | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/ore/iron

`java_mod/data/chunklock/loot_table/generic/ore/iron.json`

Reusable weighted item group; 1 pools, 20 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:raw_iron | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:raw_iron_block | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:iron_ingot | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:iron_block | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:iron_nugget | 100 | [{"function":"set_count","count":{"min":1,"max":8}}] | {} |
| 6 | item | minecraft:lantern | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:iron_trapdoor | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:iron_boots | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:iron_chestplate | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:iron_helmet | 25 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:iron_leggings | 15 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:heavy_weighted_pressure_plate | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:piston | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:shears | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:tripwire_hook | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:minecart | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 17 | item | minecraft:blast_furnace | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:hopper | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 19 | item | minecraft:anvil | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 20 | item | minecraft:hopper_minecart | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/lapis

`java_mod/data/chunklock/loot_table/generic/ore/lapis.json`

Reusable weighted item group; 1 pools, 2 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:lapis_lazuli | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:lapis_block | 200 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/netherite

`java_mod/data/chunklock/loot_table/generic/ore/netherite.json`

Reusable weighted item group; 1 pools, 14 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:ancient_debris | 1000 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:netherite_scrap | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:netherite_ingot | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:lodestone | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:netherite_axe | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:netherite_boots | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:netherite_chestplate | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:netherite_helmet | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:netherite_hoe | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:netherite_leggings | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:netherite_pickaxe | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:netherite_shovel | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:netherite_sword | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:netherite_block | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/ore/redstone

`java_mod/data/chunklock/loot_table/generic/ore/redstone.json`

Reusable weighted item group; 1 pools, 9 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:redstone | 1000 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:redstone_torch | 500 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:repeater | 200 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:lever | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:redstone_block | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:note_block | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:target | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:dropper | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:compass | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/plant/sugarcane

`java_mod/data/chunklock/loot_table/generic/plant/sugarcane.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:sugar_cane | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:sugar | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:paper | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/plant/watermellon

`java_mod/data/chunklock/loot_table/generic/plant/watermellon.json`

Reusable weighted item group; 1 pools, 3 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:melon_slice | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:melon_seeds | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:glistering_melon_slice | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/rare/rare

`java_mod/data/chunklock/loot_table/generic/rare/rare.json`

Reusable weighted item group; 1 pools, 10 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:diamond | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:jukebox | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:emerald | 100 | [{"function":"set_count","count":{"min":4,"max":16}}] | {} |
| 4 | item | minecraft:golden_apple | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:creeper_head | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:skeleton_skull | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:echo_shard | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:crying_obsidian | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:respawn_anchor | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:enchanting_table | 1 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/rare/ultra_rare

`java_mod/data/chunklock/loot_table/generic/rare/ultra_rare.json`

Reusable weighted item group; 1 pools, 20 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:nether_star | 100 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 2 | item | minecraft:beacon | 50 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 3 | item | minecraft:enchanted_golden_apple | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:elytra | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:music_disc_11 | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:music_disc_13 | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:music_disc_5 | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:music_disc_blocks | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:music_disc_cat | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:music_disc_chirp | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:music_disc_far | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:music_disc_mall | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:music_disc_mellohi | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:music_disc_otherside | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 15 | item | minecraft:music_disc_pigstep | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 16 | item | minecraft:music_disc_relic | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 17 | item | minecraft:music_disc_stal | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 18 | item | minecraft:music_disc_strad | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 19 | item | minecraft:music_disc_wait | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 20 | item | minecraft:music_disc_ward | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/structure/abandoned_mineshaft

`java_mod/data/chunklock/loot_table/generic/structure/abandoned_mineshaft.json`

Reusable weighted item group; 1 pools, 22 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/oak | 10 | [{"function":"minecraft:set_count","count":1}] | {} |
| 2 | item | minecraft:rail | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:torch | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:name_tag | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:glow_berries | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:bread | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:golden_apple | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:coal | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:rail | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:beetroot_seeds | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:melon_seeds | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:pumpkin_seeds | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:iron_ingot | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:activator_rail | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:detector_rail | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:powered_rail | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:lapis_lazuli | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 18 | item | minecraft:redstone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 19 | item | minecraft:iron_ingot | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 20 | item | minecraft:gold_ingot | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 21 | item | minecraft:diamond | 20 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 22 | item | minecraft:iron_pickaxe | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 23 | item | minecraft:enchanted_golden_apple | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/structure/bastion

`java_mod/data/chunklock/loot_table/generic/structure/bastion.json`

Reusable weighted item group; 1 pools, 3 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/blackstone | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | loot_table | chunklock:generic/block/basalt | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:gold_ingot | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:nether_wart | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | loot_table | chunklock:generic/block/glowstone | 50 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:lantern | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | loot_table | chunklock:generic/block/quartz | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | loot_table | chunklock:generic/ore/netherite | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/structure/desert_temple

`java_mod/data/chunklock/loot_table/generic/structure/desert_temple.json`

Reusable weighted item group; 1 pools, 9 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:bone | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:gunpowder | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:spider_eye | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:saddle | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:golden_apple | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:gold_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:iron_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:emerald | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:diamond | 1 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | loot_table | chunklock:generic/block/tnt | 5 | [{"function":"minecraft:set_count","count":1}] | {} |

## chunklock:generic/structure/end_city

`java_mod/data/chunklock/loot_table/generic/structure/end_city.json`

Reusable weighted item group; 1 pools, 7 item entries, 2 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/purpur | 100 | [{"function":"minecraft:set_count","count":1}] | {} |
| 2 | item | minecraft:end_rod | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:gold_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:iron_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:beetroot_seeds | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:diamond | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:emerald | 3 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:saddle | 3 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | loot_table | chunklock:generic/entity/shulker | 5 | [{"function":"minecraft:set_count","count":1}] | {} |

## chunklock:generic/structure/geode

`java_mod/data/chunklock/loot_table/generic/structure/geode.json`

Reusable weighted item group; 1 pools, 4 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:amethyst_block | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:amethyst_shard | 100 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:calcite | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:smooth_basalt | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |

## chunklock:generic/structure/nether_fortress

`java_mod/data/chunklock/loot_table/generic/structure/nether_fortress.json`

Reusable weighted item group; 1 pools, 8 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/nether_brick | 500 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:blaze_rod | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:magma_cream | 20 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:gold_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:iron_ingot | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:obsidian | 5 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:diamond | 3 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:wither_skeleton_skull | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:saddle | 2 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/structure/ocean_monument

`java_mod/data/chunklock/loot_table/generic/structure/ocean_monument.json`

Reusable weighted item group; 1 pools, 1 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/block/prismarine | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | item | minecraft:sponge | 5 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |

## chunklock:generic/structure/shipwreck

`java_mod/data/chunklock/loot_table/generic/structure/shipwreck.json`

Reusable weighted item group; 1 pools, 6 item entries, 5 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | loot_table | chunklock:generic/wood/oak | 100 | [{"function":"set_count","count":1}] | {} |
| 2 | loot_table | chunklock:generic/wood/bamboo | 5 | [{"function":"set_count","count":1}] | {} |
| 3 | item | minecraft:wheat | 10 | [{"function":"set_count","count":{"min":1,"max":16}}] | {} |
| 4 | item | minecraft:carrot | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:potato | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:poisonous_potato | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 7 | loot_table | chunklock:generic/block/moss | 5 | [{"function":"set_count","count":1}] | {} |
| 8 | item | minecraft:coal | 10 | [{"function":"set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:poisonous_potato | 10 | [{"function":"set_count","count":{"min":1,"max":1}}] | {} |
| 10 | loot_table | chunklock:generic/block/pumpkin | 5 | [{"function":"set_count","count":1}] | {} |
| 11 | loot_table | chunklock:generic/block/tnt | 10 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/acacia

`java_mod/data/chunklock/loot_table/generic/wood/acacia.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:acacia_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:acacia_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_acacia_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:acacia_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_acacia_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:acacia_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:acacia_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:acacia_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:acacia_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:acacia_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:acacia_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:acacia_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:acacia_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:acacia_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:acacia_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:acacia_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:acacia_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/bamboo

`java_mod/data/chunklock/loot_table/generic/wood/bamboo.json`

Reusable weighted item group; 1 pools, 19 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:bamboo | 1000 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:bamboo_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_bamboo_block | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 4 | item | minecraft:bamboo_mosaic | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:bamboo_mosaic_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:bamboo_mosaic_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:bamboo_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:bamboo_raft | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:bamboo_chest_raft | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:bamboo_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:bamboo_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:bamboo_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:bamboo_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:bamboo_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:bamboo_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:bamboo_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:bamboo_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | item | minecraft:bamboo_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 19 | item | minecraft:scaffolding | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 20 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/birch

`java_mod/data/chunklock/loot_table/generic/wood/birch.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:birch_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:birch_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_birch_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:birch_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_birch_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:birch_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:birch_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:birch_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:birch_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:birch_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:birch_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:birch_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:birch_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:birch_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:birch_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:birch_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:birch_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/cherry

`java_mod/data/chunklock/loot_table/generic/wood/cherry.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:cherry_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:cherry_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_cherry_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:cherry_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_cherry_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:cherry_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:cherry_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:cherry_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:cherry_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:cherry_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:cherry_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:cherry_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:cherry_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:cherry_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:cherry_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:cherry_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:cherry_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/crimson

`java_mod/data/chunklock/loot_table/generic/wood/crimson.json`

Reusable weighted item group; 1 pools, 15 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:crimson_stem | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:shroomlight | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_crimson_stem | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:crimson_hyphae | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_crimson_hyphae | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:crimson_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:crimson_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:crimson_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:crimson_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:crimson_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:crimson_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:crimson_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:crimson_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:crimson_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:crimson_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/dark_oak

`java_mod/data/chunklock/loot_table/generic/wood/dark_oak.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:dark_oak_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:dark_oak_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_dark_oak_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:dark_oak_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_dark_oak_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:dark_oak_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:dark_oak_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:dark_oak_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:dark_oak_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:dark_oak_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:dark_oak_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:dark_oak_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:dark_oak_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:dark_oak_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:dark_oak_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:dark_oak_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:dark_oak_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/jungle

`java_mod/data/chunklock/loot_table/generic/wood/jungle.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:jungle_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:jungle_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_jungle_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:jungle_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_jungle_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:jungle_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:jungle_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:jungle_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:jungle_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:jungle_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:jungle_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:jungle_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:jungle_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:jungle_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:jungle_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:jungle_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:jungle_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/mangrove

`java_mod/data/chunklock/loot_table/generic/wood/mangrove.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:mangrove_propagule | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:mangrove_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_mangrove_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:mangrove_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_mangrove_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:mangrove_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:mangrove_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:mangrove_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:mangrove_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:mangrove_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:mangrove_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:mangrove_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:mangrove_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:mangrove_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:mangrove_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:mangrove_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:mangrove_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/oak

`java_mod/data/chunklock/loot_table/generic/wood/oak.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:oak_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:oak_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_oak_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:oak_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_oak_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:oak_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:oak_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:oak_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:oak_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:oak_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:oak_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:oak_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:oak_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:oak_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:oak_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:oak_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:oak_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/spruce

`java_mod/data/chunklock/loot_table/generic/wood/spruce.json`

Reusable weighted item group; 1 pools, 17 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:spruce_sapling | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:spruce_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_spruce_log | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:spruce_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_spruce_wood | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:spruce_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:spruce_boat | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:spruce_chest_boat | 5 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:spruce_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:spruce_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:spruce_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:spruce_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:spruce_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:spruce_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:spruce_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | item | minecraft:spruce_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 17 | item | minecraft:spruce_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 18 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/warped

`java_mod/data/chunklock/loot_table/generic/wood/warped.json`

Reusable weighted item group; 1 pools, 15 item entries, 1 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:warped_stem | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 2 | item | minecraft:shroomlight | 10 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:stripped_warped_stem | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:warped_hyphae | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 5 | item | minecraft:stripped_warped_hyphae | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 6 | item | minecraft:warped_planks | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 7 | item | minecraft:warped_sign | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 8 | item | minecraft:warped_door | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 9 | item | minecraft:warped_fence | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 10 | item | minecraft:warped_slab | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 11 | item | minecraft:warped_stairs | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 12 | item | minecraft:warped_button | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 13 | item | minecraft:warped_pressure_plate | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 14 | item | minecraft:warped_trapdoor | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 15 | item | minecraft:warped_hanging_sign | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 16 | loot_table | chunklock:generic/wood/wood_misc | 20 | [{"function":"set_count","count":1}] | {} |

## chunklock:generic/wood/wood_misc

`java_mod/data/chunklock/loot_table/generic/wood/wood_misc.json`

Reusable weighted item group; 1 pools, 14 item entries, 0 table entries

Pool 1: `{"rolls":1}`

| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |
| --- | --- | --- | --- | --- | --- |
| 1 | item | minecraft:stick | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":8}}] | {} |
| 2 | item | minecraft:barrel | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 3 | item | minecraft:chest | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 4 | item | minecraft:bowl | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 5 | item | minecraft:crafting_table | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":2}}] | {} |
| 6 | item | minecraft:wooden_axe | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 7 | item | minecraft:wooden_hoe | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 8 | item | minecraft:wooden_pickaxe | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 9 | item | minecraft:wooden_shovel | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 10 | item | minecraft:wooden_sword | 100 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 11 | item | minecraft:composter | 50 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 12 | item | minecraft:campfire | 25 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 13 | item | minecraft:smoker | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
| 14 | item | minecraft:charcoal | 20 | [{"function":"minecraft:set_count","count":{"min":1,"max":1}}] | {} |
