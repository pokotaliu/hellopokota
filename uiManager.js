const messageBox = document.getElementById('message-box');

function showMessage(text, duration = 2000) {
  messageBox.innerText = text;
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, duration);
}
