import { IIngredient } from "../types/types";

export function createStock(ingredients: IIngredient[]): Record<string, number> {
  const stock: Record<string, number> = {};
  for (const ing of ingredients) {
    stock[ing.id] = Math.floor(Math.random() * 14) + 2; // 2‑15
  }
  return stock;
}
