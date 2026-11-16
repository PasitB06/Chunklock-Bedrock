# Flat requirement icon plaques

Status: approved by the user on 2026-11-16.

## Intended result

Replace held-item rendering on requirement displays with one centered, vertical square parallel to the chunk wall. Keep the existing two-line item name and remaining cost above it. Preserve display proximity, cardinal placement, click-to-pay behavior, persistent requirements and multiplayer payer ownership.

The plaque is a flat icon, not a 3D inventory model. Blocks use a representative face texture, including stairs and fences. Flowers and ordinary items use their available carried/item textures. Unknown or newly added items use a visibly distinct fallback while retaining their correct item name and cost.

## Implementation design

- Build an explicit item-to-texture catalog from the 782 distinct item IDs in the current compiled loot tables, plus supported Bedrock aliases and the stone/flint fallback results. Review unresolved mappings rather than silently assigning unrelated textures.
- Reference Vanilla resource paths from Mojang's Bedrock sample metadata. Do not copy the full Vanilla pack, Java source or Minecraft texture images into Git. Record the metadata source revision and rebuild instructions.
- Give the display a client-synchronized integer icon index. Generate the TypeScript catalog and Resource Pack texture array together so their ordering cannot drift.
- Render a square centered horizontally at model X=0 with equal dimensions and no pitch, roll or unequal scaling. Use opposite-facing faces so the display remains readable from both sides; retain the existing cardinal yaw alignment.
- Remove the rightArm/rightItem bones, item-category rotation heuristics and repeated mainhand/replaceitem updates. Remove equipment components after defining a migration that replaces old presentation helpers without touching saved access or requirements.
- Keep the existing click target and label anchor unless in-game alignment demonstrates that the anchor needs a small uniform vertical adjustment.

## Reference connection

Java `chunk_items/render_chunk_items` calls `check_render_chunk_item_north/east/south/west`, which create an item display and a text passenger. The corresponding `update_chunk_item_*` functions copy the chunk marker's saved item and remaining-cost score into those helpers. Bedrock's `refreshRequirementDisplays` calls `updateDisplay` with the saved item ID, remaining cost and locked-cell coordinates. The new icon index is presentation state derived from that item ID, never authoritative payment state.

## Verification and delivery

Check catalog coverage, stable index-to-texture correspondence, fallback behavior, geometry centering, removal of equipment commands, unchanged display lifecycle and payment tests. Run lint, build, documentation and Java reference checks. In Minecraft inspect representative blocks, flowers, tools and special models on perpendicular walls and confirm clicking still pays the labeled requirement. State any visual or coverage limits explicitly. Increment matching pack versions, deploy locally, and commit/push the verified capability.

## Limits

Vanilla resource paths can change across Minecraft versions. Flat block textures intentionally do not reproduce inventory silhouettes. Name tags are still rendered by Minecraft and can face the camera independently of the wall-aligned icon. Centering the model removes held-item offsets; it does not guarantee identical apparent size for artwork with asymmetric transparent padding.
