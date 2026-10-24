import { IGameState } from "../types/types";

export function renderHeader(state: IGameState): void {
  const container = document.getElementById("header-stats");
  if (!container) return;

  const isMenu = state.status === "menu";
  const minutes = Math.floor(state.timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (state.timeLeft % 60).toString().padStart(2, "0");
  const hearts = "❤️ ".repeat(Math.max(0, state.lives)).trim();
  const livesMarkup = !isMenu
    ? `<span class="stat-value stat-lives">${hearts || "None"}</span>`
    : `<span class="stat-value stat-lives">—</span>`;

  container.innerHTML = `
    <div class="stat-card" id="stat-score">
      <span class="stat-label">Score</span>
      <span class="stat-value">${state.score}</span>
    </div>
    <div class="stat-card" id="stat-time">
      <span class="stat-label">Time</span>
      <span class="stat-value">${minutes}:${seconds}</span>
    </div>
    <div class="stat-card" id="stat-lives-card">
      <span class="stat-label">Lives</span>
      ${livesMarkup}
    </div>
  `;
}
