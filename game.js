const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// 🏰 主塔位置
const towerX = canvas.width / 2;
const towerY = 580;

// 🥕 攻擊設定
const attackRange = 150;       // 自動攻擊範圍
const attackCooldown = 500;    // 攻擊冷卻時間（毫秒）
let lastAttackTime = 0;        // 上次攻擊的時間

// 敵人初始化
let enemies = [
  { x: 100, y: -30, speed: 1.5, alive: true },
  { x: 300, y: -80, speed: 1.2, alive: true },
  { x: 500, y: -50, speed: 1.0, alive: true },
];

// 蘿蔔子彈
let carrots = [];

function update() {
  const now = Date.now();

  // 🚶 敵人往下移動
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.y += enemy.speed;

      if (enemy.y >= towerY) {
        enemy.alive = false;
        console.log("⚠️ 敵人突破城門！");
      }
    }
  });

  // 🧠 找到範圍內第一個敵人作為目標
  const target = enemies.find((e) =>
    e.alive &&
    Math.hypot(e.x - towerX, e.y - towerY) <= attackRange
  );

  // 🥕 自動攻擊（冷卻時間限制）
  if (target && now - lastAttackTime > attackCooldown) {
    shootCarrotAt(target);
    lastAttackTime = now;
  }

  // 🥕 蘿蔔飛行邏輯
  carrots.forEach((carrot) => {
    carrot.y -= carrot.speed;
  });

  // 💥 撞擊偵測
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

  // 🚮 移除擊中或飛出畫面的蘿蔔
  carrots = carrots.filter((c) => c.y > 0 && !c.hit);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔴 畫攻擊範圍圓圈
  ctx.beginPath();
  ctx.arc(towerX, towerY, attackRange, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 👾 畫敵人
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 🥕 畫蘿蔔子彈
  ctx.fillStyle = "orange";
  carrots.forEach((carrot) => {
    ctx.beginPath();
    ctx.arc(carrot.x, carrot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 🏰 畫城門底座
  ctx.fillStyle = "gray";
  ctx.fillRect(towerX - 30, towerY, 60, 20);
}

// 🥕 射擊函數
function shootCarrotAt(target) {
  carrots.push({
    x: towerX,
    y: towerY,
    speed: 5,
    hit: false,
  });
}

// 🔁 主遊戲迴圈
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop(); // 啟動遊戲
