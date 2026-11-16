# Flat requirement icon plaques

BP 0.2.27 / RP 0.2.22 replace held-item rendering with a centered flat square. The square is 0.5 blocks wide and high, centered at model X/Y zero, with opposite-facing textured faces. Only cardinal yaw is applied. There are no arm/item bones, category-specific pitch/roll corrections, equipment components or `replaceitem` commands.

The existing name/count label remains above the icon. Minecraft name tags face the camera independently; the icon stays parallel to its wall. Transparent padding in individual Vanilla artwork can still make its visible silhouette asymmetric. Blocks use representative face textures rather than 3D inventory silhouettes. Colored banners use representative wool-color swatches; beds use their item art. Animated textures use their referenced source image and are not promised to reproduce Vanilla animation.

## Catalog and generation

[The catalog](../tools/display-icon-catalog.json) maps every one of the 782 distinct Java loot item IDs to a Vanilla texture resource path. It also includes Bedrock short grass and flint. The source metadata is pinned to [Mojang bedrock-samples revision 15701fa9](https://github.com/Mojang/bedrock-samples/tree/15701fa9c13923f12662984c32c124327e40e3d3/resource_pack): `blocks.json`, `textures/item_texture.json` and `textures/terrain_texture.json`. All referenced image paths were checked against that revision's file tree. No Vanilla image files are copied into this repository.

The mapping prefers carried/item art where available, then representative block faces. Legacy item/texture names are explicitly resolved in the catalog. To update it, inspect the pinned metadata or a deliberately reviewed newer revision, edit the item-to-path entries, validate new paths, and regenerate both sides together:

```powershell
python tools/build_display_assets.py
python tools/build_display_assets.py --check
```

The generator emits [script indices](../scripts/display-icons-data.ts), client entity texture aliases, a render-controller texture array, the synchronized property range and an original question-mark fallback PNG. It rejects incomplete source-item coverage. Unknown runtime items use index zero while retaining their true label and remaining cost. Sorting the unique paths produces matching script/client indices on each build; these indices are transient presentation state, not saved requirement identifiers.

## Connected behavior and migration

Java `chunk_items/render_chunk_items` calls side-specific `check_render_chunk_item_*`, which create item/text displays and invoke `update_chunk_item_*`. Those updates copy saved item data and remaining cost from the marker. The Bedrock counterpart is `refreshRequirementDisplays -> updateDisplay` in [displays.ts](../scripts/displays.ts). It reads the existing persistent requirement, assigns `chunklock:display_icon`, label and locked-cell coordinates, and retains cardinal `chunklock:display_yaw`.

Helper keys now start with `plaque1:`. Reconciliation removes old presentation helpers and creates the new ones within the existing spawn budget; unloaded old helpers migrate when loaded. Access flags, rolled items, remaining costs and payer totals are unchanged. The existing canceled click/deferred payment path still identifies the locked cell from the helper's coordinates and charges the clicking player. Icon indices never determine payment type or quantity.

## Verification

Automated checks cover source-item coverage, index/texture correspondence, unknown-item fallback, item changes, old-helper migration, deduplication, all four cardinal placements, centered square geometry and absence of equipment writes. Payment, protection and wall tests remain part of the full suite. The generator check verifies that catalog and generated assets agree; it does not validate paths against a different installed Minecraft version or prove visual results.

Deployment verified BP 0.2.27 / RP 0.2.22 and matching generated resource files. The running client still showed a pack-load warning after a world-only reload; the user chose to restart Minecraft and perform visual/click checks personally. Those runtime results remain pending. Automated tests are not runtime alignment proof. Vanilla paths may change with future game versions, and third-party packs may replace their artwork. This is a flat face-texture display, not an automatically extracted inventory icon renderer.
