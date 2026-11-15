# Chunklock Bedrock development rules

The user's current task instructions take precedence over this file.
These rules apply to all code, documentation and tools in this repository.

## English-only writing

- Write all documentation, code comments, authored user-facing text, identifiers and commit/PR messages in English.
- Keep generated documentation templates and function descriptions in English as well.
- Do not introduce Thai or other non-English prose into repository files. Preserve upstream identifiers and proper names accurately.
- Run `python tools/check_docs.py` to catch broken local documentation links and leftover Thai text, then review the prose for English wording.

## Repository boundary

- The Git repository root is `C:\_Others\Chunklock\bedrock_addon`; paths in these rules are relative to this directory.
- Keep `java_mod` outside the repository. Its default local reference path is `../java_mod/data`.
  `CHUNKLOCK_JAVA_REFERENCE` may point to another reference data directory.
- Never copy, stage or publish the Java source, node_modules, dist/lib/temp, private backups or secrets.
- Keep reference documentation inside `docs/reference`. Describe excluded Java source paths as local source locators, not broken GitHub links.

## Read before every task

1. Read `README.md`, `CONTEXT.md` and `docs/reference/README.md`.
2. Read `docs/reference/runtime-flow.md`, `state-model.md`, `source-observations.md` and `bedrock-porting.md`.
3. Locate the relevant Java functions/tables in `file-catalog.md`, `functions.md`, `loot-tables.md` or `predicates-advancements.md`.
   Read the corresponding local Java source when available.
4. Check callers, callees, execution context and shared state before changing behavior.
   If the Java source is unavailable, use the published documentation, state the verification limit and obtain source when a consequential detail cannot be established.

## Use the connected reference behavior

- Use the local Java datapack as the behavior reference: initialization -> tick -> proximity -> payment -> unlock -> progress -> cleanup.
- Before implementing or changing a function, document its Java counterpart, callers/callees, input, state, output and effects on neighboring systems.
- Describe actual commands. Record discrepancies between code, comments and UI in `source-observations.md`.
- Do not assume Java NBT, display entities, macros, trigger objectives or advancements work unchanged in Bedrock.
  Check the API version pinned in `package.json` before using a Bedrock mechanism.
- Identify new behavior without a Java counterpart explicitly and explain how it connects to the existing system.
- Keep the local Java reference unchanged unless the user requests an update. Never modify it merely to match the port.
- Distinguish source facts, proposed Bedrock designs, implemented behavior and verified runtime results.

## Source and documentation maintenance

- Edit `scripts/`, pack source directories and tooling, not generated output or deployed copies.
- Chunk keys must include dimension and correct negative-coordinate handling. State and remaining cost must outlive presentation helpers.
- Consider payer ownership, overflow returns, duplicate unlocks and multiplayer interactions whenever payment/state changes.
- Update related docs and the implementation-status table in `docs/reference/bedrock-porting.md` with each completed capability.
- If the user updates the Java reference, review `docs/reference/function-notes.json`, run `python tools/reference_docs.py`
  and update the manually written runtime/state/observations/mapping documents too.
- Use `python tools/reference_docs.py --check` when local source is available. Do not hand-edit the generated files it owns.
- Preserve AvidMc/Quillbee reference attribution and the separate Microsoft sample license/credits.

## Verification

- Run checks appropriate to the change. Documentation changes require link, language and reference coverage checks.
- Bedrock code/build changes require lint and build; deployment/packaging changes require checking the corresponding deployment or mcaddon output.
- Add meaningful behavior tests for gameplay systems and important bugs. Do not add tests that merely repeat low-impact documentation/configuration edits.
- Report whether verification was static/build-only or performed in Minecraft. A successful build is not gameplay proof.

## Commit and push each completed capability

- Commit and push as soon as each coherent function/capability is implemented, documented and verified. Do not accumulate completed functions until the end of a large task.
- Include the capability's supporting code, relevant tests and documentation in the same commit. Split documentation/tool work into complete, reviewable milestones.
- Inspect status/diff and stage only intended files. Write descriptive English commit messages and push to the task's current branch.
- The primary remote is `https://github.com/PasitB06/Chunklock-Bedrock.git`; the initial branch is `main`.
- Routine commits and pushes within this scope are authorized; do not request confirmation for every completed function.
- Do not rewrite remote history, force-push, delete branches or overwrite another person's work unless the user explicitly authorizes that operation for the current task.
- If remote work advances, fetch and inspect it before integrating changes. If pushing fails, report the saved commit and the error accurately.
- The final task report must identify completed work, verification, remaining limitations and the pushed commit/branch.
