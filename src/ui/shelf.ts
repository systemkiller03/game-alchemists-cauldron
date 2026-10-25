import { IGameState } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { addIngredient } from "../logic/cauldron";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";

export function renderShelf(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("shelf");
  if (!container) return;
  container.innerHTML = "";

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxCauldronSize = settings.maxCauldronIngredients;
  const displayed = INGREDIENTS.slice(0, settings.ingredientsCount);

  displayed.forEach((ing) => {
    const stock = state.shelfStock[ing.id] ?? 0;
    const button = document.createElement("button");
    button.id = `shelf-${ing.id}`;
    button.disabled =
      state.status !== "playing" ||
      stock <= 0 ||
      state.cauldronIngredients.length >= maxCauldronSize;
    if (stock <= 0) button.classList.add("out-of-stock");
    button.innerHTML = `
      <img src="${ing.icon}" alt="${ing.name}" class="icon"/>
      <span class="name">${ing.name}</span>
      <span class="stats" aria-label="Temperature ${ing.temperature}, density ${ing.density}, magic power ${ing.magicPower}">
        <span class="stat-temperature" title="Temperature">T:${ing.temperature}</span>
        <span class="stat-density" title="Density">D:${ing.density}</span>
        <span class="stat-magic" title="Magic Power">M:${ing.magicPower}</span>
      </span>
      <span class="badge">${stock}</span>
    `;
    button.onclick = (): void => {
      const newState = addIngredient(state, ing.id);
      setState(newState);
    };
    container.appendChild(button);
  });
}
