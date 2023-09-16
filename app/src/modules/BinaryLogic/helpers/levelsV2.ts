import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import BinaryLogicPattern from "@src/modules/BinaryLogic/structures/BinaryLogicPattern";
import {
  decodeSerialNumber,
  SerialNumberVariationId,
} from "@src/helpers/serialNumber";

const X = true;
const O = false;

//prettier-ignore
const SOLUTIONS_EASY = {
    [SerialNumberVariationId.ID_A]: [
        X, X, O, O,
        X, X, O, O,
        O, O, O, O,
        O, O, O, O,
    ],
    [SerialNumberVariationId.ID_B]: [
        O, O, O, O,
        O, O, O, O,
        O, O, O, O,
        X, X, X, X,
    ],
    [SerialNumberVariationId.ID_C]: [
        X, O, O, O,
        O, X, O, O,
        O, O, X, O,
        O, O, O, X,

    ],
};

//prettier-ignore
const parameters = [
    [
        X, O, X, O,
        O, X, O, X,
        X, O, X, O,
        O, X, O, X,
    ],
    [
        O, O, O, O,
        X, X, X, X,
        O, O, O, O,
        X, X, X, X,
    ],
    [
        O, O, O, O,
        O, O, O, O,
        X, X, X, X,
        X, X, X, X,
    ],
    [
        X, X, X, X,
        X, X, X, X,
        O, O, O, O,
        O, O, O, O,
    ],
    [
        X, X, O, O,
        X, X, O, O,
        O, O, X, X,
        O, O, X, X,
    ],
];

export function getLevel(
  difficulty: DifficultyLevel,
  serialNumber: string,
): BinaryLogicPattern {
  const variation = decodeSerialNumber(serialNumber).getSecondLetterVariation();

  console.log(variation);

  return new BinaryLogicPattern(SOLUTIONS_EASY[variation], parameters);
}
