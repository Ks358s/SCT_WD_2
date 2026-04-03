const timeDisplay = document.getElementById("timeDisplay");
const startPauseBtn = document.getElementById("startPauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");
const lapsList = document.getElementById("lapsList");

let startTimestamp = 0;
let elapsed = 0;
let timerId = null;
let lapCount = 0;

function formatTime(ms) {
  const centiseconds = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function setRunningState(running) {
  startPauseBtn.textContent = running ? "Pause" : "Start";
  lapBtn.disabled = !running;
  resetBtn.disabled = running ? false : elapsed === 0;
}

function updateDisplay() {
  const currentElapsed = timerId ? elapsed + (Date.now() - startTimestamp) : elapsed;
  timeDisplay.textContent = formatTime(currentElapsed);
}

function start() {
  startTimestamp = Date.now();
  timerId = setInterval(updateDisplay, 10);
  setRunningState(true);
}

function pause() {
  elapsed += Date.now() - startTimestamp;
  clearInterval(timerId);
  timerId = null;
  updateDisplay();
  setRunningState(false);
}

function reset() {
  clearInterval(timerId);
  timerId = null;
  startTimestamp = 0;
  elapsed = 0;
  lapCount = 0;
  lapsList.innerHTML = "";
  timeDisplay.textContent = "00:00:00.00";
  setRunningState(false);
  clearLapsBtn.disabled = true;
}

function addLap() {
  const currentElapsed = elapsed + (Date.now() - startTimestamp);
  lapCount += 1;

  const lapItem = document.createElement("li");
  const tag = document.createElement("span");
  const value = document.createElement("strong");

  tag.className = "lap-tag";
  tag.textContent = `Lap ${lapCount}`;
  value.textContent = formatTime(currentElapsed);

  lapItem.append(tag, value);
  lapsList.prepend(lapItem);
  clearLapsBtn.disabled = false;
}

startPauseBtn.addEventListener("click", () => {
  if (timerId) {
    pause();
  } else {
    start();
  }
});

lapBtn.addEventListener("click", addLap);
resetBtn.addEventListener("click", reset);
clearLapsBtn.addEventListener("click", () => {
  lapsList.innerHTML = "";
  lapCount = 0;
  clearLapsBtn.disabled = true;
});

updateDisplay();
setRunningState(false);
