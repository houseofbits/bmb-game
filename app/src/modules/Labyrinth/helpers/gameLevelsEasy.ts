import LabyrinthGame from "@src/modules/Labyrinth/structures/LabyrinthGame";

export default [
  LabyrinthGame.create(0, 2)
    .addLevel(7, 7, [[4, 4]])
    .addLevel(7, 0),
];
