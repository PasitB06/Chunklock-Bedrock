# Chunklock Bedrock Add-On

A TypeScript add-on (`v1.0.0`) for **Minecraft Bedrock Edition** (`1.26.60+`) built strictly on stable `@minecraft/server` **2.6.0** APIs (no Beta APIs or Experiments required), using a local Java Chunklock datapack (`v2.1.0`) as the behavior reference.

**Current status:** Core gameplay, border walls, requirement plaques, whole-inventory payment, dimension/respawn handling, central End island crystal exemptions, custom commands, scoreboard tracking, milestones, and 11-player Realms optimizations are implemented and verified by automated unit tests and build checks. Full end-to-end verification inside a live Minecraft Bedrock / Realms world remains to be completed by gameplay testing.

> [!NOTE]
> This directory (`bedrock_addon/`) is the Git repository root. Local reference documentation (`docs/`), AI/editor rules (`AGENTS.md`, `CONTEXT.md`), and the external Java reference (`../java_mod/data`) are intentionally excluded via `.gitignore` and are not published to GitHub.

---

## Key Features

- **Global Shared Progression**:
  - Unlocked chunks are shared globally across all players in the Overworld, Nether, and The End.
  - Joining players receive a chat summary of Global mode and per-dimension unlock counts (`Chunklock Global is active. Progress — Overworld #N, Nether #N, The End #N.`).
  - Paid unlocks broadcast `<Player> unlocked <Dimension> chunk #<Order>.` in global chat and hold `<Dimension> chunk #<Order> unlocked.` on the payer's action bar. Center-screen `setTitle`/`updateSubtitle` text is never used anywhere in the add-on.
- **Border Walls & Vibrant Visuals (`RP 1.0.0`)**:
  - Single-column translucent chunk borders (`border_wall`) placed around open terrain, with emissive PBR `border_wall_vibrant` (~5% opacity) when clients enable **Vibrant Visuals** (`deferred` mode).
- **Loot Requirements & Inventory Payment**:
  - All 151 compiled loot tables (`scripts/loot-tables-data.ts`) roll biome-aware item costs (`Y = 128` Overworld, `Y = 64` Nether/The End) scaled by difficulty and per-dimension unlock counts.
  - Centered flat/shaped 3D requirement plaques (`chunklock:requirement_display`) sit `0.01` blocks inside open borders and accept right-click payments across the selected hotbar slot, main 36-slot inventory, and offhand (including partial payments, rollback protection, held-click follow-through suppression, and `minecraft:barrier` test unlocks).
- **Protection, Dimension Transitions & The End Exemption**:
  - Prevents walking, breaking, placing, interacting, melee/ranged combat into, and throwing projectiles/ender pearls across locked chunk borders.
  - Central End island chunks within `<= 500` blocks without a `minecraft:ender_crystal` open automatically without unlock credit, while pillar crystal chunks and outer End islands (`> 500` blocks) stay locked with rolled requirements.
  - `playerDimensionChange` auto-unlocks locked portal destinations (world credit only, with terrain-load retries) and `playerSpawn` resets death-site checkpoints on respawn.
- **Custom Commands (`CustomCommandRegistry`)**:
  - **All Players (works with cheats disabled)**:
    - `/chunklock:reroll` — Rerolls the locked chunk requirement you are looking at within 9 blocks (`Easy` difficulty only).
    - `/chunklock:status` — Shows current difficulty, global per-dimension unlocks, personal unlocks, and reroll count.
  - **Operators / Admins (`GameDirectors`, cheats required)**:
    - `/chunklock:difficulty <easy|normal|hard|impossible>` — Changes difficulty before the first chunk is unlocked and rescales existing pre-unlock requirements.
    - `/chunklock:spreadplayers [radius] [minDistance]` — Spreads all players across the map (`500` / `200` defaults), opens landing chunks without credit, and sets spawn points.
    - `/chunklock:reset confirm` — Clears all Chunklock dynamic properties, helper entities, scoreboard objective, and caches, then re-seeds online players.
  - **Script Event**: `/scriptevent chunklock:debug` toggles prototype center flame particles and coordinate debug output.
- **Scoreboard & Milestones**:
  - Displays personal unlocked chunk totals under player names (`BelowName`) and on the pause-screen player list (`List`) using objective `chunklock:unlocked` (`"Chunks"`).
  - Plays global/payer audio cues and credits at unlock milestones (`#1, #8, #16, #32, #64, #128`) and grants per-player first-dimension unlocks, `16..2048` count tiers, and all 9 item challenges (`stone`, `coal`, `iron_ingot`, `gold_ingot`, `emerald`, `diamond`, `pufferfish`, `nether_brick`, `ancient_debris`) via chat.
- **11-Player Realms Performance Architecture**:
  - Write-through RAM state cache (`scripts/state-cache.ts`), shared per-tick `Player2D` snapshots, unioned open-cell edge scanning, fair round-robin quotas (`MAX_WALLS = 264`, `MAX_DISPLAYS = 110`), staggered 10-tick presentation refreshes, 60-tick excluded-type projectile scans, and 0.25-block dirty-flag checkpoint serialization throttling.

---

## Installation (Players & Realms)

