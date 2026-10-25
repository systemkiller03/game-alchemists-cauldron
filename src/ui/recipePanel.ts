import { IGameState } from "../types/types";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";

export function renderRecipePanel(state: IGameState): void {
  const container = document.getElementById("recipe-panel");
  if (!container) return;

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxIngredients = settings.maxCauldronIngredients;
  const addedIngredients = state.cauldronIngredients.length;
  const isFull = addedIngredients >= maxIngredients;
  const recipe = state.activeRecipe;

  container.innerHTML = `
    <div class="recipe-panel__card">
      <div class="recipe-panel__header">
        <span class="recipe-panel__subtitle">Target Recipe</span>
        <h2 id="recipe-name" class="recipe-panel__title">${recipe.name}</h2>
      </div>
      <div class="recipe-panel__targets" id="recipe-targets">
        <div class="recipe-target" data-param="temperature">
          <span class="recipe-target__label">Temperature</span>
          <span class="recipe-target__range">${recipe.temperature.min}..${recipe.temperature.max}</span>
        </div>
        <div class="recipe-target" data-param="density">
          <span class="recipe-target__label">Density</span>
          <span class="recipe-target__range">${recipe.density.min}..${recipe.density.max}</span>
        </div>
        <div class="recipe-target" data-param="magicPower">
          <span class="recipe-target__label">Magic Power</span>
          <span class="recipe-target__range">${recipe.magicPower.min}..${recipe.magicPower.max}</span>
        </div>
      </div>
      <div
        id="recipe-counter"
        class="recipe-counter ${isFull ? "counter-max counter--full highlight" : ""}"
        aria-live="polite"
      >
        Ingredients: ${addedIngredients} / ${maxIngredients}
      </div>
    </div>
  `;

  // Also sync any standalone cauldron counter if present
  const cauldronCounter = document.getElementById("cauldron-counter");
  if (cauldronCounter) {
    cauldronCounter.textContent = `Ingredients: ${addedIngredients} / ${maxIngredients}`;
    cauldronCounter.className = `cauldron-counter ${isFull ? "counter-max counter--full highlight" : ""}`;
  }
}
