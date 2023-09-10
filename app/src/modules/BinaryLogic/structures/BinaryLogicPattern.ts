export default class BinaryLogicPattern {
  solution: Array<boolean>;
  parameters: Array<Array<boolean>>;

  constructor(solution: Array<boolean>, parameters: Array<Array<boolean>>) {
    this.solution = solution;
    this.parameters = parameters;
  }

  isEqual(pattern: Array<boolean>): boolean {
    for (let i = 0; i < this.solution.length; i++) {
      if (this.solution[i] != pattern[i]) {
        return false;
      }
    }
    return true;
  }
}
