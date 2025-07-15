// js/playerCharacter.js
/**
 * @file 玩家角色類別，包含其繪製和遠程攻擊邏輯
 */

import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

export class PlayerCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        super(x, y, hp, speed, tileSize);
        this.type = 'pokota'; // 設置角色類型
        this.isAutoCombatMode = false; // 胖波特有，是否開啟自動戰鬥
        // 胖波的碰撞半徑 (像素)
        this.collisionRadius = this.tileSize * 0.3; // 胖波大約佔磁磚的 60% 寬度
    }

    /**
     * 繪製胖波（兔子）角色
     * 這個方法由 Renderer 調用，Renderer 會根據 player.type 決定調用哪個私有繪圖函數
     * 因此這個 draw 方法實際可以為空或提供一個抽象提示
     */
    draw(ctx, offsetX, offsetY, colors) {
        // 實際繪製邏輯在 Renderer 中。
        // 這個方法在這裡可以保持為空。
    }

    /**
     * 胖波的自動戰鬥 AI
     * @param {Array<EnemyCharacter>} enemies - 敵人陣列
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數 (Map.isWalkable)
     * @param {function} attackFn - 攻擊函數 (例如 Game.shootCarrot)
     * @param {number} currentTime - 當前時間
     */
    autoCombat(enemies, isWalkableFn, attackFn, currentTime) {
        if (this.hp <= 0) {
            this.isAutoCombatMode = false; // 死亡後停止自動戰鬥
            return;
        }

        // 當前位置和目標位置必須一致時才能決定下一步行動
        // 避免在移動過程中重複計算新的目標點
        if (this.pxX !== this.targetX * this.tileSize || this.pxY !== this.targetY * this.tileSize) {
            return; // 仍在前往目標位置，等待到達
        }

        let closestEnemy = null;
        let minDistance = Infinity; // 磁磚距離

        enemies.forEach(zombie => {
            const dist = Math.sqrt(
                Math.pow(zombie.x - this.x, 2) +
                Math.pow(zombie.y - this.y, 2)
            );
            if (dist < minDistance) {
                minDistance = dist;
                closestEnemy = zombie;
            }
        });

        if (closestEnemy) {
            let nextTargetX = this.x;
            let nextTargetY = this.y;
            let moved = false;

            // 如果敵人在安全距離內，嘗試後退
            if (minDistance < GAME_CONSTANTS.POKOTA_SAFE_DISTANCE_TILES) {
                const deltaX = this.x - closestEnemy.x;
                const deltaY = this.y - closestEnemy.y;

                // 嘗試向最遠離敵人的方向移動
                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    const potentialX = this.x + Math.sign(deltaX);
                    if (isWalkableFn(potentialX, this.y)) {
                        nextTargetX = potentialX;
                        nextTargetY = this.y;
                        moved = true;
                    }
                }
                if (!moved) {
                    const potentialY = this.y + Math.sign(deltaY);
                    if (isWalkableFn(this.x, potentialY)) {
                        nextTargetX = this.x;
                        nextTargetY = potentialY;
                        moved = true;
                    }
                }
                // 如果無法直接後退，嘗試橫向移動來繞開障礙
                if (!moved) {
                    if (Math.abs(deltaX) >= Math.abs(deltaY)) { // 曾想沿X移動，現在嘗試Y
                        const potentialY1 = this.y + 1;
                        const potentialY2 = this.y - 1;
                        if (isWalkableFn(this.x, potentialY1)) {
                            nextTargetX = this.x;
                            nextTargetY = potentialY1;
                            moved = true;
                        } else if (isWalkableFn(this.x, potentialY2)) {
                            nextTargetX = this.x;
                            nextTargetY = potentialY2;
                            moved = true;
                        }
                    } else { // 曾想沿Y移動，現在嘗試X
                        const potentialX1 = this.x + 1;
                        const potentialX2 = this.x - 1;
                        if (isWalkableFn(potentialX1, this.y)) {
                            nextTargetX = potentialX1;
                            nextTargetY = this.y;
                            moved = true;
                        } else if (isWalkableFn(potentialX2, this.y)) {
                            nextTargetX = potentialX2;
                            nextTargetY = this.y;
                            moved = true;
                        }
                    }
                }
            } else if (minDistance > GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES) { // 如果敵人太遠，靠近一點
                const deltaX = closestEnemy.x - this.x;
                const deltaY = closestEnemy.y - this.y;

                // 嘗試向最近敵人的方向移動
                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    const potentialX = this.x + Math.sign(deltaX);
                    if (isWalkableFn(potentialX, this.y)) {
                        nextTargetX = potentialX;
                        nextTargetY = this.y;
                        moved = true;
                    }
                }
                if (!moved) {
                    const potentialY = this.y + Math.sign(deltaY);
                    if (isWalkableFn(this.x, potentialY)) {
                        nextTargetX = this.x;
                        nextTargetY = potentialY;
                        moved = true;
                    }
                }
                // 如果無法直接靠近，嘗試橫向移動來繞開障礙
                if (!moved) {
                    if (Math.abs(deltaX) >= Math.abs(deltaY)) { // 曾想沿X移動，現在嘗試Y
                        const potentialY1 = this.y + 1;
                        const potentialY2 = this.y - 1;
                        if (isWalkableFn(this.x, potentialY1)) {
                            nextTargetX = potentialY1;
                            nextTargetY = this.y; // 這裡應該是 Y 軸移動，所以 Y 改變，X 不變
                            moved = true;
                        } else if (isWalkableFn(this.x, potentialY2)) {
                            nextTargetX = this.x;
                            nextTargetY = potentialY2;
                            moved = true;
                        }
                    } else { // 曾想沿Y移動，現在嘗試X
                        const potentialX1 = this.x + 1;
                        const potentialX2 = this.x - 1;
                        if (isWalkableFn(potentialX1, this.y)) {
                            nextTargetX = potentialX1;
                            nextTargetY = this.y;
                            moved = true;
                        } else if (isWalkableFn(potentialX2, this.y)) {
                            nextTargetX = potentialX2;
                            nextTargetY = this.y;
                            moved = true;
                        }
                    }
                }
            } else { // 在最佳攻擊範圍內 (非安全距離且非太遠)，停留在原地
                nextTargetX = this.x;
                nextTargetY = this.y;
                moved = true; // 視為已處理移動，但實際是原地不動
            }

            // 更新目標位置並標記為移動中
            if (nextTargetX !== this.targetX || nextTargetY !== this.targetY) {
                this.targetX = nextTargetX;
                this.targetY = nextTargetY;
                this.isMoving = true;
                this.animationTimer = 0; // 重置動畫計時器
            } else if (!moved) { // 如果沒有實際移動，但 AI 嘗試了移動
                this.isMoving = false; // 確保動畫停止
            }


            // 攻擊最近的敵人 (如果距離在攻擊範圍內且冷卻時間已過)
            // ZOMBIE_ATTACK_RANGE_TILES 雖然是僵屍的攻擊範圍，但這裡用來表示胖波的攻擊距離
            if (minDistance <= GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES && currentTime - this.lastAttackTime > GAME_CONSTANTS.ATTACK_INTERVAL) {
                attackFn(closestEnemy); // 呼叫傳入的攻擊函數
                this.lastAttackTime = currentTime;
            }
        } else {
            // 如果沒有敵人，停止移動並關閉自動戰鬥模式
            this.targetX = this.x;
            this.targetY = this.y;
            this.isAutoCombatMode = false;
        }
    }
}
