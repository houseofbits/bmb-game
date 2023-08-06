export enum SimonSaysColor {
    GREEN = 'green', RED = 'red', YELLOW = 'yellow', BLUE = 'blue'
}

export class SimonSaysPatternStructure {
    correctAnswer: SimonSaysColor;
    pattern: Array<SimonSaysColor>;

    constructor(correctAnswer: SimonSaysColor, pattern: Array<SimonSaysColor>) {
        this.correctAnswer = correctAnswer;
        this.pattern = pattern;
    }

    getColor(index: number): SimonSaysColor|null {
        return this.pattern[index] ?? null;
    }

    getSize(): number {
        return this.pattern.length;
    }

    isCorrect(answer: SimonSaysColor): boolean
    {
        return this.correctAnswer === answer;
    }
}