import { Difficulty } from "../types/types";

export interface IDifficultySettings {
  readonly ingredientsCount: number;
  readonly maxCauldronIngredients: number;
  readonly startingTime: number;
  readonly tolerance: number;
  readonly lives: number;
  readonly scorePerBrew: number;
  readonly timeBonus: number;
  readonly maxTime: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, IDifficultySettings> = {
  easy: {
    ingredientsCount: 4,
    maxCauldronIngredients: 4,
    startingTime: 180,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonus: 15,
    maxTime: 180,
  },
  medium: {
    ingredientsCount: 6,
    maxCauldronIngredients: 4,
    startingTime: 150,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonus: 10,
    maxTime: 150,
  },
  hard: {
    ingredientsCount: 8,
    maxCauldronIngredients: 5,
    startingTime: 150,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonus: 5,
    maxTime: 150,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = "medium";
