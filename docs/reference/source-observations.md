# Source observations and limitations

These are static-source findings, not Java source changes or proof that every suspected issue occurs in a running game.
Use them when implementing Bedrock and record deliberate departures from the reference.
Source locators are under the external `java_mod/data/chunklock` directory.

## Directly observable discrepancies

| Topic | Source locator | Implication |
| --- | --- | --- |
| Hard UI says twice as fast; commands multiply by four | `function/utils/render_chunk_difficulty_message.mcfunction`; `function/chunk_init/init_locked_chunk_unlock_item.mcfunction` | Describe the executable formula; identify any balancing change explicitly |
| Comment says 16 Overworld interactions; commands summon 17 | `function/chunk_proximity/on_chunk_become_relevant.mcfunction` | Sixteen positions from -64 through 176, plus Y=192; do not size budgets from the comment alone |
| deep_frozen_ocean selection appears twice | `function/chunk_items/roll_chunk_unlock_item.mcfunction` | A matching biome rerolls and overwrites the first result; do not reproduce the duplicate without explaining it |
| Coal advancement has no grant in the unlock path | `advancement/main/chunk_item_coal.json`; `function/utils/unlock_current_chunk.mcfunction` | Its criterion is impossible; decide explicitly whether the Bedrock equivalent should receive a grant |
| Some resources have no incoming reference in this snapshot | [Source index](source-index.json) | `generic/block/coral`, `generic/ore/diamond` and `is_looking_at_locked_chunk` are not statically referenced; diamond can still appear in other entries |
| The looking-at predicate does not check a locked tag | `predicate/is_looking_at_locked_chunk.json` | It tests an interaction entity within distance 0-15; its name does not prove locked-state filtering |
| Uninstall does not remove all objectives/tags | `function/utils/uninstall.mcfunction`; `function/load.mcfunction` | It removes selected progress/difficulty state and entities visible to its selector context, not every state value or unloaded area |
| Reset assumes the datapack name file/chunklock | `function/utils/reset.mcfunction`; `function/utils/uninstall.mcfunction` | The supplied directory is named java_mod; verify Java installation before using reset and do not port this path into Bedrock |

## Cases requiring runtime verification

- **Bedrock requirement-display adaptation:** Java creates `item_display` and `text_display` entities, plus interaction helpers, in `chunk_items/render_chunk_items` and side-specific check functions. The Bedrock port uses one custom `chunklock:requirement_display` entity with a held item, a name tag and a compact click target. This avoids Java-only display entity types and passengers; verify attachable rendering and hitbox targeting in Minecraft.
- **Bedrock payment adaptation:** Java processes player-thrown item entities, compares each stack with the nearest locked chunk's requirement and uses the `Thrower` UUID to credit the player who submitted it. The Bedrock implementation instead uses the stable player/entity interaction event, prioritizes the selected hotbar slot, then scans the player's 36-slot inventory and offhand. It consumes matching items across slots up to the remaining cost and keeps excess in place. The player's identity comes directly from the click event, and Java's dropped-item return behavior does not apply to this click path.

- **Dimensions:** tick root does not explicitly iterate dimensions for every selector group. Test marker, proximity,
  interaction and cleanup behavior in Nether and End; a few `if dimension` branches do not prove complete coverage.
- **Multiple players:** `dimension/on_change_dimension` tags `@p` but revokes the advancement from `@s`.
  Other paths combine nearest-entity selectors with temporary tags. Verify that ownership never crosses players.
- **Shared context:** `tick_player` adds `currentPlayer` before collision. Some collision paths remove it internally,
  while owner-matched projectile processing follows afterward. Check nested calls and early returns.
- **Payments near borders:** payment chooses the nearest locked marker rather than a direct item-coordinate lookup.
  Test neighboring locked chunks and simultaneous stacks so deductions and returns happen once on the intended target.
- **Fast projectiles:** the source TODO notes that a projectile can penetrate between checks and hit an End Crystal.
  Position polling alone is not proof of complete collision prevention.
- **Players at different heights:** a source TODO notes the limitations of one shared item display per side/chunk.
  Test players at different Y coordinates rather than using a single-player screenshot as multiplayer evidence.
- **Repeated triggers:** triggers are enabled during player initialization and scores reset after processing.
  Verify repeat use and permissions; a clickable command is not evidence that every player can always execute it.
- **Initial counters:** some global progress scores are not explicitly zeroed in load.
  Check initial requirements and difficulty selection before and after the first credited unlock.
- **Rejoin/reload and chunk unload/reload:** verify stable costs, safe positions, rendered tags and ownership without duplicates.
- **Missing safe-position marker:** test dimension transitions, respawn and leaving Spectator inside a locked chunk.
  The source already notes that returning to a previous safe location may be unsuitable in this situation.

The documentation checks validate JSON structure, file coverage and extracted resource targets.
They do not include a Java gameplay validation run.
