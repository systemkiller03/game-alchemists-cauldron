import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from "../data/difficulty";
import { INGREDIENTS } from "../data/ingredients";
import { RECIPES } from "../data/recipes";
import { IGameState, IIngredient, IRecipe, Difficulty } from "../types/types";

export const GAME_SAVE_STORAGE_KEY = "alchemists_cauldron_save";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function isValidSave(value: unknown): value is {
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
  status: "playing" | "paused";
} {
  if (!isRecord(value) || !isDifficulty(value.difficulty)) {
    return false;
  }

  const difficulty = value.difficulty;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const activeIngredientIds = new Set(
    INGREDIENTS.slice(0, settings.ingredientsCount).map((ingredient) => ingredient.id),
  );

  if (
    !Number.isInteger(value.score) ||
    (value.score as number) < 0 ||
    !Number.isInteger(value.timeLeft) ||
    (value.timeLeft as number) <= 0 ||
    (value.timeLeft as number) > settings.maxTime ||
    !Number.isInteger(value.lives) ||
    (value.lives as number) <= 0 ||
    (value.lives as number) > settings.lives ||
    (value.status !== "playing" && value.status !== "paused") ||
    !isRecord(value.activeRecipe) ||
    typeof value.activeRecipe.id !== "string" ||
    !Array.isArray(value.cauldronIngredients) ||
    value.cauldronIngredients.length > settings.maxCauldronIngredients ||
    !isRecord(value.shelfStock)
  ) {
    return false;
  }

  const activeRecipe = value.activeRecipe as Record<string, unknown>;
  const recipe = RECIPES.find(
    (candidate) =>
      candidate.id === activeRecipe.id &&
      candidate.difficulty === difficulty,
  );

  if (!recipe) {
    return false;
  }

  if (
    !value.cauldronIngredients.every(
      (ingredient) =>
        isRecord(ingredient) &&
        typeof ingredient.id === "string" &&
        activeIngredientIds.has(ingredient.id),
    )
  ) {
    return false;
  }

  for (const [id, stock] of Object.entries(value.shelfStock as Record<string, unknown>)) {
    if (!activeIngredientIds.has(id)) return false;
    if (!Number.isInteger(stock) || (stock as number) < 0 || (stock as number) > 15) {
      return false;
    }
  }

  return true;
}

function removeInvalidSave(): void {
  try {
    localStorage.removeItem(GAME_SAVE_STORAGE_KEY);
  } catch {
    // Ignore localStorage errors; invalid data should not crash the app.
  }
}

export function saveGame(state: IGameState): void {
  if (
    (state.status !== "playing" && state.status !== "paused") ||
    state.timeLeft <= 0 ||
    state.lives <= 0
  ) {
    clearSave();
    return;
  }

  try {
    const save = {
      difficulty: state.difficulty ?? DEFAULT_DIFFICULTY,
      score: state.score,
      timeLeft: state.timeLeft,
      lives: state.lives,
      activeRecipe: state.activeRecipe,
      cauldronIngredients: state.cauldronIngredients,
      shelfStock: state.shelfStock,
      status: state.status,
    };
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Ignore localStorage access errors.
  }
}

export function loadGame(): IGameState | null {
  try {
    const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidSave(parsed)) {
      removeInvalidSave();
      return null;
    }

    const difficulty = parsed.difficulty;
    const recipe = RECIPES.find(
      (candidate) =>
        candidate.id === parsed.activeRecipe.id &&
        candidate.difficulty === difficulty,
    );

    if (!recipe) {
      removeInvalidSave();
      return null;
    }

    const ingredientsById = new Map<string, IIngredient>(
      INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
    );

    return {
      status: "paused",
      difficulty,
      score: parsed.score,
      timeLeft: parsed.timeLeft,
      lives: parsed.lives,
      activeRecipe: recipe,
      cauldronIngredients: parsed.cauldronIngredients.map(
        (ingredient) => ingredientsById.get(ingredient.id) ?? ingredient,
      ),
      shelfStock: parsed.shelfStock,
      gameOverReason: null,
    };
  } catch {
    removeInvalidSave();
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(GAME_SAVE_STORAGE_KEY);
  } catch {
    // Ignore localStorage access errors.
  }
}
