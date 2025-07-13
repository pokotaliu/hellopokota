const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// 🧠 敵人資料：位置 (x, y) 與速度
let enemies = [
  { x: 100, y: -30, speed: 1.5 },
  { x: 300, y: -80, speed: 1.2 },
  { x: 500, y: -50, speed: 1.0 }
];

// 城門 y 座標（用來判斷敵人是否碰到主塔）
const gateY = 580;

// 遊戲主迴圈更新：移動敵人
function update() {
  enemies.forEach((enemy) => {
    // 向下移動（只改變 y）
    enemy.y += enemy.speed;

    // 檢查是否碰到城門
    if (enemy.y >= gateY) {
      console.log("⚠️ 敵人到達城門！");
      // 這裡可以加上扣血、爆炸動畫、結束判定
    }
  });
}

// 遊戲主迴圈繪製：畫敵人與城門區
function draw() {
  // 清空畫面
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 畫敵人
  ctx.fillStyle = "blue";
  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // 可加上城門血量、畫面特效等
}

// 主遊戲迴圈
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop); // 持續呼叫自己
}

gameLoop(); // 開始遊戲
