// player_character.js
import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

/**
 * @class PlayerCharacter
 * @description 玩家控制的胖波角色
 */
export class PlayerCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        super(x, y, hp, speed, tileSize);
        this.equipment = {}; // 裝備槽 (例如: { weapon: null, armor: null })
        this.isAutoCombatMode = false;
    }

    /**
     * 繪製胖波
     */
    draw(ctx, offsetX, offsetY, colors) {
        // 胖波繪圖的中心點 (現在基於單格磁磚的中心)
        const centerX = this.pxX - offsetX + this.tileSize / 2;
        const centerY = this.pxY - offsetY + this.tileSize / 2;

        // 身體半徑，調整以適應單格大小
        const bodyRadius = this.tileSize * 0.4;
        const bodyYOffset = this.tileSize * 0.05; // 身體相對於磁磚中心的Y偏移

        // 身體 (橢圓形)
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bodyYOffset, bodyRadius * 1.1, bodyRadius * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = colors.pokotaBody;
        ctx.fill();

        // 眼睛
        const eyeRadius = bodyRadius * 0.15;
        const eyeOffset = bodyRadius * 0.35;
        const pupilRadius = eyeRadius * 0.4;
        const eyeYPos = centerY + bodyYOffset - bodyRadius * 0.5;

        // 左眼
        ctx.fillStyle = colors.pokotaEyeWhite;
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset, eyeYPos, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.pokotaEye;
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset, eyeYPos, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // 右眼
        ctx.fillStyle = colors.pokotaEyeWhite;
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset, eyeYPos, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.pokotaEye;
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset, eyeYPos, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // 鼻部/口鼻 (Snout)
        const snoutWidth = bodyRadius * 0.7;
        const snoutHeight = bodyRadius * 0.4;
        const snoutYPos = centerY + bodyYOffset + bodyRadius * 0.05;

        ctx.fillStyle = colors.pokotaSnout;
        ctx.beginPath();
        ctx.moveTo(centerX, snoutYPos);
        ctx.quadraticCurveTo(centerX - snoutWidth / 2, snoutYPos - snoutHeight * 0.5,
                                 centerX - snoutWidth / 2, snoutYPos - snoutHeight * 0.8);
        ctx.quadraticCurveTo(centerX - snoutWidth * 0.2, snoutYPos - snoutHeight * 1.1,
                                 centerX, snoutYPos - snoutHeight * 1.2);
        ctx.quadraticCurveTo(centerX + snoutWidth * 0.2, snoutYPos - snoutHeight * 1.1,
                                 centerX + snoutWidth / 2, snoutYPos - snoutHeight * 0.8);
        ctx.quadraticCurveTo(centerX + snoutWidth / 2, snoutYPos - snoutHeight * 0.5,
                                 centerX, snoutYPos);
        ctx.closePath();
        ctx.fill();

        // 鼻部斑點 (Freckles)
        ctx.fillStyle = colors.pokotaEye;
        const dotRadius = 1.5;
        ctx.beginPath();
        ctx.arc(centerX - snoutWidth * 0.2, snoutYPos - snoutHeight * 0.3, dotRadius, 0, Math.PI * 2);
        ctx.arc(centerX - snoutWidth * 0.05, snoutYPos - snoutHeight * 0.1, dotRadius, 0, Math.PI * 2);
        ctx.arc(centerX + snoutWidth * 0.2, snoutYPos - snoutHeight * 0.3, dotRadius, 0, Math.PI * 2);
        ctx.arc(centerX + snoutWidth * 0.05, snoutYPos - snoutHeight * 0.1, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        // 門牙
        const toothWidth = bodyRadius * 0.15;
        const toothHeight = bodyRadius * 0.25;
        const toothYPos = snoutYPos + bodyRadius * 0.05;

        ctx.fillStyle = colors.pokotaEyeWhite;
        ctx.fillRect(centerX - toothWidth - 1, toothYPos, toothWidth, toothHeight);
        ctx.fillRect(centerX + 1, toothYPos, toothWidth, toothHeight);

        // 耳朵
        const earWidth = bodyRadius * 0.3;
        const earHeight = bodyRadius * 0.8;
        const earBaseOffset = bodyRadius * 0.3;
        const earYBase = centerY + bodyYOffset - bodyRadius * 0.9;
        let earAnimAngle = 0;
        let earAnimYOffset = 0;

        if (this.isMoving) {
            earAnimAngle = Math.sin(this.animationTimer * 0.5) * (Math.PI / 30);
            earAnimYOffset = Math.sin(this.animationTimer * 0.5 + Math.PI / 2) * (bodyRadius * 0.05);
        }

        // 左耳
        ctx.save();
        ctx.translate(centerX - earBaseOffset, earYBase);
        ctx.rotate(-earAnimAngle);
        ctx.fillStyle = colors.pokotaBody;
        ctx.beginPath();
        ctx.moveTo(0, earAnimYOffset);
        ctx.quadraticCurveTo(-earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                 -earWidth * 0.2, -earHeight + earAnimYOffset);
        ctx.quadraticCurveTo(earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                 earWidth * 0.2, earAnimYOffset);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors.pokotaInnerEar;
        ctx.beginPath();
        ctx.moveTo(0, 5 + earAnimYOffset);
        ctx.quadraticCurveTo(-earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                 0, -earHeight * 0.7 + earAnimYOffset);
        ctx.quadraticCurveTo(earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                 earWidth * 0.1, 5 + earAnimYOffset);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 右耳
        ctx.save();
        ctx.translate(centerX + earBaseOffset, earYBase);
        ctx.rotate(earAnimAngle);
        ctx.fillStyle = colors.pokotaBody;
        ctx.beginPath();
        ctx.moveTo(0, earAnimYOffset);
        ctx.quadraticCurveTo(earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                 earWidth * 0.2, -earHeight + earAnimYOffset);
        ctx.quadraticCurveTo(-earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                 -earWidth * 0.2, earAnimYOffset);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors.pokotaInnerEar;
        ctx.beginPath();
        ctx.moveTo(0, 5 + earAnimYOffset);
        ctx.quadraticCurveTo(earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                 0, -earHeight * 0.7 + earAnimYOffset);
        ctx.quadraticCurveTo(-earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                 -earWidth * 0.1, 5 + earAnimYOffset);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // --- 手臂/手 (Arms) ---
        const armWidth = bodyRadius * 0.25;
        const armHeight = bodyRadius * 0.4;
        const armYPos = centerY + bodyYOffset - bodyRadius * 0.1;
        const armXOffset = bodyRadius * 0.8;
        let armAnimRotation = 0;

        if (this.isMoving) {
            armAnimRotation = Math.sin(this.animationTimer * 0.8) * (Math.PI / 8);
        }

        // 左手
        ctx.save();
        ctx.translate(centerX - armXOffset, armYPos);
        ctx.rotate(armAnimRotation);
        ctx.fillStyle = colors.pokotaBody;
        ctx.beginPath();
        ctx.ellipse(0, 0, armWidth, armHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 右手
        ctx.save();
        ctx.translate(centerX + armXOffset, armYPos);
        ctx.rotate(-armAnimRotation);
        ctx.fillStyle = colors.pokotaBody;
        ctx.beginPath();
        ctx.ellipse(0, 0, armWidth, armHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- 腳部動畫 ---
        const footWidth = bodyRadius * 0.35;
        const footHeight = bodyRadius * 0.2;
        const footYPos = centerY + bodyRadius * 0.7;
        const footXOffset = bodyRadius * 0.25;
        let footAnimRotation = 0;

        if (this.isMoving) {
            footAnimRotation = Math.sin(this.animationTimer * 0.8 + Math.PI / 2) * (Math.PI / 10);
        }

        // 左腳
        ctx.save();
        ctx.translate(centerX - footXOffset, footYPos);
        ctx.rotate(footAnimRotation);
        ctx.fillStyle = colors.pokotaFoot;
        ctx.beginPath();
        ctx.ellipse(0, 0, footWidth, footHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 右腳
        ctx.save();
        ctx.translate(centerX + footXOffset, footYPos);
        ctx.rotate(-footAnimRotation);
        ctx.fillStyle = colors.pokotaFoot;
        ctx.beginPath();
        ctx.ellipse(0, 0, footWidth, footHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /**
     * 胖波手動移動 (由玩家輸入觸發)
     * @param {string} direction - 移動方向 ('up', 'down', 'left', 'right')
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數
     */
    move(direction, isWalkableFn) {
        // 如果正在自動戰鬥模式或已死亡，則禁用手動移動
        if (this.isAutoCombatMode || this.hp <= 0) {
            return;
        }

        // 判斷是否到達目標磁磚，使用一個小的容差值
        const targetPokotaPxX_current = this.targetX * this.tileSize;
        const targetPokotaPxY_current = this.targetY * this.tileSize;

        const distToTarget = Math.sqrt(
            Math.pow(targetPokotaPxX_current - this.pxX, 2) +
            Math.pow(targetPokotaPxY_current - this.pxY, 2)
        );

        // 如果距離目標還很遠（大於移動速度），說明仍在移動中，忽略新的輸入
        if (distToTarget > this.speedPx) {
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
        }
    }

    /**
     * 胖波自動戰鬥 AI
     * @param {Array<EnemyCharacter>} enemies - 敵人陣列
     * @param {function} isWalkableFn - 檢查磁磚是否可通行的函數
     * @param {function} attackFn - 攻擊函數 (例如：發射飛彈)
     * @param {number} currentTime - 當前時間
     */
    autoCombat(enemies, isWalkableFn, attackFn, currentTime) {
        if (!this.isAutoCombatMode || this.hp <= 0) {
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
            const distToClosestEnemy = minDistance; // 已經計算過的距離

            let nextTargetX = this.x;
            let nextTargetY = this.y;

            // 判斷胖波是否已經到達當前目標磁磚 (用於決定是否設定新目標)
            const targetPxX_current = this.targetX * this.tileSize;
            const targetPxY_current = this.targetY * this.tileSize;
            const distToCurrentTarget = Math.sqrt(
                Math.pow(targetPxX_current - this.pxX, 2) +
                Math.pow(targetPxY_current - this.pxY, 2)
            );

            if (distToCurrentTarget <= this.speedPx) { // 如果已經在當前目標磁磚或非常接近
                // 閃避/保持距離邏輯
                if (distToClosestEnemy < GAME_CONSTANTS.POKOTA_SAFE_DISTANCE_TILES) {
                    const dx_flee = this.x - closestEnemy.x;
                    const dy_flee = this.y - closestEnemy.y;

                    // 嘗試向遠離敵人的方向移動
                    let potentialNextX = this.x + Math.sign(dx_flee);
                    let potentialNextY = this.y + Math.sign(dy_flee);

                    if (isWalkableFn(potentialNextX, potentialNextY)) {
                        nextTargetX = potentialNextX;
                        nextTargetY = potentialNextY;
                    } else if (isWalkableFn(potentialNextX, this.y)) { // 嘗試只水平移動
                        nextTargetX = potentialNextX;
                        nextTargetY = this.y;
                    } else if (isWalkableFn(this.x, potentialNextY)) { // 嘗試只垂直移動
                        nextTargetX = this.x;
                        nextTargetY = this.y;
                    } else {
                        // 如果無法移動，則停留在原地
                        nextTargetX = this.x;
                        nextTargetY = this.y;
                    }
                }
                // 靠近敵人邏輯 (如果太遠且不在閃避)
                else if (distToClosestEnemy > GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES - 1) {
                    // 移動 towards enemy
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
                                nextTargetX = this.x; // 無法移動，停留在原地
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
                                nextTargetX = this.x; // 無法移動，停留在原地
                                nextTargetY = this.y;
                            }
                        }
                    }
                }
                // 如果在安全距離和攻擊範圍之間，則停留在原地
                else {
                    nextTargetX = this.x;
                    nextTargetY = this.y;
                }

                // 更新胖波的目標位置
                this.targetX = nextTargetX;
                this.targetY = nextTargetY;
            }

            // 自動攻擊最近的敵人 (如果距離在攻擊範圍內)
            if (distToClosestEnemy <= GAME_CONSTANTS.ZOMBIE_ATTACK_RANGE_TILES && currentTime - this.lastAttackTime > GAME_CONSTANTS.ATTACK_INTERVAL) {
                attackFn(closestEnemy); // 呼叫遊戲的攻擊函數
                this.lastAttackTime = currentTime;
            }
        } else {
            // 如果沒有敵人，停止自動戰鬥模式
            this.isAutoCombatMode = false;
            this.targetX = this.x; // 停止移動
            this.targetY = this.y;
            console.log("所有怪物已被擊敗，自動戰鬥模式關閉。");
        }
    }

    /**
     * 裝備物品 (佔位符)
     * @param {object} item - 要裝備的物品
     */
    equip(item) {
        // 這裡將來會實現裝備邏輯
        console.log(`胖波裝備了: ${item.name}`);
        this.equipment[item.slot] = item;
    }
}
