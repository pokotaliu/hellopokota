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
    }

    /**
     * 繪製胖波（兔子）角色，包含走路動畫
     * (此方法已移至 Renderer 類別中，但保留此處作為 Character 介面的一部分，儘管不直接使用)
     */
    draw(ctx, offsetX, offsetY, colors) {
        // 實際繪製由 Renderer._drawPokota 處理
        // 這裡可以留空或放置一個錯誤提示，如果這個方法被意外調用
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

            // 判斷是否到達當前目標磁磚 (使用磁磚座標判斷，更可靠)
            if (this.x === this.targetX && this.y === this.targetY) {
                // 如果敵人在安全距離內，嘗試後退
                if (distToClosestEnemy < GAME_CONSTANTS.POKOTA_SAFE_DISTANCE_TILES) {
                    // 嘗試遠離敵人
                    let deltaX = this.x - closestEnemy.x;
                    let deltaY = this.y - closestEnemy.y;

                    let potentialNextX = this.x;
                    let potentialNextY = this.y;

                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        potentialNextX = this.x + Math.sign(deltaX);
                    } else {
                        potentialNextY = this.y + Math.sign(deltaY);
                    }

                    if (isWalkableFn(potentialNextX, potentialNextY)) {
                        nextTargetX = potentialNextX;
                        nextTargetY = potentialNextY;
                    } else {
                        // 如果無法直接後退，嘗試橫向移動
                        if (isWalkableFn(this.x + Math.sign(deltaY), this.y)) { // 嘗試向右/左移動
                            nextTargetX = this.x + Math.sign(deltaY);
                            nextTargetY = this.y;
                        } else if (isWalkableFn(this.x - Math.sign(deltaY), this.y)) { // 嘗試向左/右移動
                            nextTargetX = this.x - Math.sign(deltaY);
                            nextTargetY = this.y;
                        } else if (isWalkableFn(this.x, this.y + Math.sign(deltaX))) { // 嘗試向上/下移動
                            nextTargetX = this.x;
                            nextTargetY = this.y + Math.sign(deltaX);
                        } else if (isWalkableFn(this.x, this.y - Math.sign(deltaX))) { // 嘗試向下/上移動
                            nextTargetX = this.x;
                            nextTargetY = this.y - Math.sign(deltaX);
                        } else {
                            // 無法移動，停留在原地
                            nextTargetX = this.x;
                            nextTargetY = this.y;
                        }
                    }
                } else if (distToClosestEnemy > GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES) { // 如果敵人太遠，靠近一點
                    // 靠近敵人 (與之前邏輯相同)
                    if (Math.abs(closestEnemy.x - this.x) > Math.abs(closestEnemy.y - this.y)) {
                        let potentialNextX = this.x + Math.sign(closestEnemy.x - this.x);
                        if (isWalkableFn(potentialNextX, this.y)) {
                            nextTargetX = potentialNextX;
                            nextTargetY = this.y;
                        } else {
                            let potentialNextY = this.y + Math.sign(closestEnemy.y - this.y);
                            if (isWalkableFn(this.x, potentialNextY)) {
                                nextTargetX = this.x;
                                nextTargetY = potentialNextY;
                            } else {
                                nextTargetX = this.x;
                                nextTargetY = this.y;
                            }
                        }
                    } else {
                        let potentialNextY = this.y + Math.sign(closestEnemy.y - this.y);
                        if (isWalkableFn(this.x, potentialNextY)) {
                            nextTargetX = this.x;
                            nextTargetY = potentialNextY;
                        } else {
                            let potentialNextX = this.x + Math.sign(closestEnemy.x - this.x);
                            if (isWalkableFn(potentialNextX, this.y)) {
                                nextTargetX = potentialNextX;
                                nextTargetY = this.y;
                            } else {
                                nextTargetX = this.x;
                                nextTargetY = this.y;
                            }
                        }
                    }
                } else { // 在最佳攻擊範圍內，停留在原地
                    nextTargetX = this.x;
                    nextTargetY = this.y;
                }
                this.targetX = nextTargetX;
                this.targetY = nextTargetY;
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
