// game.js
import { Map, isWalkable, tileSize } from './map.js';
import { Pokota } from './pokota.js';
import { Enemy } from './enemy.js';
import { log } from './log.js';

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const gameMap = new Map();
const pokota = new Pokota(1, 1); // 起始格子座標
let enemies = [new Enemy(10, 0)];

function update() {
  pokota.update(gameMap);
  enemies.forEach(e => e.update(gameMap));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameMap.draw(ctx);
  pokota.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.onload = () => {
  gameLoop();
};
