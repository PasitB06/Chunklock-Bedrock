# Chunk Requirement Data and Loot Rolling

This document describes the Bedrock chunk requirement flow: compile the local Java loot tables into a TypeScript data module, roll and persist a locked chunk's requirement, show it beside an open border, and accept payment by clicking its display.

## Implementation status

The source-table compiler ([`tools/build_loot_tables.py`](../tools/build_loot_tables.py)), generated TypeScript data ([`scripts/loot-tables-data.ts`](../scripts/loot-tables-data.ts)), nested weighted roller, biome/item resolvers and Java cost formula ([`scripts/loot.ts`](../scripts/loot.ts)) are implemented. Locked-cell persistence and bounded nearby-scan integration are implemented in [`scripts/requirements.ts`](../scripts/requirements.ts) and [`scripts/chunks.ts`](../scripts/chunks.ts). Milestone 2 adds nearby requirement displays through [`scripts/displays.ts`](../scripts/displays.ts) and the custom `chunklock:requirement_display` entity. Milestone 3 scans and deducts payment across the clicking player's inventory and offhand, then records idempotent unlocks and world/payer progress in [`scripts/payment.ts`](../scripts/payment.ts) and [`scripts/access.ts`](../scripts/access.ts). Script and pack validation has passed; visual rendering and click targeting still need Minecraft gameplay verification. The generated module contains all 151 custom tables and is checked against the local reference with `python tools/build_loot_tables.py --check`.

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

## Milestone 2: Nearby requirement displays

The Bedrock display manager uses the same cardinal edge calculation as the border walls. It creates one `chunklock:requirement_display` only when an open cell borders a locked cell with saved requirement data and a player is within 24 blocks. The helper is placed just inside the open cell at the side midpoint, and its vertical position follows the nearest player's head height. A compact 0.8 by 0.9 block hitbox puts the click target by the item icon without covering the full 16-block border. It holds the required item in its main hand and shows the item name and remaining quantity in its always-visible name tag. The helper is damage-proof, has no gravity or physical collision, and is removed when it is no longer relevant.

These helpers are presentation and input targets only; the saved requirement and open-cell data remain authoritative. The border wall manager and requirement display manager refresh every ten ticks, reuse matching loaded entities, remove duplicates, and cap entity counts and spawn work.

## Milestone 3: Whole-inventory payment and unlocks — implemented

Payment uses [`PlayerInteractWithEntityBeforeEvent`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithentitybeforeevent?view=minecraft-bedrock-stable) on the requirement display. The handler cancels the normal interaction immediately, applies a five-tick per-player debounce, and schedules gameplay mutations with `system.run` because the before-event runs in restricted execution. The clicking player is the payer. The script checks for the non-consuming `minecraft:barrier` shortcut in the selected hotbar slot first. Otherwise, it reads the player's [`EntityInventoryComponent`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityinventorycomponent?view=minecraft-bedrock-stable), checks the selected hotbar slot first, scans each remaining slot in the 36-slot player container, and checks the offhand through [`EntityEquippableComponent`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityequippablecomponent?view=minecraft-bedrock-stable). Matching stacks are totaled, then exactly `min(total matching items, remaining cost)` is removed across slots in that order. Items beyond the cost remain in their original slots. If no matching item exists, the inventory is unchanged and the required type/count are reported with warning feedback. Payment consumes items in all game modes.

Partial payments persist the lower remaining cost and refresh the visible count. A completed payment opens the locked chunk once, clears its requirement, refreshes adjacent walls and displays, and increments world and payer totals by dimension and overall. This replaces Java's dropped-item entity and `Thrower` UUID path with direct `event.player` attribution, and replaces Java's surviving dropped-stack overflow with the exact excess left in inventory. Inventory slot changes are rolled back if a write or unlock-progress update fails. Automated tests cover empty/wrong inventory, selected-slot priority, partial payment across slots, payment over 64 items, offhand, excess preservation, the barrier shortcut, debounce, duplicate unlocks and rollback after inventory or progress writes fail. Minecraft gameplay verification is still pending.
