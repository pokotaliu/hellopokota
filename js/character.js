// js/character.js
/**
 * @file 遊戲中所有人物的基底類別
 */

import { GAME_CONSTANTS } from './constants.js';

export class Character {
    constructor(x, y, hp, speed, tileSize) {
        this.x = x; // 磁磚X座標
        this.y = y; // 磁磚Y座標
        this.pxX = x * tileSize; // 像素X座標
        this.pxY = y * tileSize; // 像素Y座標
        this.targetX = x; // 目標磁磚X座標
        this.targetY = y; // 目標磁磚Y座標
        this.hp = hp;
        this.maxHp = hp;
        this.speedPx = speed; // 像素移動速度
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.tileSize = tileSize; // 方便子類別繪製

        this.lastAttackTime = 0; // 上次攻擊時間
    }

    /**
     * 更新人物動畫狀態
     */
    updateAnimation() {
        if (this.isMoving) {
            this.animationTimer++;
            if (this.animationTimer >= GAME_CONSTANTS.POKOTA_ANIM_FRAME_DURATION) {
                this.animationFrame = 1 - this.animationFrame;
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
    }

    /**
     * 抽象方法：繪製人物 (由子類別實現)
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D 渲染上下文
     * @param {number} offsetX - 鏡頭X偏移量
     * @param {number} offsetY - 鏡頭Y偏移量
     * @param {object} colors - 遊戲顏色配置
     */
    draw(ctx, offsetX, offsetY, colors) {
        throw new Error("draw() method must be implemented by subclass");
    }

    /**
     * 人物受到傷害
     * @param {number} amount - 傷害量
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }
}
