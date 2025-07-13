const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const towerX = canvas.width / 2;
const towerY = 580;

const attackRange = 500;         // 超長射程！
const attackCooldown = 500;
let lastAttackTime = 0;

let enemies = [];
let carrots = [];

// 🎯 點按按鈕 → 一次產 3 隻敵人
function spawnEnemies() {
  for (let i = 0; i < 3; i++) {
    enemies.push({
      x: Math.random() * 500 + 50,
      y: -Math.random() * 200 - 50,
      speed: 1 + Math.random(),
      alive: true
    });
  }
}

// 🧠 遊戲邏輯更新
function update() {
  const now = Date.now();

  // 敵人下移
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.y += enemy.speed;

      if (enemy.y >= towerY) {
        enemy.alive = false;
        console.log("⚠️ 敵人突破城門！");
      }
    }
  });

  // 自動攻擊範圍內的敵人
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

  // 命中判定
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

  // 清除打到或飛出畫面的蘿蔔
  carrots = carrots.filter((c) => c.y > 0 && !c.hit);
}

// 🎨 畫畫時間
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 攻擊範圍圈圈
  ctx.beginPath();
  ctx.arc(towerX, towerY, attackRange, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 敵人
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 蘿蔔
  ctx.fillStyle = "orange";
  carrots.forEach((carrot) => {
    ctx.beginPath();
    ctx.arc(carrot.x, carrot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 主塔底座
  ctx.fillStyle = "gray";
  ctx.fillRect(towerX - 30, towerY, 60, 20);
}

// 射出蘿蔔！
function shootCarrotAt(target) {
  carrots.push({
    x: towerX,
    y: towerY,
    speed: 5,
    hit: false
  });
}

// 🔁 遊戲迴圈
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 啟動遊戲 & 按鈕事件確保在 DOM 載入後才綁定
window.onload = () => {
  gameLoop();
  document.getElementById("spawn-btn").addEventListener("click", spawnEnemies);
};
