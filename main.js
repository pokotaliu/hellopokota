const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 260, // 扣掉右側訊息框寬度
  height: window.innerHeight,
  backgroundColor: '#1d1d1d',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let scene;
let pokota;

function preload() {
  // 暫時用 dummy image 模擬胖波角色
  this.load.image('pokota', 'https://dummyimage.com/32x32/ff69b4/000000&text=P');
}

function create() {
  scene = this;
  window.scene = scene;

  // 建立胖波角色
  pokota = this.add.sprite(200, 200, 'pokota');
  window.pokota = pokota;

  // 初始訊息
  showMessage('🎮 遊戲啟動，胖波出場啦！');
}

function update() {
  // 可擴充邏輯，例如自動移動、碰撞檢查等
}
