# Chunklock domain language

Shared terminology for understanding the Java reference and developing the Bedrock add-on.

## Language

**Chunk**:
A horizontal 16 by 16 block area in one dimension. Equal chunk coordinates in different dimensions identify different areas.
_Avoid_: X/Z coordinates without a dimension.

**Locked chunk**:
A chunk players cannot enter until its unlock requirement or an explicit system exception has been satisfied.
_Avoid_: Unloaded chunk, ungenerated terrain.

**Unlocked chunk**:
A chunk players may enter and use, whether unlocked by starting conditions, payment or a system exception.
_Avoid_: Always treating unlocked as paid.

**Unlock requirement**:
The item type and quantity assigned as the price of unlocking one chunk.
_Avoid_: Loot awarded to the player.

**Remaining cost**:
The number of required items still owed after earlier payments have been deducted.
_Avoid_: Base count, submitted stack size.

**Payer**:
The player whose inventory supplies items to a requirement and receives credit when that payment completes an unlock.
_Avoid_: The nearest player without evidence of ownership.

**Safe position**:
The player's latest permitted location, used for returning them after entry into a locked area.
_Avoid_: Spawn point, chunk center.

**Relevant chunk**:
A locked chunk near players for which the system currently needs to display requirements and process interactions.
_Avoid_: Every loaded chunk.

**Chunklock difficulty**:
The setting that controls unlock-cost scaling and permission to reroll requirements.
_Avoid_: Minecraft world difficulty, such as Peaceful or Hard.

**Reroll**:
Replacing one chunk's existing unlock requirement with a newly selected requirement.
_Avoid_: Unlock, full-world reset.

**Progress**:
Unlock totals and achievements recorded for the world or an individual player, with ownership stated explicitly.
_Avoid_: Substituting world totals for personal totals.
