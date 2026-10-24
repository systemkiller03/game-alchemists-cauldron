import { IGameState, IIngredient } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { createStock } from "../logic/stock";
import { RECIPES } from "../data/recipes";

export const initialGameState: IGameState = {
  status: "menu",
  score: 0,
  timeLeft: 0,
  lives: 3,
  activeRecipe: RECIPES[6],
  cauldronIngredients: [] as IIngredient[],
  shelfStock: createStock(INGREDIENTS),
};
