import { ICauldronValues } from "./calculateCauldron";
import { IRecipe } from "../types/types";

export interface IBrewCheckResult {
  readonly success: boolean;
  readonly temperatureMatch: boolean;
  readonly densityMatch: boolean;
  readonly magicPowerMatch: boolean;
  readonly tolerance: number;
}

export function isParamWithinRange(
  value: number,
  min: number,
  max: number,
  tolerance: number,
): boolean {
  return value >= min - tolerance && value <= max + tolerance;
}

export function checkBrew(
  values: ICauldronValues,
  recipe: IRecipe,
  tolerance: number = 8,
): IBrewCheckResult {
  const temperatureMatch = isParamWithinRange(
    values.temperature,
    recipe.temperature.min,
    recipe.temperature.max,
    tolerance,
  );
  const densityMatch = isParamWithinRange(
    values.density,
    recipe.density.min,
    recipe.density.max,
    tolerance,
  );
  const magicPowerMatch = isParamWithinRange(
    values.magicPower,
    recipe.magicPower.min,
    recipe.magicPower.max,
    tolerance,
  );

  return {
    success: temperatureMatch && densityMatch && magicPowerMatch,
    temperatureMatch,
    densityMatch,
    magicPowerMatch,
    tolerance,
  };
}
