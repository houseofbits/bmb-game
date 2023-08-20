import { ModuleState } from "@src/helpers/ModuleState";

export default class ModuleStructure {
  name: string;
  component: any;
  state: ModuleState;

  constructor(name: string, comp: any, s: ModuleState) {
    this.name = name;
    this.component = comp;
    this.state = s;
  }
}
