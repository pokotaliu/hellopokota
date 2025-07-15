// js/enemyCharacter.js
/**
 * @file 遊戲中的敵人角色 (例如僵屍)
 */

import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

export class EnemyCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        // 敵人通常不使用 tile-based movement，而是直接像素移動
        // 所以 targetX/targetY 對敵人來說意義不大，但 Character 基類需要它們
        super(x, y, hp, speed, tileSize);
        this.type = 'zombie'; // 設置角色類型
        this.lastAttackTime = 0; // 僵屍上次攻擊時間
        // 僵屍的碰撞半徑 (像素)
        this.collisionRadius = this.tileSize * 0.35; // 僵屍大約佔磁磚的 70% 寬度
    }

    /**
     * 繪製僵屍
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D 渲染上下文
     * @param {number} offsetX - 鏡頭X偏移量
     * @param {number} offsetY - 鏡頭Y偏移量
     * @param {object} colors - 遊戲顏色配置
     */
    draw(ctx, offsetX, offsetY, colors) {
        const zombieX = this.pxX - offsetX;
        const zombieY = this.pxY - offsetY;
        const bodySize = this.tileSize * 0.7; // 僵屍身體大小佔磁磚的比例

        ctx.fillStyle = colors.zombieBody;
        // 繪製僵屍身體，使其中心與 this.pxX, this.pxY 對齊
        // 注意：為了與 Character 的 pxX/pxY 保持一致，我們將其視為實體的左上角
        // 所以實際繪製時需要偏移以居中
        ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2, bodySize, bodySize);

        ctx.fillStyle = colors.zombieEye;
        // 繪製眼睛
        ctx.fillRect(zombieX + this.tileSize * 0.3, zombieY + this.tileSize * 0.4, 4, 4);
        ctx.fillRect(zombieX + this.tileSize * 0.7 - 4, zombieY + this.tileSize * 0.4, 4, 4);

        // 繪製血條
        const hpBarWidth = bodySize * (this.hp / this.maxHp);
        ctx.fillStyle = 'red';
        ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, hpBarWidth, 4);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, bodySize, 4);
    }

    /**
     * 僵屍的 AI 邏輯：追蹤玩家並攻擊
     * @param {PlayerCharacter} player - 玩家角色
     * @param {function} attackPlayerFn - 攻擊玩家的函數 (例如 Game.zombieAttackPlayer)
     * @param {number} currentTime - 當前遊戲時間
     */
    updateAI(player, attackPlayerFn, currentTime) {
        if (player.hp <= 0 || this.hp <= 0) return; // 如果玩家或僵屍死了，停止 AI

        // 僵屍的中心點 (用於計算距離)
        const currentZombieCenterX = this.pxX + this.tileSize / 2;
        const currentZombieCenterY = this.pxY + this.tileSize / 2;

        // 胖波的中心點 (用於計算距離)
        const targetPlayerCenterX = player.pxX + player.tileSize / 2;
        const targetPlayerCenterY = player.pxY + player.tileSize / 2;

        const dx = targetPlayerCenterX - currentZombieCenterX;
        const dy = targetPlayerCenterY - currentZombieCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 檢查是否在攻擊範圍內
        if (distance <= GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_PX) {
            this.isMoving = false; // 在攻擊範圍內停止移動
            // 檢查攻擊冷卻時間
            if (currentTime - this.lastAttackTime > GAME_CONSTANTS.ZOMBIE_ATTACK_INTERVAL) {
                attackPlayerFn(this, player); // 呼叫攻擊玩家的函數
                this.lastAttackTime = currentTime;
            }
        } else {
            // 不在攻擊範圍內，繼續追蹤
            this.isMoving = true;
            // 正規化方向向量並乘以速度
            if (distance > 0) { // 避免除以零
                this.pxX += (dx / distance) * this.speedPx;
                this.pxY += (dy / distance) * this.speedPx;
            }
        }

        // 更新磁磚座標 (僅供邏輯判斷，例如 isWalkable 不適用於僵屍的像素移動)
        // 僵屍的 x, y 磁磚座標應該基於其像素座標的四捨五入
        this.x = Math.floor(this.pxX / this.tileSize);
        this.y = Math.floor(this.pxY / this.tileSize);

        // 更新動畫計時器
        this.updateAnimation();
    }
}
