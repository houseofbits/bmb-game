import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import LabyrinthGame from "@src/modules/Labyrinth/structures/LabyrinthGame";
import _ from "lodash";
import {
  decodeSerialNumber,
  SerialNumberVariationId,
} from "@src/helpers/serialNumber";

const _eas = DifficultyLevel.EASY;
const _avg = DifficultyLevel.AVERAGE;
const _har = DifficultyLevel.HARD;
const _imp = DifficultyLevel.IMPOSSIBLE;

const _A = SerialNumberVariationId.ID_A;
const _B = SerialNumberVariationId.ID_B;
const _C = SerialNumberVariationId.ID_C;

//prettify-ignore
export const allGameLevels: Array<LabyrinthGame> = [
  LabyrinthGame.create(_eas, _A, 0, 2).addLevel(3, 5).addLevel(5, 3),
  LabyrinthGame.create(_eas, _A, 1, 6).addLevel(3, 2).addLevel(5, 4),
  LabyrinthGame.create(_eas, _A, 0, 1).addLevel(3, 6).addLevel(4, 4),
  LabyrinthGame.create(_eas, _A, 3, 7).addLevel(4, 3).addLevel(6, 6),

  LabyrinthGame.create(_eas, _A, 4, 7).addLevel(7, 5).addLevel(5, 0),

  LabyrinthGame.create(_eas, _A, 3, 1).addLevel(5, 3).addLevel(7, 6),

  LabyrinthGame.create(_eas, _B, 0, 2).addLevel(3, 5),

  LabyrinthGame.create(_eas, _C, 0, 2).addLevel(3, 5),
];

export function getRandomGameLevel(
  difficulty: DifficultyLevel,
  serialNumber: string,
): LabyrinthGame | null {
  const variant = decodeSerialNumber(serialNumber).getFirstLetterVariation();

  const levelsSubset = allGameLevels.filter(
    (level: LabyrinthGame) =>
      level.variation === variant && level.difficulty === difficulty,
  );
  const index = _.random(0, levelsSubset.length - 1);
  return levelsSubset[index];
  // return allGameLevels[4];
}
