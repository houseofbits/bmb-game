import {LabyrinthDirection} from "@src/modules/Labyrinth/structures/LabyrinthDirection";
import LabyrinthPoint from "@src/modules/Labyrinth/structures/LabyrinthPoint";

enum CellWalls {
    NO_WALL = 0,
    RIGHT_WALL = 1,
    BOTTOM_WALL = 2,
    BOTH_WALLS = 3,
}

export default class LabyrinthWalls {
    matrix: Array<number>;

    constructor(input: Array<number>) {
        this.matrix = Array.apply(null, Array(8 * 8)).map((val: number | unknown, index: number) => Number(input[index]) ?? 0)
    }

    canCross(direction: LabyrinthDirection, point: LabyrinthPoint): boolean {
        const p = point.getCopy();

        switch (direction) {
            case LabyrinthDirection.LEFT:
                p.x--;
                break;
            case LabyrinthDirection.UP:
                p.y--;
                break;
        }

        const walls = this.matrix[p.getArrayPosition()];

        switch (direction) {
            case LabyrinthDirection.LEFT:
            case LabyrinthDirection.RIGHT:
                if (walls === CellWalls.RIGHT_WALL || walls === CellWalls.BOTH_WALLS) {
                    return false;
                }
                break;
            case LabyrinthDirection.UP:
            case LabyrinthDirection.DOWN:
                if (walls === CellWalls.BOTTOM_WALL || walls === CellWalls.BOTH_WALLS) {
                    return false;
                }
                break;
        }

        return true;
    }
}