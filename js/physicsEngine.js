// js/physicsEngine.js
/**
 * @file 處理遊戲中的物理和碰撞
 */

export class PhysicsEngine {
    constructor(tileSize) {
        this.tileSize = tileSize;
    }

    /**
     * 更新人物的像素位置，使其朝目標移動
     * @param {Character} character - 要更新的人物
     */
    updateCharacterMovement(character) {
        const targetPxX = character.targetX * this.tileSize;
        const targetPxY = character.targetY * this.tileSize;

        // 檢查人物是否已經在目標位置 (考慮浮點數精度)
        const arrivedX = Math.abs(character.pxX - targetPxX) < character.speedPx;
        const arrivedY = Math.abs(character.pxY - targetPxY) < character.speedPx;

        if (!arrivedX || !arrivedY) {
            character.isMoving = true;
            const dx = targetPxX - character.pxX;
            const dy = targetPxY - character.pxY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 如果距離小於或等於一步移動的距離，則直接設置為目標位置
            // 這樣可以避免因浮點數計算導致的無限小範圍抖動
            if (distance <= character.speedPx) {
                character.pxX = targetPxX;
                character.pxY = targetPxY;
                character.x = character.targetX;
                character.y = character.targetY;
                character.isMoving = false;
            } else {
                // 正規化方向向量並乘以速度
                character.pxX += (dx / distance) * character.speedPx;
                character.pxY += (dy / distance) * character.speedPx;
            }
        } else {
            // 如果已經在目標位置附近，確保完全對齊並標記為停止移動
            character.pxX = targetPxX;
            character.pxY = targetPxY;
            character.x = character.targetX;
            character.y = character.targetY;
            character.isMoving = false;
        }
    }

    /**
     * 檢查兩個實體是否發生碰撞 (簡單的圓形碰撞)
     * 注意：這裡的 entity.x 和 entity.y 應為像素座標，而不是磁磚座標
     * 並將 radius 調整為實際像素半徑
     * @param {object} entity1 - 實體1 (需有 pxX, pxY, collisionRadius 屬性)
     * @param {object} entity2 - 實體2 (需有 pxX, pxY, collisionRadius 屬性)
     * @returns {boolean} 如果碰撞則為 true
     */
    checkCollision(entity1, entity2) {
        // 使用像素座標進行碰撞檢測
        const dx = entity1.pxX - entity2.pxX;
        const dy = entity1.pxY - entity2.pxY;
        const distSq = dx * dx + dy * dy;

        // 使用 collisionRadius 進行碰撞檢測
        // collisionRadius 應該根據實際繪製大小來設定
        const radiusSumSq = (entity1.collisionRadius + entity2.collisionRadius) * (entity1.collisionRadius + entity2.collisionRadius);
        return distSq < radiusSumSq;
    }

    /**
     * 檢查實體是否與地圖邊界碰撞
     * @param {object} entity - 實體 (需有 pxX, pxY, width, height 屬性)
     * @param {Map} map - 地圖物件
     * @returns {boolean} 如果碰撞則為 true
     */
    checkMapBoundaryCollision(entity, map) {
        const entityLeft = entity.pxX;
        const entityRight = entity.pxX + entity.width;
        const entityTop = entity.pxY;
        const entityBottom = entity.pxY + entity.height;

        const mapWidthPx = map.cols * this.tileSize;
        const mapHeightPx = map.rows * this.tileSize;

        return (
            entityLeft < 0 ||
            entityRight > mapWidthPx ||
            entityTop < 0 ||
            entityBottom > mapHeightPx
        );
    }
}
