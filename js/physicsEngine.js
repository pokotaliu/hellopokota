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

        if (character.pxX !== targetPxX || character.pxY !== targetPxY) {
            character.isMoving = true;
            const dx = targetPxX - character.pxX;
            const dy = targetPxY - character.pxY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= character.speedPx) {
                character.pxX = targetPxX;
                character.pxY = targetPxY;
                character.x = character.targetX;
                character.y = character.targetY;
                character.isMoving = false;
            } else {
                character.pxX += (dx / distance) * character.speedPx;
                character.pxY += (dy / distance) * character.speedPx; 
            }
        } else {
            character.isMoving = false;
        }
    }

    /**
     * 檢查兩個實體是否發生碰撞 (簡單的圓形碰撞)
     * @param {object} entity1 - 實體1 (需有 x, y, radius 屬性)
     * @param {object} entity2 - 實體2 (需有 x, y, radius 屬性)
     * @returns {boolean} 如果碰撞則為 true
     */
    checkCollision(entity1, entity2) {
        const distSq = (entity1.x - entity2.x) * (entity1.x - entity2.x) +
                       (entity1.y - entity2.y) * (entity1.y - entity2.y);
        const radiusSumSq = (entity1.radius + entity2.radius) * (entity1.radius + entity2.radius);
        return distSq < radiusSumSq;
    }
}
