# Upstream starter

This project adapts `ts-starter` from Microsoft's
[minecraft-scripting-samples](https://github.com/microsoft/minecraft-scripting-samples/tree/73a171fc8393a1052b4ca0669dc82231f775d8b1/ts-starter).

Source commit: `73a171fc8393a1052b4ca0669dc82231f775d8b1`.
Retrieved: 2026-11-15.
The upstream MIT license is retained in `LICENSE.microsoft-samples`.
The copied build configuration, VS Code configuration, formatting/lint
configuration, and sample pack icons originate from that starter.

Local changes configure the Chunklock pack names and unique UUIDs, pin the
stable Script API to 2.0.0, link the behavior pack to the resource pack,
and replace the repeating demo with a player-join smoke message.

Cleanup is scoped to this pack in the selected Minecraft installation.
The lint parser/plugin are declared explicitly, and npm overrides select
patched Vitest, Tinypool, and Minimatch versions for the development tools.
`package-lock.json` records the verified dependency versions.

## Vanilla texture resource metadata

The flat-icon catalog records identifiers and texture resource paths checked against Mojang's [bedrock-samples](https://github.com/Mojang/bedrock-samples/tree/15701fa9c13923f12662984c32c124327e40e3d3/resource_pack) metadata at revision `15701fa9c13923f12662984c32c124327e40e3d3`. Minecraft supplies the referenced images at runtime; no Vanilla image assets or full reference pack are redistributed here. The question-mark fallback icon is original procedural artwork.
