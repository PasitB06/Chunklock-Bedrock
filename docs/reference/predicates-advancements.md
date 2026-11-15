# Complete predicate and advancement reference

Generated from local reference data by `python tools/reference_docs.py`. Do not edit generated content.


Java paths below identify local-only reference files outside this repository; they are source locators, not GitHub links.

## advancement: chunklock:main/chunk_dye

`java_mod/data/chunklock/advancement/main/chunk_dye.json`

```json
{
  "parent": "chunklock:main/made_by_quillbee",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Dyer"
    },
    "description": {
      "text": "Change the color of a chunk"
    },
    "frame": "task",
    "hidden": true
  }
}
```

## advancement: chunklock:main/chunk_item_ancient_debris

`java_mod/data/chunklock/advancement/main/chunk_item_ancient_debris.json`

```json
{
  "parent": "chunklock:main/chunk_item_nether_brick",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Hefty Price"
    },
    "description": {
      "text": "Unlock a chunk using Ancient Debris"
    },
    "hidden": false,
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/chunk_item_coal

`java_mod/data/chunklock/advancement/main/chunk_item_coal.json`

```json
{
  "parent": "chunklock:main/chunk_item_stone",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Coal Cost"
    },
    "description": {
      "text": "Unlock a chunk using a piece of Coal"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_diamond

`java_mod/data/chunklock/advancement/main/chunk_item_diamond.json`

```json
{
  "parent": "chunklock:main/chunk_item_emerald",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Shiny Tribute"
    },
    "description": {
      "text": "Unlock a chunk using a Diamond"
    },
    "hidden": false,
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/chunk_item_emerald

`java_mod/data/chunklock/advancement/main/chunk_item_emerald.json`

```json
{
  "parent": "chunklock:main/chunk_item_gold_ingot",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Green Gift"
    },
    "description": {
      "text": "Unlock a chunk using an emerald"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_gold_ingot

`java_mod/data/chunklock/advancement/main/chunk_item_gold_ingot.json`

```json
{
  "parent": "chunklock:main/chunk_item_iron_ingot",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Golden Gift"
    },
    "description": {
      "text": "Unlock a chunk using a Gold Ingot"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_iron_ingot

`java_mod/data/chunklock/advancement/main/chunk_item_iron_ingot.json`

```json
{
  "parent": "chunklock:main/chunk_item_coal",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "An Ironic Tribute"
    },
    "description": {
      "text": "Unlock a chunk using an Iron Ingot"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_nether_brick

`java_mod/data/chunklock/advancement/main/chunk_item_nether_brick.json`

```json
{
  "parent": "chunklock:main/chunks_nether_unlocked_1",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "Just Another Brick in The Chunk"
    },
    "description": {
      "text": "Unlock a chunk using Nether Brick"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_pufferfish

`java_mod/data/chunklock/advancement/main/chunk_item_pufferfish.json`

```json
{
  "parent": "chunklock:main/chunk_item_stone",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Puffy Price"
    },
    "description": {
      "text": "Unlock a chunk using a pufferfish"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunk_item_stone

`java_mod/data/chunklock/advancement/main/chunk_item_stone.json`

```json
{
  "parent": "chunklock:main/chunks_overworld_unlocked_1",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:impossible"
    }
  },
  "display_text": {
    "title": {
      "text": "A Stone Cold Offer"
    },
    "description": {
      "text": "Unlock a chunk using a piece of Stone"
    },
    "hidden": false
  }
}
```

## advancement: chunklock:main/chunks_end_unlocked_1y

`java_mod/data/chunklock/advancement/main/chunks_end_unlocked_1y.json`

```json
{
  "parent": "chunklock:main/chunks_nether_unlocked_1",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockEndUnlockedChunks": {
                "min": 1
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunklock Endgame"
    },
    "description": {
      "text": "Unlock your first chunk in the End"
    },
    "frame": "goal"
  }
}
```

## advancement: chunklock:main/chunks_nether_unlocked_1

`java_mod/data/chunklock/advancement/main/chunks_nether_unlocked_1.json`

```json
{
  "parent": "chunklock:main/made_by_quillbee",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockNetherUnlockedChunks": {
                "min": 1
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Nether Chunker"
    },
    "description": {
      "text": "Unlock your first chunk in the Nether"
    },
    "frame": "goal"
  }
}
```

## advancement: chunklock:main/chunks_overworld_unlocked_1

`java_mod/data/chunklock/advancement/main/chunks_overworld_unlocked_1.json`

```json
{
  "parent": "chunklock:main/made_by_quillbee",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockOverworldUnlockedChunks": {
                "min": 1
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "The Grass is Always Chunkier"
    },
    "description": {
      "text": "Unlock your first chunk in the Overworld"
    },
    "frame": "goal"
  }
}
```

## advancement: chunklock:main/chunks_unlocked_1

`java_mod/data/chunklock/advancement/main/chunks_unlocked_1.json`

```json
{
  "parent": "chunklock:main/made_by_quillbee",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 16
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Novice"
    },
    "description": {
      "text": "Unlock 16 chunks"
    },
    "frame": "goal"
  }
}
```

## advancement: chunklock:main/chunks_unlocked_2

`java_mod/data/chunklock/advancement/main/chunks_unlocked_2.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_1",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 64
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Explorer"
    },
    "description": {
      "text": "Unlock 64 chunks"
    }
  }
}
```

## advancement: chunklock:main/chunks_unlocked_3

`java_mod/data/chunklock/advancement/main/chunks_unlocked_3.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_2",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 128
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Pro"
    },
    "description": {
      "text": "Unlock 128 chunks"
    }
  }
}
```

## advancement: chunklock:main/chunks_unlocked_4

`java_mod/data/chunklock/advancement/main/chunks_unlocked_4.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_3",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 256
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Master"
    },
    "description": {
      "text": "Unlock 256 chunks"
    },
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/chunks_unlocked_5

`java_mod/data/chunklock/advancement/main/chunks_unlocked_5.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_4",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 512
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk Legend"
    },
    "description": {
      "text": "Unlock 512 chunks"
    },
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/chunks_unlocked_6

`java_mod/data/chunklock/advancement/main/chunks_unlocked_6.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_5",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 1024
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunk God"
    },
    "description": {
      "text": "Unlock 1024 chunks"
    },
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/chunks_unlocked_7

`java_mod/data/chunklock/advancement/main/chunks_unlocked_7.json`

```json
{
  "parent": "chunklock:main/chunks_unlocked_6",
  "criteria": {
    "chunksUnlocked": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 2048
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunklock Champion"
    },
    "description": {
      "text": "Unlock 2048 chunks"
    },
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/made_by_avidmc

`java_mod/data/chunklock/advancement/main/made_by_avidmc.json`

```json
{
  "parent": "chunklock:main/root",
  "criteria": {
    "requirement": {
      "trigger": "minecraft:tick"
    }
  },
  "display_text": {
    "title": {
      "text": "By AvidMc"
    },
    "description": {
      "text": "Co-Creator of Chunklock"
    },
    "show_toast": false,
    "announce_to_chat": false,
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/made_by_quillbee

`java_mod/data/chunklock/advancement/main/made_by_quillbee.json`

```json
{
  "parent": "chunklock:main/made_by_avidmc",
  "criteria": {
    "requirement": {
      "trigger": "minecraft:tick"
    }
  },
  "display_text": {
    "title": {
      "text": "And Quillbee"
    },
    "description": {
      "text": "Co-Creator of Chunklock"
    },
    "show_toast": false,
    "announce_to_chat": false,
    "frame": "challenge"
  }
}
```

## advancement: chunklock:main/root

`java_mod/data/chunklock/advancement/main/root.json`

```json
{
  "criteria": {
    "unlock_one_chunk": {
      "trigger": "minecraft:location",
      "conditions": {
        "player": [
          {
            "condition": "minecraft:entity_scores",
            "entity": "this",
            "scores": {
              "ChunklockTotalUnlockedChunks": {
                "min": 1
              }
            }
          }
        ]
      }
    }
  },
  "display_text": {
    "title": {
      "text": "Chunklock"
    },
    "description": {
      "text": "Watch your world expand"
    },
    "show_toast": false,
    "announce_to_chat": false
  }
}
```

## advancement: chunklock:util/change_dimension

`java_mod/data/chunklock/advancement/util/change_dimension.json`

```json
{
  "criteria": {
    "requirement": {
      "trigger": "minecraft:changed_dimension"
    }
  },
  "rewards": {
    "function": "chunklock:dimension/on_change_dimension"
  }
}
```

## predicate: chunklock:dye/is_holding_black_dye

`java_mod/data/chunklock/predicate/dye/is_holding_black_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:black_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_blue_dye

`java_mod/data/chunklock/predicate/dye/is_holding_blue_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:blue_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_brown_dye

`java_mod/data/chunklock/predicate/dye/is_holding_brown_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:brown_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_cyan_dye

`java_mod/data/chunklock/predicate/dye/is_holding_cyan_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:cyan_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_dye

`java_mod/data/chunklock/predicate/dye/is_holding_dye.json`

```json
{
  "condition": "minecraft:any_of",
  "terms": [
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:red_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:blue_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:cyan_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:gray_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:lime_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:pink_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:black_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:brown_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:green_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:white_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:orange_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:purple_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:yellow_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:magenta_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:light_blue_dye"
            ]
          }
        }
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "equipment": {
          "mainhand": {
            "items": [
              "minecraft:light_gray_dye"
            ]
          }
        }
      }
    }
  ]
}
```

## predicate: chunklock:dye/is_holding_gray_dye

`java_mod/data/chunklock/predicate/dye/is_holding_gray_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:gray_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_green_dye

