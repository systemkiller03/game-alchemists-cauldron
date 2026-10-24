import { IGameState } from "./types/types";
import { initialGameState } from "./state/gameState";
import { renderShelf } from "./ui/shelf";
import { renderCauldron } from "./ui/cauldron";

let state: IGameState = initialGameState;

function setState(newState: IGameState): void {
  state = newState;
  render();
}

function render(): void {
  renderShelf(state, setState);
  renderCauldron(state);
}

render();
