export default [
  {
    name: "Test MOrse code",
    width: 1,
    height: 2,
    modules: ["timer", "morseCode"],
  },
  {
    name: "Test Labyrinth",
    width: 1,
    height: 2,
    modules: ["timer", "labyrinth"],
  },
  {
    name: "Test Simon Says",
    width: 1,
    height: 2,
    modules: ["timer", "simonSays"],
  },
  {
    name: "Test Number decoder",
    width: 1,
    height: 2,
    modules: ["timer", "numberDecoder"],
  },
  {
    name: "Test Wire matcher",
    width: 1,
    height: 2,
    modules: ["timer", "wireMatcher"],
  },
  {
    name: "All modules",
    width: 3,
    height: 3,
    modules: [
      "labyrinth",
      "numberDecoder",
      "timer",
      "simonSays",
      "wireMatcher",
      "morseCode",
      "wireMatcher",
      "labyrinth",
      "numberDecoder",
    ],
  },
];