`java_mod/data/chunklock/predicate/dye/is_holding_green_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:green_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_light_blue_dye

`java_mod/data/chunklock/predicate/dye/is_holding_light_blue_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:light_blue_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_light_gray_dye

`java_mod/data/chunklock/predicate/dye/is_holding_light_gray_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:light_gray_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_lime_dye

`java_mod/data/chunklock/predicate/dye/is_holding_lime_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:lime_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_magenta_dye

`java_mod/data/chunklock/predicate/dye/is_holding_magenta_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:magenta_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_orange_dye

`java_mod/data/chunklock/predicate/dye/is_holding_orange_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:orange_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_pink_dye

`java_mod/data/chunklock/predicate/dye/is_holding_pink_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:pink_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_purple_dye

`java_mod/data/chunklock/predicate/dye/is_holding_purple_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:purple_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_red_dye

`java_mod/data/chunklock/predicate/dye/is_holding_red_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:red_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_white_dye

`java_mod/data/chunklock/predicate/dye/is_holding_white_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:white_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:dye/is_holding_yellow_dye

`java_mod/data/chunklock/predicate/dye/is_holding_yellow_dye.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "equipment": {
      "mainhand": {
        "items": [
          "minecraft:yellow_dye"
        ]
      }
    }
  }
}
```

