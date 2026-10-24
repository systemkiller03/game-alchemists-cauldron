import { IGameState } from "../types/types";
import { brewPotion, startNewGame } from "../logic/cauldron";
import { showFeedback } from "./feedback";

export function renderControls(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("controls");
  if (!container) return;

  container.innerHTML = "";

  const startBtn = document.createElement("button");
  startBtn.id = "btn-start";
  startBtn.className = "btn-primary btn-start";
  startBtn.textContent = "Start Game";

  const brewBtn = document.createElement("button");
  brewBtn.id = "btn-brew";
  brewBtn.className = "btn-primary btn-brew";
  brewBtn.textContent = "Brew";

  if (state.status === "menu") {
    startBtn.style.display = "";
    brewBtn.style.display = "none";
    brewBtn.disabled = true;

    startBtn.onclick = (): void => {
      const next = startNewGame(state);
      setState(next);
    };

    container.appendChild(startBtn);
    container.appendChild(brewBtn);
    return;
  }

  if (state.status === "game-over") {
    const gameOverBox = document.createElement("div");
    gameOverBox.className = "game-over-box";
    gameOverBox.innerHTML = `
      <p class="game-over-title">Game Over</p>
      <p class="game-over-score">Final Score: ${state.score}</p>
    `;

    const restartBtn = document.createElement("button");
    restartBtn.id = "btn-restart";
    restartBtn.className = "btn-primary btn-restart";
    restartBtn.textContent = "Play Again";
    restartBtn.onclick = (): void => {
      const next = startNewGame(state);
      setState(next);
    };
    gameOverBox.appendChild(restartBtn);
    container.appendChild(gameOverBox);
    return;
  }

  // Active playing state
  startBtn.style.display = "none";
  brewBtn.style.display = "";
  brewBtn.disabled = state.cauldronIngredients.length === 0;

  brewBtn.onclick = (): void => {
    if (state.cauldronIngredients.length === 0) return;
    const { nextState, checkResult } = brewPotion(state);
    if (checkResult.success) {
      showFeedback("✨ Potion brewed successfully! +200 Score", "success");
    } else {
      showFeedback("💥 Brew failed! Ingredients lost, -1 Life", "failure");
    }
    setState(nextState);
  };

  container.appendChild(startBtn);
  container.appendChild(brewBtn);
}
