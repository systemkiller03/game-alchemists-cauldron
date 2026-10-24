import { IIngredient } from "../types/types";

export interface ICauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export function calculateCauldron(
  ingredients: readonly IIngredient[],
): ICauldronValues {
  return ingredients.reduce<ICauldronValues>(
    (acc, ing) => ({
      temperature: acc.temperature + ing.temperature,
      density: acc.density + ing.density,
      magicPower: acc.magicPower + ing.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );
}
