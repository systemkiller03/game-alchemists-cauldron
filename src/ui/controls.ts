import { IGameState } from "../types/types";
import { brewPotion, startNewGame } from "../logic/cauldron";
import { showFeedback } from "./feedback";
import { openLeaderboardModal } from "./leaderboard";

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
    const menuGroup = document.createElement("div");
    menuGroup.className = "menu-controls-group";

    startBtn.style.display = "";
    brewBtn.style.display = "none";
    brewBtn.disabled = true;

    startBtn.onclick = (): void => {
      const next = startNewGame(state);
      setState(next);
    };

    const leaderboardBtn = document.createElement("button");
    leaderboardBtn.id = "btn-leaderboard-menu";
    leaderboardBtn.className = "btn-secondary btn-leaderboard";
    leaderboardBtn.textContent = "🏆 Leaderboard";
    leaderboardBtn.onclick = (): void => {
      openLeaderboardModal();
    };

    menuGroup.append(startBtn, leaderboardBtn);
    container.appendChild(menuGroup);
    container.appendChild(brewBtn);
    return;
  }

  if (state.status === "game-over") {
    // Game over screen is displayed separately via renderGameOver modal
    startBtn.style.display = "none";
    brewBtn.style.display = "none";
    brewBtn.disabled = true;
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
