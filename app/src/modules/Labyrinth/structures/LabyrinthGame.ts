import LabyrinthPoint from "@src/modules/Labyrinth/structures/LabyrinthPoint";

export class LabyrinthLevel {
  endingPoint: LabyrinthPoint;
  obstacles: Array<LabyrinthPoint> = [];

  constructor(endX: number, endY: number) {
    this.endingPoint = new LabyrinthPoint(endX, endY);
  }

  addObstacle(x: number, y: number): LabyrinthLevel {
    this.obstacles.push(new LabyrinthPoint(x, y));

    return this;
  }

  isObstacle(point: LabyrinthPoint): boolean {
    for (const obstacle of this.obstacles) {
      if (obstacle.isEqual(point)) {
        return true;
      }
    }
    return false;
  }
}

export default class LabyrinthGame {
  startingPoint: LabyrinthPoint;
  levels: Array<LabyrinthLevel> = [];

  constructor(startX: number, startY: number) {
    this.startingPoint = new LabyrinthPoint(startX, startY);
  }

  addLevel(
    endX: number,
    endY: number,
    obstacles: Array<Array<number>> = [],
  ): LabyrinthGame {
    const level = new LabyrinthLevel(endX, endY);
    for (const obstacle of obstacles) {
      level.addObstacle(obstacle[0], obstacle[1]);
    }

    this.levels.push(level);

    return this;
  }

  getLevel(index: number): LabyrinthLevel {
    return this.levels[index] ?? this.levels[0];
  }

  getLevelCount(): number {
    return this.levels.length;
  }

  static create(x: number, y: number): LabyrinthGame {
    return new LabyrinthGame(x, y);
  }
}
