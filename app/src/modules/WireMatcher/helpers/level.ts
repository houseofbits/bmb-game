import _ from "lodash";

const SET_A = 0;
const SET_B = 1;
const SET_C = 2;
const SET_D = 3;

export enum ConnectionState {
  INCORRECT,
  CORRECT,
  COMPLETED,
}

export function validateConnection(
  portAConnectionIndex: number,
  portBConnectionIndex: number,
  portA: Array<number | null>,
  portB: Array<number | null>,
  condition: boolean,
): ConnectionState {
  if (
    portA[portAConnectionIndex] !== portB[portBConnectionIndex] ||
    portA[portAConnectionIndex] === null ||
    portB[portBConnectionIndex] === null
  ) {
    return ConnectionState.INCORRECT;
  }

  const uniqueColorsA = [...new Set(portA)];
  const uniqueColorsB = [...new Set(portB)];

  let colors = _.intersection(uniqueColorsA, uniqueColorsB);
  colors = colors.filter((val: number | null) => val !== null);
  colors.sort();

  // console.log(colors);

  let isFinalConnection = false;
  let expectedColor: Array<number | null> | null = null;

  if (colors.length === 1) {
    //Rule 1
    // console.log("Rule: " + 1);
    expectedColor = [portA[portAConnectionIndex]];
    isFinalConnection = true;
  } else if (colors.length === 2) {
    if (_.isEqual(colors, [SET_A, SET_B])) {
      //Rule 2
      // console.log("Rule: " + 2);
      expectedColor = [condition ? SET_A : SET_B];
    } else if (
      _.isEqual(colors, [SET_A, SET_C]) ||
      _.isEqual(colors, [SET_B, SET_C])
    ) {
      //Rule 3
      // console.log("Rule: " + 3);
      expectedColor = condition ? [SET_A, SET_B] : [SET_C];
    } else if (
      _.isEqual(colors, [SET_A, SET_D]) ||
      _.isEqual(colors, [SET_B, SET_D])
    ) {
      //Rule 4
      // console.log("Rule: " + 4);
      expectedColor = condition ? [SET_A, SET_B] : [SET_D];
    } else if (_.isEqual(colors, [SET_C, SET_D])) {
      //Rule 5
      // console.log("Rule: " + 5);
      expectedColor = condition ? [SET_C] : [SET_D];
    }
  } else if (colors.length === 3) {
    if (
      _.isEqual(colors, [SET_A, SET_B, SET_D]) ||
      _.isEqual(colors, [SET_A, SET_B, SET_C])
    ) {
      //Rule 6
      // console.log("Rule: " + 6);
      expectedColor = condition ? [SET_B] : [SET_A];
    } else if (
      _.isEqual(colors, [SET_A, SET_C, SET_D]) ||
      _.isEqual(colors, [SET_B, SET_C, SET_D])
    ) {
      //Rule 7
      // console.log("Rule: " + 7);
      expectedColor = condition ? [SET_D] : [SET_C];
    }
  } else if (colors.length === 4) {
    //Rule 8
    // console.log("Rule: " + 8);
    expectedColor = [SET_A];
  }

  if (<boolean>expectedColor?.includes(portA[portAConnectionIndex])) {
    return isFinalConnection
      ? ConnectionState.COMPLETED
      : ConnectionState.CORRECT;
  }

  return ConnectionState.INCORRECT;
}
