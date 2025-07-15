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
     * 繪製胖波（兔子）角色，包含走路動畫
     * (此方法應由 Renderer 類別中的 _drawPokota 實際處理，這裡作為 Character 抽象方法的一部分，
     * 儘管在 PlayerCharacter 實例中不直接繪製，但為了滿足繼承要求，提供一個空實現或錯誤提示)
     */
    draw(ctx, offsetX, offsetY, colors) {
        // 實際繪製邏輯在 Renderer 中。
        // 這個方法在這裡可以保持為空，或者如果你希望 Character 類有默認繪製邏輯
        // 可以在 Character 類中提供一個通用的方塊或圓形繪製，供測試使用。
        // 由於 Renderer 會直接呼叫 _drawPokota，所以這裡不需要實作繪圖邏輯。
    }

    /**
     * 胖波的自動戰鬥 AI
     * @param {Array<EnemyCharacter>} enemies - 敵人陣列
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數
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
        let minDistance = Infinity;

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
            const distToClosestEnemy = minDistance;

            let nextTargetX = this.x;
            let nextTargetY = this.y;

            // 如果敵人在安全距離內，嘗試後退
            if (distToClosestEnemy < GAME_CONSTANTS.POKOTA_SAFE_DISTANCE_TILES) {
                let moved = false;
                // 優先沿著與敵人最遠的軸移動
                const deltaX = this.x - closestEnemy.x;
                const deltaY = this.y - closestEnemy.y;

                if (Math.abs(deltaX) >= Math.abs(deltaY)) { // X軸距離更大或相等，優先X軸移動
                    const potentialX = this.x + Math.sign(deltaX);
                    if (isWalkableFn(potentialX, this.y)) {
                        nextTargetX = potentialX;
                        nextTargetY = this.y;
                        moved = true;
                    }
                }

                if (!moved) { // 如果X軸無法移動或Y軸距離更大
                    const potentialY = this.y + Math.sign(deltaY);
                    if (isWalkableFn(this.x, potentialY)) {
                        nextTargetX = this.x;
                        nextTargetY = potentialY;
                        moved = true;
                    }
                }
                
                if (!moved) { // 如果兩個主要方向都無法移動，嘗試其他方向 (繞開障礙)
                    // 嘗試垂直於主要移動方向的方向
                    if (Math.abs(deltaX) >= Math.abs(deltaY)) { // 原本想沿X移動，但失敗了，嘗試Y方向
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
                    } else { // 原本想沿Y移動，但失敗了，嘗試X方向
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
                // 如果所有方向都無法後退，則停留在原地，準備攻擊或受擊
                if (!moved) {
                    nextTargetX = this.x;
                    nextTargetY = this.y;
                }
            } else if (distToClosestEnemy > GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES) {
                // 如果敵人太遠，靠近一點
                let moved = false;
                const deltaX = closestEnemy.x - this.x;
                const deltaY = closestEnemy.y - this.y;

                if (Math.abs(deltaX) >= Math.abs(deltaY)) { // 優先X軸移動
                    const potentialX = this.x + Math.sign(deltaX);
                    if (isWalkableFn(potentialX, this.y)) {
                        nextTargetX = potentialX;
                        nextTargetY = this.y;
                        moved = true;
                    }
                }

                if (!moved) { // 如果X軸無法移動或Y軸距離更大
                    const potentialY = this.y + Math.sign(deltaY);
                    if (isWalkableFn(this.x, potentialY)) {
                        nextTargetX = this.x;
                        nextTargetY = potentialY;
                        moved = true;
                    }
                }

                if (!moved) { // 如果兩個主要方向都無法移動，嘗試其他方向 (繞開障礙)
                    if (Math.abs(deltaX) >= Math.abs(deltaY)) { // 原本想沿X移動，但失敗了，嘗試Y方向
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
                    } else { // 原本想沿Y移動，但失敗了，嘗試X方向
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
                if (!moved) {
                    nextTargetX = this.x;
                    nextTargetY = this.y;
                }

            } else { // 在最佳攻擊範圍內，停留在原地
                nextTargetX = this.x;
                nextTargetY = this.y;
            }
            
            // 只有當新的目標磁磚與當前目標磁磚不同時才更新目標
            if (nextTargetX !== this.targetX || nextTargetY !== this.targetY) {
                 this.targetX = nextTargetX;
                 this.targetY = nextTargetY;
                 this.isMoving = true; // 設置為移動中
            }


            // 攻擊最近的敵人 (如果距離在攻擊範圍內且冷卻時間已過)
            if (distToClosestEnemy <= GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES && currentTime - this.lastAttackTime > GAME_CONSTANTS.ATTACK_INTERVAL) {
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
