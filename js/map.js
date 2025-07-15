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
        this.colors = {
            ...mapData.colors,
            // 為草地添加多種色調，供 _drawGrass 隨機使用
            grass: [
                mapData.colors.grassBase,
                this._shadeColor(mapData.colors.grassBase, -5),
                this._shadeColor(mapData.colors.grassBase, -10),
                this._shadeColor(mapData.colors.grassBase, 5),
                this._shadeColor(mapData.colors.grassBase, 10)
            ],
            // 新增其他物體的顏色
            houseWall: '#8B4513', // SaddleBrown
            houseRoof: '#A52A2A', // Brown
            houseDoorWindow: '#556B2F', // DarkOliveGreen
            treeTrunk: '#8B4513',
            treeLeaves: '#228B22', // ForestGreen
            carrotBody: '#FF8C00', // DarkOrange
            carrotLeaf: '#228B22',
            rockColor: '#696969', // DimGray
            skullColor: '#F5F5DC', // Beige
            portalColor: '#8A2BE2', // BlueViolet

            // 胖波（Pokota）的顏色
            pokotaBody: '#FFC0CB', // 粉紅色
            pokotaEyeWhite: '#FFFFFF', // 白色
            pokotaEye: '#000000',    // 黑色
            pokotaSnout: '#F08080',  // 淺珊瑚色
            pokotaInnerEar: '#FF69B4', // 熱粉色
            pokotaFoot: '#CD5C5C',   // 印度紅

            // 熊大（Brown Bear）的顏色
            brownBearBody: '#8B4513', // 棕色
            brownBearSnout: '#D2B48C', // 淺棕色
            brownBearNose: '#000000', // 黑色
            brownBearEye: '#000000', // 黑色
            brownBearInnerEar: '#F4A460', // 沙棕色
            brownBearClub: '#5A2D0C' // 深棕色，用於棍棒
        };
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
                    // 隨機選擇一個草地色調索引
                    this.grid[r][c] = { type: 0, grassShadeIndex: Math.floor(Math.random() * this.colors.grass.length) };
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
        // 可通行的磁磚類型：0 (草地), 3 (蘿蔔), 4 (僵屍生成點但視覺是草地), 6 (傳送門)
        // 1 (小屋), 2 (樹木), 5 (骷髏) 不可通行
        return tile.type === 0 || tile.type === 3 || tile.type === 4 || tile.type === 6;
    }

    /**
     * 獲取地圖的僵屍生成點
     * @returns {Array<{x: number, y: number}>} 僵屍生成點陣列
     */
    getSpawnPoints() {
        // 從 mapData 中獲取 spawnPoints，如果沒有則返回空陣列
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
