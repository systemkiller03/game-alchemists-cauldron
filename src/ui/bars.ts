import { IGameState, IRecipeRange } from "../types/types";
import { calculateCauldron, ICauldronValues } from "../logic/calculateCauldron";

export interface IBarConfig {
  id: "temperature" | "density" | "magicPower";
  label: string;
  min: number;
  max: number;
  hasNegative: boolean;
}

export const BAR_CONFIGS: readonly IBarConfig[] = [
  {
    id: "temperature",
    label: "Temperature",
    min: -100,
    max: 100,
    hasNegative: true,
  },
  {
    id: "density",
    label: "Density",
    min: -100,
    max: 100,
    hasNegative: true,
  },
  {
    id: "magicPower",
    label: "Magic Power",
    min: 0,
    max: 100,
    hasNegative: false,
  },
];

export function valueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (max === min) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

function formatValue(value: number, hasNegative: boolean): string {
  if (hasNegative && value > 0) {
    return `+${value}`;
  }
  return `${value}`;
}

/**
 * Helper to render or update a single parameter bar so all 3 bars stay consistent.
 */
export function renderParameterBar(
  container: HTMLElement,
  config: IBarConfig,
  currentValue: number,
  targetRange: IRecipeRange,
): HTMLElement {
  const barId = `cauldron-bar-${config.id}`;
  let barEl = document.getElementById(barId);

  const markerPct = valueToPercent(currentValue, config.min, config.max);
  const targetLeft = valueToPercent(targetRange.min, config.min, config.max);
  const targetRight = valueToPercent(targetRange.max, config.min, config.max);
  const targetWidth = Math.max(0, targetRight - targetLeft);

  const isInRange =
    (targetRange.min !== 0 || targetRange.max !== 0) &&
    currentValue >= targetRange.min &&
    currentValue <= targetRange.max;

  let fillLeft: number;
  let fillWidth: number;
  if (config.hasNegative) {
    const zeroPct = valueToPercent(0, config.min, config.max); // 50%
    if (currentValue >= 0) {
      fillLeft = zeroPct;
      fillWidth = markerPct - zeroPct;
    } else {
      fillLeft = markerPct;
      fillWidth = zeroPct - markerPct;
    }
  } else {
    fillLeft = 0;
    fillWidth = markerPct;
  }

  if (!barEl) {
    barEl = document.createElement("div");
    barEl.id = barId;
    barEl.className = "cauldron-bar";
    barEl.dataset.bar = config.id;

    barEl.innerHTML = `
      <div class="cauldron-bar__header">
        <span class="cauldron-bar__label">${config.label}</span>
        <span class="cauldron-bar__target-text">Target: ${targetRange.min}..${targetRange.max}</span>
        <span class="cauldron-bar__value" id="bar-value-${config.id}">${formatValue(currentValue, config.hasNegative)}</span>
      </div>
      <div class="cauldron-bar__track-container">
        <div class="cauldron-bar__track" id="bar-track-${config.id}">
          <div class="cauldron-bar__target-zone" id="bar-target-${config.id}"></div>
          ${
            config.hasNegative
              ? '<div class="cauldron-bar__center-line" title="0"></div>'
              : ""
          }
          <div class="cauldron-bar__fill" id="bar-fill-${config.id}"></div>
          <div class="cauldron-bar__marker" id="bar-marker-${config.id}"></div>
        </div>
        <div class="cauldron-bar__scale">
          <span class="scale-min">${config.min}</span>
          ${config.hasNegative ? '<span class="scale-zero">0</span>' : ""}
          <span class="scale-max">${config.max}</span>
        </div>
      </div>
    `;
    container.appendChild(barEl);
  }

  // Update existing elements for smooth CSS transitions
  barEl.classList.toggle("in-range", isInRange);

  const valueEl = barEl.querySelector(`#bar-value-${config.id}`);
  if (valueEl) {
    valueEl.textContent = formatValue(currentValue, config.hasNegative);
  }

  const targetTextEl = barEl.querySelector(".cauldron-bar__target-text");
  if (targetTextEl) {
    targetTextEl.textContent = `Target: ${targetRange.min}..${targetRange.max}`;
  }

  const targetZoneEl = barEl.querySelector<HTMLElement>(
    `#bar-target-${config.id}`,
  );
  if (targetZoneEl) {
    targetZoneEl.style.left = `${targetLeft}%`;
    targetZoneEl.style.width = `${targetWidth}%`;
    targetZoneEl.classList.toggle("in-range", isInRange);
  }

  const fillEl = barEl.querySelector<HTMLElement>(`#bar-fill-${config.id}`);
  if (fillEl) {
    fillEl.style.left = `${fillLeft}%`;
    fillEl.style.width = `${fillWidth}%`;
    fillEl.classList.toggle("in-range", isInRange);
  }

  const markerEl = barEl.querySelector<HTMLElement>(`#bar-marker-${config.id}`);
  if (markerEl) {
    markerEl.style.left = `${markerPct}%`;
    markerEl.classList.toggle("in-range", isInRange);
  }

  return barEl;
}

/**
 * Main render function for cauldron parameter bars.
 */
export function renderBars(state: IGameState): void {
  const container =
    document.getElementById("bars") || document.getElementById("cauldron-bars");
  if (!container) return;

  const currentValues: ICauldronValues = calculateCauldron(
    state.cauldronIngredients,
  );
  const recipe = state.activeRecipe;

  for (const config of BAR_CONFIGS) {
    const value = currentValues[config.id];
    const targetRange = recipe[config.id];
    renderParameterBar(container, config, value, targetRange);
  }
}
