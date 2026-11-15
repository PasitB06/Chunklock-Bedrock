#!/usr/bin/env python3
"""Compile the local Java loot-table subset into Bedrock runtime data."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


EXPECTED_COUNTS = {"biome": 64, "generic": 87}
EXPECTED_TOTAL = sum(EXPECTED_COUNTS.values())
GRAVEL_ADAPTER_ID = "minecraft:blocks/gravel"
SUPPORTED_TABLE_FIELDS = {"pools"}
SUPPORTED_POOL_FIELDS = {"rolls", "entries"}
SUPPORTED_ENTRY_FIELDS = {"type", "weight", "name", "value", "functions"}
SUPPORTED_FUNCTION_FIELDS = {"function", "count"}


def _fail(message: str) -> None:
    raise ValueError(message)


def _normalized_identifier(value: Any, default_namespace: str, label: str) -> str:
    if not isinstance(value, str) or not value:
        _fail(f"{label} must be a non-empty string")
    if ":" not in value:
        return f"{default_namespace}:{value}"
    namespace, path = value.split(":", 1)
    if not namespace or not path:
        _fail(f"{label} is not a valid namespaced identifier: {value!r}")
    return f"{namespace}:{path}"


def _normalize_count(value: Any) -> int | dict[str, int]:
    if isinstance(value, bool):
        _fail("set_count count must be an integer or an inclusive min/max range")
    if isinstance(value, int):
        if value < 0:
            _fail("set_count count must not be negative")
        return value
    if not isinstance(value, dict) or set(value) != {"min", "max"}:
        _fail("set_count count must be an integer or an inclusive min/max range")
    minimum, maximum = value["min"], value["max"]
    if any(isinstance(bound, bool) or not isinstance(bound, int) for bound in (minimum, maximum)):
        _fail("set_count range bounds must be integers")
    if minimum < 0 or maximum < minimum:
        _fail("set_count range must be non-negative and min must not exceed max")
    return {"min": minimum, "max": maximum}


def normalize_table(source: Any) -> dict[str, Any]:
    """Validate and normalize one table while preserving its selection order."""
    if not isinstance(source, dict):
        _fail("loot table must be an object")
    extra = set(source) - SUPPORTED_TABLE_FIELDS
    if extra:
        _fail(f"unsupported table fields: {', '.join(sorted(extra))}")
    pools = source.get("pools")
    if not isinstance(pools, list) or not pools:
        _fail("loot table must contain at least one pool")

    normalized_pools: list[dict[str, Any]] = []
    for pool_index, pool in enumerate(pools):
        if not isinstance(pool, dict):
            _fail(f"pool {pool_index} must be an object")
        extra = set(pool) - SUPPORTED_POOL_FIELDS
        if extra:
            _fail(f"unsupported pool fields: {', '.join(sorted(extra))}")
        rolls = pool.get("rolls")
        if isinstance(rolls, bool) or not isinstance(rolls, int) or rolls != 1:
            _fail("only a single integer roll per pool is supported")
        entries = pool.get("entries")
        if not isinstance(entries, list) or not entries:
            _fail(f"pool {pool_index} must contain at least one entry")

        normalized_entries: list[dict[str, Any]] = []
        for entry_index, entry in enumerate(entries):
            if not isinstance(entry, dict):
                _fail(f"entry {entry_index} in pool {pool_index} must be an object")
            extra = set(entry) - SUPPORTED_ENTRY_FIELDS
            if extra:
                _fail(f"unsupported entry fields: {', '.join(sorted(extra))}")
            entry_type = entry.get("type", "item")
            if entry_type in ("item", "minecraft:item"):
                kind = "item"
                if "name" not in entry or "value" in entry:
                    _fail("item entry must have name and must not have value")
                normalized_entry = {
                    "type": kind,
                    "weight": entry.get("weight", 1),
                    "name": _normalized_identifier(entry["name"], "minecraft", "item name"),
                }
            elif entry_type in ("loot_table", "minecraft:loot_table"):
                kind = "loot_table"
                if "value" not in entry or "name" in entry:
                    _fail("loot-table entry must have value and must not have name")
                normalized_entry = {
                    "type": kind,
                    "weight": entry.get("weight", 1),
                    "value": _normalized_identifier(entry["value"], "minecraft", "loot table value"),
                }
            else:
                _fail(f"unsupported loot entry type: {entry_type!r}")

            weight = normalized_entry["weight"]
            if isinstance(weight, bool) or not isinstance(weight, int) or weight <= 0:
                _fail("loot entry weight must be a positive integer")

            functions = entry.get("functions", [])
            if not isinstance(functions, list):
                _fail("entry functions must be a list")
            normalized_functions: list[dict[str, Any]] = []
            for function in functions:
                if not isinstance(function, dict):
                    _fail("loot function must be an object")
                extra = set(function) - SUPPORTED_FUNCTION_FIELDS
                if extra:
                    _fail(f"unsupported loot function fields: {', '.join(sorted(extra))}")
                function_id = function.get("function")
                if function_id not in ("set_count", "minecraft:set_count"):
                    _fail(f"unsupported loot function: {function_id!r}")
                if "count" not in function:
                    _fail("set_count function requires count")
                normalized_functions.append({"function": "set_count", "count": _normalize_count(function["count"])})

            normalized_entry["functions"] = normalized_functions
            normalized_entries.append(normalized_entry)
        normalized_pools.append({"rolls": rolls, "entries": normalized_entries})
    return {"pools": normalized_pools}


def validate_tables(tables: dict[str, dict[str, Any]]) -> None:
    """Validate table graph references and the runtime's single-result contract."""
    if not tables:
        _fail("no custom loot tables were loaded")
    for table_id, table in tables.items():
        if len(table["pools"]) != 1 or table["pools"][0]["rolls"] != 1:
            _fail(f"{table_id} must have exactly one pool with one roll")
        for pool in table["pools"]:
            for entry in pool["entries"]:
                if entry["type"] != "loot_table":
                    continue
                reference = entry["value"]
                if reference == GRAVEL_ADAPTER_ID or reference in tables:
                    continue
                _fail(f"unresolved loot table reference {reference!r} from {table_id}")


