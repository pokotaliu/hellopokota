function runTest(feature) {
  switch (feature) {
    case 'move':
      showMessage('胖波開始亂跑！');
      if (window.scene && window.pokota) {
        let dx = Phaser.Math.Between(-1, 1);
        let dy = Phaser.Math.Between(-1, 1);
        window.pokota.x += dx * 32;
        window.pokota.y += dy * 32;
      }
      break;
    case 'map':
      showMessage('載入簡易地圖～（未實作）');
      break;
    case 'enemy':
      showMessage('生成敵人！（未實作）');
      break;
    case 'dialog':
      showMessage('這是一個測試訊息框唷！');
      break;
  }
}