1. Download `chunklock-1.0.0.mcaddon` (from GitHub Releases) or build `dist/packages/chunklock.mcaddon` locally.
2. Double-click the `.mcaddon` file to import both **Chunklock Behavior (`1.0.0`)** and **Chunklock Resources (`1.0.0`)** into Minecraft Bedrock.
3. In **Create New World** or **Edit World**:
   - Activate **Chunklock Behavior** under **Behavior Packs** — Minecraft automatically activates **Chunklock Resources** via its manifest dependency.
   - No **Beta APIs** or experimental toggles are required.
   - To use Vibrant Visuals wall transparency, enable **Settings → Video → Graphics Mode → Vibrant Visuals** on supported hardware.

> [!TIP]
> Avoid mixing imported `.mcaddon` packs with local `development_*_packs\chunklock` folders on the same machine, as duplicate pack UUIDs can trigger a pack-load warning on world entry.

---

## Development & Verification

Use `npm.cmd` in PowerShell to avoid script execution-policy issues with `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run local-deploy
```

| Task | Command |
| --- | --- |
| Check ESLint + Prettier formatting | `npm.cmd run lint` |
| Run Node behavior test suite (`69` tests) | `npm.cmd test` |
| Run Python loot-table compiler tests (`4` tests) | `python -m unittest discover -s tests -p "test_*.py"` |
| Build TypeScript & bundle (`dist/scripts/main.js`) | `npm.cmd run build` |
| Build & deploy to Minecraft development folders | `npm.cmd run local-deploy` |
| Watch mode build & deploy | `npm.cmd run dev` |
| Package `.mcaddon` (`dist/packages/chunklock.mcaddon`) | `npm.cmd run mcaddon` |
| Package production `.mcaddon` | `npm.cmd run mcaddon:production` |
| Verify display plaque assets | `python tools/build_display_assets.py --check` |
| Verify compiled 151 loot tables against local reference | `python tools/build_loot_tables.py --check` |
| Verify local docs & links (standalone safe) | `python tools/check_docs.py` |
| Verify generated Java reference docs | `python tools/reference_docs.py --check` |

After script changes via `local-deploy`, leave and re-enter the world (or run `/reload all` when cheats are enabled). Resource Pack texture/model/manifest updates require a full Minecraft restart.

---

## Repository Layout

```text
behavior_packs/chunklock/    Behavior Pack manifest (1.0.0) and helper entity definitions
resource_packs/chunklock/    Resource Pack manifest (1.0.0), textures, PBR sets, models, materials
scripts/
  main.ts                    Entry point, staggered startup, join summary
  access.ts                  Persistent open-cell access, world/player counters, join formatter
  state-cache.ts             Write-through RAM caches and per-tick Player2D snapshots
  regions.ts                 Floor chunk math, union open-cell edge scans, swept intersections
  end.ts                     Central End island crystal-exemption check (radius <= 500)
  chunks.ts                  Bounded chunk discovery and biome/loot requirement assignment
  loot.ts & loot-tables-data.ts  151 compiled loot tables, item/biome resolvers, cost scaling
  requirements.ts            Per-chunk JSON cost persistence, difficulty rescaling, rerolls
  displays.ts & display-icons-data.ts  Requirement plaque entity reconciliation and icon catalog
  walls.ts & wall-diagnostics.ts  Border wall entity reconciliation and debug diagnostics
  payment.ts & notices.ts    Whole-inventory payment, click suppression, action-bar & global chat
  commands.ts                Custom slash commands (reroll, status, difficulty, spreadplayers, reset)
  progress.ts                BelowName/List scoreboard and global/personal unlock milestones
  collision.ts               Per-tick pullback, dimension arrival auto-unlock, respawn safety
  protection.ts              Block/interaction/combat protection inside locked cells
  projectiles.ts             Projectile & ender pearl border interception
tests/                       Automated Node behavior tests (*.test.cjs) and Python compiler tests
tools/                       Wall/display asset generators, loot-table compiler, doc/reference checks
just.config.ts               Build, local-deploy and .mcaddon packaging tasks
.env                         Pack name and target Minecraft product (BedrockGDK / PreviewGDK)
```

---

## Minecraft Deployment Paths

The default `.env` targets `MINECRAFT_PRODUCT="BedrockGDK"` on Windows:

```text
%APPDATA%\Minecraft Bedrock\users\shared\games\com.mojang\development_behavior_packs\chunklock
%APPDATA%\Minecraft Bedrock\users\shared\games\com.mojang\development_resource_packs\chunklock
```

Set `MINECRAFT_PRODUCT="PreviewGDK"` for Preview or `Custom` + `CUSTOM_DEPLOYMENT_PATH` for a custom `com.mojang` directory.

Enable **Settings → Creator → Content Log** in Minecraft to inspect runtime errors, or connect the VS Code debugger to port `19144` via `/script debugger connect localhost 19144`.

---

## Credits & Upstream

- Adapts Microsoft's TypeScript starter ([THIRD_PARTY.md](THIRD_PARTY.md), `LICENSE.microsoft-samples`).
- Chunklock gameplay concept and Java datapack reference by **AvidMc** and **Quillbee**.
- Repository: [PasitB06/Chunklock-Bedrock](https://github.com/PasitB06/Chunklock-Bedrock).
