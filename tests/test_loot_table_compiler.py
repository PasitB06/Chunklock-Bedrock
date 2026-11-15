import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from tools.build_loot_tables import normalize_table, validate_tables


class LootTableCompilerTests(unittest.TestCase):
    def test_normalizes_items_nested_tables_and_ordered_count_functions(self):
        source = {
            "pools": [
                {
                    "rolls": 1,
                    "entries": [
                        {
                            "type": "minecraft:item",
                            "name": "stone",
                            "weight": 3,
                            "functions": [
                                {
                                    "function": "minecraft:set_count",
                                    "count": {"min": 1, "max": 2},
                                }
                            ],
                        },
                        {
                            "type": "loot_table",
                            "value": "chunklock:generic/wood/oak",
                            "weight": 7,
                            "functions": [{"function": "set_count", "count": 1}],
                        },
                    ],
                }
            ]
        }

        normalized = normalize_table(source)

        self.assertEqual(normalized["pools"][0]["entries"][0]["name"], "minecraft:stone")
        self.assertEqual(normalized["pools"][0]["entries"][0]["functions"][0]["function"], "set_count")
        self.assertEqual(normalized["pools"][0]["entries"][1]["value"], "chunklock:generic/wood/oak")
        self.assertEqual(normalized["pools"][0]["entries"][1]["functions"][0]["count"], 1)

    def test_rejects_unsupported_table_conditions(self):
        with self.assertRaisesRegex(ValueError, "unsupported table fields"):
            normalize_table({"pools": [], "random_sequence": "minecraft:test"})

    def test_rejects_unsupported_entry_conditions_and_functions(self):
        entry = {
            "type": "item",
            "name": "minecraft:stone",
            "weight": 1,
            "conditions": [{"condition": "minecraft:survives_explosion"}],
        }
        with self.assertRaisesRegex(ValueError, "unsupported entry fields"):
            normalize_table({"pools": [{"rolls": 1, "entries": [entry]}]})

        entry.pop("conditions")
        entry["functions"] = [{"function": "set_damage", "damage": 0.5}]
        with self.assertRaisesRegex(ValueError, "unsupported loot function"):
            normalize_table({"pools": [{"rolls": 1, "entries": [entry]}]})

    def test_validates_references_and_allows_the_vanilla_gravel_adapter(self):
        table = normalize_table(
            {
                "pools": [
                    {
                        "rolls": 1,
                        "entries": [
                            {
                                "type": "loot_table",
                                "value": "minecraft:blocks/gravel",
                                "weight": 1,
                                "functions": [],
                            }
                        ],
                    }
                ]
            }
        )

        validate_tables({"chunklock:biome/test": table})

        table["pools"][0]["entries"][0]["value"] = "chunklock:generic/missing"
        with self.assertRaisesRegex(ValueError, "unresolved loot table"):
            validate_tables({"chunklock:biome/test": table})


if __name__ == "__main__":
    unittest.main()
