// log.js

export function log(message) {
  const logBox = document.getElementById("log-box");
  if (!logBox) return;

  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.textContent = `[${time}] ${message}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

// 可擴充：增加不同級別訊息（info, warn, error）
export function warn(message) {
  log(`⚠️ WARNING: ${message}`);
}

export function error(message) {
  log(`❌ ERROR: ${message}`);
}
