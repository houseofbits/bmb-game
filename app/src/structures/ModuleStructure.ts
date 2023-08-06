import { ModuleState } from "@src/helpers/ModuleState";

export default class ModuleStructure {
  component: any;
  state: ModuleState;

  constructor(comp: any, s: ModuleState) {
    this.component = comp;
    this.state = s;
  }
}
