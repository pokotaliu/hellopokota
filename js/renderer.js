// js/renderer.js
/**
 * @file 負責所有遊戲元素的繪製
 */

export class Renderer {
    constructor(canvas, ctx, tileSize, colors) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileSize = tileSize;
        this.colors = colors; // 將由 Map 實例更新
    }

    /**
     * 繪製單個草地磁磚
     */
    _drawGrass(x, y, offsetX, offsetY, grassShadeIndex) {
        const drawX = x * this.tileSize - offsetX;
        const drawY = y * this.tileSize - offsetY;

        // 使用來自 this.colors 的草地色板
        this.ctx.fillStyle = this.colors.grass[grassShadeIndex];
        this.ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize);

        // 使用來自 this.colors 的草地細節色
        this.ctx.fillStyle = this.colors.grassDetail;
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
        gradient.addColorStop(0.5, this.colors.portalColor + '80'); // 使用傳送門顏色並添加透明度
        gradient.addColorStop(1, this.colors.portalColor + '00'); // 完全透明
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(tileX + this.tileSize / 2, tileY + this.tileSize / 2, this.tileSize * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * 繪製胖波（兔子）角色，包含走路動畫
     */
    _drawPokota(pokota, offsetX, offsetY) {
        // 胖波繪圖的中心點 (基於像素座標和磁磚中心的偏移)
        const centerX = pokota.pxX - offsetX + this.tileSize / 2;
        const centerY = pokota.pxY - offsetY + this.tileSize / 2;

        const colors = this.colors; // 使用 Renderer 的顏色配置

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

    /**
     * 繪製僵屍 (EnemyCharacter 實例本身有 draw 方法，但這裡保留以便 Renderer 集中調用)
     */
    _drawZombie(zombie, offsetX, offsetY) {
        // 直接調用僵屍實例自身的 draw 方法
        zombie.draw(this.ctx, offsetX, offsetY, this.colors);
    }

    /**
     * 繪製蘿蔔飛彈
     */
    _drawProjectile(projectile, offsetX, offsetY) {
        // 投射物的 pxX, pxY 已經是實際像素位置
        const drawX = projectile.pxX - offsetX;
        const drawY = projectile.pxY - offsetY;

        const carrotWidth = this.tileSize * 0.4;
        const carrotHeight = this.tileSize * 0.7;
        this.ctx.fillStyle = this.colors.carrotBody;
        this.ctx.beginPath();
        // 蘿蔔的繪製中心點在 projectile.pxX, projectile.pxY，所以需要偏移繪製
        this.ctx.moveTo(drawX + carrotWidth / 2, drawY + carrotHeight / 2 + carrotHeight * 0.4); // 尖端
        this.ctx.lineTo(drawX + carrotWidth * 0.1, drawY + carrotHeight / 2 - carrotHeight * 0.1);
        this.ctx.lineTo(drawX + carrotWidth * 0.9, drawY + carrotHeight / 2 - carrotHeight * 0.1);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.colors.carrotLeaf;
        this.ctx.fillRect(drawX + carrotWidth / 2 - 1, drawY + carrotHeight / 2 - carrotHeight * 0.4, 2, carrotHeight * 0.1);
        this.ctx.fillRect(drawX + carrotWidth / 2 - 5, drawY + carrotHeight / 2 - carrotHeight * 0.35, 2, carrotHeight * 0.08);
        this.ctx.fillRect(drawX + carrotWidth / 2 + 3, drawY + carrotHeight / 2 - carrotHeight * 0.35, 2, carrotHeight * 0.08);
    }

    /**
     * 遊戲渲染
     * @param {Map} currentMap - 當前地圖物件
     * @param {PlayerCharacter} player - 玩家角色
     * @param {Array<EnemyCharacter>} enemies - 敵人陣列
     * @param {Array<Projectile>} projectiles - 投射物陣列
     */
    render(currentMap, player, enemies, projectiles) {
        // 清空畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 計算鏡頭偏移量，使玩家居中
        // 玩家的 pxX, pxY 是左上角座標，為了居中，需要加上半個 tile
        const offsetX = player.pxX - this.canvas.width / 2 + this.tileSize / 2;
        const offsetY = player.pxY - this.canvas.height / 2 + this.tileSize / 2;

        // 繪製地圖磁磚
        // 只繪製可見區域的磁磚以優化性能
        const startCol = Math.max(0, Math.floor(offsetX / this.tileSize));
        const endCol = Math.min(currentMap.cols, Math.ceil((offsetX + this.canvas.width) / this.tileSize));
        const startRow = Math.max(0, Math.floor(offsetY / this.tileSize));
        const endRow = Math.min(currentMap.rows, Math.ceil((offsetY + this.canvas.height) / this.tileSize));


        for (let r = startRow; r < endRow; r++) {
            for (let c = startCol; c < endCol; c++) {
                const tile = currentMap.getTile(c, r);
                if (!tile) continue;

                switch (tile.type) {
                    case 0: // 草地
                        this._drawGrass(c, r, offsetX, offsetY, tile.grassShadeIndex);
                        break;
                    case 1: // 小屋
                        this._drawHouse(c, r, offsetX, offsetY);
                        break;
                    case 2: // 樹木
                        this._drawTree(c, r, offsetX, offsetY);
                        break;
                    case 3: // 蘿蔔
                        this._drawCarrot(c, r, offsetX, offsetY);
                        break;
                    case 4: // 岩石 (怪物地圖)
                        this._drawRock(c, r, offsetX, offsetY);
                        break;
                    case 5: // 骷髏 (怪物地圖)
                        this._drawSkull(c, r, offsetX, offsetY);
                        break;
                    case 6: // 傳送門
                        this._drawPortal(c, r, offsetX, offsetY);
                        break;
                }
            }
        }

        // 繪製投射物
        projectiles.forEach(p => {
            this._drawProjectile(p, offsetX, offsetY);
        });

        // 繪製敵人
        enemies.forEach(enemy => {
            // 由於 EnemyCharacter 自身有 draw 方法，直接調用即可
            enemy.draw(this.ctx, offsetX, offsetY, this.colors);
        });

        // 根據玩家類型繪製角色
        if (player.type === 'pokota') {
            this._drawPokota(player, offsetX, offsetY);
        } else if (player.type === 'brownBear') {
            // 由於 BrownBearCharacter 自身有 draw 方法，直接調用即可
            player.draw(this.ctx, offsetX, offsetY, this.colors);
        }
    }
}
