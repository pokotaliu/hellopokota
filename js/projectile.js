// js/projectile.js
/**
 * @file 遊戲中的投射物 (例如蘿蔔飛彈)
 */

export class Projectile {
    constructor(startX, startY, targetX, targetY, damage, speed, tileSize) {
        this.pxX = startX; // 像素X座標
        this.pxY = startY; // 像素Y座標
        this.targetPxX = targetX; // 目標像素X座標
        this.targetPxY = targetY; // 目標像素Y座標
        this.damage = damage;
        this.speed = speed; // 像素移動速度
        this.tileSize = tileSize;
        this.collisionRadius = tileSize * 0.1; // 投射物的碰撞半徑 (例如蘿蔔的大小)
    }

    /**
     * 更新投射物位置
     * @returns {boolean} 如果到達目標則為 true
     */
    update() {
        const dx = this.targetPxX - this.pxX;
        const dy = this.targetPxY - this.pxY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.pxX = this.targetPxX;
            this.pxY = this.targetPxY;
            return true; // 到達目標
        } else {
            this.pxX += (dx / distance) * this.speed;
            this.pxY += (dy / distance) * this.speed;
            return false; // 未到達目標
        }
    }
}
