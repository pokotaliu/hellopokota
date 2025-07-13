// enemy.js
import { tileSize, isWalkable } from './map.js';

export class Enemy {
  constructor(tileX, tileY) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.color = 'blue';
  }

  update(map) {
    // 簡單隨機移動邏輯（後續可改成 AI 或路徑演算法）
    if (Math.random() < 0.05) {
      const dir = [
        [0, -1], // 上
        [0, 1],  // 下
        [-1, 0], // 左
        [1, 0]   // 右
      ];
      const [dx, dy] = dir[Math.floor(Math.random() * dir.length)];
      const newX = this.tileX + dx;
      const newY = this.tileY + dy;
      if (isWalkable(newX, newY, map)) {
        this.tileX = newX;
        this.tileY = newY;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.tileX * tileSize + tileSize / 2,
      this.tileY * tileSize + tileSize / 2,
      tileSize / 2 - 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
