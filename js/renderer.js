// js/renderer.js
/**
 * @file 負責所有遊戲元素的繪製
 */

export class Renderer {
    constructor(canvas, ctx, tileSize, colors) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileSize = tileSize;
        this.colors = colors;
    }

    /**
     * 繪製單個草地磁磚
     */
    _drawGrass(x, y, offsetX, offsetY, grassShadeIndex, mapColors) {
        const drawX = x * this.tileSize - offsetX;
        const drawY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.grass[grassShadeIndex];
        this.ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize);

        this.ctx.fillStyle = mapColors.grassDetail;
        for (let i = 0; i < 5; i++) {
            this.ctx.fillRect(drawX + Math.random() * this.tileSize, drawY + Math.random() * this.tileSize, 1, 1);
        }
    }

    /**
     * 繪製單個小屋磁磚
     */
    _drawHouse(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.houseWall;
        this.ctx.fillRect(tileX + 2, tileY + this.tileSize / 3, this.tileSize - 4, this.tileSize - this.tileSize / 3 - 2);

        this.ctx.fillStyle = this.colors.houseRoof;
        this.ctx.beginPath();
        this.ctx.moveTo(tileX, tileY + this.tileSize / 3);
        this.ctx.lineTo(tileX + this.tileSize / 2, tileY);
        this.ctx.lineTo(tileX + this.tileSize, tileY + this.tileSize / 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.colors.houseDoorWindow;
        this.ctx.fillRect(tileX + this.tileSize / 2 - 4, tileY + this.tileSize * 0.6, 8, this.tileSize * 0.3);

        this.ctx.fillRect(tileX + this.tileSize * 0.2, tileY + this.tileSize * 0.4, 6, 6);
        this.ctx.fillRect(tileX + this.tileSize * 0.8 - 6, tileY + this.tileSize * 0.4, 6, 6);
    }

    /**
     * 繪製單個樹木磁磚
     */
    _drawTree(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.treeTrunk;
        this.ctx.fillRect(tileX + this.tileSize / 2 - 4, tileY + this.tileSize * 0.6, 8, this.tileSize * 0.4);

        this.ctx.fillStyle = this.colors.treeLeaves;
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize / 2, tileY + this.tileSize * 0.4, this.tileSize * 0.4, 0, Math.PI * 2);
        this.ctx.arc(tileX + this.tileSize * 0.3, tileY + this.tileSize * 0.5, this.tileSize * 0.35, 0, Math.PI * 2);
        this.ctx.arc(tileX + this.tileSize * 0.7, tileY + this.tileSize * 0.5, this.tileSize * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * 繪製單個蘿蔔磁磚
     */
    _drawCarrot(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.carrotBody;
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize / 2, tileY + this.tileSize * 0.9);
        this.ctx.lineTo(tileX + this.tileSize * 0.3, tileY + this.tileSize * 0.5);
        this.ctx.lineTo(tileX + this.tileSize * 0.7, tileY + this.tileSize * 0.5);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.colors.carrotLeaf;
        this.ctx.fillRect(tileX + this.tileSize / 2 - 1, tileY + this.tileSize * 0.4, 2, this.tileSize * 0.1);
        this.ctx.fillRect(tileX + this.tileSize / 2 - 5, tileY + this.tileSize * 0.45, 2, this.tileSize * 0.08);
        this.ctx.fillRect(tileX + this.tileSize / 2 + 3, tileY + this.tileSize * 0.45, 2, this.tileSize * 0.08);
    }

    /**
     * 繪製岩石磁磚
     */
    _drawRock(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.rockColor;
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize * 0.2, tileY + this.tileSize * 0.8);
        this.ctx.lineTo(tileX + this.tileSize * 0.8, tileY + this.tileSize * 0.9);
        this.ctx.lineTo(tileX + this.tileSize * 0.9, tileY + this.tileSize * 0.4);
        this.ctx.lineTo(tileX + this.tileSize * 0.5, tileY + this.tileSize * 0.1);
        this.ctx.lineTo(tileX + this.tileSize * 0.1, tileY + this.tileSize * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * 繪製骷髏磁磚
     */
    _drawSkull(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        this.ctx.fillStyle = this.colors.skullColor;
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize / 2, tileY + this.tileSize * 0.4, this.tileSize * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize * 0.4, tileY + this.tileSize * 0.35, this.tileSize * 0.05, 0, Math.PI * 2);
        this.ctx.arc(tileX + this.tileSize * 0.6, tileY + this.tileSize * 0.35, this.tileSize * 0.05, 0, Math.PI * 2);
        this.ctx.fill();

        // Nose
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize * 0.5, tileY + this.tileSize * 0.45);
        this.ctx.lineTo(tileX + this.tileSize * 0.45, tileY + this.tileSize * 0.55);
        this.ctx.lineTo(tileX + this.tileSize * 0.55, tileY + this.tileSize * 0.55);
        this.ctx.closePath();
        this.ctx.fill();

        // Mouth
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize * 0.35, tileY + this.tileSize * 0.65);
        this.ctx.lineTo(tileX + this.tileSize * 0.65, tileY + this.tileSize * 0.65);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize * 0.4, tileY + this.tileSize * 0.65);
        this.ctx.lineTo(tileX + this.tileSize * 0.4, tileY + this.tileSize * 0.7);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(tileX + this.tileSize * 0.6, tileY + this.tileSize * 0.65);
        this.ctx.lineTo(tileX + this.tileSize * 0.6, tileY + this.tileSize * 0.7);
        this.ctx.stroke();
    }

    /**
     * 繪製傳送門磁磚
     */
    _drawPortal(x, y, offsetX, offsetY) {
        const tileX = x * this.tileSize - offsetX;
        const tileY = y * this.tileSize - offsetY;

        // 繪製傳送門基底
        this.ctx.fillStyle = this.colors.portalColor;
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize / 2, tileY + this.tileSize / 2, this.tileSize * 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        // 繪製發光效果
        const gradient = this.ctx.createRadialGradient(
            tileX + this.tileSize / 2, tileY + this.tileSize / 2, 0,
            tileX + this.tileSize / 2, tileY + this.tileSize / 2, this.tileSize * 0.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.5)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize / 2, tileY + this.tileSize / 2, this.tileSize * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * 繪製僵屍
     */
    _drawZombie(zombie, offsetX, offsetY) {
        const zombieX = zombie.pxX - offsetX;
        const zombieY = zombie.pxY - offsetY;
        const bodySize = this.tileSize * 0.7;

        this.ctx.fillStyle = this.colors.zombieBody;
        this.ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2, bodySize, bodySize);

        this.ctx.fillStyle = this.colors.zombieEye;
        this.ctx.fillRect(zombieX + this.tileSize * 0.3, zombieY + this.tileSize * 0.4, 4, 4);
        this.ctx.fillRect(zombieX + this.tileSize * 0.7 - 4, zombieY + this.tileSize * 0.4, 4, 4);

        const hpBarWidth = bodySize * (zombie.hp / zombie.maxHp);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, hpBarWidth, 4);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(zombieX + (this.tileSize - bodySize) / 2, zombieY + (this.tileSize - bodySize) / 2 - 8, bodySize, 4);
    }

    /**
     * 繪製蘿蔔飛彈
     */
    _drawProjectile(projectile, offsetX, offsetY) {
        const drawX = projectile.x - offsetX;
        const drawY = projectile.y - offsetY;

        const carrotWidth = this.tileSize * 0.4;
        const carrotHeight = this.tileSize * 0.7;
        this.ctx.fillStyle = this.colors.carrotBody;
        this.ctx.beginPath();
        this.ctx.moveTo(drawX + carrotWidth / 2, drawY + carrotHeight);
        this.ctx.lineTo(drawX, drawY + carrotHeight * 0.3);
        this.ctx.lineTo(drawX + carrotWidth, drawY + carrotHeight * 0.3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.colors.carrotLeaf;
        this.ctx.fillRect(drawX + carrotWidth / 2 - 1, drawY, 2, carrotHeight * 0.2);
    }

    /**
     * 繪製胖波（兔子）角色，包含走路動畫
     */
    _drawPokota(pokota, offsetX, offsetY, colors) {
        // 胖波繪圖的中心點 (現在基於單格磁磚的中心)
        const centerX = pokota.pxX - offsetX + this.tileSize / 2;
        const centerY = pokota.pxY - offsetY + this.tileSize / 2;

        // 身體半徑，調整以適應單格大小
        const bodyRadius = this.tileSize * 0.4;
        const bodyYOffset = this.tileSize * 0.05; // 身體相對於磁磚中心的Y偏移

        // 身體 (橢圓形)
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + bodyYOffset, bodyRadius * 1.1, bodyRadius * 1.2, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = colors.pokotaBody;
        this.ctx.fill();

        // 眼睛
        const eyeRadius = bodyRadius * 0.15;
        const eyeOffset = bodyRadius * 0.35;
        const pupilRadius = eyeRadius * 0.4;
        const eyeYPos = centerY + bodyYOffset - bodyRadius * 0.5;

        // 左眼
        this.ctx.fillStyle = colors.pokotaEyeWhite;
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeOffset, eyeYPos, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = colors.pokotaEye;
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeOffset, eyeYPos, pupilRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // 右眼
        this.ctx.fillStyle = colors.pokotaEyeWhite;
        this.ctx.beginPath();
        this.ctx.arc(centerX + eyeOffset, eyeYPos, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = colors.pokotaEye;
        this.ctx.beginPath();
        this.ctx.arc(centerX + eyeOffset, eyeYPos, pupilRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // 鼻部/口鼻 (Snout)
        const snoutWidth = bodyRadius * 0.7;
        const snoutHeight = bodyRadius * 0.4;
        const snoutYPos = centerY + bodyYOffset + bodyRadius * 0.05;

        this.ctx.fillStyle = colors.pokotaSnout;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, snoutYPos);
        this.ctx.quadraticCurveTo(centerX - snoutWidth / 2, snoutYPos - snoutHeight * 0.5,
                                     centerX - snoutWidth / 2, snoutYPos - snoutHeight * 0.8);
        this.ctx.quadraticCurveTo(centerX - snoutWidth * 0.2, snoutYPos - snoutHeight * 1.1,
                                     centerX, snoutYPos - snoutHeight * 1.2);
        this.ctx.quadraticCurveTo(centerX + snoutWidth * 0.2, snoutYPos - snoutHeight * 1.1,
                                     centerX + snoutWidth / 2, snoutYPos - snoutHeight * 0.8);
        this.ctx.quadraticCurveTo(centerX + snoutWidth / 2, snoutYPos - snoutHeight * 0.5,
                                     centerX, snoutYPos);
        this.ctx.closePath();
        this.ctx.fill();

        // 鼻部斑點 (Freckles)
        this.ctx.fillStyle = colors.pokotaEye;
        const dotRadius = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(centerX - snoutWidth * 0.2, snoutYPos - snoutHeight * 0.3, dotRadius, 0, Math.PI * 2);
        this.ctx.arc(centerX - snoutWidth * 0.05, snoutYPos - snoutHeight * 0.1, dotRadius, 0, Math.PI * 2);
        this.ctx.arc(centerX + snoutWidth * 0.2, snoutYPos - snoutHeight * 0.3, dotRadius, 0, Math.PI * 2);
        this.ctx.arc(centerX + snoutWidth * 0.05, snoutYPos - snoutHeight * 0.1, dotRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // 門牙
        const toothWidth = bodyRadius * 0.15;
        const toothHeight = bodyRadius * 0.25;
        const toothYPos = snoutYPos + bodyRadius * 0.05;

        this.ctx.fillStyle = colors.pokotaEyeWhite;
        this.ctx.fillRect(centerX - toothWidth - 1, toothYPos, toothWidth, toothHeight);
        this.ctx.fillRect(centerX + 1, toothYPos, toothWidth, toothHeight);

        // 耳朵
        const earWidth = bodyRadius * 0.3;
        const earHeight = bodyRadius * 0.8;
        const earBaseOffset = bodyRadius * 0.3;
        const earYBase = centerY + bodyYOffset - bodyRadius * 0.9;
        let earAnimAngle = 0;
        let earAnimYOffset = 0;

        if (pokota.isMoving) {
            earAnimAngle = Math.sin(pokota.animationTimer * 0.5) * (Math.PI / 30);
            earAnimYOffset = Math.sin(pokota.animationTimer * 0.5 + Math.PI / 2) * (bodyRadius * 0.05);
        }

        // 左耳
        this.ctx.save();
        this.ctx.translate(centerX - earBaseOffset, earYBase);
        this.ctx.rotate(-earAnimAngle);
        this.ctx.fillStyle = colors.pokotaBody;
        this.ctx.beginPath();
        this.ctx.moveTo(0, earAnimYOffset);
        this.ctx.quadraticCurveTo(-earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                     -earWidth * 0.2, -earHeight + earAnimYOffset);
        this.ctx.quadraticCurveTo(earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                     earWidth * 0.2, earAnimYOffset);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = colors.pokotaInnerEar;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 5 + earAnimYOffset);
        this.ctx.quadraticCurveTo(-earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                     0, -earHeight * 0.7 + earAnimYOffset);
        this.ctx.quadraticCurveTo(earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                     earWidth * 0.1, 5 + earAnimYOffset);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // 右耳
        this.ctx.save();
        this.ctx.translate(centerX + earBaseOffset, earYBase);
        this.ctx.rotate(earAnimAngle);
        this.ctx.fillStyle = colors.pokotaBody;
        this.ctx.beginPath();
        this.ctx.moveTo(0, earAnimYOffset);
        this.ctx.quadraticCurveTo(earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                     earWidth * 0.2, -earHeight + earAnimYOffset);
        this.ctx.quadraticCurveTo(-earWidth * 0.8, -earHeight * 0.7 + earAnimYOffset,
                                     -earWidth * 0.2, earAnimYOffset);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = colors.pokotaInnerEar;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 5 + earAnimYOffset);
        this.ctx.quadraticCurveTo(earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                     0, -earHeight * 0.7 + earAnimYOffset);
        this.ctx.quadraticCurveTo(-earWidth * 0.2, -earHeight * 0.5 + earAnimYOffset,
                                     -earWidth * 0.1, 5 + earAnimYOffset);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // --- 手臂/手 (Arms) ---
        const armWidth = bodyRadius * 0.25;
        const armHeight = bodyRadius * 0.4;
        const armYPos = centerY + bodyYOffset - bodyRadius * 0.1;
        const armXOffset = bodyRadius * 0.8;
        let armAnimRotation = 0;

        if (pokota.isMoving) {
            armAnimRotation = Math.sin(pokota.animationTimer * 0.8) * (Math.PI / 8);
        }

        // 左手
        this.ctx.save();
        this.ctx.translate(centerX - armXOffset, armYPos);
        this.ctx.rotate(armAnimRotation);
        this.ctx.fillStyle = colors.pokotaBody;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, armWidth, armHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // 右手
        this.ctx.save();
        this.ctx.translate(centerX + armXOffset, armYPos);
        this.ctx.rotate(-armAnimRotation);
        this.ctx.fillStyle = colors.pokotaBody;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, armWidth, armHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // --- 腳部動畫 ---
        const footWidth = bodyRadius * 0.35;
        const footHeight = bodyRadius * 0.2;
        const footYPos = centerY + bodyRadius * 0.7;
        const footXOffset = bodyRadius * 0.25;
        let footAnimRotation = 0;

        if (pokota.isMoving) {
            footAnimRotation = Math.sin(pokota.animationTimer * 0.8 + Math.PI / 2) * (Math.PI / 10);
        }

        // 左腳
        this.ctx.save();
        this.ctx.translate(centerX - footXOffset, footYPos);
        this.ctx.rotate(footAnimRotation);
        this.ctx.fillStyle = colors.pokotaFoot;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, footWidth, footHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // 右腳
        this.ctx.save();
        this.ctx.translate(centerX + footXOffset, footYPos);
        this.ctx.rotate(-footAnimRotation);
        this.ctx.fillStyle = colors.pokotaFoot;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, footWidth, footHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}
