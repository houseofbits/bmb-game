import PlaceholderModule from "@src/components/PlaceholderModule.vue";
import TimerModule from "@src/modules/Timer/components/TimerModule.vue";
import SimonSaysModule from "@src/modules/SimonSays/components/SimonSaysModule.vue";
import LabyrinthModule from "@src/modules/Labyrinth/components/LabyrinthModule.vue";
import WireMatcherModule from "@src/modules/WireMatcher/components/WireMatcherModule.vue";
import NumberDecoderModule from "@src/modules/NumberDecoder/components/NumberDecoderModule.vue";
import { markRaw } from "vue";

const modulesComponentNameMap: { [name: string]: any } = {
  placeholder: PlaceholderModule,
  timer: TimerModule,
  simonSays: SimonSaysModule,
  labyrinth: LabyrinthModule,
  wireMatcher: WireMatcherModule,
  numberDecoder: NumberDecoderModule,
};

export default function getModuleComponent(name: string): any {
  return markRaw(modulesComponentNameMap[name]);
}
