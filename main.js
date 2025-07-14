const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 260,
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
  this.load.image('pokota', 'https://dummyimage.com/32x32/ff69b4/000000&text=P');
}

function create() {
  scene = this;
  window.scene = scene;

  pokota = this.add.sprite(200, 200, 'pokota');
  window.pokota = pokota;

  MessageManager.show('🎮 遊戲啟動，胖波出場啦！');
}

function update() {
  // 暫無持續邏輯
}
