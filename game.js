const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const towerX = canvas.width / 2;
const towerY = 580;

// 攻擊參數
const attackRange = 150;           // 攻擊範圍（像圓形雷達半徑）
const attackCooldown = 500;        // 每次攻擊後冷卻時間（毫秒）
let lastAttackTime = 0;            // 上次攻擊的時間戳

let enemies = [
  { x: 100, y: -30, speed: 1.5, alive: true },
  { x: 300, y: -80, speed: 1.2, alive: true },
  { x: 500, y: -50, speed: 1.0, alive: true },
];

let carrots = [];

function update() {
  const now = Date.now();

  // 移動敵人
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.y += enemy.speed;

      if (enemy.y >= towerY) {
        enemy.alive = false;
        console.log("⚠️ 敵人突破城門！");
      }
    }
  });

  // 自動攻擊判斷
  const target = enemies.find((e) =>
    e.alive &&
    Math.hypot(e.x - towerX, e.y - towerY) <= attackRange
  );

  if (target && now - lastAttackTime > attackCooldown) {
    shootCarrotAt(target);
    lastAttackTime = now;
  }

  // 蘿蔔飛行
  carrots.forEach((carrot) => {
    carrot.y -= carrot.speed;
  });

  // 撞擊偵測
  carrots.forEach((carrot) => {
    enemies.forEach((enemy) => {
      if (
        enemy.alive &&
        Math.abs(carrot.x - enemy.x) < 15 &&
        Math.abs(carrot.y - enemy.y) < 15
      ) {
        enemy.alive = false;
        carrot.hit = true;
        console.log("💥 命中敵人！");
      }
    });
  });

  carrots = carrots.filter((c) => c.y > 0 && !c.hit);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 畫攻擊範圍圈圈
  ctx.beginPath();
  ctx.arc(towerX, towerY, attackRange, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 畫敵人
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 畫蘿蔔子彈
  ctx.fillStyle = "orange";
  carrots.forEach((carrot) =>
