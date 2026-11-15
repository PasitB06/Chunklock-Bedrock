# Chunklock Bedrock Add-On

A TypeScript project for Minecraft Bedrock, using the behavior of a local Java Chunklock datapack as a development reference.

**Current status:** an experimental entity-free chunk marker and bounded propagation system is ready for manual testing. See [prototype instructions](docs/chunk-prototype.md). Translucent border walls, block/right-click/combat protection and per-tick movement pullback are now available for testing; see [visuals and protection](docs/visuals-protection.md). All Java loot tables compile and roll in Bedrock TypeScript; locked chunks now persist their biome-based requirements and source-scaled costs, with Minecraft gameplay verification pending. Display, payment and progression remain in progress.

This directory is the Git repository root. The Java reference is kept outside the repository at `../java_mod/data` and is not published to GitHub.

## Documentation

| Document | Purpose |
| --- | --- |
| [Reference guide](docs/reference/README.md) | Explains the Java system and how its parts connect |
| [Domain glossary](CONTEXT.md) | Defines chunks, unlock requirements, payers and progress |
| [Bedrock mapping](docs/reference/bedrock-porting.md) | Maps responsibilities to future Bedrock work and records implementation status |
| [Loot requirements](docs/loot-requirements.md) | Describes the Java table compiler and planned per-chunk requirement flow |
| [Agent rules](AGENTS.md) | Requires English-only writing, reference-based development and a commit/push for each completed capability |

All repository documentation, comments, authored messages and commit messages must be written in English.

## Getting started

Open this directory in VS Code, then run:

```powershell
npm.cmd ci
npm.cmd run local-deploy
```

Use `npm.cmd` in PowerShell to avoid execution-policy restrictions on `npm.ps1`.
Dependencies are already installed on the original development machine; use `npm.cmd ci` when installing again or cloning elsewhere.

## Testing in Minecraft

1. Open **Minecraft for Windows / Bedrock** and create a new Creative test world.
2. Activate **Chunklock Behavior** under **Behavior Packs -> My Packs / Available**.
3. Confirm that **Chunklock Resources** is also active. The behavior pack declares this dependency.
4. Enter the world and look for `[Chunklock] Bedrock add-on is ready.` in chat.

The starter pins stable Script API `@minecraft/server` **2.6.0** and declares a minimum Bedrock version of **1.26.60**.
It does not require Beta APIs or Experiments. Restart Minecraft if newly deployed packs are not listed.
Building and copying files does not prove gameplay works; the readiness message must be checked in a world.

## Development commands

| Task | Command |
| --- | --- |
| Check script style | `npm.cmd run lint` |
| Build | `npm.cmd run build` |
| Build and deploy once | `npm.cmd run local-deploy` |
| Watch and deploy changes | `npm.cmd run dev` |
| Create an importable add-on | `npm.cmd run mcaddon` |
| Create a production add-on | `npm.cmd run mcaddon:production` |
| Check documentation without Java source | `python tools/check_docs.py` |
| Check generated reference docs against local Java source | `python tools/reference_docs.py --check` |
| Compile local Java loot tables | `python tools/build_loot_tables.py` |
| Check compiled loot data is current | `python tools/build_loot_tables.py --check` |

Watch mode handles TypeScript, JSON, lang and PNG changes. Stop it with Ctrl+C.
After script changes, save and leave the world, then re-enter it; `/reload` is another option if commands are enabled.
Some resource changes may require restarting the game.

The importable file is `dist/packages/chunklock.mcaddon`. Double-click it to import it into Minecraft.
For local development, prefer `local-deploy` to avoid duplicate imported and development copies of the same pack.

## Layout

```text
scripts/main.ts                        Script entry point
behavior_packs/chunklock/manifest.json   Pack identity, version and Script API dependency
resource_packs/chunklock/manifest.json   Resource pack for future textures, audio and models
docs/reference/                        Behavior reference, file catalog and porting status
tools/                                 Reference generation and documentation checks
.env                                   Pack directory name and Minecraft target
just.config.ts                         Build, deployment and packaging tasks
.vscode/                               Editor tasks and debugger configuration
dist/                                  Regenerable build output; excluded from Git
```

Edit source files in this repository. Deployment replaces generated files in Minecraft's development directories.
Keep existing UUIDs when updating the same pack and increment pack versions before distributing updates.
The Java source directory, dependencies and generated outputs must never be added to this repository.

## Minecraft deployment paths

The default `.env` selects `MINECRAFT_PRODUCT="BedrockGDK"` for the regular Bedrock installation:

```text
%APPDATA%\Minecraft Bedrock\users\shared\games\com.mojang\development_behavior_packs\chunklock
%APPDATA%\Minecraft Bedrock\users\shared\games\com.mojang\development_resource_packs\chunklock
```

Use `PreviewGDK` for Preview. For a custom installation, select `Custom` and set `CUSTOM_DEPLOYMENT_PATH`
to the intended `com.mojang` directory, not to a world directory.

## Logs and debugging

Enable **Settings -> Creator -> Content Log** in Minecraft to inspect add-on errors.
Recommended VS Code extensions are Blockception Bedrock Development, Minecraft Debugger and Prettier.
The **Debug with Minecraft** configuration listens on port 19144.

Deploy the pack, open a test world with command permissions, start the debugger in VS Code and run:

```text
/script debugger connect localhost 19144
```

The configuration is prepared; an actual debugger connection still needs to be verified in a running world.

## Java reference availability

The published English reference documents cover 275 local Java data files and 626 extracted resource references.
Source paths in those documents are identifiers for local reference material, not links to files hosted in this repository.
To regenerate or compare them, provide `../java_mod/data` or set `CHUNKLOCK_JAVA_REFERENCE` to the reference data directory.
`python tools/check_docs.py` works in a standalone clone without Java files.

## Upstream and toolchain

The project adapts Microsoft's TypeScript starter. Attribution and licensing are recorded in
[THIRD_PARTY.md](THIRD_PARTY.md) and `LICENSE.microsoft-samples`.
The local Java reference credits AvidMc and Quillbee; Microsoft's sample license does not cover that datapack.

The development toolchain uses dependency overrides for patched Vitest, Tinypool and Minimatch versions.
`package-lock.json` records the installed versions. The original machine uses Node.js 26.7.0;
use a supported Node.js LTS release for another development machine.

- [Minecraft Creator documentation](https://learn.microsoft.com/en-us/minecraft/creator/?view=minecraft-bedrock-stable)
- [Add-on development and folder locations](https://learn.microsoft.com/en-us/minecraft/creator/documents/gettingstarted?view=minecraft-bedrock-stable)
- [TypeScript scripting guide](https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/next-steps?view=minecraft-bedrock-stable)
- [Script API reference](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable)
- [Microsoft starter](https://github.com/microsoft/minecraft-scripting-samples/tree/main/ts-starter)

Repository: [PasitB06/Chunklock-Bedrock](https://github.com/PasitB06/Chunklock-Bedrock).
