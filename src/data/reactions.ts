import { IIngredient, IReaction } from "../types/types";

const hasIngredients =
  (...ids: string[]) =>
  (ingredients: IIngredient[]): boolean =>
    ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));

const changeValues = (
  values: { temperature: number; density: number; magicPower: number },
  changes: Partial<{
    temperature: number;
    density: number;
    magicPower: number;
  }>,
): { temperature: number; density: number; magicPower: number } => ({
  ...values,
  ...changes,
});

export const REACTIONS: readonly IReaction[] = [
  {
    id: "bubbling",
    name: "Bubbling",
    isActive: hasIngredients("fairy-dust", "caustic-acid"),
    apply: (values) =>
      changeValues(values, { magicPower: values.magicPower * 1.5 }),
    timePenalty: 10,
  },
  {
    id: "solar-frost",
    name: "Solar Frost",
    isActive: hasIngredients("dragon-tears", "frost-lotus"),
    apply: (values) =>
      changeValues(values, {
        temperature: 0,
        density: values.density * 1.2,
      }),
  },
  {
    id: "volatile-mix",
    name: "Volatile Mix",
    isActive: hasIngredients("phoenix-feather", "essence-of-the-void"),
    apply: (values) => values,
    lifePenalty: 1,
    clearCauldron: true,
  },
  {
    id: "rooted-steam",
    name: "Rooted Steam",
    isActive: hasIngredients("mandrake-root", "toad-slime"),
    apply: (values) =>
      changeValues(values, {
        density: values.density * 1.25,
        magicPower: values.magicPower * 0.9,
      }),
  },
  {
    id: "ashen-bloom",
    name: "Ashen Bloom",
    isActive: hasIngredients("phoenix-feather", "fairy-dust"),
    apply: (values) =>
      changeValues(values, {
        temperature: values.temperature + 10,
        magicPower: values.magicPower * 1.25,
      }),
  },
  {
    id: "annihilation",
    name: "Annihilation",
    isActive: (ingredients) =>
      ingredients.some((ingredient) => ingredient.temperature > 15) &&
      ingredients.some((ingredient) => ingredient.temperature < -15) &&
      ingredients.some((positive) =>
        ingredients.some(
          (negative) =>
            positive !== negative &&
            positive.temperature > 15 &&
            negative.temperature < -15,
        ),
      ),
    apply: (values) =>
      changeValues(values, {
        temperature: 0,
        density: values.density * 2,
      }),
  },
  {
    id: "pressure-spike",
    name: "Pressure Spike",
    isActive: (ingredients) =>
      ingredients.reduce((sum, ingredient) => sum + ingredient.density, 0) >=
      70,
    apply: (values) =>
      changeValues(values, {
        density: 70,
        magicPower: values.magicPower * 1.1,
      }),
  },
  {
    id: "magma-flux",
    name: "Magma Flux",
    isActive: (ingredients) =>
      ingredients.reduce(
        (sum, ingredient) => sum + ingredient.temperature,
        0,
      ) >= 60,
    apply: (values) =>
      changeValues(values, {
        magicPower: values.magicPower * 1.2,
        density: values.density * 0.9,
      }),
  },
  {
    id: "deep-freeze",
    name: "Deep Freeze",
    isActive: (ingredients) =>
      ingredients.reduce(
        (sum, ingredient) => sum + ingredient.temperature,
        0,
      ) <= -20,
    apply: (values) =>
      changeValues(values, {
        density: values.density * 1.15,
        magicPower: values.magicPower * 0.85,
      }),
  },
  {
    id: "arcane-saturation",
    name: "Arcane Saturation",
    isActive: (ingredients) =>
      ingredients.reduce((sum, ingredient) => sum + ingredient.magicPower, 0) >=
      80,
    apply: (values) =>
      changeValues(values, {
        magicPower: 80,
        temperature: values.temperature + 5,
      }),
  },
  {
    id: "steam-burst",
    name: "Steam Burst",
    isActive: (ingredients) =>
      hasIngredients("dragon-tears", "caustic-acid")(ingredients) &&
      ingredients.reduce(
        (sum, ingredient) => sum + ingredient.temperature,
        0,
      ) >= 35,
    apply: (values) =>
      changeValues(values, { temperature: values.temperature + 10 }),
    timePenalty: 5,
  },
  {
    id: "black-ice",
    name: "Black Ice",
    isActive: (ingredients) =>
      hasIngredients("frost-lotus", "essence-of-the-void")(ingredients) &&
      ingredients.reduce((sum, ingredient) => sum + ingredient.density, 0) <= 0,
    apply: (values) =>
      changeValues(values, {
        temperature: values.temperature - 10,
        magicPower: values.magicPower * 1.2,
      }),
  },
  {
    id: "heavy-spark",
    name: "Heavy Spark",
    isActive: (ingredients) =>
      hasIngredients("fairy-dust", "toad-slime")(ingredients) &&
      ingredients.reduce((sum, ingredient) => sum + ingredient.density, 0) >=
        40,
    apply: (values) =>
      changeValues(values, {
        density: values.density * 1.2,
        magicPower: values.magicPower * 1.1,
      }),
  },
  {
    id: "burning-root",
    name: "Burning Root",
    isActive: (ingredients) =>
      hasIngredients("mandrake-root", "phoenix-feather")(ingredients) &&
      ingredients.reduce(
        (sum, ingredient) => sum + ingredient.temperature,
        0,
      ) >= 40,
    apply: (values) =>
      changeValues(values, {
        temperature: values.temperature + 15,
        density: values.density * 0.9,
      }),
  },
  {
    id: "void-resonance",
    name: "Void Resonance",
    isActive: (ingredients) =>
      hasIngredients("essence-of-the-void", "dragon-tears")(ingredients) &&
      ingredients.reduce((sum, ingredient) => sum + ingredient.magicPower, 0) >=
        50,
    apply: (values) =>
      changeValues(values, {
        magicPower: values.magicPower * 1.3,
        temperature: values.temperature - 5,
      }),
  },
];
