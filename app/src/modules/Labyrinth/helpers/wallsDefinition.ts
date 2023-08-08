import LabyrinthWalls from "@src/modules/Labyrinth/structures/LabyrinthWalls";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export default function getWallConfiguration(
  difficulty: DifficultyLevel,
): LabyrinthWalls {
  return walls[difficulty];
}

//prettier-ignore
const easyWalls = new LabyrinthWalls([
	0, 0, 1, 0, 0, 0, 0, 0,
	0, 0, 1, 2, 2, 2, 0, 0,
	0, 0, 1, 0, 0, 1, 0, 0,
	2, 2, 0, 0, 0, 1, 0, 0,
	0, 0, 0, 0, 0, 1, 0, 0,
	0, 0, 1, 0, 2, 2, 2, 2,
	0, 0, 1, 0, 0, 0, 0, 0,
	0, 0, 1, 0, 0, 1, 0, 0,
]);

const walls = {
  [DifficultyLevel.EASY]: easyWalls,
  [DifficultyLevel.AVERAGE]: easyWalls,
  [DifficultyLevel.HARD]: easyWalls,
  [DifficultyLevel.IMPOSSIBLE]: easyWalls,
};
