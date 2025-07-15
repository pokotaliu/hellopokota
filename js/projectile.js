// js/projectile.js
/**
 * @file 遊戲中的投射物 (例如蘿蔔飛彈)
 */

export class Projectile {
    constructor(startX, startY, targetX, targetY, damage, speed, tileSize) {
        this.x = startX; // 像素X座標
        this.y = startY; // 像素Y座標
        this.targetX = targetX; // 目標像素X座標
        this.targetY = targetY; // 目標像素Y座標
        this.damage = damage;
        this.speed = speed;
        this.tileSize = tileSize;
    }

    /**
     * 更新投射物位置
     * @returns {boolean} 如果到達目標則為 true
     */
    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.x = this.targetX;
            this.y = this.targetY;
            return true; // 到達目標
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
            return false; // 未到達目標
        }
    }
}