def default_source_root() -> Path:
    configured = os.environ.get("CHUNKLOCK_JAVA_REFERENCE")
    if configured:
        return Path(configured).expanduser().resolve()
    return (Path(__file__).resolve().parents[2] / "java_mod" / "data").resolve()


def load_tables(source_root: Path) -> dict[str, dict[str, Any]]:
    loot_root = source_root / "chunklock" / "loot_table"
    if not loot_root.is_dir():
        _fail(f"loot-table directory not found: {loot_root}")

    tables: dict[str, dict[str, Any]] = {}
    counts = {key: 0 for key in EXPECTED_COUNTS}
    for group in EXPECTED_COUNTS:
        group_root = loot_root / group
        if not group_root.is_dir():
            _fail(f"expected loot-table directory not found: {group_root}")
        for path in sorted(group_root.rglob("*.json")):
            relative = path.relative_to(loot_root).with_suffix("").as_posix()
            table_id = f"chunklock:{relative}"
            try:
                source = json.loads(path.read_text(encoding="utf-8"))
                tables[table_id] = normalize_table(source)
            except (OSError, json.JSONDecodeError, ValueError) as error:
                _fail(f"{path}: {error}")
            counts[group] += 1

    if counts != EXPECTED_COUNTS:
        _fail(f"expected {EXPECTED_COUNTS} source tables, found {counts}")
    if len(tables) != EXPECTED_TOTAL:
        _fail(f"expected {EXPECTED_TOTAL} unique table IDs, found {len(tables)}")
    validate_tables(tables)
    return tables


def render_typescript(tables: dict[str, dict[str, Any]]) -> str:
    data = json.dumps(tables, ensure_ascii=False, indent=2, sort_keys=True)
    return """/* Generated by tools/build_loot_tables.py. Do not edit by hand. */
export type LootCount = number | Readonly<{ min: number; max: number }>;
export type LootFunction = Readonly<{ function: "set_count"; count: LootCount }>;
export type LootEntry =
  | Readonly<{ type: "item"; weight: number; name: string; functions: readonly LootFunction[] }>
  | Readonly<{ type: "loot_table"; weight: number; value: string; functions: readonly LootFunction[] }>;
export type LootTable = Readonly<{
  pools: readonly Readonly<{ rolls: 1; entries: readonly LootEntry[] }>[];
}>;

export const SOURCE_TABLE_COUNT = """ + str(len(tables)) + ";\n" + "export const LOOT_TABLES: Readonly<Record<string, LootTable>> = " + data + ";\n"


def format_typescript(source: str) -> str:
    """Apply the repository's pinned Prettier formatter for stable checked output."""
    prettier = Path(__file__).resolve().parents[1] / "node_modules" / "prettier" / "bin" / "prettier.cjs"
    if not prettier.is_file():
        _fail("Prettier is unavailable; install project dependencies with npm ci before compiling loot tables")
    result = subprocess.run(
        ["node", str(prettier), "--parser", "typescript"],
        input=source,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return result.stdout


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=default_source_root(), help="Java data root")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "scripts" / "loot-tables-data.ts",
        help="generated TypeScript output",
    )
    parser.add_argument("--check", action="store_true", help="fail when generated output is stale")
    args = parser.parse_args(argv)

    try:
        generated = format_typescript(render_typescript(load_tables(args.source)))
        if args.check:
            current = args.output.read_text(encoding="utf-8") if args.output.exists() else None
            if current != generated:
                print(f"Generated loot data is stale: {args.output}", file=sys.stderr)
                return 1
            print(f"Verified {EXPECTED_TOTAL} loot tables: {args.output}")
            return 0
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(generated, encoding="utf-8", newline="\n")
        print(f"Compiled {EXPECTED_TOTAL} loot tables: {args.output}")
        return 0
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Loot-table compilation failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
