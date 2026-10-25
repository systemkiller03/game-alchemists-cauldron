import { DIFFICULTY_SETTINGS, DEFAULT_DIFFICULTY } from "../data/difficulty";
import { REACTIONS } from "../data/reactions";
import { Difficulty, IIngredient, IReaction } from "../types/types";
import { calculateCauldron, ICauldronValues } from "./calculateCauldron";

export function getEnabledReactions(
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): readonly IReaction[] {
  return REACTIONS.slice(0, DIFFICULTY_SETTINGS[difficulty].reactionCount);
}

export function getActiveReactions(
  ingredients: IIngredient[],
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): IReaction[] {
  return getEnabledReactions(difficulty).filter((reaction) =>
    reaction.isActive(ingredients),
  );
}

export function calculateCauldronWithReactions(
  ingredients: IIngredient[],
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): ICauldronValues {
  return getActiveReactions(ingredients, difficulty).reduce(
    (values, reaction) => reaction.apply(values),
    calculateCauldron(ingredients),
  );
}
