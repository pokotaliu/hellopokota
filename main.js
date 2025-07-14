const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  backgroundColor: '#1d1d1d',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
let pokota;

function preload() {
  this.load.image('pokota', 'https://dummyimage.com/32x32/ff69b4/000000&text=P');
}

function create() {
  window.scene = this;

  pokota = this.add.sprite(320, 240, 'pokota');
  window.pokota = pokota;

  showMessage('歡迎來到胖波測試場～');
}

function update() {
  // 可擴充邏輯
}
