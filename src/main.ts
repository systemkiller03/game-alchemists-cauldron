import "./styles/style.css";
import { IGameState } from "./types/types";
import { initialGameState } from "./state/gameState";
import { renderShelf } from "./ui/shelf";
import { renderCauldron } from "./ui/cauldron";
import { renderBars } from "./ui/bars";

let state: IGameState = initialGameState;

function setState(newState: IGameState): void {
  state = newState;
  render();
}

function render(): void {
  renderShelf(state, setState);
  renderCauldron(state);
  renderBars(state);
}

render();
