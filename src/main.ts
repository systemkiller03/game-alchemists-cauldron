import "./styles/style.css";
import { IGameState } from "./types/types";
import { initialGameState } from "./state/gameState";
import { renderHeader } from "./ui/header";
import { renderRecipePanel } from "./ui/recipePanel";
import { renderShelf } from "./ui/shelf";
import { renderCauldron } from "./ui/cauldron";
import { renderBars } from "./ui/bars";
import { renderControls } from "./ui/controls";

let state: IGameState = initialGameState;

function setState(newState: IGameState): void {
  state = newState;
  render();
}

function render(): void {
  renderHeader(state);
  renderRecipePanel(state);
  renderShelf(state, setState);
  renderCauldron(state);
  renderControls(state, setState);
  renderBars(state);
}

render();
