// js/brownBearCharacter.js
/**
 * @file 熊大角色類別，包含其繪製和近戰攻擊邏輯
 */

import { Character } from './character.js';
import { GAME_CONSTants } from './constants.js';

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

        // 調整熊大的尺寸比例，使其更接近 LINE Brown 的圓潤造型
        const bodyWidth = this.tileSize * 0.85; // 讓身體更寬一點
        const bodyHeight = this.tileSize * 0.85; // 讓身體更接近正圓
        const headRadius = this.tileSize * 0.38; // 稍微增大頭部
        const earRadius = this.tileSize * 0.07; // 耳朵稍小一點
        const snoutWidth = this.tileSize * 0.28; // 鼻吻部寬度
        const snoutHeight = this.tileSize * 0.1; // 鼻吻部高度，使其更扁平

        // 身體 (調整位置使其看起來與頭部銜接更自然)
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        // 身體中心稍微上移，讓整體造型更緊湊
        ctx.ellipse(centerX, centerY + this.tileSize * 0.05, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 頭部 (調整中心位置)
        // 將頭部中心設在 Y 軸上稍微靠上的位置，使其在磁磚內更顯眼
        const headCenterY = centerY - this.tileSize * 0.15;
        ctx.beginPath();
        ctx.arc(centerX, headCenterY, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // 鼻子 (Snout - 調整位置使其位於頭部較低處)
        const snoutCenterY = headCenterY + headRadius * 0.55; // 相對於頭部中心的位置
        ctx.fillStyle = colors.brownBearSnout;
        ctx.beginPath();
        ctx.ellipse(centerX, snoutCenterY, snoutWidth / 2, snoutHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 鼻孔
        ctx.fillStyle = colors.brownBearNose;
        ctx.beginPath();
        ctx.arc(centerX - snoutWidth * 0.1, snoutCenterY, 1.5, 0, Math.PI * 2);
        ctx.arc(centerX + snoutWidth * 0.1, snoutCenterY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛 (調整位置使其位於頭部靠上且兩側)
        const eyeY = headCenterY - headRadius * 0.5; // 相對於頭部中心的位置
        ctx.fillStyle = colors.brownBearEye;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.3, eyeY, 2, 0, Math.PI * 2); // 眼睛半徑稍小
        ctx.arc(centerX + headRadius * 0.3, eyeY, 2, 0, Math.PI * 2); // 眼睛半徑稍小
        ctx.fill();

        // 嘴巴 (關鍵修改：添加直線嘴巴以突顯角度)
        ctx.strokeStyle = colors.brownBearNose; // 嘴巴顏色和鼻孔相同
        ctx.lineWidth = 2; // 嘴巴線條粗細
        ctx.beginPath();
        // 嘴巴的位置在鼻吻部下方，橫跨一定寬度
        const mouthY = snoutCenterY + snoutHeight * 0.4; // 位於鼻吻部底部附近
        ctx.moveTo(centerX - snoutWidth * 0.12, mouthY); // 嘴巴起點
        ctx.lineTo(centerX + snoutWidth * 0.12, mouthY); // 嘴巴終點
        ctx.stroke(); // 繪製直線

        // 耳朵 (調整位置使其位於頭部上方兩側)
        const earY = headCenterY - headRadius * 0.8; // 相對於頭部中心的位置
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.6, earY, earRadius, 0, Math.PI * 2);
        ctx.arc(centerX + headRadius * 0.6, earY, earRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors.brownBearInnerEar;
        ctx.beginPath();
        ctx.arc(centerX - headRadius * 0.6, earY, earRadius * 0.6, 0, Math.PI * 2);
        ctx.arc(centerX + headRadius * 0.6, earY, earRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 腳 (簡單的圓形，調整位置使其在身體下方)
        const footRadius = this.tileSize * 0.15;
        const footY = centerY + this.tileSize * 0.25; // 腳的位置調整
        ctx.fillStyle = colors.brownBearBody;
        ctx.beginPath();
        ctx.arc(centerX - bodyWidth * 0.25, footY, footRadius, 0, Math.PI * 2);
        ctx.arc(centerX + bodyWidth * 0.25, footY, footRadius, 0, Math.PI * 2);
        ctx.fill();

        // 棍棒 (簡單的長方形，位置稍微調整)
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

        console.log(`DEBUG: BrownBear meleeAttack - dist: ${dist.toFixed(2)}px, attackRangePx: ${this.attackRangePx.toFixed(2)}px`);
        console.log(`DEBUG: BrownBear meleeAttack - targetEnemy HP before: ${targetEnemy.hp}`);

        if (dist <= this.attackRangePx) {
            targetEnemy.takeDamage(this.attackDamage);
            console.log(`熊大對僵屍造成 ${this.attackDamage} 傷害！`);
            console.log(`DEBUG: BrownBear meleeAttack - targetEnemy HP after: ${targetEnemy.hp}`);
            return true;
        }
        console.log("DEBUG: BrownBear meleeAttack - Enemy out of range.");
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
            // 如果當前位置與目標位置相同，表示已到達目標，可以計算新目標
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
                // DEBUG: 熊大自動戰鬥移動目標
                console.log(`DEBUG: BrownBear autoCombat - New target: (${this.targetX}, ${this.targetY})`);
            }

            // 攻擊最近的敵人 (如果距離在攻擊範圍內且冷卻時間已過)
            if (distToClosestEnemy <= GAME_CONSTANTS.BROWN_BEAR_ATTACK_RANGE_TILES && currentTime - this.lastAttackTime > this.attackCooldown) {
                console.log("DEBUG: BrownBear autoCombat - Attempting melee attack.");
                this.meleeAttack(closestEnemy);
                this.lastAttackTime = currentTime;
            }
        } else {
            // 如果沒有敵人，停止移動並關閉自動戰鬥模式
            this.targetX = this.x; // 停止移動
            this.targetY = this.y;
            this.isAutoCombatMode = false; // 新增：沒有敵人時關閉自動戰鬥模式
            console.log("DEBUG: BrownBear autoCombat - No enemies found, stopping movement and exiting auto-combat mode.");
        }
    }
}
