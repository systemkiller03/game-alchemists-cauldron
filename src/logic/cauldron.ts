import { Difficulty, IGameState } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { calculateCauldron } from "./calculateCauldron";
import { checkBrew, IBrewCheckResult } from "./brewCheck";
import { getRandomRecipe } from "./recipeGenerator";
import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";
import { createStock } from "./stock";

export { calculateCauldron, type ICauldronValues } from "./calculateCauldron";
export { checkBrew, type IBrewCheckResult } from "./brewCheck";

export const MAX_CAULDRON_SIZE =
  DIFFICULTY_SETTINGS[DEFAULT_DIFFICULTY].maxCauldronIngredients;

export function addIngredient(
  state: IGameState,
  ingredientId: string,
): IGameState {
  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  if (state.cauldronIngredients.length >= settings.maxCauldronIngredients) {
    return state;
  }
  const stock = state.shelfStock[ingredientId] ?? 0;
  if (stock <= 0) return state;

  const ing = INGREDIENTS.find((i) => i.id === ingredientId);
  if (!ing) return state;

  return {
    ...state,
    cauldronIngredients: [...state.cauldronIngredients, ing],
    shelfStock: {
      ...state.shelfStock,
      [ingredientId]: stock - 1,
    },
  };
}

export interface IBrewResult {
  readonly nextState: IGameState;
  readonly checkResult: IBrewCheckResult;
}

export function brewPotion(state: IGameState): IBrewResult {
  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];

  if (state.cauldronIngredients.length === 0) {
    return {
      nextState: state,
      checkResult: {
        success: false,
        temperatureMatch: false,
        densityMatch: false,
        magicPowerMatch: false,
        tolerance: settings.tolerance,
      },
    };
  }

  const currentValues = calculateCauldron(state.cauldronIngredients);
  const checkResult = checkBrew(
    currentValues,
    state.activeRecipe,
    settings.tolerance,
  );

  if (checkResult.success) {
    const nextScore = state.score + settings.scorePerBrew;
    const nextTime = Math.min(
      settings.maxTime,
      state.timeLeft + settings.timeBonus,
    );
    const nextRecipe = getRandomRecipe(difficulty, state.activeRecipe.id);

    return {
      nextState: {
        ...state,
        score: nextScore,
        timeLeft: nextTime,
        cauldronIngredients: [],
        activeRecipe: nextRecipe,
      },
      checkResult,
    };
  }

  const nextLives = Math.max(0, state.lives - 1);
  const nextStatus = nextLives <= 0 ? "game-over" : state.status;

  return {
    nextState: {
      ...state,
      lives: nextLives,
      status: nextStatus,
      cauldronIngredients: [],
    },
    checkResult,
  };
}

export function startNewGame(
  state: IGameState,
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): IGameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const activeIngredients = INGREDIENTS.slice(0, settings.ingredientsCount);

  return {
    ...state,
    status: "playing",
    difficulty,
    score: 0,
    timeLeft: settings.startingTime,
    lives: settings.lives,
    cauldronIngredients: [],
    shelfStock: createStock(activeIngredients),
    activeRecipe: getRandomRecipe(difficulty),
  };
}