## predicate: chunklock:is_in_overworld_chunk_render_height

`java_mod/data/chunklock/predicate/is_in_overworld_chunk_render_height.json`

```json
{
  "condition": "minecraft:location_check",
  "predicate": {
    "position": {
      "y": {
        "min": -63,
        "max": 318
      }
    },
    "dimension": "minecraft:overworld"
  }
}
```

## predicate: chunklock:is_in_the_end_chunk_render_height

`java_mod/data/chunklock/predicate/is_in_the_end_chunk_render_height.json`

```json
{
  "condition": "minecraft:location_check",
  "predicate": {
    "position": {
      "y": {
        "min": 0,
        "max": 255
      }
    },
    "dimension": "minecraft:the_end"
  }
}
```

## predicate: chunklock:is_in_the_nether_chunk_render_height

`java_mod/data/chunklock/predicate/is_in_the_nether_chunk_render_height.json`

```json
{
  "condition": "minecraft:location_check",
  "predicate": {
    "position": {
      "y": {
        "min": 0,
        "max": 127
      }
    },
    "dimension": "minecraft:the_nether"
  }
}
```

## predicate: chunklock:is_looking_at_locked_chunk

`java_mod/data/chunklock/predicate/is_looking_at_locked_chunk.json`

```json
{
  "condition": "minecraft:entity_properties",
  "entity": "this",
  "predicate": {
    "type_specific": {
      "type": "player",
      "looking_at": {
        "type": "minecraft:interaction",
        "distance": {
          "absolute": {
            "min": 0,
            "max": 15
          }
        }
      }
    }
  }
}
```

## predicate: chunklock:is_projectile

`java_mod/data/chunklock/predicate/is_projectile.json`

```json
{
  "condition": "minecraft:any_of",
  "terms": [
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "#minecraft:arrows"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:egg"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:splash_potion"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:lingering_potion"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:small_fireball"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:snowball"
      }
    },
    {
      "condition": "minecraft:entity_properties",
      "entity": "this",
      "predicate": {
        "type": "minecraft:trident"
      }
    }
  ]
}
```
