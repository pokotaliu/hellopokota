// js/game.js
/**
 * @file 遊戲主邏輯
 */

import { Renderer } from './renderer.js';
import { PhysicsEngine } from './physicsEngine.js';
import { PlayerCharacter } from './playerCharacter.js';
import { BrownBearCharacter } from './brownBearCharacter.js';
import { EnemyCharacter } from './enemyCharacter.js';
import { Projectile } from './projectile.js';
import { Map } from './map.js';
import { GAME_CONSTANTS, MAP_DATA } from './constants.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.TILE_SIZE = GAME_CONSTANTS.TILE_SIZE;

        this.renderer = new Renderer(this.canvas, this.ctx, this.TILE_SIZE, MAP_DATA.villageMap.colors); // 初始化時先用一個地圖的顏色
        this.physicsEngine = new PhysicsEngine(this.TILE_SIZE);

        this.player = null; // 玩家角色 (Pokota 或 BrownBear)
        this.enemies = []; // 敵人列表
        this.projectiles = []; // 投射物列表
        this.carrots = 0; // 胖波的蘿蔔數量

        this.keys = {}; // 記錄按鍵狀態
        this.lastAttackTime = 0; // 玩家上次攻擊時間

        this.gameLoopId = null; // 遊戲循環 ID
        this.lastFrameTime = 0; // 上一幀的時間

        this.currentMapId = GAME_CONSTANTS.MAP_VILLAGE_ID;
        this.currentMap = null; // 當前地圖實例
        this.playerSpawnPoint = { x: GAME_CONSTANTS.MAP_DATA.villageMap.playerSpawn.x, y: GAME_CONSTANTS.MAP_DATA.villageMap.playerSpawn.y };

        this.isGameRunning = false; // 遊戲運行狀態
        this.gameStartTime = 0; // 遊戲開始時間
        this.elapsedTime = 0; // 遊戲經過時間

        this.overlay = document.getElementById('message-overlay');
        this.overlayText = document.getElementById('overlay-text');
        this.restartButton = document.getElementById('restartGameBtn');

        this.healthBarElement = document.getElementById('health-bar');
        this.carrotCountElement = document.getElementById('carrot-count');
        this.currentMapElement = document.getElementById('current-map');
        this.gameTimeElement = document.getElementById('game-time');

        this._addEventListeners();
        this._initializeGame();
    }

    _initializeGame() {
        this.loadMap(this.currentMapId); // 載入初始地圖
        this.player = new PlayerCharacter(
            this.playerSpawnPoint.x,
            this.playerSpawnPoint.y,
            GAME_CONSTANTS.POKOTA_HP,
            GAME_CONSTANTS.POKOTA_SPEED_PX,
            this.TILE_SIZE
        );
        this.player.type = 'pokota'; // 確保初始是胖波

        // 初始化UI
        this.updateUI();
        this.overlay.style.display = 'none';
        this.restartButton.style.display = 'none';
    }

    _addEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            // 阻止預設行為以防止滾動
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyA'].includes(e.code)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        document.getElementById('startGameBtn').addEventListener('click', () => {
            if (!this.isGameRunning) {
                this.startGame();
            }
        });

        document.getElementById('togglePlayerBtn').addEventListener('click', () => {
            this.togglePlayerCharacter();
        });

        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
    }

    startGame() {
        if (this.isGameRunning) return;

        this.isGameRunning = true;
        this.gameStartTime = performance.now(); // 記錄遊戲開始時間
        this.overlay.style.display = 'none';
        this.restartButton.style.display = 'none';
        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
        console.log("Game started!");
    }

    pauseGame(message) {
        if (!this.isGameRunning) return;
        this.isGameRunning = false;
        cancelAnimationFrame(this.gameLoopId);
        this.overlayText.textContent = message;
        this.overlay.style.display = 'flex';
        this.restartButton.style.display = 'block'; // 顯示重新開始按鈕
        console.log("Game paused/ended.");
    }

    restartGame() {
        // 重置遊戲狀態
        this.carrots = 0;
        this.enemies = [];
        this.projectiles = [];
        this.lastAttackTime = 0;
        this.keys = {};

        // 重新載入初始地圖並將玩家傳送到出生點
        this.currentMapId = GAME_CONSTANTS.MAP_VILLAGE_ID;
        this.loadMap(this.currentMapId);
        this.playerSpawnPoint = { x: GAME_CONSTANTS.MAP_DATA.villageMap.playerSpawn.x, y: GAME_CONSTANTS.MAP_DATA.villageMap.playerSpawn.y };

        // 根據當前玩家類型重新創建玩家實例
        const playerType = this.player.type;
        if (playerType === 'pokota') {
            this.player = new PlayerCharacter(
                this.playerSpawnPoint.x,
                this.playerSpawnPoint.y,
                GAME_CONSTANTS.POKOTA_HP,
                GAME_CONSTANTS.POKOTA_SPEED_PX,
                this.TILE_SIZE
            );
        } else {
            this.player = new BrownBearCharacter(
                this.playerSpawnPoint.x,
                this.playerSpawnPoint.y,
                GAME_CONSTANTS.BROWN_BEAR_HP,
                GAME_CONSTANTS.BROWN_BEAR_SPEED_PX,
                this.TILE_SIZE
            );
        }

        this.player.type = playerType; // 確保角色類型正確

        this.updateUI();
        this.startGame(); // 重新開始遊戲循環
    }

    loadMap(mapId) {
        const mapData = MAP_DATA[mapId];
        if (!mapData) {
            console.error(`Map data for ID '${mapId}' not found!`);
            return;
        }
        this.currentMap = new Map(mapData, this.TILE_SIZE);
        // 更新 Renderer 的顏色配置以匹配新地圖
        this.renderer.colors = this.currentMap.colors;
        console.log(`Map loaded: ${this.currentMap.name}`);

        // 如果切換到怪物地圖，生成僵屍
        if (mapId === GAME_CONSTANTS.MAP_MONSTER_ID) {
            this.spawnZombies(mapData.spawnPoints);
        } else {
            this.enemies = []; // 回到村莊地圖時清空僵屍
        }
        this.updateUI();
    }

    spawnZombies(spawnPoints) {
        this.enemies = []; // 清空現有僵屍
        spawnPoints.forEach(point => {
            const zombie = new EnemyCharacter(
                point.x,
                point.y,
                GAME_CONSTANTS.ZOMBIE_HP,
                GAME_CONSTANTS.ZOMBIE_SPEED_PX,
                this.TILE_SIZE
            );
            // 將僵屍的像素位置初始化為其磁磚位置的左上角
            zombie.pxX = point.x * this.TILE_SIZE;
            zombie.pxY = point.y * this.TILE_SIZE;
            this.enemies.push(zombie);
        });
        console.log(`Spawned ${this.enemies.length} zombies.`);
    }

    togglePlayerCharacter() {
        if (this.isGameRunning) {
            this.pauseGame("請先停止遊戲以切換角色。");
            return;
        }
        const currentPlayerType = this.player.type;
        let newPlayer;

        if (currentPlayerType === 'pokota') {
            newPlayer = new BrownBearCharacter(
                this.player.x,
                this.player.y,
                GAME_CONSTANTS.BROWN_BEAR_HP,
                GAME_CONSTANTS.BROWN_BEAR_SPEED_PX,
                this.TILE_SIZE
            );
            newPlayer.type = 'brownBear';
            console.log("Switched to Brown Bear!");
        } else {
            newPlayer = new PlayerCharacter( // 使用 PlayerCharacter 類別來表示胖波
                this.player.x,
                this.player.y,
                GAME_CONSTANTS.POKOTA_HP,
                GAME_CONSTANTS.POKOTA_SPEED_PX,
                this.TILE_SIZE
            );
            newPlayer.type = 'pokota';
            console.log("Switched to Pokota!");
        }
        // 保持新角色的像素位置與舊角色相同
        newPlayer.pxX = this.player.pxX;
        newPlayer.pxY = this.player.pxY;
        this.player = newPlayer;
        this.updateUI();
    }

    gameLoop(currentTime) {
        if (!this.isGameRunning) return;

        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        this.elapsedTime = currentTime - this.gameStartTime;

        this.update(deltaTime, currentTime);
        this.render();

        this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime, currentTime) {
        if (this.player.hp <= 0) {
            this.pauseGame("你被打敗了！");
            return;
        }

        // === 玩家移動處理 ===
        if (this.player.type === 'pokota') {
            // 胖波自動戰鬥模式
            if (this.player.isAutoCombatMode) {
                this.player.autoCombat(this.enemies, this.currentMap.isWalkable.bind(this.currentMap), this.shootCarrot.bind(this), currentTime);
            } else {
                // 手動控制
                this._handlePlayerInput();
            }
        } else { // BrownBear
            this._handlePlayerInput();
        }

        this.physicsEngine.updateCharacterMovement(this.player);
        this.player.updateAnimation(); // 更新玩家動畫

        // === 敵人 AI 更新 ===
        this.enemies.forEach(zombie => {
            zombie.updateAI(this.player, this.zombieAttackPlayer.bind(this), currentTime);
            // 僵屍的像素移動已經在 updateAI 中處理，不需要額外調用 physicsEngine.updateCharacterMovement
        });

        // === 投射物更新 ===
        this.projectiles = this.projectiles.filter(p => {
            const arrived = p.update();
            if (arrived) {
                // 檢查投射物是否擊中敵人
                let hitEnemy = false;
                this.enemies = this.enemies.filter(enemy => {
                    // 使用投射物的像素位置和僵屍的像素位置進行碰撞檢測
                    // 需要為投射物和僵屍設定 collisionRadius
                    const projectileCollisionRadius = p.tileSize * 0.1; // 蘿蔔飛彈的半徑
                    if (this.physicsEngine.checkCollision(
                        { pxX: p.x, pxY: p.y, collisionRadius: projectileCollisionRadius },
                        enemy
                    )) {
                        enemy.takeDamage(p.damage);
                        console.log(`Zombie hit! HP: ${enemy.hp}/${enemy.maxHp}`);
                        hitEnemy = true;
                        return enemy.hp > 0; // 如果敵人生命值歸零，則移除
                    }
                    return true; // 否則保留敵人
                });
                return !hitEnemy; // 如果擊中敵人，則移除投射物
            }
            return true; // 如果未到達目標或未擊中敵人，保留投射物
        });


        // === 檢查玩家與地圖互動 ===
        this._checkPlayerMapInteraction();

        // === 刷新 UI ===
        this.updateUI();
    }

    _handlePlayerInput() {
        // 如果玩家正在移動中，不允許新的移動指令，直到到達目標磁磚
        if (this.player.isMoving) {
            return;
        }
        
        let moved = false;
        if (this.keys['ArrowUp']) {
            this.player.move('up', this.currentMap.isWalkable.bind(this.currentMap));
            moved = true;
        } else if (this.keys['ArrowDown']) {
            this.player.move('down', this.currentMap.isWalkable.bind(this.currentMap));
            moved = true;
        } else if (this.keys['ArrowLeft']) {
            this.player.move('left', this.currentMap.isWalkable.bind(this.currentMap));
            moved = true;
        } else if (this.keys['ArrowRight']) {
            this.player.move('right', this.currentMap.isWalkable.bind(this.currentMap));
            moved = true;
        }

        // 如果玩家類型是胖波，且按下 'A' 鍵，切換自動戰鬥模式
        if (this.player.type === 'pokota' && this.keys['KeyA']) {
            // 只在按鍵按下瞬間切換，避免長按頻繁切換
            if (!this.lastToggleAutoCombatPress) { // 檢查上次切換時間
                this.player.isAutoCombatMode = !this.player.isAutoCombatMode;
                console.log(`Pokota Auto Combat: ${this.player.isAutoCombatMode ? 'ON' : 'OFF'}`);
                this.lastToggleAutoCombatPress = performance.now();
            }
        } else {
            this.lastToggleAutoCombatPress = null; // 重置按鍵狀態
        }

        // 攻擊
        const currentTime = performance.now();
        if (this.keys['Space'] && currentTime - this.lastAttackTime > GAME_CONSTANTS.ATTACK_INTERVAL) {
            if (this.player.type === 'pokota') {
                if (this.carrots > 0) {
                    this.shootCarrot();
                    this.carrots--;
                    this.lastAttackTime = currentTime;
                } else {
                    console.log("No carrots left!");
                }
            } else if (this.player.type === 'brownBear') {
                this.brownBearAttack();
                this.lastAttackTime = currentTime;
            }
        }
    }


    _checkPlayerMapInteraction() {
        const playerTile = this.currentMap.getTile(this.player.x, this.player.y);

        // 檢查是否踩到蘿蔔
        if (playerTile && playerTile.type === 3) { // 蘿蔔
            this.carrots++;
            this.currentMap.grid[this.player.y][this.player.x] = { type: 0, grassShadeIndex: Math.floor(Math.random() * this.currentMap.colors.grass.length) }; // 將蘿蔔變成草地
            console.log(`Picked up a carrot! Total: ${this.carrots}`);
        }

        // 檢查是否到達傳送門
        if (this.currentMap.portal && this.player.x === this.currentMap.portal.x && this.player.y === this.currentMap.portal.y) {
            this.teleportPlayer(this.currentMap.portal.targetMapId, this.currentMap.portal.targetPlayerSpawn);
        }
    }

    teleportPlayer(targetMapId, spawnPoint) {
        this.currentMapId = targetMapId;
        this.loadMap(targetMapId);

        // 重置玩家的位置到目標地圖的出生點
        this.player.x = spawnPoint.x;
        this.player.y = spawnPoint.y;
        this.player.pxX = spawnPoint.x * this.TILE_SIZE;
        this.player.pxY = spawnPoint.y * this.TILE_SIZE;
        this.player.targetX = spawnPoint.x;
        this.player.targetY = spawnPoint.y;
        this.player.isMoving = false;
        console.log(`Teleported to map: ${this.currentMap.name}`);
    }

    shootCarrot(targetEnemy = null) {
        // 如果沒有指定目標敵人，則尋找最近的敵人作為目標
        if (!targetEnemy && this.enemies.length > 0) {
            let closestDist = Infinity;
            this.enemies.forEach(enemy => {
                const dist = Math.sqrt(
                    Math.pow(enemy.x - this.player.x, 2) +
                    Math.pow(enemy.y - this.player.y, 2)
                );
                if (dist < closestDist) {
                    closestDist = dist;
                    targetEnemy = enemy;
                }
            });
        }

        if (targetEnemy) {
            // 計算飛彈的起始位置 (玩家中心)
            const startPxX = this.player.pxX + this.TILE_SIZE / 2;
            const startPxY = this.player.pxY + this.TILE_SIZE / 2;

            // 計算目標敵人的中心位置
            const targetPxX = targetEnemy.pxX + this.TILE_SIZE / 2;
            const targetPxY = targetEnemy.pxY + this.TILE_SIZE / 2;

            const projectile = new Projectile(
                startPxX,
                startPxY,
                targetPxX,
                targetPxY,
                GAME_CONSTANTS.POKOTA_ATTACK_DAMAGE,
                GAME_CONSTANTS.POKOTA_PROJECTILE_SPEED,
                this.TILE_SIZE
            );
            this.projectiles.push(projectile);
            console.log("Pokota shoots a carrot!");
        } else {
            // 如果沒有敵人可以攻擊，且不是自動戰鬥模式，則只扣蘿蔔不發射
            if (!this.player.isAutoCombatMode) {
                console.log("No enemies to shoot at.");
            }
        }
    }

    brownBearAttack() {
        console.log("Brown Bear attacks!");
        this.enemies.forEach(enemy => {
            // 檢查熊大與敵人的距離 (像素)
            const dist = Math.sqrt(
                Math.pow((this.player.pxX + this.TILE_SIZE / 2) - (enemy.pxX + this.TILE_SIZE / 2), 2) +
                Math.pow((this.player.pxY + this.TILE_SIZE / 2) - (enemy.pxY + this.TILE_SIZE / 2), 2)
            );

            if (dist <= this.player.attackRangePx) {
                enemy.takeDamage(GAME_CONSTANTS.BROWN_BEAR_ATTACK_DAMAGE);
                console.log(`Zombie hit by Brown Bear! HP: ${enemy.hp}/${enemy.maxHp}`);
            }
        });
        // 移除死亡的敵人
        this.enemies = this.enemies.filter(enemy => enemy.hp > 0);
    }

    zombieAttackPlayer(zombie, player) {
        player.takeDamage(GAME_CONSTANTS.ZOMBIE_ATTACK_DAMAGE);
        console.log(`Player hit by zombie! HP: ${player.hp}/${player.maxHp}`);
    }


    render() {
        this.renderer.render(this.currentMap, this.player, this.enemies, this.projectiles);
    }

    updateUI() {
        this.healthBarElement.textContent = `${this.player.hp}/${this.player.maxHp}`;
        this.carrotCountElement.textContent = this.carrots;
        this.currentMapElement.textContent = this.currentMap.name;

        // 更新遊戲時間
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.gameTimeElement.textContent = formattedTime;
    }
}

// 啟動遊戲
window.onload = () => {
    new Game();
};
