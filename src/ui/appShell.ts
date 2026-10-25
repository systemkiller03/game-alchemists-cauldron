import cauldronArt from "@/assets/cauldron.svg";

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  id?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;
  if (id) element.id = id;
  return element;
}

export function renderAppShell(): void {
  const header = createElement("header", "app-header");
  const title = createElement("h1", "");
  title.textContent = "Alchemist's Cauldron";
  const headerStats = createElement("section", "header-stats", "header-stats");
  header.append(title, headerStats);

  const game = createElement("main", "game-container");
  const shelf = createElement("section", "shelf", "shelf");
  shelf.setAttribute("aria-label", "Ingredient Shelf");

  const station = createElement(
    "section",
    "brewing-station",
    "brewing-station",
  );
  station.setAttribute("aria-label", "Brewing station");
  const cauldronArea = createElement("div", "cauldron-area");
  const cauldronImage = createElement("img", "cauldron-art");
  cauldronImage.src = cauldronArt;
  cauldronImage.alt = "";
  cauldronImage.setAttribute("aria-hidden", "true");
  const cauldron = createElement("div", "cauldron", "cauldron");
  cauldron.setAttribute("aria-label", "Cauldron Slots");
  const cauldronCounter = createElement(
    "div",
    "cauldron-counter",
    "cauldron-counter",
  );
  cauldronArea.append(cauldronImage, cauldron, cauldronCounter);

  const feedback = createElement("div", "feedback-message", "feedback-message");
  feedback.setAttribute("role", "status");
  const controls = createElement("section", "controls", "controls");
  station.append(cauldronArea, feedback, controls);

  const recipePanel = createElement("section", "recipe-panel", "recipe-panel");
  const bars = createElement("section", "bars cauldron-bars", "bars");
  bars.setAttribute("aria-label", "Cauldron Parameters");

  game.append(shelf, station, recipePanel, bars);
  document.body.append(header, game);
}
