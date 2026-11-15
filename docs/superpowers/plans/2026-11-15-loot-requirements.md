# Chunk Requirement Data and Loot Rolling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compile all 151 local Java loot tables into TypeScript data and persist a correctly rolled requirement for each nearby locked Bedrock chunk.

**Architecture:** A Python compiler validates and normalizes the external Java table tree into a committed TypeScript module. Runtime TypeScript performs weighted nested rolls, maps biome and item identifiers, applies the Java difficulty/count formula, and stores a versioned per-chunk requirement from the existing bounded chunk scan.

**Tech Stack:** TypeScript, Python 3, `@minecraft/server` 2.6.0, Node's built-in test runner, Python `unittest`.

**Spec:** `docs/loot-requirements.md` and the user-approved Milestone 1 design in the conversation.

## Global Constraints

- Keep `java_mod/data` outside the repository; commit only the compiler and generated TypeScript representation.
- Compile 151 custom tables (64 biome, 87 generic), preserving nested weights and ordered `set_count` behavior.
- Use the existing stable Script API pin, `@minecraft/server` 2.6.0.
- Keep `chunklock:open:<dimension>:<cx>:<cz>` as the access authority.
- Default difficulty to Normal (2); do not count the Java starting chunk as a credited unlock.
- Do not implement displays, payment, or unlock transitions in this milestone.
- Commit and push each coherent capability to the authorized `main` branch.

## Review Focus

- A negative chunk coordinate must use floor-based chunk keys, not truncation toward zero.
- Unknown biome IDs must choose the all-biome fallback without saving a partial requirement.
- Unsupported item IDs must fall back to stone while retaining the Java source item ID.
- A parent `set_count` must override the nested table's count after child selection.
- Existing open chunks must not receive requirements; old locked records must be backfilled within a bounded work budget.

---

### Task 1: Validate and compile the source tables

**Files:**
- Create: `tools/build_loot_tables.py`
- Create: `scripts/loot-tables-data.ts` (generated)
- Create: `tests/test_loot_table_compiler.py`
- Modify: `package.json`

**Interfaces:**
- Produces `LOOT_TABLES: Readonly<Record<string, LootTable>>` in `scripts/loot-tables-data.ts`.
- Provides `python tools/build_loot_tables.py` to write data and `--check` to compare generated output.
- Includes a Bedrock adapter for the external vanilla table `minecraft:blocks/gravel` at runtime, not as a copied Java source file.

- [x] Write compiler unit tests for normalized IDs/count functions, nested table entries, unknown functions, and unsupported conditions.
- [x] Run `python -m unittest discover -s tests -p "test_loot_table_compiler.py"`; confirm the new imports/functions fail before implementation.
- [x] Implement source discovery via `CHUNKLOCK_JAVA_REFERENCE` or `../java_mod/data`, validation of all 151 tables and their references, and deterministic TypeScript output.
- [x] Run the compiler test and `python tools/build_loot_tables.py --check`; confirm all source tables validate and generated output matches.
- [x] Commit and push the compiler/data capability (`e3e6683`).

### Task 2: Roll requirements and apply scaling

**Files:**
- Create: `scripts/loot.ts`
- Create: `tests/loot.test.cjs`
- Modify: `scripts/loot-tables-data.ts` only through the compiler.

**Interfaces:**
- `rollLootTable(tableId, random?)` returns the Java source item ID and final base count.
- `resolveBiomeTable(bedrockBiomeId)` returns an available biome table or `chunklock:biome/all_biome`.
- `resolveBedrockItemId(sourceItemId)` returns the selected Bedrock ID, original source ID and whether stone fallback was used.
- `calculateRemainingCost(baseCount, dimensionId, unlockedCount, difficulty)` implements the exact source formula.

- [x] Write tests for deterministic weighted selection, nested count override, inclusive count ranges, biome aliases/fallback, item fallback, and every difficulty/step boundary.
- [x] Run `node --test tests/loot.test.cjs`; confirm failures because runtime functions are absent.
- [x] Implement weighted selection by pool and recursion without flattening, the gravel adapter, ID maps, and the formula.
- [x] Run `node --test tests/loot.test.cjs`; all focused cases pass.
- [x] Commit and push the standalone roller/scaling capability (`7890b56`).

## Follow-up design approved for the next milestone

The requirement display will become a compact clickable entity on each eligible locked-chunk border. Payment will use the clicking player's held main-hand item through `playerInteractWithEntity`, with scheduled inventory changes, a five-tick debounce, partial payment and direct player credit. A barrier remains a non-consuming test shortcut. Do not implement item-drop payment.

### Task 3: Persist locked-chunk requirements

**Files:**
- Create: `scripts/requirements.ts`
- Modify: `scripts/chunks.ts`
- Modify: `tests/loot.test.cjs`
- Modify: `behavior_packs/chunklock/manifest.json`

**Interfaces:**
- `ensureChunkRequirement(dimension, cx, cz)` returns whether it created, found, skipped, or deferred a requirement.
- Requirement keys use `chunklock:req:<dimensionId>:<cx>:<cz>` and JSON follows the versioned schema in the spec.
- Difficulty uses `chunklock:difficulty`; per-dimension credited totals use `chunklock:progress:unlocked:<dimensionId>`.

- [x] Write integration tests for creating requirements on locked neighboring records, skipping the open starting cell, backfilling existing locked records, retrying unavailable biomes, and respecting the per-interval budget.
- [x] Run the focused integration test; confirm failures before storage/integration exists.
- [x] Implement schema validation, fixed biome lookup heights, failure-safe persistence, and bounded requirement initialization from the existing chunk scan.
- [x] Run the focused tests; requirements persist without changing access state.
- [x] Update Behavior Pack version to 0.2.5 and project/porting documentation; keep resource dependency 0.2.2.
- [x] Run all tests, lint, build, documentation/reference checks, `git diff --check`, and local deployment.
- [x] Commit and push the integrated Milestone 1 capability.
