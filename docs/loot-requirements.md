# Chunk Requirement Data and Loot Rolling

This document describes Milestone 1 of the Bedrock port: compile the local Java loot tables into a TypeScript data module, roll a locked chunk's item requirement, apply the Java cost formula, and persist the result. It does not implement requirement displays, payment handling, or chunk unlocking.

## Implementation status

The source-table compiler ([`tools/build_loot_tables.py`](../tools/build_loot_tables.py)), generated TypeScript data ([`scripts/loot-tables-data.ts`](../scripts/loot-tables-data.ts)), nested weighted roller, biome/item resolvers and Java cost formula ([`scripts/loot.ts`](../scripts/loot.ts)) are implemented. Locked-cell persistence and bounded nearby-scan integration are implemented in [`scripts/requirements.ts`](../scripts/requirements.ts) and [`scripts/chunks.ts`](../scripts/chunks.ts). The generated module contains all 151 custom tables and is checked against the local reference with `python tools/build_loot_tables.py --check`.

## Java source behavior

The local snapshot contains 151 custom loot tables: 64 biome tables (including `all_biome`) and 87 generic tables. The tables contain item entries, nested loot-table entries, integer weights, and `set_count` functions. The current snapshot has one pool and one roll per table, no loot conditions, and no functions other than `set_count`. The compiler validates those assumptions and fails if the source grows beyond the supported subset.

The source also references the vanilla table `minecraft:blocks/gravel`, which is outside the local 151 files. The Bedrock adapter models it as one pool with gravel weight 9 and flint weight 1. Parent `set_count` functions still apply after the nested result, matching the source table flow.

`init_locked_chunk_unlock_item` stores the selected stack count as the base cost and scales it once when the locked chunk is initialized. Difficulty defaults to Normal (2). Easy uses the base count, Normal multiplies by `floor(U / step) + 1`, Hard multiplies that result by 4, and Impossible multiplies it by 16. `step` is 16 for Overworld/Nether and 32 for The End. `U` is the dimension's credited unlock total; the initial starting chunk does not pass through the credited unlock path and is not counted.

## Bedrock state and generation

`scripts/loot-tables-data.ts` is generated from the external source directory by `tools/build_loot_tables.py`. The Java directory remains outside Git. Generated entries preserve pool boundaries, weights, nested table references, and ordered count functions.

Each locked chunk stores a JSON value at `chunklock:req:<dimensionId>:<cx>:<cz>`:

```ts
type ChunkRequirement = {
  schemaVersion: 1;
  state: "locked";
  biomeId: string;
  tableId: string;
  sourceItemId: string;
  itemId: string;
  baseCount: number;
  remainingCost: number;
  difficulty: 1 | 2 | 3 | 4;
};
```

`sourceItemId` records the Java table result. `itemId` is the Bedrock item ID after `ITEM_ID_MAP` and runtime `ItemTypes.get` validation. An unsupported item falls back to `minecraft:stone` while preserving its original ID for diagnosis. The open-cell property remains the authority for access; this milestone does not change it.

Biome selection queries `Dimension.getBiome` at the chunk center and the same fixed lookup height used by the Java reference: Y=128 in Overworld and Y=64 in Nether/The End. Directly matching Java biome names select their table; explicit legacy aliases map older Bedrock IDs to current Java table keys. Unknown IDs use `all_biome`, the same fallback table used by the Java roll function. If the biome location is unavailable or unloaded, no requirement is saved and the nearby scan retries later.

Requirements are initialized only for cells with a chunk record that are not open. Existing locked records without a requirement are backfilled. Work is bounded per interval so opening or re-entering a world does not roll every recorded chunk at once.

The stable Script API version is pinned to 2.6.0. The item resolver uses [`ItemTypes.get`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemtypes?view=minecraft-bedrock-stable); the persistence integration will use [`Dimension.getBiome`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/dimension?view=minecraft-bedrock-stable).

## Parity boundary

The table graph, integer weights, nested selection steps, count ranges, and scaling formulas can be reproduced for the current source. The Java roll function checks `deep_frozen_ocean` twice, replacing its first random result with a second roll; Bedrock resolves that biome to one table and rolls once, as intended by the approved design. Bedrock biome IDs do not always identify the same regions as Java, and some Java items may not exist in Bedrock. Biome aliases and the explicit item fallback make the system usable, but those cases prevent a claim of identical outcomes for every world and every item.

## Follow-up: requirement displays and direct-hand payment

The next presentation/payment milestone uses a `chunklock:requirement_display` entity on each eligible side of a locked chunk. It appears only when that side borders an open chunk and a player is within 24 blocks. The display sits at the side midpoint and follows the nearest player's eye height. Its compact 0.8 by 0.9 block collision box keeps the interaction target near the item icon instead of blocking the whole border. It holds the required item in its main hand and shows the item name and remaining quantity in its name tag. It must be protected from all damage like the border wall.

Payment uses `world.beforeEvents.playerInteractWithEntity` on that display. The handler cancels the normal interaction and schedules inventory mutation with `system.run`, then reads `event.player`'s main-hand equipment. A five-tick per-player debounce prevents repeated processing. An empty hand reports the current requirement; a wrong item is not consumed and produces feedback; a matching item pays `min(stack amount, remaining cost)`. In non-Creative play, only the paid count is removed and any excess stays in the player's hand. A held barrier is a non-consuming test shortcut. Partial payments update the saved requirement and displayed count; a completed payment unlocks the chunk and credits the clicking player.

This design attributes payment directly to the player who clicked. Future implementation must verify all event, cancellation, inventory and entity-component calls against the pinned stable API 2.6.0. The current milestone does not implement the display entity, payment interaction, price mutation or chunk unlocking.
