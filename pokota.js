// pokota.js
import { tileSize, isWalkable } from './map.js';

export class Pokota {
  constructor(tileX, tileY) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.color = 'pink';
  }

  move(dx, dy, map) {
    const newX = this.tileX + dx;
    const newY = this.tileY + dy;
    if (isWalkable(newX, newY, map)) {
      this.tileX = newX;
      this.tileY = newY;
    }
  }

  update(map) {
    // 可改為鍵盤輸入控制；這裡先簡單隨機移動做示意
    if (Math.random() < 0.02) {
      const dir = [
        [0, -1], // 上
        [0, 1],  // 下
        [-1, 0], // 左
        [1, 0]   // 右
      ];
      const [dx, dy] = dir[Math.floor(Math.random() * dir.length)];
      this.move(dx, dy, map);
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.tileX * tileSize + tileSize / 2,
      this.tileY * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
