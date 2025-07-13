const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const towerX = canvas.width / 2;
const towerY = 580;

const attackRange = 500;
const attackCooldown = 500;
let lastAttackTime = 0;

let enemies = [];
let carrots = [];

// 🎯 產生敵人
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

// 🎯 發射蘿蔔（含超級爆擊判斷）
function shootCarrotAt(target) {
  const tx = target.x;
  const ty = target.y;
  const tvx = 0;
  const tvy = target.speed;

  const dx = tx - towerX;
  const dy = ty - towerY;
  const bulletSpeed = 5;

  const a = tvx * tvx + tvy * tvy - bulletSpeed * bulletSpeed;
  const b = 2 * (dx * tvx + dy * tvy);
  const c = dx * dx + dy * dy;

  let t = 0;

  if (Math.abs(a) < 1e-6) {
    if (Math.abs(b) > 1e-6) t = -c / b;
  } else {
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(discriminant);
      const t1 = (-b + sqrtD) / (2 * a);
      const t2 = (-b - sqrtD) / (2 * a);
      t = Math.max(t1, t2, 0);
    }
  }

  const leadX = tx + tvx * t;
  const leadY = ty + tvy * t;
  const lx = leadX - towerX;
  const ly = leadY - towerY;
  const distance = Math.hypot(lx, ly);

  if (distance === 0) return;

  const isSuper = Math.random() < 0.05;
  const radius = isSuper ? 20 : 5;

  carrots.push({
    x: towerX,
    y: towerY,
    dx: (lx / distance) * bulletSpeed,
    dy: (ly / distance) * bulletSpeed,
    hit: false,
    super: isSuper,
    radius: radius
  });
}

// 🎮 更新邏輯
function update() {
  const now = Date.now();

  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.y += enemy.speed;
      if (enemy.y >= towerY) {
        enemy.alive = false;
        console.log("⚠️ 敵人突破城門！");
      }
    }
  });

  const target = enemies.find((e) =>
    e.alive && Math.hypot(e.x - towerX, e.y - towerY) <= attackRange
  );

  if (target && now - lastAttackTime > attackCooldown) {
    shootCarrotAt(target);
    lastAttackTime = now;
  }

  carrots.forEach((carrot) => {
    carrot.x += carrot.dx;
    carrot.y += carrot.dy;
  });

  carrots.forEach((carrot) => {
    enemies.forEach((enemy) => {
      if (!enemy.alive) return;

      const distance = Math.hypot(carrot.x - enemy.x, carrot.y - enemy.y);
      const hitRadius = carrot.super ? 25 : 15;

      if (distance < hitRadius) {
        enemy.alive = false;
        carrot.hit = true;
        console.log(carrot.super ? "🔥 超級蘿蔔爆擊命中！" : "💥 命中敵人！");
      }
    });
  });

  carrots = carrots.filter((c) =>
    c.x >= 0 && c.x <= canvas.width &&
    c.y >= 0 && c.y <= canvas.height &&
    !c.hit
  );
}

// 🖼️ 畫圖
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 攻擊範圍
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
  carrots.forEach((carrot) => {
    ctx.beginPath();
    ctx.arc(carrot.x, carrot.y, carrot.radius, 0, Math.PI * 2);
    ctx.fillStyle = carrot.super ? "red" : "orange";
    ctx.fill();
  });

  // 主塔
  ctx.fillStyle = "gray";
  ctx.fillRect(towerX - 30, towerY, 60, 20);
}

// 🔁 遊戲迴圈
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 🚀 初始化
window.onload = () => {
  gameLoop();
  document.getElementById("spawn-btn").addEventListener("click", spawnEnemies);
};
