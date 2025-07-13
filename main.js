// main.js
import { Map } from './map.js';
import { tileSize } from './map.js';
import { Pokota } from './pokota.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

const map = new Map();
const pokota = new Pokota(1, 1);
const enemies = [
  new Enemy(13, 8),
  new Enemy(7, 4)
];

function update() {
  pokota.update(map);
  enemies.forEach((enemy) => enemy.update(map));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.draw(ctx);
  pokota.draw(ctx);
  enemies.forEach((enemy) => enemy.draw(ctx));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.onload = () => {
  gameLoop();
  document.addEventListener('keydown', (e) => {
    pokota.handleInput(e);
  });
};
