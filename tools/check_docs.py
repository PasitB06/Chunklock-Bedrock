"""Check repository documentation without requiring the external Java source.

Checks local links, Thai-language migration regressions and published reference
coverage. English wording still requires editorial review; this is not a
general-purpose natural-language classifier or a Java runtime validator.
"""

from collections import Counter
import json
import os
from pathlib import Path
import re
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {".git", "node_modules", "dist", "lib", "temp", "__pycache__", ".codex-attachments"}


def main():
    errors, documents = [], []
    for directory, directories, files in os.walk(ROOT):
        directories[:] = sorted(name for name in directories if name not in EXCLUDED)
        for name in sorted(files):
            path = Path(directory) / name
            relative = path.relative_to(ROOT)
            if "java_mod" in relative.parts:
                errors.append(f"Java source is inside the repository: {relative}")
            try:
                content = path.read_text(encoding="utf-8-sig")
            except UnicodeDecodeError:
                continue
            if re.search(r"[\u0e00-\u0e7f]", content):
                errors.append(f"Non-English migration text remains: {relative}")
            if path.suffix.lower() == ".md":
                documents.append((path, content))

    links = 0
    for path, content in documents:
        for raw in re.findall(r"\[[^\]]*\]\(([^)]+)\)", content):
            target = raw.strip().split(' "', 1)[0].strip("<>")
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target) or target.startswith("#"):
                continue
            destination = (path.parent / unquote(target.split("#", 1)[0])).resolve()
            links += 1
            if not destination.is_relative_to(ROOT):
                errors.append(f"Local link leaves the published repository: {path.relative_to(ROOT)} -> {raw}")
            elif not destination.exists():
                errors.append(f"Missing local link: {path.relative_to(ROOT)} -> {raw}")

    reference = ROOT / "docs/reference"
    index = json.loads((reference / "source-index.json").read_text(encoding="utf-8"))
    notes = json.loads((reference / "function-notes.json").read_text(encoding="utf-8"))
    nodes, edges = index["nodes"], index["edges"]
    paths = {node["path"]: node for node in nodes}
    counts = dict(Counter(node["kind"] for node in nodes))
    if len(paths) != len(nodes) or len(nodes) != index["total_files"] or counts != index["counts"]:
        errors.append("Source index counts or unique source paths are inconsistent.")
    if len({(node["kind"], node["id"]) for node in nodes}) != len(nodes):
        errors.append("Source index has duplicate resource identities.")
    for node in nodes:
        if not re.fullmatch(r"[a-f0-9]{64}", node["sha256_lf_utf8"]):
            errors.append(f"Invalid source hash: {node['path']}")
    for edge in edges:
        target = paths.get(edge["target"])
        if edge["source"] not in paths or target is None:
            errors.append(f"Dangling indexed edge: {edge}")
        elif (target["kind"], target["id"]) != (edge["target_kind"], edge["target_id"]):
            errors.append(f"Indexed edge target identity differs: {edge}")
    function_names = {node["id"].split(":", 1)[1] for node in nodes if node["kind"] == "function"}
    if set(notes) != function_names:
        errors.append("Function descriptions do not cover exactly the indexed functions.")
    catalog = (reference / "file-catalog.md").read_text(encoding="utf-8")
    for node in nodes:
        if f"`{node['id']}` (`{node['path']}`)" not in catalog:
            errors.append(f"Catalog is missing a resource: {node['path']}")
    for filename, kinds in [
        ("functions.md", {"function"}),
        ("loot-tables.md", {"loot_table"}),
        ("predicates-advancements.md", {"predicate", "advancement"}),
    ]:
        text = (reference / filename).read_text(encoding="utf-8")
        headings = set(re.findall(r"^## (.+)$", text, flags=re.MULTILINE))
        expected = {
            f"{node['kind']}: {node['id']}" if filename == "predicates-advancements.md" else node["id"]
            for node in nodes if node["kind"] in kinds
        }
        if headings != expected:
            errors.append(f"Detailed resource coverage is inconsistent: {filename}")

    if errors:
        print("\n".join(errors))
        return 1
    print(f"Checked {len(documents)} Markdown documents, {links} local links, "
          f"{len(nodes)} indexed resources and {len(edges)} indexed references. "
          "No Thai migration text found; external Java source was not required.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
