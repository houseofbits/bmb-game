import LabyrinthWalls from "@src/modules/Labyrinth/structures/LabyrinthWalls";
import { LabyrinthWallVariations } from "@src/modules/Labyrinth/structures/LabyrinthEnums";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export default function getWalls(
  difficultyLevel: DifficultyLevel,
  variant: LabyrinthWallVariations,
): LabyrinthWalls {
  return easyWalls[variant];
}

//prettier-ignore
const easyWalls = {
    [LabyrinthWallVariations.A]: new LabyrinthWalls([
        0, 1, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0, 0,
    ]),
    [LabyrinthWallVariations.B]: new LabyrinthWalls([
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 2, 2, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 2, 2, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0, 0,
    ]),
    [LabyrinthWallVariations.C]: new LabyrinthWalls([
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
