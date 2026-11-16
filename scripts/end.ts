import { Dimension } from "@minecraft/server";
import { openExemptChunk } from "./access.js";

export const END_DIMENSION_ID = "minecraft:the_end";
export const END_CENTRAL_RADIUS = 500;
export const END_CRYSTAL_TYPE = "minecraft:ender_crystal";
export const END_CRYSTAL_EDGE_INSET = 0.25;

export type EndCrystalLookup =
  | { status: "ready"; crystals: readonly { x: number; z: number }[] }
  | { status: "unavailable" }
  | { status: "unsupported" };

/**
 * Returns true when chunk `(cx, cz)` lies inside the central End island radius (`<= 500` blocks),
 * excluding outer End islands where `minecraft:the_end` biome also applies.
 */
export function isCentralEndChunk(cx: number, cz: number): boolean {
  return Math.hypot(cx * 16 + 8, cz * 16 + 8) <= END_CENTRAL_RADIUS;
}

/**
 * Queries all loaded `minecraft:ender_crystal` positions in The End once per scan/arrival.
 */
export function collectEndCrystalPositions(dimension: Dimension): EndCrystalLookup {
  if (dimension.id !== END_DIMENSION_ID || typeof dimension.getEntities !== "function") {
    return { status: "unsupported" };
  }
  try {
    const crystals = dimension.getEntities({ type: END_CRYSTAL_TYPE }).map((entity) => ({
      x: entity.location.x,
      z: entity.location.z,
    }));
    return { status: "ready", crystals };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * Checks whether any crystal lies inside chunk `(cx, cz)` shrunk by 0.25 blocks on each edge
 * (matching Java's `dx=15.5, dz=15.5` boundary inset).
 */
export function chunkContainsEndCrystal(
  crystals: readonly { x: number; z: number }[],
  cx: number,
  cz: number
): boolean {
  const minX = cx * 16 + END_CRYSTAL_EDGE_INSET;
  const maxX = (cx + 1) * 16 - END_CRYSTAL_EDGE_INSET;
  const minZ = cz * 16 + END_CRYSTAL_EDGE_INSET;
  const maxZ = (cz + 1) * 16 - END_CRYSTAL_EDGE_INSET;
  return crystals.some((crystal) => crystal.x >= minX && crystal.x <= maxX && crystal.z >= minZ && crystal.z <= maxZ);
}

/**
 * Opens a crystal-free central End chunk without unlock credit, or preserves it as locked when
 * an End crystal is present or crystal state could not yet be queried.
 */
export function tryExemptCentralEndChunk(
  dimension: Dimension,
  cx: number,
  cz: number,
  lookup: EndCrystalLookup
): "exempted" | "crystal" | "deferred" | "ineligible" {
  if (dimension.id !== END_DIMENSION_ID || !isCentralEndChunk(cx, cz)) return "ineligible";
  if (lookup.status === "unsupported") return "ineligible";
  if (lookup.status === "unavailable") return "deferred";
  if (chunkContainsEndCrystal(lookup.crystals, cx, cz)) return "crystal";
  openExemptChunk(dimension.id, cx, cz);
  return "exempted";
}
