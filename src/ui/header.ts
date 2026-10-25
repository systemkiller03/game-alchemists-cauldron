import { IGameState } from "../types/types";
import { formatTime } from "../logic/timer";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";

export function renderHeader(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("header-stats");
  if (!container) return;

  const isMenu = state.status === "menu";
  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const maxTime = DIFFICULTY_SETTINGS[difficulty].maxTime;

  const timePercent = isMenu
    ? 0
    : Math.max(0, Math.min(100, (state.timeLeft / maxTime) * 100));

  const isWarning =
    state.status === "playing" && state.timeLeft < 15 && state.timeLeft > 0;

  const formattedTime = isMenu ? "00:00" : formatTime(state.timeLeft);

  const hearts = "❤️ ".repeat(Math.max(0, state.lives)).trim();
  const livesMarkup = !isMenu
    ? `<span class="stat-value stat-lives" id="stat-lives-val">${hearts || "None"}</span>`
    : `<span class="stat-value stat-lives" id="stat-lives-val">—</span>`;

  // Try to reuse existing elements if they've already been created
  const scoreValEl = document.getElementById("stat-score-val");
  const timeValEl = document.getElementById("timer-display");
  const timeBarFillEl = document.getElementById("timer-bar-fill");
  const livesValEl = document.getElementById("stat-lives-val");
  const statTimeCard = document.getElementById("stat-time");
  const livesCardEl = document.getElementById("stat-lives-card");
  const pauseBtn = document.getElementById("btn-pause-toggle");

  if (
    scoreValEl &&
    timeValEl &&
    timeBarFillEl &&
    livesValEl &&
    statTimeCard &&
    pauseBtn
  ) {
    scoreValEl.textContent = String(state.score);
    timeValEl.textContent = formattedTime;
    timeBarFillEl.style.width = `${timePercent}%`;
    timeBarFillEl.className = `timer-bar__fill ${isWarning ? "timer-bar__fill--warning" : ""}`;
    statTimeCard.className = `stat-card stat-time ${isWarning ? "stat-time--warning" : ""}`;
    if (livesCardEl) {
      livesCardEl.hidden = isMenu;
      livesCardEl.style.display = isMenu ? "none" : "";
    }
    livesValEl.innerHTML = !isMenu ? hearts || "None" : "—";
    if (pauseBtn instanceof HTMLButtonElement) {
      pauseBtn.hidden = state.status !== "playing";
      pauseBtn.style.display = state.status === "playing" ? "" : "none";
      pauseBtn.onclick = (): void => {
        if (state.status === "playing") {
          setState({ ...state, status: "paused" });
        }
      };
    }
    return;
  }

  container.innerHTML = `
    <div class="stat-card" id="stat-score">
      <span class="stat-label">Score</span>
      <span class="stat-value" id="stat-score-val">${state.score}</span>
    </div>
    <div class="stat-card stat-time ${isWarning ? "stat-time--warning" : ""}" id="stat-time">
      <div class="stat-time__info">
        <span class="stat-label">Time</span>
        <span class="stat-value" id="timer-display">${formattedTime}</span>
        <button id="btn-pause-toggle" class="btn-secondary btn-pause-toggle" ${state.status !== "playing" ? "hidden" : ""}>Pause</button>
      </div>
      <div class="timer-bar" id="timer-bar" aria-label="Remaining time">
        <div
          class="timer-bar__fill ${isWarning ? "timer-bar__fill--warning" : ""}"
          id="timer-bar-fill"
          style="width: ${timePercent}%;"
        ></div>
      </div>
    </div>
    <div class="stat-card" id="stat-lives-card">
      <span class="stat-label">Lives</span>
      ${livesMarkup}
    </div>
  `;

  const livesCard = document.getElementById("stat-lives-card");
  if (livesCard) {
    livesCard.hidden = isMenu;
    livesCard.style.display = isMenu ? "none" : "";
  }

  const pauseToggleBtn = document.getElementById("btn-pause-toggle");
  if (pauseToggleBtn instanceof HTMLButtonElement) {
    pauseToggleBtn.style.display = state.status === "playing" ? "" : "none";
    pauseToggleBtn.onclick = (): void => {
      if (state.status === "playing") {
        setState({ ...state, status: "paused" });
      }
    };
  }
}
