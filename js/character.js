// js/character.js
/**
 * @file 遊戲中所有人物的基底類別
 */

import { GAME_CONSTANTS } from './constants.js';

export class Character {
    constructor(x, y, hp, speed, tileSize) {
        this.x = x; // 磁磚X座標 (整數)
        this.y = y; // 磁磚Y座標 (整數)
        this.pxX = x * tileSize; // 像素X座標 (浮點數)
        this.pxY = y * tileSize; // 像素Y座標 (浮點數)
        this.targetX = x; // 目標磁磚X座標 (整數)
        this.targetY = y; // 目標磁磚Y座標 (整數)
        this.hp = hp;
        this.maxHp = hp;
        this.speedPx = speed; // 像素移動速度 (每幀移動的像素量)
        this.isMoving = false;
        this.animationFrame = 0; // 當前動畫幀
        this.animationTimer = 0; // 用於控制動畫幀切換的計時器
        this.tileSize = tileSize; // 方便子類別繪製

        this.lastAttackTime = 0; // 上次攻擊時間
        this.collisionRadius = tileSize * 0.2; // 預設碰撞半徑，子類別可覆寫
    }

    /**
     * 更新人物動畫狀態
     */
    updateAnimation() {
        if (this.isMoving) {
            this.animationTimer++;
            // 每個角色可以有自己的動畫速度，這裡使用通用的常數
            if (this.animationTimer >= GAME_CONSTANTS.POKOTA_ANIM_FRAME_DURATION) {
                this.animationFrame = 1 - this.animationFrame; // 在 0 和 1 之間切換
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0; // 不移動時回到預設幀
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
     * 角色移動 (基於磁磚的移動)
     * 適用於玩家角色 (胖波和熊大)
     * @param {string} direction - 移動方向 ('up', 'down', 'left', 'right')
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數 (Map.isWalkable)
     */
    move(direction, isWalkableFn) {
        // 如果角色正在移動到某個目標磁磚，則忽略新的移動指令
        // 確保角色完成一個磁磚的移動後才能接收下一個指令
        if (this.pxX !== this.targetX * this.tileSize || this.pxY !== this.targetY * this.tileSize) {
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

        // 檢查新的目標磁磚是否可通行
        if (isWalkableFn(newTargetX, newTargetY)) {
            this.targetX = newTargetX;
            this.targetY = newTargetY;
            this.isMoving = true; // 標記為正在移動
            this.animationTimer = 0; // 重置動畫計時器
        } else {
            this.isMoving = false; // 無法移動，停止動畫
        }
    }
}
