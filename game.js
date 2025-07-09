const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let enemies = [
  { x: 0, y: 0, speed: 1.2 },
  { x: 600, y: 0, speed: 1 },
  { x: 0, y: 600, speed: 0.8 }
];

const center = { x: 300, y: 300 };

function update() {
  enemies.forEach((enemy) => {
    const dx = center.x - enemy.x;
    const dy = center.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    const vx = (dx / dist) * enemy.speed;
    const vy = (dy / dist) * enemy.speed;
    enemy.x += vx;
    enemy.y += vy;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
