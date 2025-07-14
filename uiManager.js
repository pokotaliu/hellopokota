const messageBox = document.getElementById('message-box');

function showMessage(text) {
  const line = document.createElement('div');
  line.className = 'message-line';
  line.innerText = '🟢 ' + text;
  messageBox.appendChild(line);

  // 自動滾到底部
  messageBox.scrollTop = messageBox.scrollHeight;
}
