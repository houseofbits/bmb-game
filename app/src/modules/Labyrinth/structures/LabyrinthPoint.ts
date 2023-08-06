
export default class LabyrinthPoint {
    x: number;
    y: number;
    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    getCopy(): LabyrinthPoint {
        return new LabyrinthPoint(this.x, this.y);
    }

    isEqual(other: LabyrinthPoint): boolean {
        return this.x === other.x && this.y === other.y;
    }

    getArrayPosition(): number {
        return this.y * 8 + this.x;
    }
}