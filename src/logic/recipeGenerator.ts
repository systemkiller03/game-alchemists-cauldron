import { RECIPES } from "../data/recipes";
import { Difficulty, IRecipe } from "../types/types";

export function getRecipesByDifficulty(difficulty: Difficulty): IRecipe[] {
  return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

export function getRandomRecipe(
  difficulty: Difficulty = "medium",
  currentRecipeId?: string,
): IRecipe {
  const pool = getRecipesByDifficulty(difficulty);
  if (pool.length === 0) {
    throw new Error(`No recipes found for difficulty: ${difficulty}`);
  }

  const candidates =
    pool.length > 1 && currentRecipeId
      ? pool.filter((recipe) => recipe.id !== currentRecipeId)
      : pool;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
