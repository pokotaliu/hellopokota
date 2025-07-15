// js/enemyCharacter.js
/**
 * @file 遊戲中的敵人角色 (例如僵屍)
 */

import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

export class EnemyCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        super(x, y, hp, speed, tileSize);
        this.lastAttackTime = 0; // 僵屍上次攻擊時間
    }

    /**
     * 繪製僵屍
     */
    draw(ctx, offsetX, offsetY, colors) {
        const zombieX = this.pxX - offsetX;
        const zombieY = this.pxY - offsetY;
        const bodySize = this.tileSize * 0.7;

        ctx.fillStyle = colors.zombieBody;
        ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2, bodySize, bodySize);

        ctx.fillStyle = colors.zombieEye;
        ctx.fillRect(zombieX + this.tileSize * 0.3, zombieY + this.tileSize * 0.4, 4, 4);
        ctx.fillRect(zombieX + this.tileSize * 0.7 - 4, zombieY + this.tileSize * 0.4, 4, 4);

        const hpBarWidth = bodySize * (this.hp / this.maxHp);
        ctx.fillStyle = 'red';
        ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, hpBarWidth, 4);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, bodySize, 4);
    }

    /**
     * 僵屍的 AI 邏輯：追蹤玩家
     * @param {PlayerCharacter} player - 玩家角色
     */
    updateAI(player) {
        if (player.hp <= 0) return; // 如果玩家死了，僵屍停止追蹤

        // 僵屍目標是胖波的中心
        const targetPlayerPxX = player.pxX + this.tileSize / 2;
        const targetPlayerPxY = player.pxY + this.tileSize / 2;

        const currentZombiePxX = this.pxX + this.tileSize / 2;
        const currentZombiePxY = this.pxY + this.tileSize / 2;

        const dx = targetPlayerPxX - currentZombiePxX;
        const dy = targetPlayerPxY - currentZombiePxY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 只有當距離大於攻擊範圍時才移動
        if (distance > GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_PX * 0.8) { // 留一點緩衝，避免頻繁停止
            this.pxX += (dx / distance) * this.speedPx;
            this.pxY += (dy / distance) * this.speedPx;
            this.isMoving = true;
        } else {
            // 僵屍到達胖波攻擊範圍內，停止移動
            this.isMoving = false;
        }

        // 更新磁磚座標 (僅供邏輯判斷，實際繪製使用 pxX/pxY)
        this.x = Math.round(this.pxX / this.tileSize);
        this.y = Math.round(this.pxY / this.tileSize);
    }
}
