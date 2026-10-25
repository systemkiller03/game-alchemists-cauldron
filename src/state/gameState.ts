import { IGameState, IIngredient } from "../types/types";
import { getRandomRecipe } from "../logic/recipeGenerator";
import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from "../data/difficulty";
import { createStock } from "../logic/stock";
import { INGREDIENTS } from "../data/ingredients";

const defaultSettings = DIFFICULTY_SETTINGS[DEFAULT_DIFFICULTY];

export const initialGameState: IGameState = {
  status: "menu",
  score: 0,
  timeLeft: defaultSettings.startingTime,
  lives: defaultSettings.lives,
  difficulty: DEFAULT_DIFFICULTY,
  activeRecipe: getRandomRecipe(DEFAULT_DIFFICULTY),
  cauldronIngredients: [] as IIngredient[],
  shelfStock: createStock(
    INGREDIENTS.slice(0, defaultSettings.ingredientsCount),
  ),
};
