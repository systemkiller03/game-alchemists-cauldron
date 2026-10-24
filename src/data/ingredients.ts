import { IIngredient } from "../types/types";
import dragonTears from "@/assets/dragon-tears.svg";
import fairyDust from "@/assets/fairy-dust.svg";
import frostLotus from "@/assets/frost-lotus.svg";
import mandrakeRoot from "@/assets/mandrake-root.svg";
import causticAcid from "@/assets/caustic-acid.svg";
import essenceOfTheVoid from "@/assets/essence-of-the-void.svg";

export const INGREDIENTS: IIngredient[] = [
  {
    id: "dragon-tears",
    name: "Dragon Tears",
    icon: dragonTears,
    temperature: 25,
    density: 8,
    magicPower: 10,
  },
  {
    id: "fairy-dust",
    name: "Fairy Dust",
    icon: fairyDust,
    temperature: 12,
    density: 9,
    magicPower: 12,
  },
  {
    id: "frost-lotus",
    name: "Frost Lotus",
    icon: frostLotus,
    temperature: -18,
    density: 4,
    magicPower: 14,
  },
  {
    id: "mandrake-root",
    name: "Mandrake Root",
    icon: mandrakeRoot,
    temperature: -5,
    density: 20,
    magicPower: 8,
  },
  {
    id: "caustic-acid",
    name: "Caustic Acid",
    icon: causticAcid,
    temperature: 10,
    density: 14,
    magicPower: 22,
  },
  {
    id: "essence-of-the-void",
    name: "Essence of the Void",
    icon: essenceOfTheVoid,
    temperature: -20,
    density: -10,
    magicPower: 40,
  },
];
