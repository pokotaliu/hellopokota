// log.js

export function log(message) {
  const logBox = document.getElementById("log-box");
  if (!logBox) {
    console.warn("log-box element not found");
    return;
  }

  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.textContent = `[${time}] ${message}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

export function warn(message) {
  log(`⚠️ WARNING: ${message}`);
}

export function error(message) {
  log(`❌ ERROR: ${message}`);
}

// 初始化 logbox，如果不存在就自動建立
export function initLogBox() {
  let logBox = document.getElementById("log-box");
  if (!logBox) {
    logBox = document.createElement("div");
    logBox.id = "log-box";
    logBox.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.8);
      color: #0f0;
      font-family: monospace;
      font-size: 14px;
      padding: 6px;
      box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    `;
    document.body.appendChild(logBox);
    log("Log box initialized.");
  }
}
