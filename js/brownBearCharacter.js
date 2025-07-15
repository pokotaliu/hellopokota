// js/brownBearCharacter.js
/**
 * @file 熊大角色類別，包含其繪製和近戰攻擊邏輯
 */

import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

export class BrownBearCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        super(x, y, hp, speed, tileSize);
        this.type = 'brownBear'; // 設置角色類型
        this.attackRangePx = GAME_CONSTANTS.BROWN_BEAR_ATTACK_RANGE_TILES * tileSize; // 近戰攻擊範圍像素
        this.attackDamage = GAME_CONSTANTS.BROWN_BEAR_MELEE_DAMAGE;
        this.attackCooldown = GAME_CONSTANTS.BROWN_BEAR_ATTACK_COOLDOWN;
    }

    /**
     * 繪製熊大
     */
    draw(ctx, offsetX, offsetY, colors) {
        const centerX = this.pxX - offsetX + this.tileSize / 2;
        const centerY = this.pxY - offsetY + this.tileSize / 2;

        const bodyWidth = this.tileSize * 0.8;
        const bodyHeight = this.tileSize * 0.7;
        const headRadius = this.tileSize * 0.3;
        const earRadius = this.tileSize * 0.08;
        const snoutWidth = this.tileSize * 0.25;
        const snoutHeight = this.tileSize * 0.15;

        // 身體 (橢圓形)
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + this.tileSize * 0.1, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 頭部
        ctx.beginPath();
        ctx.arc(centerX, centerY - headRadius * 0.5, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // 鼻子 (Snout)
        ctx.fillStyle = colors.brownBearSnout;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - headRadius * 0.5 + headRadius * 0.6, snoutWidth / 2, snoutHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 鼻孔
        ctx.fillStyle = colors.brownBearNose;
        ctx.beginPath();
        ctx.arc(centerX - snoutWidth * 0.1, centerY - headRadius * 0.5 + headRadius * 0.6, 1.5, 0, Math.PI * 2);
        ctx.arc(centerX + snoutWidth * 0.1, centerY - headRadius * 0.5 + headRadius * 0.6, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = colors.brownBearEye;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.4, centerY - headRadius * 0.8, 3, 0, Math.PI * 2);
        ctx.arc(centerX + headRadius * 0.4, centerY - headRadius * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();

        // 耳朵
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.7, centerY - headRadius * 1.1, earRadius, 0, Math.PI * 2);
        ctx.arc(centerX + headRadius * 0.7, centerY - headRadius * 1.1, earRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors.brownBearInnerEar;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.7, centerY - headRadius * 1.1, earRadius * 0.6, 0, Math.PI * 2);
        ctx.arc(centerX + headRadius * 0.7, centerY - headRadius * 1.1, earRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 腳 (簡單的圓形)
        const footRadius = this.tileSize * 0.15;
        const footY = centerY + this.tileSize * 0.3;
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        ctx.arc(centerX - bodyWidth * 0.25, footY, footRadius, 0, Math.PI * 2);
        ctx.arc(centerX + bodyWidth * 0.25, footY, footRadius, 0, Math.PI * 2);
        ctx.fill();

        // 棍棒 (簡單的長方形)
        ctx.fillStyle = colors.brownBearClub;
        ctx.fillRect(centerX + bodyWidth * 0.3, centerY - this.tileSize * 0.1, this.tileSize * 0.4, 6);
    }

    /**
     * 熊大近戰攻擊邏輯
     * @param {EnemyCharacter} targetEnemy - 目標敵人
     * @returns {boolean} 如果成功攻擊則為 true
     */
    meleeAttack(targetEnemy) {
        if (this.hp <= 0) return false;

        const playerCenterX = this.pxX + this.tileSize / 2;
        const playerCenterY = this.pxY + this.tileSize / 2;
        const enemyCenterX = targetEnemy.pxX + this.tileSize / 2;
        const enemyCenterY = targetEnemy.pxY + this.tileSize / 2;

        const dist = Math.sqrt(
            Math.pow(playerCenterX - enemyCenterX, 2) +
            Math.pow(playerCenterY - enemyCenterY, 2)
        );

        if (dist <= this.attackRangePx) {
            targetEnemy.takeDamage(this.attackDamage);
            console.log(`熊大對僵屍造成 ${this.attackDamage} 傷害！`);
            return true;
        }
        return false;
    }

    /**
     * 熊大的自動戰鬥 AI
     * 熊大作為近戰角色，會主動接近敵人並在攻擊範圍內進行攻擊。
     * @param {Array<EnemyCharacter>} enemies - 敵人陣列
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數
     * @param {number} currentTime - 當前時間
     */
    autoCombat(enemies, isWalkableFn, currentTime) {
        if (this.hp <= 0) {
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
                // 如果敵人在攻擊範圍內，則停留在原地攻擊
                if (distToClosestEnemy <= GAME_CONSTANTS.BROWN_BEAR_ATTACK_RANGE_TILES) {
                    nextTargetX = this.x;
                    nextTargetY = this.y;
                } else {
                    // 靠近敵人
                    // 優先移動到敵人X或Y方向，取距離較遠的方向
                    if (Math.abs(closestEnemy.x - this.x) > Math.abs(closestEnemy.y - this.y)) {
                        let potentialNextX = this.x + Math.sign(closestEnemy.x - this.x);
                        if (isWalkableFn(potentialNextX, this.y)) {
                            nextTargetX = potentialNextX;
                            nextTargetY = this.y;
                        } else {
                            // 如果X方向被阻擋，嘗試Y方向
                            let potentialNextY = this.y + Math.sign(closestEnemy.y - this.y);
                            if (isWalkableFn(this.x, potentialNextY)) {
                                nextTargetX = this.x;
                                nextTargetY = potentialNextY;
                            } else {
                                // 兩個方向都無法移動，停留在原地
                                nextTargetX = this.x;
                                nextTargetY = this.y;
                            }
                        }
                    } else {
                        // 優先移動到敵人Y方向
                        let potentialNextY = this.y + Math.sign(closestEnemy.y - this.y);
                        if (isWalkableFn(this.x, potentialNextY)) {
                            nextTargetX = this.x;
                            nextTargetY = potentialNextY;
                        } else {
                            // 如果Y方向被阻擋，嘗試X方向
                            let potentialNextX = this.x + Math.sign(closestEnemy.x - this.x);
                            if (isWalkableFn(potentialNextX, this.y)) {
                                nextTargetX = potentialNextX;
                                nextTargetY = this.y;
                            } else {
                                // 兩個方向都無法移動，停留在原地
                                nextTargetX = this.x;
                                nextTargetY = this.y;
                            }
                        }
                    }
                }
                this.targetX = nextTargetX;
                this.targetY = nextTargetY;
            }

            // 攻擊最近的敵人 (如果距離在攻擊範圍內且冷卻時間已過)
            if (distToClosestEnemy <= GAME_CONSTANTS.BROWN_BEAR_ATTACK_RANGE_TILES && currentTime - this.lastAttackTime > this.attackCooldown) {
                this.meleeAttack(closestEnemy);
                this.lastAttackTime = currentTime;
            }
        } else {
            // 如果沒有敵人，停止移動
            this.targetX = this.x; // 停止移動
            this.targetY = this.y;
        }
    }
}
