import { IGameState, IIngredient } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";
import { createStock } from "../logic/stock";

export const initialGameState: IGameState = {
  status: "menu",
  score: 0,
  timeLeft: 0,
  lives: 3,
  activeRecipe: {
    id: "",
    name: "",
    difficulty: "medium",
    temperature: { min: 0, max: 0 },
    density: { min: 0, max: 0 },
    magicPower: { min: 0, max: 0 },
  },
  cauldronIngredients: [] as IIngredient[],
  shelfStock: createStock(INGREDIENTS),
};
