import { IIngredient } from "../types/types";

export function createStock(
  ingredients: IIngredient[],
): Record<string, number> {
  const stock: Record<string, number> = {};
  for (const ing of ingredients) {
    stock[ing.id] = Math.floor(Math.random() * 14) + 2; // 2‑15
  }
  return stock;
}

export function isShelfEmpty(
  stock: Record<string, number>,
  activeIngredientIds: readonly string[],
): boolean {
  return activeIngredientIds.every((id) => (stock[id] ?? 0) <= 0);
}

export function isOutOfIngredients(
  stock: Record<string, number>,
  cauldronIngredientsCount: number,
  activeIngredientIds: readonly string[],
): boolean {
  return (
    cauldronIngredientsCount === 0 && isShelfEmpty(stock, activeIngredientIds)
  );
}
