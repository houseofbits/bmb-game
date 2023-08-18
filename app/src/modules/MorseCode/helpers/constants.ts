export enum OperationMode {
  RECEIVE,
  TRANSMIT,
  PRACTICE,
}

export enum Signal {
  DIT = 1,
  DAH = 2,
  DIT_SPACE = 3,
  CHAR_SPACE = 4,
  WORD_SPACE = 5,
}

export const SignalTiming = {
  [Signal.DIT]: 1,
  [Signal.DAH]: 3,
  [Signal.DIT_SPACE]: 1,
  [Signal.CHAR_SPACE]: 3,
  [Signal.WORD_SPACE]: 7,
};
