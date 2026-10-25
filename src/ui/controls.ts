import { IGameState } from "../types/types";
import { brewPotion, pourOut, startNewGame } from "../logic/cauldron";
import { clearSave, loadGame } from "../storage/gameSave";
import { showFeedback } from "./feedback";
import { openLeaderboardModal } from "./leaderboard";
import { openDifficultyModal, openHelpModal } from "./startScreenDialogs";

export function renderControls(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("controls");
  if (!container) return;

  container.innerHTML = "";
  container.classList.toggle("controls--menu", state.status === "menu");

  if (state.status === "paused") {
    return;
  }

  const startBtn = document.createElement("button");
  startBtn.id = "btn-start";
  startBtn.className = "btn-primary btn-start";
  startBtn.textContent = "Start Game";

  const brewBtn = document.createElement("button");
  brewBtn.id = "btn-brew";
  brewBtn.className = "btn-primary btn-brew";
  brewBtn.textContent = "Brew";

  const pourOutBtn = document.createElement("button");
  pourOutBtn.id = "btn-pour-out";
  pourOutBtn.className = "btn-primary btn-pour-out";
  pourOutBtn.textContent = "Pour Out (-10s)";

  // Menu state controls
  if (state.status === "menu") {
    const menuGroup = document.createElement("div");
    menuGroup.className = "menu-controls-group";

    brewBtn.style.display = "none";
    brewBtn.disabled = true;

    const continueSavedGame = loadGame();
    const continueBtn = document.createElement("button");
    continueBtn.id = "btn-continue-game";
    continueBtn.className = "btn-secondary btn-continue";
    continueBtn.textContent = "Continue Game";
    continueBtn.hidden = !continueSavedGame;
    continueBtn.onclick = (): void => {
      if (!continueSavedGame) return;
      setState({
        ...continueSavedGame,
        status: "paused",
      });
    };

    startBtn.onclick = (): void => {
      clearSave();
      const next = startNewGame(state);
      setState(next);
    };

    const leaderboardBtn = document.createElement("button");
    leaderboardBtn.id = "btn-leaderboard-menu";
    leaderboardBtn.className = "btn-secondary btn-leaderboard";
    leaderboardBtn.textContent = "🏆 Leaderboard";
    leaderboardBtn.onclick = (): void => {
      openLeaderboardModal(state.difficulty);
    };

    const helpBtn = document.createElement("button");
    helpBtn.id = "btn-help";
    helpBtn.className = "btn-secondary";
    helpBtn.textContent = "Help";
    helpBtn.onclick = openHelpModal;

    const settingsBtn = document.createElement("button");
    settingsBtn.id = "btn-settings";
    settingsBtn.className = "btn-secondary";
    settingsBtn.textContent = "Settings";
    settingsBtn.onclick = (): void => {
      openDifficultyModal(state, setState);
    };

    const startGroup = document.createElement("div");
    startGroup.className = "start-controls";
    startGroup.append(continueBtn, startBtn);
    menuGroup.append(helpBtn, settingsBtn, leaderboardBtn);
    container.appendChild(menuGroup);
    container.appendChild(startGroup);
    container.appendChild(brewBtn);
    return;
  }

  if (state.status === "game-over") {
    return;
  }

  startBtn.style.display = "none";
  brewBtn.style.display = "";
  brewBtn.disabled = state.cauldronIngredients.length === 0;
  pourOutBtn.disabled = state.cauldronIngredients.length === 0;

  brewBtn.onclick = (): void => {
    if (state.cauldronIngredients.length === 0) return;
    const { nextState, checkResult } = brewPotion(state);
    if (checkResult.success) {
      showFeedback(
        `✨ Potion brewed successfully! +${nextState.score - state.score} Score`,
        "success",
      );
    } else {
      showFeedback("💥 Brew failed! Ingredients lost, -1 Life", "failure");
    }
    setState(nextState);
  };

  pourOutBtn.onclick = (): void => {
    const nextState = pourOut(state);
    if (nextState !== state) {
      showFeedback("Mixture poured out. -10 seconds", "failure");
      setState(nextState);
    }
  };

  container.appendChild(startBtn);
  container.appendChild(brewBtn);
  container.appendChild(pourOutBtn);
}
