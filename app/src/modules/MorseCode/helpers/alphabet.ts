import { Signal } from "@src/modules/MorseCode/helpers/constants";

const D = Signal.DIT;
const L = Signal.DAH;

const Alphabet: { [char: string]: Array<Signal> } = {
  A: [D, L],
  B: [L, D, D, D],
  C: [L, D, L, D],
  D: [L, D, D],
  E: [D],
  F: [D, D, L, D],
  G: [L, L, D],
  H: [D, D, D, D],
  I: [D, D],
  J: [D, L, L, L],
  K: [L, D, L],
  L: [D, L, D, D],
  M: [L, L],
  N: [L, D],
  O: [L, L, L],
  P: [D, L, L, D],
  Q: [L, L, D, L],
  R: [D, L, D],
  S: [D, D, D],
  T: [L],
  U: [D, D, L],
  V: [D, D, D, L],
  W: [D, L, L],
  X: [L, D, D, L],
  Y: [L, D, L, L],
  Z: [L, L, D, D],
};

export default Alphabet;
