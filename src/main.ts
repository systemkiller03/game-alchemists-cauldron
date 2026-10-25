import "./styles/style.css";
import { renderAppShell } from "./ui/appShell";
import { IGameState } from "./types/types";
import { initialGameState } from "./state/gameState";
import { renderHeader } from "./ui/header";
import { renderRecipePanel } from "./ui/recipePanel";
import { renderShelf } from "./ui/shelf";
import { renderCauldron } from "./ui/cauldron";
import { renderBars } from "./ui/bars";
import { renderControls } from "./ui/controls";
import { renderPauseDialog } from "./ui/pauseDialog";
import { renderGameOver } from "./ui/gameOver";
import { GameTimer } from "./logic/timer";
import { startNewGame } from "./logic/cauldron";
import { clearSave, saveGame } from "./storage/gameSave";
import { INGREDIENTS } from "./data/ingredients";

let state: IGameState = initialGameState;

renderAppShell();

const gameTimer = new GameTimer({
  onTick: (timeLeft: number): void => {
    if (state.status !== "playing") return;
    if (timeLeft !== state.timeLeft) {
      state = { ...state, timeLeft };
      renderHeader(state, setState);
    }
  },
  onTimeUp: (): void => {
    if (state.status !== "playing") return;
    setState({
      ...state,
      timeLeft: 0,
      status: "game-over",
      gameOverReason: "Time is up!",
    });
  },
});

function handlePlayAgain(): void {
  const next = startNewGame(state);
  setState(next);
}

function setState(newState: IGameState): void {
  const prevStatus = state.status;
  const prevTimeLeft = state.timeLeft;
  state = newState;

  if (newState.status === "playing") {
    if (prevStatus !== "playing") {
      gameTimer.start(newState.timeLeft);
    } else if (newState.timeLeft !== prevTimeLeft) {
      gameTimer.setTime(newState.timeLeft);
    }
    saveGame(newState);
  } else if (newState.status === "paused") {
    gameTimer.stop();
    saveGame(newState);
  } else {
    gameTimer.stop();
    clearSave();
  }

  render();
}

function render(): void {
  renderHeader(state, setState);
  renderRecipePanel(state);
  renderShelf(state, setState);
  renderCauldron(state);
  renderControls(state, setState);
  renderBars(state);
  renderPauseDialog(state, setState);
  renderGameOver(state, handlePlayAgain);
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  if (
    state.status !== "playing" ||
    isTextEntryTarget(event.target) ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.repeat
  ) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") return;

  const key = event.key.toLowerCase();
  if (key === "p" || key === "escape") {
    event.preventDefault();
    setState({ ...state, status: "paused" });
    return;
  }

  if (/^[1-8]$/.test(key)) {
    const ingredient = INGREDIENTS[Number(key) - 1];
    if (ingredient) {
      document.getElementById(`shelf-${ingredient.id}`)?.click();
    }
    return;
  }

  if (key === "b") {
    document.getElementById("btn-brew")?.click();
  } else if (key === "o") {
    document.getElementById("btn-pour-out")?.click();
  }
});

document.addEventListener("visibilitychange", (): void => {
  // Auto-pause when tab becomes hidden
  if (document.hidden && state.status === "playing" && gameTimer.running) {
    setState({ ...state, status: "paused" });
  }
});

render();
