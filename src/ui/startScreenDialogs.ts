import { DIFFICULTY_SETTINGS } from "../data/difficulty";
import { Difficulty, IGameState } from "../types/types";

const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];

function createModal(title: string, content: string): HTMLDivElement {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop start-screen-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-label", title);
  backdrop.innerHTML = `
    <section class="modal-card start-screen-card">
      <h2 class="modal-title">${title}</h2>
      ${content}
      <button type="button" class="btn-secondary start-screen-close">Close</button>
    </section>
  `;

  const close = (): void => {
    document.removeEventListener("keydown", onKeydown);
    backdrop.remove();
  };
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") close();
  };

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  backdrop
    .querySelector(".start-screen-close")
    ?.addEventListener("click", close);
  document.addEventListener("keydown", onKeydown);
  document.body.appendChild(backdrop);
  backdrop.querySelector<HTMLButtonElement>(".start-screen-close")?.focus();
  return backdrop;
}

export function openHelpModal(): void {
  const existing = document.getElementById("start-screen-help");
  existing?.remove();
  const backdrop = createModal(
    "How to Play",
    `<ol class="help-rules">
      <li>Choose a difficulty in Settings, then start a game.</li>
      <li>Add ingredients to match the recipe's temperature, density and magic power.</li>
      <li>Press Brew. Successful brews earn points and time; failed brews cost a life.</li>
      <li>The game ends when time or lives run out, or you run out of ingredients.</li>
    </ol>`,
  );
  backdrop.id = "start-screen-help";
}

export function openDifficultyModal(
  state: IGameState,
  setState: (state: IGameState) => void,
): void {
  const existing = document.getElementById("start-screen-settings");
  existing?.remove();

  const choices = DIFFICULTIES.map((difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const selected = state.difficulty === difficulty;
    const label = difficulty[0].toUpperCase() + difficulty.slice(1);
    return `
      <button
        type="button"
        class="btn-secondary difficulty-choice${selected ? " is-selected" : ""}"
        data-difficulty="${difficulty}"
        ${selected ? 'aria-pressed="true"' : 'aria-pressed="false"'}
      >
        <strong>${label}</strong>
        <span>${settings.ingredientsCount} ingredients · ${settings.maxCauldronIngredients} per brew · ${settings.startingTime}s · ±${settings.tolerance} tolerance</span>
        <span>${settings.lives} lives · ${settings.scorePerBrew} points · +${settings.timeBonus}s · ${settings.reactionCount} reactions</span>
      </button>
    `;
  }).join("");

  const backdrop = createModal(
    "Choose Difficulty",
    `<div class="difficulty-choices">${choices}</div>`,
  );
  backdrop.id = "start-screen-settings";
  backdrop
    .querySelectorAll<HTMLButtonElement>("[data-difficulty]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const difficulty = DIFFICULTIES.find(
          (candidate) => candidate === button.dataset.difficulty,
        );
        if (!difficulty) return;
        setState({ ...state, difficulty });
        backdrop
          .querySelector<HTMLButtonElement>(".start-screen-close")
          ?.click();
      });
    });
}
