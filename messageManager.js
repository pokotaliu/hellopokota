const MessageManager = (function () {
  const box = () => document.getElementById('message-box');

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-TW', { hour12: false });
  }

  function createLine(text, type = 'info') {
    const line = document.createElement('div');
    line.className = 'message-line message-' + type;
    line.innerHTML = `<span class="time">[${formatTime()}]</span> ${text}`;
    return line;
  }

  function show(text, type = 'info') {
    const el = box();
    if (!el) return;

    const line = createLine(text, type);
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  function clear() {
    const el = box();
    if (el) el.innerHTML = '';
  }

  return {
    show,
    clear
  };
})();
