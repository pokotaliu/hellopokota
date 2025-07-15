// js/game.js
/**
 * @file 遊戲主類別，管理遊戲循環和所有子系統
 */

// 確保所有類別定義只存在於其各自的檔案中，這裡只進行匯入。
import { GAME_CONSTANTS, gameMapsData } from './constants.js';
import { Character } from './character.js'; // 雖然 Game 不直接使用 Character，但 PlayerCharacter 和 EnemyCharacter 使用
import { PlayerCharacter } from './playerCharacter.js';
import { EnemyCharacter } from './enemyCharacter.js';
import { Projectile } from './projectile.js';
import { PhysicsEngine } from './physicsEngine.js';
import { Map } from './map.js';
import { Renderer } from './renderer.js';

class Game {
    constructor(canvasId, constants, mapsData) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.constants = constants;
        this.mapsData = mapsData;

        this.tileSize = this.constants.TILE_SIZE;
        this.canvas.width = this.constants.CANVAS_WIDTH_TILES * this.tileSize;
        this.canvas.height = this.constants.CANVAS_HEIGHT_TILES * this.tileSize;

        this.currentMapId = 'village';
        this.currentMap = null;
        this.player = null;
        this.enemies = [];
        this.projectiles = [];

        this.colors = {}; // 儲存所有顏色值
        this._initializeColors();

        // 確保 Renderer 在這裡被正確實例化
        this.renderer = new Renderer(this.canvas, this.ctx, this.tileSize, this.colors);
        this.physicsEngine = new PhysicsEngine(this.tileSize);

        this.pokotaHPDisplay = document.getElementById('pokotaHPDisplay');
        this.autoCombatStatusDisplay = document.getElementById('autoCombatStatus');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.restartButton = document.getElementById('restartButton');

