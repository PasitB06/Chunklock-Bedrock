export const chunkAt = (position: number) => Math.floor(position / 16);
export interface Cell {
  x: number;
  z: number;
}
export type CardinalSide = "north" | "east" | "south" | "west";
export interface WallEdge extends Cell {
  key: string;
  axis: "x" | "z";
  openCell: Cell;
  lockedCell: Cell;
  side: CardinalSide;
}
const DIRECTIONS: readonly [number, number, CardinalSide][] = [
  [0, -1, "north"],
  [1, 0, "east"],
  [0, 1, "south"],
  [-1, 0, "west"],
];

export function wallEdges(cells: Cell[], isOpen: (x: number, z: number) => boolean): WallEdge[] {
  const edges = new Map<string, WallEdge>();
  for (const { x, z } of cells) {
    for (const [dx, dz, side] of DIRECTIONS) {
      if (isOpen(x + dx, z + dz)) continue;
      const axis = dx === 0 ? "x" : "z";
      const px = dx === 0 ? x * 16 + 8 : (x + (dx > 0 ? 1 : 0)) * 16;
      const pz = dz === 0 ? z * 16 + 8 : (z + (dz > 0 ? 1 : 0)) * 16;
      const key = `${axis}:${px}:${pz}`;
      edges.set(key, {
        key,
        axis,
        x: px,
        z: pz,
        openCell: { x, z },
        lockedCell: { x: x + dx, z: z + dz },
        side: side as CardinalSide,
      });
    }
  }
  return [...edges.values()];
}

// Supercover grid traversal: also test both cells touched at diagonal corners.
export function segmentTouchesLocked(from: Cell, to: Cell, locked: (x: number, z: number) => boolean): boolean {
  let x = chunkAt(from.x),
    z = chunkAt(from.z);
  const endX = chunkAt(to.x),
    endZ = chunkAt(to.z);
  const dx = to.x - from.x,
    dz = to.z - from.z;
  const sx = Math.sign(dx),
    sz = Math.sign(dz);
  const deltaX = dx === 0 ? Infinity : 16 / Math.abs(dx);
  const deltaZ = dz === 0 ? Infinity : 16 / Math.abs(dz);
  let tx = dx === 0 ? Infinity : ((x + (sx > 0 ? 1 : 0)) * 16 - from.x) / dx;
  let tz = dz === 0 ? Infinity : ((z + (sz > 0 ? 1 : 0)) * 16 - from.z) / dz;
  for (let i = 0; i < 128; i++) {
    if (locked(x, z)) return true;
    if (x === endX && z === endZ) return false;
    if (Math.abs(tx - tz) < 1e-10) {
      if (locked(x + sx, z) || locked(x, z + sz)) return true;
      x += sx;
      z += sz;
      tx += deltaX;
      tz += deltaZ;
    } else if (tx < tz) {
      x += sx;
      tx += deltaX;
    } else {
      z += sz;
      tz += deltaZ;
    }
  }
  return true;
}
