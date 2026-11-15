"""Read every supplied Java data resource and reproduce its reference indexes.

Run from any directory: python tools/reference_docs.py [--check]
Only docs/reference generated files are written; the Java snapshot is read-only.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import json
import os
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(os.environ.get("CHUNKLOCK_JAVA_REFERENCE", ROOT.parent / "java_mod/data")).resolve()
DOCS = ROOT / "docs/reference"
RESOURCE = r"[a-z0-9_.-]+:[a-z0-9_./-]+"


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def cell(value):
    return str(value).replace("|", "\\|").replace("\n", " ")


def source_link(path, label=None):
    # Java resources are local reference material, deliberately outside this repo.
    return f"`{label}` (`{path}`)" if label else f"`{path}`"


def walk(value):
    yield value
    if isinstance(value, dict):
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def build_index():
    if not SOURCE.is_dir():
        raise ValueError(
            "Java reference data is unavailable. Place it at ../java_mod/data or set "
            "CHUNKLOCK_JAVA_REFERENCE to its data directory. "
            "Use python tools/check_docs.py for source-independent repository checks."
        )
    notes = json.loads((DOCS / "function-notes.json").read_text(encoding="utf-8"))
    nodes, edges = [], []
    for path in sorted(SOURCE.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(SOURCE)
        parts = relative.parts
        kind = "/".join(parts[1:3]) if parts[1] == "tags" else parts[1]
        tail = Path(*parts[3:] if kind.startswith("tags/") else parts[2:])
        resource_id = f"{parts[0]}:{tail.with_suffix('').as_posix()}"
        text = path.read_text(encoding="utf-8-sig").replace("\r\n", "\n")
        node = {
            "path": "java_mod/data/" + relative.as_posix(),
            "kind": kind,
            "id": resource_id,
            "lines": len(text.splitlines()),
            "sha256_lf_utf8": hashlib.sha256(text.encode("utf-8")).hexdigest(),
        }
        references = []
        if kind == "function":
            key = tail.with_suffix("").as_posix()
            if key not in notes:
                raise ValueError(f"Missing reviewed purpose for {key}")
            node["purpose"] = notes[key]
            commands = [(line_no, line) for line_no, line in enumerate(text.splitlines(), 1)
                        if line.strip() and not line.lstrip().startswith("#")]
            node["commands"] = len(commands)
            for line_no, command in commands:
                for target in re.findall(r"\bfunction\s+(" + RESOURCE + r")", command):
                    # tellraw click actions are potential user calls, not immediate execution.
                    relation = "click_command" if "tellraw " in command else "call"
                    references.append(("function", target, relation, line_no))
                for target in re.findall(r"\bloot\s+(" + RESOURCE + r")", command):
                    references.append(("loot_table", target, "roll_loot", line_no))
                for target in re.findall(r"\bpredicate[=\s]!?((?:" + RESOURCE + r"))", command):
                    references.append(("predicate", target, "test_predicate", line_no))
                for target in re.findall(r"\b(?:only|until|from|through)\s+(chunklock:[a-z0-9_./-]+)", command):
                    if "advancement " in command:
                        references.append(("advancement", target, "advancement_command", line_no))
        else:
            data = json.loads(text)
            node["data"] = data
            for obj in walk(data):
                if not isinstance(obj, dict):
                    continue
                if kind == "loot_table" and obj.get("type", "").removeprefix("minecraft:") == "loot_table":
                    target = obj.get("value", obj.get("name"))
                    if isinstance(target, str):
                        references.append(("loot_table", target, "nested_loot", None))
                if kind == "advancement":
                    if isinstance(obj.get("parent"), str):
                        references.append(("advancement", obj["parent"], "parent", None))
                    if isinstance(obj.get("function"), str):
                        references.append(("function", obj["function"], "reward_function", None))
                if kind == "predicate" and obj.get("condition", "").removeprefix("minecraft:") == "reference":
                    references.append(("predicate", obj["name"], "predicate_reference", None))
            if kind == "tags/function":
                for entry in data["values"]:
                    target = entry if isinstance(entry, str) else entry["id"]
                    references.append(("function", target, "entrypoint", None))
        nodes.append(node)
        for target_kind, target_id, relation, line_no in references:
            if target_id.startswith("chunklock:"):
                edges.append({"source": node["path"], "target_kind": target_kind,
                              "target_id": target_id, "relation": relation, "line": line_no})
    lookup = {(n["kind"], n["id"]): n for n in nodes}
    for edge in edges:
        target = lookup.get((edge["target_kind"], edge["target_id"]))
        if target is None:
            raise ValueError(f"Unresolved resource: {edge}")
        edge["target"] = target["path"]
    actual = {n["id"].split(":", 1)[1] for n in nodes if n["kind"] == "function"}
    if actual != set(notes):
        raise ValueError(f"Function notes differ from source: {actual ^ set(notes)}")
    return nodes, edges


def purpose(node):
    data = node.get("data", {})
    if node["kind"] == "function":
        return node["purpose"]
    if node["kind"] == "tags/function":
        return "Game entry point; invokes functions in order: " + ", ".join(data["values"])
    if node["kind"] == "loot_table":
        entries = [obj for obj in walk(data) if isinstance(obj, dict) and "type" in obj]
        items = [e for e in entries if e["type"].removeprefix("minecraft:") == "item"]
        tables = [e for e in entries if e["type"].removeprefix("minecraft:") == "loot_table"]
        group = "Selects biome-specific unlock requirements" if ":biome/" in node["id"] else "Reusable weighted item group"
        return f"{group}; {len(data.get('pools', []))} pools, {len(items)} item entries, {len(tables)} table entries"
    if node["kind"] == "advancement":
        display = data.get("display", {})
        return "Advancement: " + compact(display.get("title", {})) + "; criteria: " + compact(data.get("criteria", {}))
    if node["kind"] == "predicate":
        return "Condition filter: " + compact(data)
    raise ValueError(f"Unhandled kind: {node['kind']}")


def render(nodes, edges):
    incoming, outgoing = defaultdict(list), defaultdict(list)
    for edge in edges:
        incoming[edge["target"]].append(edge)
        outgoing[edge["source"]].append(edge)
    counts = dict(sorted(Counter(n["kind"] for n in nodes).items()))
    banner = "Generated from local reference data by `python tools/reference_docs.py`. Do not edit generated content.\n"
    source_note = "Java paths below identify local-only reference files outside this repository; they are source locators, not GitHub links."
    catalog = ["# Complete reference file catalog", "", banner, "", f"Read **{len(nodes)} files**; counts by type: `{compact(counts)}`", "",
               "Each file's responsibility appears below. source-index.json records UTF-8/LF hashes and extracted resource references.", "",
               "These are static resource references, not evidence that a branch or command executed in a game.", "", source_note, ""]
    functions = ["# Function responsibilities and relationships", "", banner, "",
                 "call = command invocation; click_command = user-activated command in a message; entrypoint = function tag; reward_function = advancement reward.", "",
                 "Read execute as/at/positioned and conditions in the source as well; the static graph does not capture all execution context.", "", source_note, ""]
    loot = ["# Complete loot table reference", "", banner, "",
            "Weights apply within the same pool/group, not across all files. A nested table adds another selection step.", "",
            "A parent's set_count function can overwrite a child table's count. Preserve function order when porting to Bedrock.", "", source_note, ""]
    predicates = ["# Complete predicate and advancement reference", "", banner, "", source_note, ""]
    current_kind = None
    for node in nodes:
        kind, path = node["kind"], node["path"]
        # Nodes are sorted by path, so each source directory remains together.
        if kind != current_kind:
            catalog.extend(["", f"## {kind}", "", "| File | Responsibility |", "| --- | --- |"])
            current_kind = kind
        catalog.append(f"| {source_link(path, node['id'])} | {cell(purpose(node))} |")
        if kind == "function":
            functions.extend([f"## {node['id']}", "", source_link(path), "", node["purpose"], "",
                              f"Commands: {node['commands']}; total lines: {node['lines']}", ""])
            callers = sorted({f"{e['relation']}: {source_link(e['source'])}" for e in incoming[path]})
            functions.extend(["Called/referenced by: " + ("; ".join(callers) or "No static reference found; an administrator may invoke it directly."), ""])
            if outgoing[path]:
                functions.extend(["| Relationship | Target | Source line |", "| --- | --- | --- |"])
                for edge in outgoing[path]:
                    functions.append(f"| {edge['relation']} | {source_link(edge['target'], edge['target_id'])} | {edge['line'] or 'JSON'} |")
                functions.append("")
        elif kind == "loot_table":
            loot.extend([f"## {node['id']}", "", source_link(path), "", purpose(node), ""])
            for i, pool in enumerate(node["data"].get("pools", []), 1):
                metadata = {k: v for k, v in pool.items() if k != "entries"}
                loot.extend([f"Pool {i}: `{compact(metadata)}`", "",
                             "| Order | Type | Item / child table | Weight | Functions in order | Conditions / other details |",
                             "| --- | --- | --- | --- | --- | --- |"])
                def render_entries(entries, prefix=""):
                    for j, entry in enumerate(entries, 1):
                        number = f"{prefix}{j}"
                        entry_kind = entry.get("type", "").removeprefix("minecraft:")
                        target = entry.get("value", entry.get("name", "-"))
                        extra = {k: v for k, v in entry.items() if k not in {"type", "name", "value", "weight", "functions", "children"}}
                        row = [number, entry_kind, target, entry.get("weight", 1), compact(entry.get("functions", [])), compact(extra)]
                        loot.append("| " + " | ".join(cell(v) for v in row) + " |")
                        render_entries(entry.get("children", []), number + ".")
                render_entries(pool.get("entries", []))
                loot.append("")
        elif kind in {"predicate", "advancement"}:
            data = node["data"]
            # Exclude decorative skin texture blobs while preserving behavior fields.
            details = data if kind == "predicate" else {k: v for k, v in data.items() if k != "display"}
            if kind == "advancement" and "display" in data:
                details = {**details, "display_text": {k: v for k, v in data["display"].items() if k not in {"icon", "background"}}}
            predicates.extend([f"## {kind}: {node['id']}", "", source_link(path), "", "```json",
                               json.dumps(details, ensure_ascii=False, indent=2), "```", ""])
    index_nodes = [{k: v for k, v in n.items() if k != "data"} for n in nodes]
    index = {"source_root": "java_mod/data", "source_location": "local-only: ../java_mod/data or CHUNKLOCK_JAVA_REFERENCE",
             "hash_normalization": "UTF-8 without BOM, CRLF -> LF",
             "counts": counts, "total_files": len(nodes), "nodes": index_nodes, "edges": edges}
    outputs = {"file-catalog.md": catalog, "functions.md": functions,
               "loot-tables.md": loot, "predicates-advancements.md": predicates}
    result = {name: "\n".join(lines).rstrip() + "\n" for name, lines in outputs.items()}
    result["source-index.json"] = json.dumps(index, ensure_ascii=False, indent=2) + "\n"
    return result, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if generated docs differ; write nothing")
    args = parser.parse_args()
    nodes, edges = build_index()
    outputs, counts = render(nodes, edges)
    stale = []
    for name, content in outputs.items():
        path = DOCS / name
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != content:
                stale.append(name)
        else:
            path.write_text(content, encoding="utf-8", newline="\n")
    if stale:
        print("STALE: " + ", ".join(stale), file=sys.stderr)
        return 1
    print(f"{'Checked' if args.check else 'Generated'} {len(outputs)} documents: {len(nodes)} files, {len(edges)} resolved references; {counts}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
