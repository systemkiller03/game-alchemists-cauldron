// src/ui/shelf.ts
import { IGameState } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { addIngredient } from "../logic/cauldron";
import { MAX_CAULDRON_SIZE } from "../constants";

export function renderShelf(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("shelf");
  if (!container) return;
  container.innerHTML = "";
  const displayed = INGREDIENTS.slice(0, 6);
  displayed.forEach((ing) => {
    const stock = state.shelfStock[ing.id] ?? 0;
    const button = document.createElement("button");
    button.id = `shelf-${ing.id}`;
    button.disabled =
      stock <= 0 || state.cauldronIngredients.length >= MAX_CAULDRON_SIZE;
    // dim when out of stock
    if (stock <= 0) button.classList.add("out-of-stock");
    button.innerHTML = `
      <img src="${ing.icon}" alt="${ing.name}" class="icon"/>
      <span class="name">${ing.name}</span>
      <span class="stats">T:${ing.temperature} D:${ing.density} M:${ing.magicPower}</span>
      <span class="badge">${stock}</span>
    `;
    button.onclick = (): void => {
      const newState = addIngredient(state, ing.id);
      setState(newState);
    };
    container.appendChild(button);
  });
}
