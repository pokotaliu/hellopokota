let game;
let pokota;
let scene;

function preload() {
  // 這裡可以載入圖片資源（目前沒用）
}

function create() {
  scene = this;

  // 背景色
  this.cameras.main.setBackgroundColor('#1d1d1d');

  // 建立胖波（簡化為一個圓形代表）
  pokota = this.add.circle(100, 100, 20, 0xff88cc);
  window.pokota = pokota;
  window.scene = this;
}

function update() {
  // 暫時不需要更新邏輯
}

// ✅ Phaser 初始化設定（響應式畫布）
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,          // 📱 根據裝置寬度設定
  height: window.innerHeight,        // 📱 根據裝置高度設定
  backgroundColor: '#1d1d1d',
  scene: {
    preload,
    create,
    update
  }
};

// ✅ 建立遊戲實例
game = new Phaser.Game(config);

// ✅ 當使用者縮放視窗（或旋轉手機）時自動調整畫布大小
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
