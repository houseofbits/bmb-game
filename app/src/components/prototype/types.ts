import BmbMoreCodeModule from "@src/components/prototype/BmbMoreCodeModule.vue";
import BmbLabyrinthModule from "@src/components/prototype/BmbLabyrinthModule.vue";
import { markRaw, ShallowRef, shallowRef } from "vue";

export class BmbBase {
  state: number = 0;
  name: string = "";

  isActive(): boolean {
    return this.state === 1;
  }

  setActive(): void {
    this.state = 1;
  }
}

export class BmbMorseCode extends BmbBase {
  strikeNumber: number = 0;
  levelIndex: number = 0;
}

export class BmbLabyrinth extends BmbBase {
  strikeNumber: number = 0;
  levelIndex: number = 0;
  currentPositionX: number = 0;
  currentPositionY: number = 0;
}

export class BmbComponent {
  component: any;
  state: BmbBase = new BmbBase();
}
