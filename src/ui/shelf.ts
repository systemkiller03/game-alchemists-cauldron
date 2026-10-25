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
  if (state.status === "menu") return;

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxCauldronSize = settings.maxCauldronIngredients;
  const displayed = INGREDIENTS.slice(0, settings.ingredientsCount);

  const cauldron = document.getElementById("cauldron");
  if (cauldron) {
    cauldron.ondragover = (event: DragEvent): void => {
      event.preventDefault();
      if (state.status !== "playing") return;
      const ingredientId = event.dataTransfer?.getData("text/plain");
      const stock = ingredientId ? state.shelfStock[ingredientId] ?? 0 : 0;
      const canDrop =
        Boolean(ingredientId) &&
        stock > 0 &&
        state.cauldronIngredients.length < maxCauldronSize;
      if (!canDrop) return;
      cauldron.classList.add("is-drop-target");
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    };

    cauldron.ondragleave = (event: DragEvent): void => {
      const nextTarget = event.relatedTarget;
      if (nextTarget && cauldron.contains(nextTarget as Node)) {
        return;
      }
      cauldron.classList.remove("is-drop-target");
    };

    cauldron.ondrop = (event: DragEvent): void => {
      event.preventDefault();
      cauldron.classList.remove("is-drop-target");
      if (state.status !== "playing") return;
      if (state.cauldronIngredients.length >= maxCauldronSize) return;
      const ingredientId = event.dataTransfer?.getData("text/plain");
      if (!ingredientId) return;
      const nextState = addIngredient(state, ingredientId);
      setState(nextState);
    };
  }

  displayed.forEach((ing) => {
    const stock = state.shelfStock[ing.id] ?? 0;
    const canInteract =
      state.status === "playing" &&
      stock > 0 &&
      state.cauldronIngredients.length < maxCauldronSize;
    const button = document.createElement("button");
    button.id = `shelf-${ing.id}`;
    button.type = "button";
    button.draggable = canInteract;
    button.disabled = !canInteract;
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
      if (state.status !== "playing") return;
      const newState = addIngredient(state, ing.id);
      setState(newState);
    };
    button.ondragstart = (event: DragEvent): void => {
      if (!canInteract) {
        event.preventDefault();
        return;
      }
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/plain", ing.id);
      }
      button.classList.add("dragging");
    };
    button.ondragend = (): void => {
      button.classList.remove("dragging");
      cauldron?.classList.remove("is-drop-target");
    };
    container.appendChild(button);
  });
}
