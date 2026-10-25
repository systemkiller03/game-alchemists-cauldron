import { IGameState } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { addIngredient } from "../logic/cauldron";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";
import { REACTIONS } from "../data/reactions";
import { playBrewAnimation, showFeedback } from "./feedback";

const formatTooltipValue = (value: number): string => {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
};

export function renderShelf(
  state: IGameState,
  setState: (s: IGameState) => void,
): void {
  const container = document.getElementById("shelf");
  if (!container) return;
  container.innerHTML = "";
  document.querySelectorAll(".ingredient-tooltip").forEach((tooltip) => {
    tooltip.remove();
  });
  if (state.status === "menu") return;

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxCauldronSize = settings.maxCauldronIngredients;
  const displayed = INGREDIENTS.slice(0, settings.ingredientsCount);
  const addToCauldron = (ingredientId: string): void => {
    const nextState = addIngredient(state, ingredientId);
    if (nextState === state) return;

    const reaction = REACTIONS.find(
      (candidate) => candidate.id === nextState.lastReactionId,
    );
    if (reaction) {
      if (reaction.clearCauldron) {
        playBrewAnimation(false);
      }
      const isHarmful =
        (reaction.timePenalty ?? 0) > 0 || (reaction.lifePenalty ?? 0) > 0;
      showFeedback(`${reaction.name}!`, isHarmful ? "failure" : "success");
    }
    setState(nextState);
  };

  const cauldron = document.getElementById("cauldron");
  if (cauldron) {
    cauldron.ondragover = (event: DragEvent): void => {
      event.preventDefault();
      if (state.status !== "playing") return;
      const ingredientId = event.dataTransfer?.getData("text/plain");
      const stock = ingredientId ? (state.shelfStock[ingredientId] ?? 0) : 0;
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
      addToCauldron(ingredientId);
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
    `;

    const tooltip = document.createElement("div");
    tooltip.className = "ingredient-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.innerHTML = `
      <div class="tooltip-row">
        <span class="tooltip-label">Temperature</span>
        <span class="tooltip-value">${formatTooltipValue(ing.temperature)}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">Density</span>
        <span class="tooltip-value">${formatTooltipValue(ing.density)}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">Magic Power</span>
        <span class="tooltip-value">${formatTooltipValue(ing.magicPower)}</span>
      </div>
    `;
    document.body.appendChild(tooltip);

    const positionTooltip = (): void => {
      tooltip.classList.remove("tooltip--left", "tooltip--up");
      if (state.status !== "playing" || button.disabled) {
        tooltip.classList.remove("is-visible");
        return;
      }

      const rect = button.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const padding = 12;

      let left = rect.left + rect.width / 2;
      let top = rect.bottom + 12;
      let alignLeft = false;
      let alignUp = false;

      if (left + tooltipWidth / 2 > window.innerWidth - padding) {
        left = rect.right;
        alignLeft = true;
        tooltip.classList.add("tooltip--left");
      }

      if (top + tooltipHeight > window.innerHeight - padding) {
        top = rect.top - 8;
        alignUp = true;
        tooltip.classList.add("tooltip--up");
      }

      tooltip.style.left = `${Math.min(window.innerWidth - padding, Math.max(padding, left))}px`;
      tooltip.style.top = `${Math.min(window.innerHeight - padding, Math.max(padding, top))}px`;
      tooltip.style.transform = `translate(${alignLeft ? "-100%" : "-50%"}, ${alignUp ? "-100%" : "0"})`;

      tooltip.classList.add("is-visible");
    };

    const hideTooltip = (): void => {
      tooltip.classList.remove("is-visible", "tooltip--left", "tooltip--up");
    };

    button.addEventListener("pointerenter", positionTooltip);
    button.addEventListener("pointerleave", hideTooltip);
    button.addEventListener("focus", positionTooltip);
    button.addEventListener("blur", hideTooltip);

    button.onclick = (): void => {
      if (state.status !== "playing") return;
      addToCauldron(ing.id);
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
