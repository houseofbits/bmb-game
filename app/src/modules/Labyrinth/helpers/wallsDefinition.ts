import LabyrinthWalls from "@src/modules/Labyrinth/structures/LabyrinthWalls";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import { SerialNumberVariationId } from "@src/helpers/serialNumber";

export default function getWalls(
  difficultyLevel: DifficultyLevel,
  variant: SerialNumberVariationId,
): LabyrinthWalls {
  return easyWalls[variant];
}

//prettier-ignore
const easyWalls = {
    [SerialNumberVariationId.ID_A]: new LabyrinthWalls([
        0, 1, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0, 0,
    ]),
    [SerialNumberVariationId.ID_B]: new LabyrinthWalls([
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 2, 2, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 2, 2, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
    ]),
    [SerialNumberVariationId.ID_C]: new LabyrinthWalls([
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 2, 2, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 2, 2, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
    ])
};
