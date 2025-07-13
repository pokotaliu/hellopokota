// map.js
export const tileSize = 40; // 每格 40px

const layout = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0]
];

export class Map {
  constructor() {
    this.layout = layout;
  }

  draw(ctx) {
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        const tile = this.layout[y][x];
        ctx.fillStyle = tile === 0 ? '#eee' : '#444';
        ctx.fillRect(
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

export function isWalkable(x, y, map) {
  if (
    y >= 0 &&
    y < map.layout.length &&
    x >= 0 &&
    x < map.layout[0].length
  ) {
    return map.layout[y][x] === 0;
  }
  return false;
}
