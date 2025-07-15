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

    /**
     * 角色移動
     * @param {string} direction - 移動方向 ('up', 'down', 'left', 'right')
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數
     */
    move(direction, isWalkableFn) {
        // 判斷是否到達目標磁磚，使用一個小的容差值
        const targetPxX_current = this.targetX * this.tileSize;
        const targetPxY_current = this.targetY * this.tileSize;

        const distToTarget = Math.sqrt(
            Math.pow(targetPxX_current - this.pxX, 2) +
            Math.pow(targetPxY_current - this.pxY, 2)
        );

        // 如果距離目標還很遠（大於移動速度），說明仍在移動中，忽略新的輸入
        // 這裡使用一個小於 speedPx 的容差值，確保在接近目標時也能接受新指令
        if (distToTarget > (this.speedPx / 2)) { // 調整容差值
            return;
        }

        let newTargetX = this.targetX;
        let newTargetY = this.targetY;

        switch (direction) {
            case 'left':
                newTargetX = this.targetX - 1;
                break;
            case 'right':
                newTargetX = this.targetX + 1;
                break;
            case 'up':
                newTargetY = this.targetY - 1;
                break;
            case 'down':
                newTargetY = this.targetY + 1;
                break;
        }

        if (isWalkableFn(newTargetX, newTargetY)) {
            this.targetX = newTargetX;
            this.targetY = newTargetY;
            this.isMoving = true; // 開始移動
        } else {
            this.isMoving = false; // 無法移動，停止動畫
        }
    }
}
