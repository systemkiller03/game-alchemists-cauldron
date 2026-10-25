import { IGameState } from "../types/types";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";

export function renderCauldron(state: IGameState): void {
  const container = document.getElementById("cauldron");
  if (!container) return;
  container.innerHTML = "";

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const maxCapacity =
    DIFFICULTY_SETTINGS[difficulty]?.maxCauldronIngredients ?? 4;

  for (let i = 0; i < maxCapacity; i++) {
    const el = document.createElement("div");
    el.className = "cauldron-slot";
    const ing = state.cauldronIngredients[i];
    if (ing) {
      el.classList.add("cauldron-slot--filled");
      const img = document.createElement("img");
      img.src = ing.icon;
      img.alt = ing.name;
      img.classList.add("icon");
      el.appendChild(img);
    }
    container.appendChild(el);
  }

  const counter = document.getElementById("cauldron-counter");
  if (counter) {
    const isFull = state.cauldronIngredients.length >= maxCapacity;
    counter.textContent = `Ingredients: ${state.cauldronIngredients.length} / ${maxCapacity}`;
    counter.className = `cauldron-counter ${isFull ? "counter-max counter--full highlight" : ""}`;
  }
}
