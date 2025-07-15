// map.js
/**
 * @class Map
 * @description 管理地圖數據和磁磚資訊
 */
export class Map {
    constructor(mapData, tileSize) {
        this.mapData = mapData; // 原始地圖網格
        this.tileSize = tileSize;
        this.rows = mapData.mapGrid.length;
        this.cols = mapData.mapGrid[0].length;
        this.grid = []; // 處理後的磁磚數據
        this.portal = mapData.portal;
        this.colors = mapData.colors;
        this.spawnPoints = mapData.spawnPoints || []; // 儲存村莊地圖的僵屍生成點

        this._processMapGrid();
    }

    /**
     * 處理原始地圖網格，將數字轉換為包含類型和草地陰影索引的物件
     */
    _processMapGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const tileValue = this.mapData.mapGrid[r][c];
                if (tileValue === 0) { // 草地
                    this.grid[r][c] = { type: 0, grassShadeIndex: Math.floor(Math.random() * 5) };
                } else {
                    this.grid[r][c] = { type: tileValue };
                }
            }
        }
    }

    /**
     * 獲取指定座標的磁磚數據
     * @param {number} x - 磁磚X座標
     * @param {number} y - 磁磚Y座標
     * @returns {object|undefined} 磁磚數據物件或 undefined
     */
    getTile(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.grid[y][x];
        }
        return undefined;
    }

    /**
     * 檢查指定磁磚是否可通行
     * @param {number} x - 磁磚X座標
     * @param {number} y - 磁磚Y座標
     * @returns {boolean} 如果可通行則為 true
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;
        // 可通行的磁磚類型：0 (草地), 3 (蘿蔔), 6 (傳送門)
        // 怪物地圖的岩石 (4) 和骷髏 (5) 不可通行
        return tile.type === 0 || tile.type === 3 || tile.type === 6;
    }

    /**
     * 獲取地圖的僵屍生成點
     * @returns {Array<{x: number, y: number}>} 僵屍生成點陣列
     */
    getSpawnPoints() {
        return this.mapData.spawnPoints || [];
    }
}
