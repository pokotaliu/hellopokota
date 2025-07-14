// === UI 訊息顯示與拖曳控制 ===

// 🧩 新增訊息到訊息框
function showMessage(text) {
  const box = document.getElementById('message-box');

  // 建立訊息元素
  const line = document.createElement('div');
  line.className = 'message-line';
  line.innerText = '🟢 ' + text;

  // 加入訊息框中
  box.appendChild(line);

  // 自動捲到底部
  box.scrollTop = box.scrollHeight;
}

// 🧠 讓任何元素可拖曳
function enableDrag(el) {
  let offsetX = 0, offsetY = 0, isDown = false;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    el.style.cursor = 'move';
  });
}

// ✅ 當頁面載入完成後，自動啟用拖曳功能
window.addEventListener('DOMContentLoaded', () => {
  const msgBox = document.getElementById('message-box');

  // 確保初始位置固定（避免 top: 0 被覆蓋）
  msgBox.style.position = 'absolute';
  msgBox.style.top = '0px';
  msgBox.style.right = '0px';

  enableDrag(msgBox);
});
