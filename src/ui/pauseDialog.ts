import { IGameState } from "../types/types";

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
      setState({ ...state, status: "menu" });
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
