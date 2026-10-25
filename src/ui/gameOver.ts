import { IGameState } from "../types/types";
import {
  addLeaderboardEntry,
  getNameValidationError,
  isScoreEligibleForTop10,
} from "../storage/leaderboard";
import { openLeaderboardModal } from "./leaderboard";

let isScoreSaved = false;

export function resetGameOverSavedState(): void {
  isScoreSaved = false;
}

export function renderGameOver(
  state: IGameState,
  onPlayAgain: () => void,
): void {
  let modal = document.getElementById("game-over-modal");

  if (!modal) {
    modal = document.createElement("section");
    modal.id = "game-over-modal";
    modal.className = "game-over-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "game-over-title");

    modal.innerHTML = `
      <div class="game-over-backdrop"></div>
      <div class="game-over-card">
        <h2 id="game-over-title" class="game-over-title">Game Over</h2>
        <div class="game-over-reason-wrapper">
          <span class="game-over-reason-label">Reason</span>
          <p id="game-over-reason" class="game-over-reason"></p>
        </div>
        <div class="game-over-score-wrapper">
          <span class="game-over-score-label">Final Score</span>
          <p id="game-over-score" class="game-over-score">0</p>
        </div>
        <div id="game-over-top10-container" class="game-over-top10-container"></div>
        <div class="game-over-actions">
          <button id="btn-restart" class="btn-primary btn-restart btn-play-again" data-testid="btn-play-again">Play Again</button>
          <button id="btn-leaderboard-gameover" class="btn-secondary btn-leaderboard">🏆 Leaderboard</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const restartBtn = modal.querySelector("#btn-restart");
    restartBtn?.addEventListener("click", () => {
      isScoreSaved = false;
      onPlayAgain();
    });

    const leaderboardBtn = modal.querySelector("#btn-leaderboard-gameover");
    leaderboardBtn?.addEventListener("click", () => {
      openLeaderboardModal(state.difficulty);
    });
  }

  const isGameOver = state.status === "game-over";
  if (isGameOver) {
    modal.classList.add("game-over-modal--visible");
    modal.style.display = "flex";

    const reasonEl = document.getElementById("game-over-reason");
    if (reasonEl) {
      reasonEl.textContent = state.gameOverReason ?? "Game Over";
    }

    const scoreEl = document.getElementById("game-over-score");
    if (scoreEl) {
      scoreEl.textContent = String(state.score);
    }

    const top10Container = document.getElementById("game-over-top10-container");
    if (top10Container) {
      const difficulty = state.difficulty ?? "medium";
      const isEligible = isScoreEligibleForTop10(state.score, difficulty);

      if (isEligible && !isScoreSaved) {
        top10Container.innerHTML = `
          <div class="leaderboard-entry-form">
            <p class="leaderboard-entry-prompt">🏆 Top 10 Score! Enter your name:</p>
            <div class="name-input-group">
              <input
                type="text"
                id="player-name-input"
                class="player-name-input"
                maxlength="15"
                placeholder="Your name (2–15 chars)"
                aria-label="Player name"
              />
              <button type="button" id="btn-save-score" class="btn-primary btn-save-score">
                Save
              </button>
            </div>
            <p id="name-validation-error" class="name-validation-error" role="alert"></p>
          </div>
        `;

        const input =
          top10Container.querySelector<HTMLInputElement>("#player-name-input");
        const saveBtn =
          top10Container.querySelector<HTMLButtonElement>("#btn-save-score");
        const errorText = top10Container.querySelector<HTMLParagraphElement>(
          "#name-validation-error",
        );

        const handleSave = (): void => {
          if (!input) return;
          const enteredName = input.value;
          const validationError = getNameValidationError(enteredName);

          if (validationError) {
            if (errorText) {
              errorText.textContent = validationError;
            }
            input.focus();
            return;
          }

          addLeaderboardEntry(enteredName, state.score, Date.now(), difficulty);
          isScoreSaved = true;

          top10Container.innerHTML = `
            <p class="score-saved-message">✨ Saved to Leaderboard!</p>
          `;

          openLeaderboardModal();
        };

        saveBtn?.addEventListener("click", handleSave);
        input?.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        });
      } else if (isScoreSaved) {
        top10Container.innerHTML = `
          <p class="score-saved-message">✨ Saved to Leaderboard!</p>
        `;
      } else {
        top10Container.innerHTML = "";
      }
    }
  } else {
    isScoreSaved = false;
    modal.classList.remove("game-over-modal--visible");
    modal.style.display = "none";
  }
}
