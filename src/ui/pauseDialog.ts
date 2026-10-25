import { IGameState } from "../types/types";
import { DEFAULT_DIFFICULTY } from "../data/difficulty";
import { getRandomRecipe } from "../logic/recipeGenerator";
import { clearSave } from "../storage/gameSave";

export function renderPauseDialog(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  let modal = document.getElementById("pause-modal");

  if (!modal) {
    modal = document.createElement("section");
    modal.id = "pause-modal";
    modal.className = "pause-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "pause-title");

    modal.innerHTML = `
      <div class="pause-backdrop"></div>
      <div class="pause-card">
        <h2 id="pause-title" class="pause-title">Game Paused</h2>
        <div class="pause-actions">
          <button id="btn-resume" class="btn-primary btn-resume">Resume</button>
          <button id="btn-exit-menu" class="btn-secondary btn-exit-menu">Exit to Menu</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  const resumeBtn = modal.querySelector<HTMLButtonElement>("#btn-resume");
  if (resumeBtn) {
    resumeBtn.onclick = (): void => {
      setState({ ...state, status: "playing" });
    };
  }

  const exitBtn = modal.querySelector<HTMLButtonElement>("#btn-exit-menu");
  if (exitBtn) {
    exitBtn.onclick = (): void => {
      clearSave();
      const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
      setState({
        ...state,
        status: "menu",
        score: 0,
        timeLeft: 0,
        lives: 0,
        activeRecipe: getRandomRecipe(difficulty),
        cauldronIngredients: [],
        shelfStock: {},
        gameOverReason: null,
      });
    };
  }

  const isPaused = state.status === "paused";
  if (isPaused) {
    modal.classList.add("pause-modal--visible");
    (modal as HTMLElement).style.display = "flex";
  } else {
    modal.classList.remove("pause-modal--visible");
    (modal as HTMLElement).style.display = "none";
  }
}
