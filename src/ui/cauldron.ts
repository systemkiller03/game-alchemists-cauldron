import { IGameState } from "../types/types";

export function renderCauldron(state: IGameState) {
  const container = document.getElementById("cauldron");
  if (!container) return;
  container.innerHTML = "";
  state.cauldronIngredients.forEach((ing) => {
    const el = document.createElement("div");
    el.className = "cauldron-slot";
    const img = document.createElement("img");
    img.src = ing.icon;
    img.alt = ing.name;
    img.classList.add("icon");
    el.appendChild(img);
    container.appendChild(el);
  });

  const counter = document.getElementById("cauldron-counter");
  if (counter) {
    counter.textContent = `${state.cauldronIngredients.length} / 4`;
  }
}
