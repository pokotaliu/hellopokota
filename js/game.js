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
import { BrownBearCharacter } from './brownBearCharacter.js'; // 匯入熊大角色

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
        this.enemies = [];
        this.projectiles = [];

        this.colors = {}; // 儲存所有顏色值
        this._initializeColors();

        // 初始化兩個玩家角色實例
        this.pokota = new PlayerCharacter(
            this.mapsData[this.currentMapId].initialPokotaX,
            this.mapsData[this.currentMapId].initialPokotaY,
            this.constants.POKOTA_MAX_HP,
            this.constants.POKOTA_MOVE_SPEED_PX,
            this.tileSize
        );
        this.pokota.type = 'pokota'; // 設置角色類型

        this.brownBear = new BrownBearCharacter(
            this.mapsData[this.currentMapId].initialPokotaX, // 初始位置與胖波相同
            this.mapsData[this.currentMapId].initialPokotaY,
            this.constants.BROWN_BEAR_MAX_HP,
            this.constants.BROWN_BEAR_MOVE_SPEED_PX,
            this.tileSize
        );
        this.brownBear.type = 'brownBear'; // 設置角色類型

        this.activePlayer = this.pokota; // 預設活躍角色為胖波

        // DEBUG: 檢查角色實例是否正確建立
        console.log("DEBUG: Game constructor - Pokota:", this.pokota);
        console.log("DEBUG: Game constructor - Brown Bear:", this.brownBear);
        console.log("DEBUG: Game constructor - Initial activePlayer:", this.activePlayer);
        console.log("DEBUG: Game constructor - typeof this.pokota.move:", typeof this.pokota.move);
        console.log("DEBUG: Game constructor - typeof this.brownBear.move:", typeof this.brownBear.move);


        this.renderer = new Renderer(this.canvas, this.ctx, this.tileSize, this.colors);
        this.physicsEngine = new PhysicsEngine(this.tileSize);

        this.pokotaHPDisplay = document.getElementById('pokotaHPDisplay');
        this.autoCombatStatusDisplay = document.getElementById('autoCombatStatus');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.restartButton = document.getElementById('restartButton');
        this.switchCharacterButton = document.getElementById('switchCharacterBtn'); // 新增切換角色按鈕的引用

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
            portalColor: getComputedStyle(document.documentElement).getPropertyValue('--portal-color'),
            // 新增熊大的顏色
            brownBearBody: '#8B4513', // 棕色
            brownBearSnout: '#D2B48C', // 米色
            brownBearNose: '#333333', // 深色鼻子
            brownBearEye: '#000000', // 黑色眼睛
            brownBearInnerEar: '#A0522D', // 稍淺的棕色內耳
            brownBearClub: '#5A2D0C' // 棍棒顏色
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
        // 載入初始地圖，並將活躍角色移動到地圖初始位置
        this.loadMap(this.currentMapId);
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

        // 將所有玩家角色移動到新地圖的初始位置
        this.pokota.x = mapData.initialPokotaX;
        this.pokota.y = mapData.initialPokotaY;
        this.pokota.pxX = this.pokota.x * this.tileSize;
        this.pokota.pxY = this.pokota.y * this.tileSize;
        this.pokota.targetX = this.pokota.x;
        this.pokota.targetY = this.pokota.y;
        this.pokota.isMoving = false; // 停止移動

        this.brownBear.x = mapData.initialPokotaX;
        this.brownBear.y = mapData.initialPokotaY;
        this.brownBear.pxX = this.brownBear.x * this.tileSize;
        this.brownBear.pxY = this.brownBear.y * this.tileSize;
        this.brownBear.targetX = this.brownBear.x;
        this.brownBear.targetY = this.brownBear.y;
        this.brownBear.isMoving = false; // 停止移動

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
            this.pokota.isAutoCombatMode = true; // 胖波啟用自動戰鬥
            this.brownBear.isAutoCombatMode = true; // 熊大啟用自動戰鬥
            mapData.initialMonsters.forEach(monster => {
                this.enemies.push(new EnemyCharacter(monster.x, monster.y, monster.hp, monster.speed, this.tileSize));
            });
            this._toggleManualControls(false); // 自動戰鬥模式下禁用手動控制
        } else {
            this.pokota.isAutoCombatMode = false; // 胖波禁用自動戰鬥
            this.brownBear.isAutoCombatMode = false; // 熊大禁用自動戰鬥
            this._toggleManualControls(true); // 手動模式下啟用手動控制
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
     * 玩家攻擊邏輯 (根據當前角色類型調用不同攻擊方式)
     * @param {EnemyCharacter} targetEnemy - 目標敵人
     */
    playerAttack(targetEnemy) {
        if (this.activePlayer.hp <= 0) return;

        console.log(`DEBUG: playerAttack called. Active player type: ${this.activePlayer.type}`);
        if (this.activePlayer.type === 'pokota') {
            // 胖波的遠程攻擊
            const startX = this.activePlayer.pxX + this.tileSize / 2;
            const startY = this.activePlayer.pxY + this.tileSize / 2;
            const targetX = targetEnemy.pxX + this.tileSize / 2;
            const targetY = targetEnemy.pxY + this.tileSize / 2;

            this.projectiles.push(new Projectile(
                startX, startY, targetX, targetY, 50, this.constants.PROJECTILE_SPEED, this.tileSize
            ));
            console.log("胖波發射蘿蔔飛彈！");
        } else if (this.activePlayer.type === 'brownBear') {
            // 熊大的近戰攻擊
            console.log("DEBUG: Calling brownBear.meleeAttack(). Target enemy:", targetEnemy);
            this.activePlayer.meleeAttack(targetEnemy);
        }
    }

    /**
     * 隨機生成僵屍 (僅限村莊地圖)
     */
    spawnZombie() {
        if (this.activePlayer.hp <= 0 || this.currentMapId !== 'village') return;

        const spawnPoints = this.currentMap.getSpawnPoints();
        if (spawnPoints.length === 0) {
            console.warn("沒有僵屍生成點！");
            return;
        }

        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

        const dist = Math.sqrt(
            Math.pow(spawnPoint.x - this.activePlayer.x, 2) +
            Math.pow(spawnPoint.y - this.activePlayer.y, 2)
        );
        if (dist < 3) { // 確保距離活躍角色至少三格以上
            return;
        }

        this.enemies.push(new EnemyCharacter(spawnPoint.x, spawnPoint.y, 100, 0.01 + Math.random() * 0.01, this.tileSize));
        console.log("手動生成一個僵屍！");
    }

    /**
     * 切換當前活躍的角色
     */
    switchCharacter() {
        // 記錄當前活躍角色的位置和血量
        const currentX = this.activePlayer.x;
        const currentY = this.activePlayer.y;
        const currentPxX = this.activePlayer.pxX;
        const currentPxY = this.activePlayer.pxY;
        const currentTargetX = this.activePlayer.targetX;
        const currentTargetY = this.activePlayer.targetY;
        const currentHP = this.activePlayer.hp;
        const currentIsAutoCombatMode = this.activePlayer.isAutoCombatMode;

        if (this.activePlayer === this.pokota) {
            this.activePlayer = this.brownBear;
            this.pokota.hp = currentHP; // 保存胖波的血量
            this.pokota.isAutoCombatMode = currentIsAutoCombatMode; // 保存胖波的自動戰鬥模式
            console.log("切換到熊大！");
        } else {
            this.activePlayer = this.pokota;
            this.brownBear.hp = currentHP; // 保存熊大的血量
            this.brownBear.isAutoCombatMode = currentIsAutoCombatMode; // 保存熊大的自動戰鬥模式
            console.log("切換到胖波！");
        }

        // 將新活躍角色的位置設定為前一個角色的位置
        this.activePlayer.x = currentX;
        this.activePlayer.y = currentY;
        this.activePlayer.pxX = currentPxX;
        this.activePlayer.pxY = currentPxY;
        this.activePlayer.targetX = currentTargetX;
        this.activePlayer.targetY = currentTargetY;
        this.activePlayer.isMoving = false; // 停止移動
        this.activePlayer.hp = currentHP; // 恢復血量
        this.activePlayer.isAutoCombatMode = currentIsAutoCombatMode; // 恢復自動戰鬥模式

        // 如果在怪物區域，強制啟用自動戰鬥
        if (this.currentMapId === 'monster_zone') {
            this.activePlayer.isAutoCombatMode = true;
            this._toggleManualControls(false);
        } else {
            this._toggleManualControls(true);
        }

        // DEBUG: 檢查切換後 activePlayer 的狀態
        console.log("DEBUG: After switch - activePlayer:", this.activePlayer);
        console.log("DEBUG: After switch - typeof activePlayer.move:", typeof this.activePlayer.move);
        console.log("DEBUG: After switch - activePlayer prototype:", Object.getPrototypeOf(this.activePlayer));
        console.log("DEBUG: After switch - activePlayer prototype's prototype:", Object.getPrototypeOf(Object.getPrototypeOf(this.activePlayer)));
    }

    /**
     * 遊戲邏輯更新
     * @param {number} currentTime - 當前時間戳
     */
    update(currentTime) {
        if (this.activePlayer.hp <= 0) {
            this.gameOverOverlay.style.display = 'flex';
            return;
        }

        // 更新活躍玩家的動畫和移動
        this.activePlayer.updateAnimation();
        this.physicsEngine.updateCharacterMovement(this.activePlayer);

        // 自動戰鬥模式邏輯
        if (this.activePlayer.isAutoCombatMode) {
            // 根據角色類型調用不同的 autoCombat 方法
            if (this.activePlayer.type === 'pokota') {
                this.activePlayer.autoCombat(this.enemies, this.currentMap.isWalkable.bind(this.currentMap), this.playerAttack.bind(this), currentTime);
            } else if (this.activePlayer.type === 'brownBear') {
                // 修正：確保為熊大 autoCombat 傳入 isWalkableFn
                this.activePlayer.autoCombat(this.enemies, this.currentMap.isWalkable.bind(this.currentMap), currentTime);
            }

            // 如果自動戰鬥模式因沒有敵人而關閉，重新啟用手動控制 (僅胖波會關閉，熊大不會)
            if (this.activePlayer.type === 'pokota' && !this.activePlayer.isAutoCombatMode) {
                this._toggleManualControls(true);
            }
        } else {
            // 手動模式下，如果仍有敵人且在攻擊間隔內，自動攻擊最近的敵人
            let attackRange = 0;
            let attackCooldown = 0;
            if (this.activePlayer.type === 'pokota') {
                attackRange = this.constants.ZOMBIE_ATTACK_RANGE_TILES; // 胖波的攻擊範圍
                attackCooldown = this.constants.ATTACK_INTERVAL; // 胖波的攻擊冷卻
            } else if (this.activePlayer.type === 'brownBear') {
                attackRange = this.constants.BROWN_BEAR_ATTACK_RANGE_TILES; // 熊大的攻擊範圍
                attackCooldown = this.constants.BROWN_BEAR_ATTACK_COOLDOWN; // 熊大的攻擊冷卻
            }

            if (this.enemies.length > 0 && currentTime - this.activePlayer.lastAttackTime > attackCooldown) {
                let closestEnemy = null;
                let minDistance = Infinity;
                this.enemies.forEach(zombie => {
                    const dist = Math.sqrt(
                        Math.pow(zombie.x - this.activePlayer.x, 2) +
                        Math.pow(zombie.y - this.activePlayer.y, 2)
                    );
                    if (dist <= attackRange && dist < minDistance) {
                        minDistance = dist;
                        closestEnemy = zombie;
                    }
                });
                if (closestEnemy) {
                    console.log("DEBUG: Manual mode - Attempting player attack.");
                    this.playerAttack(closestEnemy); // 調用通用的 playerAttack
                    this.activePlayer.lastAttackTime = currentTime;
                }
            }
        }

        // 更新敵人 AI 和移動
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.updateAI(this.activePlayer); // 敵人追蹤活躍玩家

            // 僵屍對活躍玩家造成傷害
            const zombieCenterX = enemy.pxX + this.tileSize / 2;
            const zombieCenterY = enemy.pxY + this.tileSize / 2;
            const playerCenterX = this.activePlayer.pxX + this.tileSize / 2;
            const playerCenterY = this.activePlayer.pxY + this.tileSize / 2;

            const distPxToPlayer = Math.sqrt(
                Math.pow(zombieCenterX - playerCenterX, 2) +
                Math.pow(zombieCenterY - playerCenterY, 2)
            );

            if (distPxToPlayer < this.constants.ZOMBIE_ATTACK_RANGE_PX && currentTime - enemy.lastAttackTime > this.constants.ZOMBIE_ATTACK_COOLDOWN) {
                this.activePlayer.takeDamage(this.constants.ZOMBIE_MELEE_DAMAGE);
                enemy.lastAttackTime = currentTime;
                console.log(`${this.activePlayer.type === 'pokota' ? '胖波' : '熊大'}受到傷害！HP: ${this.activePlayer.hp}`);
            }

            // 檢查敵人是否死亡並移除
            console.log(`DEBUG: Enemy check for removal - Enemy HP: ${enemy.hp}, ID: ${enemy.id || 'N/A'}`); // 增加敵人ID以便追蹤
            if (enemy.hp <= 0) {
                console.log(`DEBUG: Enemy at (${enemy.x}, ${enemy.y}) defeated! Removing from list. Current enemies count: ${this.enemies.length}`);
                this.enemies.splice(i, 1);
                console.log(`DEBUG: Enemies count after removal: ${this.enemies.length}`);
            }
        }

        // 更新投射物位置和碰撞 (僅胖波會發射投射物)
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
                    console.log(`DEBUG: Projectile hit enemy. Enemy HP after hit: ${enemy.hp}`);
                    // 敵人死亡的檢查和移除會由外層的敵人更新循環處理
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
            this.activePlayer.x === portal.x &&
            this.activePlayer.y === portal.y) {
            console.log(`進入傳送門，傳送到 ${portal.targetMap}`);
            this.loadMap(portal.targetMap);
        }
    }

    /**
     * 遊戲渲染
     */
    render() {
        this.renderer.render(this.currentMap, this.activePlayer, this.enemies, this.projectiles);

        // 更新 UI 顯示
        this.pokotaHPDisplay.textContent = `${this.activePlayer.hp} / ${this.activePlayer.maxHp}`;
        this.pokotaHPDisplay.style.color = this.activePlayer.hp > this.activePlayer.maxHp / 2 ? 'green' : (this.activePlayer.hp > this.activePlayer.maxHp / 4 ? 'orange' : 'red');

        if (this.activePlayer.isAutoCombatMode) {
            this.autoCombatStatusDisplay.textContent = `模式: 自動戰鬥中 (${this.activePlayer.type === 'pokota' ? '胖波' : '熊大'})`;
            this.autoCombatStatusDisplay.style.color = '#4CAF50';
        } else {
            this.autoCombatStatusDisplay.textContent = `模式: 手動探索 (${this.activePlayer.type === 'pokota' ? '胖波' : '熊大'})`;
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
        // 移動按鈕事件
        document.getElementById('moveUpBtn').addEventListener('click', () => {
            console.log("DEBUG: Move Up button clicked. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
            this.activePlayer.move('up', this.currentMap.isWalkable.bind(this.currentMap));
        });
        document.getElementById('moveLeftBtn').addEventListener('click', () => {
            console.log("DEBUG: Move Left button clicked. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
            this.activePlayer.move('left', this.currentMap.isWalkable.bind(this.currentMap));
        });
        document.getElementById('moveRightBtn').addEventListener('click', () => {
            console.log("DEBUG: Move Right button clicked. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
            this.activePlayer.move('right', this.currentMap.isWalkable.bind(this.currentMap));
        });
        document.getElementById('moveDownBtn').addEventListener('click', () => {
            console.log("DEBUG: Move Down button clicked. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
            this.activePlayer.move('down', this.currentMap.isWalkable.bind(this.currentMap));
        });
        
        // 生成僵屍按鈕
        document.getElementById('spawnZombieBtn').addEventListener('click', () => this.spawnZombie());

        // 切換角色按鈕
        this.switchCharacterButton.addEventListener('click', () => this.switchCharacter());

        // 鍵盤事件
        document.addEventListener('keydown', (event) => {
            if (this.activePlayer.hp <= 0) return;

            switch (event.key) {
                case 'ArrowUp':
                    console.log("DEBUG: ArrowUp pressed. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
                    this.activePlayer.move('up', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowDown':
                    console.log("DEBUG: ArrowDown pressed. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
                    this.activePlayer.move('down', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowLeft':
                    console.log("DEBUG: ArrowLeft pressed. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
                    this.activePlayer.move('left', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'ArrowRight':
                    console.log("DEBUG: ArrowRight pressed. activePlayer:", this.activePlayer, "typeof move:", typeof this.activePlayer.move);
                    this.activePlayer.move('right', this.currentMap.isWalkable.bind(this.currentMap));
                    break;
                case 'z':
                case 'Z':
                    this.spawnZombie();
                    break;
                case 'c': // 'c' 鍵用於切換角色
                case 'C':
                    this.switchCharacter();
                    break;
            }
        });

        // 重新開始按鈕
        this.restartButton.addEventListener('click', () => {
            this.activePlayer.hp = this.constants.POKOTA_MAX_HP; // 重置為胖波的滿血，因為胖波是預設角色
            this.pokota.hp = this.constants.POKOTA_MAX_HP;
            this.brownBear.hp = this.constants.BROWN_BEAR_MAX_HP;

            this.pokota.isAutoCombatMode = false; // 重置自動戰鬥模式
            this.brownBear.isAutoCombatMode = false;

            this.gameOverOverlay.style.display = 'none';
            this.loadMap('village'); // 回到村莊地圖重新開始
            this.activePlayer = this.pokota; // 確保重置後是胖波

            // 重新啟動遊戲循環 (如果已經停止)
            if (this.activePlayer.hp > 0 && this.gameOverOverlay.style.display === 'none') {
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
