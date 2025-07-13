const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// 🐰 主塔位置
const towerX = canvas.width / 2;
const towerY = 580;

// 敵人資料
let enemies = [
  { x: 100, y: -30, speed: 1.5, alive: true },
  { x: 300, y: -80, speed: 1.2, alive: true },
  { x: 500, y: -50, speed: 1.0, alive: true },
];

// 蘿蔔子彈陣列
let carrots = [];

// 🧠 更新邏輯
function update() {
  // 敵人移動
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.y += enemy.speed;

      if (enemy.y >= towerY) {
        console.log("⚠️ 敵人到達城門！");
        enemy.alive = false; // 讓敵人消失
      }
    }
  });

  // 蘿蔔飛行
  carrots.forEach((carrot) => {
    carrot.y -= carrot.speed;
  });

  // 撞擊判定
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

  // 清除飛太遠的蘿蔔和擊中的
  carrots = carrots.filter((c) => c.y > 0 && !c.hit);
}

// 🎨 畫面渲染
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 敵人
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 蘿蔔子彈
  ctx.fillStyle = "orange";
  carrots.forEach((carrot) => {
    ctx.beginPath();
    ctx.arc(carrot.x, carrot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 城門底座（可視化）
  ctx.fillStyle = "gray";
  ctx.fillRect(towerX - 30, towerY, 60, 20);
}

// 🔫 射出蘿蔔
function shootCarrot() {
  carrots.push({
    x: towerX,
    y: towerY,
    speed: 5,
    hit: false,
  });
}

// 🔁 遊戲主迴圈
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// 🔘 點擊或按空白鍵發射蘿蔔
document.addEventListener("click", shootCarrot);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    shootCarrot();
  }
});
