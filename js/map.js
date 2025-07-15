// js/map.js
/**
 * @file 管理地圖數據和磁磚資訊
 */

export class Map {
    constructor(mapData, tileSize) {
        this.mapData = mapData; // 原始地圖網格
        this.tileSize = tileSize;
        this.rows = mapData.mapGrid.length;
        this.cols = mapData.mapGrid[0].length;
        this.grid = []; // 處理後的磁磚數據
        this.portal = mapData.portal;
        // 將 colors 屬性從 mapData 中直接複製過來，因為 Renderer 會從 Map 實例中獲取顏色
        // 注意：這裡將直接從 mapData.colors 獲取，而不是在 Map 內部重新定義所有顏色
        // 因為 constants.js 中的 MAP_DATA 已經包含完整的顏色定義
        this.colors = { ...mapData.colors };

        // 為草地添加多種色調，供 _drawGrass 隨機使用 (如果 MAP_DATA 中沒有定義，則在此生成)
        if (!this.colors.grass || this.colors.grass.length === 0) {
            const baseGrassColor = this.colors.grassBase || '#8BC34A'; // 預設一個基色
            this.colors.grass = [
                baseGrassColor,
                this._shadeColor(baseGrassColor, -5),
                this._shadeColor(baseGrassColor, -10),
                this._shadeColor(baseGrassColor, 5),
                this._shadeColor(baseGrassColor, 10)
            ];
        }

        this.spawnPoints = mapData.spawnPoints || []; // 儲存地圖的僵屍生成點

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
                    // 隨機選擇一個草地色調索引
                    this.grid[r][c] = { type: 0, grassShadeIndex: Math.floor(Math.random() * this.colors.grass.length) };
                } else if (tileValue === 4 && this.mapData.id === 'monsterMap') { // 怪物地圖的岩石 (不可通行)
                    this.grid[r][c] = { type: 4 };
                } else if (tileValue === 5 && this.mapData.id === 'monsterMap') { // 怪物地圖的骷髏 (不可通行)
                    this.grid[r][c] = { type: 5 };
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
        // 確保 x 和 y 在地圖邊界內
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.grid[y][x];
        }
        return undefined; // 超出邊界
    }

    /**
     * 檢查指定磁磚是否可通行
     * @param {number} x - 磁磚X座標
     * @param {number} y - 磁磚Y座標
     * @returns {boolean} 如果可通行則為 true
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false; // 超出地圖邊界則不可通行

        // 可通行的磁磚類型：0 (草地), 3 (蘿蔔), 6 (傳送門)
        // 1 (小屋), 2 (樹木), 4 (岩石), 5 (骷髏) 不可通行
        return tile.type === 0 || tile.type === 3 || tile.type === 6;
    }

    /**
     * 獲取地圖的僵屍生成點
     * @returns {Array<{x: number, y: number}>} 僵屍生成點陣列
     */
    getSpawnPoints() {
        return this.spawnPoints;
    }

    /**
     * 輔助函數：調整顏色深淺
     * @param {string} color - 十六進制顏色碼 (e.g., "#RRGGBB")
     * @param {number} percent - 調整百分比 (-100 到 100)
     * @returns {string} 調整後的十六進制顏色碼
     */
    _shadeColor(color, percent) {
        let f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = (f >> 8) & 0x00ff,
            B = f & 0x0000ff;
        return (
            "#" +
            (
                0x1000000 +
                (Math.round((t - R) * p) + R) * 0x10000 +
                (Math.round((t - G) * p) + G) * 0x100 +
                (Math.round((t - B) * p) + B)
            )
            .toString(16)
            .slice(1)
        );
    }
}