        this.lastGameUpdateTime = 0; // 用於控制遊戲邏輯更新頻率
    }

    /**
     * 初始化顏色配置
     */
    _initializeColors() {
        this.colors = {
            grass: [],
            grassDetail: getComputedStyle(document.documentElement).getPropertyValue('--grass-detail-color'),
            houseWall: getComputedStyle(document.documentElement).getPropertyValue('--house-wall-color'),
            houseRoof: getComputedStyle(document.documentElement).getPropertyValue('--house-roof-color'),
            houseDoorWindow: getComputedStyle(document.documentElement).getPropertyValue('--house-door-window-color'),
            treeTrunk: getComputedStyle(document.documentElement).getPropertyValue('--tree-trunk-color'),
            treeLeaves: getComputedStyle(document.documentElement).getPropertyValue('--tree-leaves-color'),
            carrotBody: getComputedStyle(document.documentElement).getPropertyValue('--carrot-body-color'),
            carrotLeaf: getComputedStyle(document.documentElement).getPropertyValue('--carrot-leaf-color'),
            pokotaBody: getComputedStyle(document.documentElement).getPropertyValue('--pokota-body-color'),
            pokotaEye: getComputedStyle(document.documentElement).getPropertyValue('--pokota-eye-color'),
            pokotaEyeWhite: getComputedStyle(document.documentElement).getPropertyValue('--pokota-eye-white-color'),
            pokotaCheek: getComputedStyle(document.documentElement).getPropertyValue('--pokota-cheek-color'),
            pokotaSnout: getComputedStyle(document.documentElement).getPropertyValue('--pokota-snout-color'),
            pokotaInnerEar: getComputedStyle(document.documentElement).getPropertyValue('--pokota-inner-ear-color'),
            pokotaFoot: getComputedStyle(document.documentElement).getPropertyValue('--pokota-foot-color'),
            zombieBody: getComputedStyle(document.documentElement).getPropertyValue('--zombie-body-color'),
            zombieEye: getComputedStyle(document.documentElement).getPropertyValue('--zombie-eye-color'),
            rockColor: getComputedStyle(document.documentElement).getPropertyValue('--rock-color'),
            skullColor: getComputedStyle(document.documentElement).getPropertyValue('--skull-color'),
            portalColor: getComputedStyle(document.documentElement).getPropertyValue('--portal-color')
        };
        this._updateGrassShades(this.mapsData[this.currentMapId].colors.grassBase);
    }

    /**
     * 更新草地陰影顏色板
     * @param {string} baseColorHex - 基礎草地顏色的十六進制值
     */
    _updateGrassShades(baseColorHex) {
        this.colors.grass = [];
        const baseColorInt = parseInt(baseColorHex.trim().slice(1), 16);
        for (let i = 0; i < 5; i++) {
            const r = (baseColorInt >> 16) & 0xFF;
            const g = (baseColorInt >> 8) & 0xFF;
            const b = (baseColorInt) & 0xFF;

            const offset = Math.floor(Math.random() * 20) - 10;
            const newR = Math.max(0, Math.min(255, r + offset));
            const newG = Math.max(0, Math.min(255, g + offset));
            const newB = Math.max(0, Math.min(255, b + offset));
            this.colors.grass.push(`#${(newR << 16 | newG << 8 | newB).toString(16).padStart(6, '0')}`);
        }
    }

    /**
     * 初始化遊戲狀態
     */
    init() {
        this.player = new PlayerCharacter(
            this.mapsData[this.currentMapId].initialPokotaX,
            this.mapsData[this.currentMapId].initialPokotaY,
            this.constants.POKOTA_MAX_HP,
            this.constants.POKOTA_MOVE_SPEED_PX,
            this.tileSize
        );
        this.loadMap(this.currentMapId); // 初始載入地圖
        this._setupEventListeners();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * 載入指定地圖
     * @param {string} mapId - 要載入的地圖ID
     */
    loadMap(mapId) {
        this.currentMapId = mapId;
        const mapData = this.mapsData[mapId];
        this.currentMap = new Map(mapData, this.tileSize);

        // 更新胖波在新地圖的初始位置
        this.player.x = mapData.initialPokotaX;
        this.player.y = mapData.initialPokotaY;
        this.player.pxX = this.player.x * this.tileSize;
        this.player.pxY = this.player.y * this.tileSize;
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;

        this.enemies = [];
        this.projectiles = [];

        // 應用地圖專屬的顏色到 CSS 變數
        document.documentElement.style.setProperty('--sky-start-color', mapData.colors.skyStart);
        document.documentElement.style.setProperty('--sky-end-color', mapData.colors.skyEnd);
        document.documentElement.style.setProperty('--ground-color', mapData.colors.ground);
        document.documentElement.style.setProperty('--grass-base-color', mapData.colors.grassBase);
        document.documentElement.style.setProperty('--grass-detail-color', mapData.colors.grassDetail);
        this._updateGrassShades(mapData.colors.grassBase); // 更新草地陰影色板

        // 如果是怪物地圖，啟用自動戰鬥模式並生成初始怪物
        if (mapId === 'monster_zone') {
            this.player.isAutoCombatMode = true;
            mapData.initialMonsters.forEach(monster => {
                this.enemies.push(new EnemyCharacter(monster.x, monster.y, monster.hp, monster.speed, this.tileSize));
            });
            this._toggleManualControls(false);
        } else {
            this.player.isAutoCombatMode = false;
            this._toggleManualControls(true);
        }
        console.log(`載入地圖: ${mapId}`);
    }

    /**
     * 切換手動控制按鈕的啟用狀態
     * @param {boolean} enable - 是否啟用按鈕
     */
    _toggleManualControls(enable) {
        document.getElementById('moveUpBtn').disabled = !enable;
        document.getElementById('moveLeftBtn').disabled = !enable;
        document.getElementById('moveRightBtn').disabled = !enable;
        document.getElementById('moveDownBtn').disabled = !enable;
    }

    /**
     * 發射蘿蔔飛彈
     * @param {EnemyCharacter} targetEnemy - 目標敵人
     */
    shootCarrot(targetEnemy) {
        if (this.player.hp <= 0) return;

        const startX = this.player.pxX + this.tileSize / 2;
        const startY = this.player.pxY + this.tileSize / 2;
        const targetX = targetEnemy.pxX + this.tileSize / 2;
        const targetY = targetEnemy.pxY + this.tileSize / 2;

        this.projectiles.push(new Projectile(
            startX, startY, targetX, targetY, 50, this.constants.PROJECTILE_SPEED, this.tileSize
        ));
        console.log("發射蘿蔔飛彈！");
    }

    /**
     * 隨機生成僵屍 (僅限村莊地圖)
     */
    spawnZombie() {
        if (this.player.hp <= 0 || this.currentMapId !== 'village') return;

        const spawnPoints = this.currentMap.getSpawnPoints();
        if (spawnPoints.length === 0) {
            console.warn("沒有僵屍生成點！");
            return;
        }

        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

        const dist = Math.sqrt(
            Math.pow(spawnPoint.x - this.player.x, 2) +
            Math.pow(spawnPoint.y - this.player.y, 2)
        );
        if (dist < 3) { // 確保距離胖波至少三格以上
            return;
        }

        this.enemies.push(new EnemyCharacter(spawnPoint.x, spawnPoint.y, 100, 0.01 + Math.random() * 0.01, this.tileSize));
        console.log("手動生成一個僵屍！");
    }

    /**
     * 遊戲邏輯更新
     * @param {number} currentTime - 當前時間戳
     */
    update(currentTime) {
        if (this.player.hp <= 0) {
            this.gameOverOverlay.style.display = 'flex';
            return;
        }

        // 更新玩家動畫和移動
        this.player.updateAnimation();
        this.physicsEngine.updateCharacterMovement(this.player);

        // 自動戰鬥模式邏輯
        if (this.player.isAutoCombatMode) {
            this.player.autoCombat(this.enemies, this.currentMap.isWalkable.bind(this.currentMap), this.shootCarrot.bind(this), currentTime);
            // 如果自動戰鬥模式因沒有敵人而關閉，重新啟用手動控制
            if (!this.player.isAutoCombatMode) {
                this._toggleManualControls(true);
            }
        } else {
            // 手動模式下，如果仍有敵人且在攻擊間隔內，自動攻擊最近的敵人
            if (this.enemies.length > 0 && currentTime - this.player.lastAttackTime > this.constants.ATTACK_INTERVAL) {
                let closestEnemy = null;
                let minDistance = Infinity;
                this.enemies.forEach(zombie => {
                    const dist = Math.sqrt(
                        Math.pow(zombie.x - this.player.x, 2) +
                        Math.pow(zombie.y - this.player.y, 2)
                    );
                    if (dist <= this.constants.ZOMBIE_ATTACK_RANGE_TILES && dist < minDistance) {
                        minDistance = dist;
                        closestEnemy = zombie;
                    }
                });
                if (closestEnemy) {
                    this.shootCarrot(closestEnemy);
                    this.player.lastAttackTime = currentTime;
                }
            }
        }

        // 更新敵人 AI 和移動
        this.enemies.forEach(enemy => {
            enemy.updateAI(this.player);
            // 僵屍對胖波造成傷害
            const zombieCenterX = enemy.pxX + this.tileSize / 2;
            const zombieCenterY = enemy.pxY + this.tileSize / 2;
            const playerCenterX = this.player.pxX + this.tileSize / 2;
            const playerCenterY = this.player.pxY + this.tileSize / 2;

            const distPxToPlayer = Math.sqrt(
                Math.pow(zombieCenterX - playerCenterX, 2) +
                Math.pow(zombieCenterY - playerCenterY, 2)
            );

            if (distPxToPlayer < this.constants.ZOMBIE_ATTACK_RANGE_PX && currentTime - enemy.lastAttackTime > this.constants.ZOMBIE_ATTACK_COOLDOWN) {
                this.player.takeDamage(this.constants.ZOMBIE_MELEE_DAMAGE);
                enemy.lastAttackTime = currentTime;
                console.log(`胖波受到傷害！HP: ${this.player.hp}`);
            }
        });

        // 更新投射物位置和碰撞
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (p.update()) { // 如果投射物到達目標
                this.projectiles.splice(i, 1); // 移除投射物
                continue;
            }

            let hitEnemyIndex = -1;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                // 簡單的像素級碰撞檢測
                const collisionDist = Math.sqrt(
                    Math.pow(p.x - (enemy.pxX + this.tileSize / 2), 2) +
                    Math.pow(p.y - (enemy.pxY + this.tileSize / 2), 2)
                );
                if (collisionDist < this.tileSize * 0.5) { // 如果飛彈中心與敵人中心距離小於半個磁磚
                    enemy.takeDamage(p.damage);
                    if (enemy.hp <= 0) {
                        this.enemies.splice(j, 1);
                        console.log("僵屍被擊敗！");
                    }
                    hitEnemyIndex = j;
                    break;
                }
            }

            if (hitEnemyIndex !== -1) {
                this.projectiles.splice(i, 1); // 移除投射物
            }
        }

        // 檢查傳送門進入
        const portal = this.currentMap.portal;
        if (portal &&
            this.player.x === portal.x &&
            this.player.y === portal.y) {
            console.log(`進入傳送門，傳送到 ${portal.targetMap}`);
            this.loadMap(portal.targetMap);
        }
    }

    /**
     * 遊戲渲染
     */
    render() {
        // 這裡調用 Renderer 實例的 render 方法
        this.renderer.render(this.currentMap, this.player, this.enemies, this.projectiles);

        // 更新 UI 顯示
        this.pokotaHPDisplay.textContent = this.player.hp;
        this.pokotaHPDisplay.style.color = this.player.hp > this.constants.POKOTA_MAX_HP / 2 ? 'green' : (this.player.hp > this.constants.POKOTA_MAX_HP / 4 ? 'orange' : 'red');

        if (this.player.isAutoCombatMode) {
            this.autoCombatStatusDisplay.textContent = "模式: 自動戰鬥中";
            this.autoCombatStatusDisplay.style.color = '#4CAF50';
        } else {
            this.autoCombatStatusDisplay.textContent = "模式: 手動探索";
            this.autoCombatStatusDisplay.style.color = '#d85785';
        }
    }

    /**
     * 主遊戲循環
     * @param {DOMHighResTimeStamp} currentTime - 當前時間戳
     */
    gameLoop(currentTime) {
        if (!this.lastGameUpdateTime) {
            this.lastGameUpdateTime = currentTime;
        }
        const deltaTime = currentTime - this.lastGameUpdateTime;

        // 可以根據 deltaTime 調整更新頻率，這裡簡化為每幀更新
        this.update(currentTime);
        this.render();

        this.lastGameUpdateTime = currentTime;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * 設定事件監聽器
     */
    _setupEventListeners() {
        document.getElementById('moveUpBtn').addEventListener('click', () => this.player.move('up', this.currentMap.isWalkable.bind(this.currentMap)));
        document.getElementById('moveLeftBtn').addEventListener('click', () => this.player.move('left', this.currentMap.isWalkable.bind(this.currentMap)));
        document.getElementById('moveRightBtn').addEventListener('click', () => this.player.move('right', this.currentMap.isWalkable.bind(this.currentMap)));
        document.getElementById('moveDownBtn').addEventListener('click', () => this.player.move('down', this.currentMap.isWalkable.bind(this.currentMap)));
        document.getElementById('spawnZombieBtn').addEventListener('click', () => this.spawnZombie());

        document.addEventListener('keydown', (event) => {
            if (this.player.hp <= 0) return;

            switch (event.key) {
                case 'ArrowUp':
                    this.player.move('up', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowDown':
                    this.player.move('down', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowLeft':
                    this.player.move('left', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowRight':
                    this.player.move('right', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'z':
                case 'Z':
                    this.spawnZombie();
                    break;
            }
        });

        this.restartButton.addEventListener('click', () => {
            this.player.hp = this.constants.POKOTA_MAX_HP;
            this.player.isAutoCombatMode = false; // 重置自動戰鬥模式
            this.gameOverOverlay.style.display = 'none';
            this.loadMap('village'); // 回到村莊地圖重新開始
            // 重新啟動遊戲循環 (如果已經停止)
            if (this.player.hp > 0 && this.gameOverOverlay.style.display === 'none') {
                 requestAnimationFrame(this.gameLoop.bind(this));
            }
        });
    }
}

// 遊戲啟動
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game("gameCanvas", GAME_CONSTANTS, gameMapsData);
    game.init();
});
