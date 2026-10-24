import { IGameState } from "../types/types";
import { INGREDIENTS } from "../data/ingredients";

export const MAX_CAULDRON_SIZE = 4;

export function addIngredient(state: IGameState, ingredientId: string): IGameState {
  if (state.cauldronIngredients.length >= MAX_CAULDRON_SIZE) return state;
  const stock = state.shelfStock[ingredientId] ?? 0;
  if (stock <= 0) return state;
  const ingredient = INGREDIENTS.find((i) => i.id === ingredientId);
  if (!ingredient) return state;

  return {
    ...state,
    shelfStock: { ...state.shelfStock, [ingredientId]: stock - 1 },
    cauldronIngredients: [...state.cauldronIngredients, ingredient],
  };
}
