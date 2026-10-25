import { IGameState } from "../types/types";
import { getRandomRecipe } from "../logic/recipeGenerator";
import { DEFAULT_DIFFICULTY } from "../data/difficulty";

export const initialGameState: IGameState = {
  status: "menu",
  score: 0,
  timeLeft: 0,
  lives: 0,
  difficulty: DEFAULT_DIFFICULTY,
  activeRecipe: getRandomRecipe(DEFAULT_DIFFICULTY),
  cauldronIngredients: [],
  shelfStock: {},
};
