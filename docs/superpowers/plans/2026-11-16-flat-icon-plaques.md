# Flat Icon Plaques Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace held-item helpers with centered flat icons while retaining payment behavior.

**Architecture:** An explicit catalog maps loot item IDs to Vanilla texture paths. One generator emits matching script indices, client texture declarations and a render-controller texture array. A centered square uses the existing cardinal yaw.

**Tech Stack:** TypeScript, Bedrock Script API 2.6.0, Python tooling, Node tests.

**Spec:** [Approved design](../../flat-icon-plaque-design.md).

## Global Constraints

English-only authored text; Java reference stays outside Git. No changes to saved requirements or payment ownership. Preserve the existing wall rendering fix. Use Vanilla resource paths without copying texture images.

## Review Focus

Unknown items use a visible fallback with their correct name/cost. Old helpers migrate without retaining held items. Saved costs survive display cleanup. All four rotations remain wall-parallel. Texture catalog and index array cannot drift.

## Capability: flat requirement plaques

- [x] Add failing display tests for icon-index updates without equipment commands and centered geometry.
- [x] Resolve Vanilla item/block aliases into an explicit catalog with pinned metadata provenance; record coverage and fallbacks.
- [x] Generate matching TypeScript indices, client textures and render controller; add a reproducibility check.
- [x] Remove hand rendering, add the synchronized icon index, and migrate presentation helpers through a versioned key.
- [x] Test catalog coverage, all four sides, item changes, unknown items, reload/deduplication and unchanged payment suite.
- [ ] Build/deploy, inspect representative icons and click payment in Minecraft, document actual evidence and limits.
- [ ] Review intended diff, commit and push the capability.

Runtime handoff: the user chose to restart Minecraft and inspect the installed BP 0.2.27 / RP 0.2.22 personally. Automated checks passed; final visual alignment and click verification are pending, not claimed complete.
