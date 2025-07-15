// js/brownBearCharacter.js
/**
 * @file 遊戲中的熊大角色
 */

import { Character } from './character.js';
import { GAME_CONSTANTS } from './constants.js';

export class BrownBearCharacter extends Character {
    constructor(x, y, hp, speed, tileSize) {
        super(x, y, hp, speed, tileSize);
        this.type = 'brownBear'; // 設置角色類型
        this.attackRangePx = GAME_CONSTANTS.BROWN_BEAR_ATTACK_RANGE_PX; // 熊大的近戰攻擊範圍 (像素)
        this.collisionRadius = this.tileSize * 0.4; // 熊大的碰撞半徑，略大於胖波
    }

    /**
     * 繪製熊大角色
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D 渲染上下文
     * @param {number} offsetX - 鏡頭X偏移量
     * @param {number} offsetY - 鏡頭Y偏移量
     * @param {object} colors - 遊戲顏色配置
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
}
