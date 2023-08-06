import { computed, reactive, ref } from "vue";
import { ModuleState } from "@src/helpers/ModuleState";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";
import ModuleStructure from "@src/structures/ModuleStructure";
import getModuleComponent from "@src/config/componentDefinition";

let modules = ref<Array<ModuleStructure>>([]);
const modulesWidth = ref<number>(0);
const modulesHeight = ref<number>(0);
const difficultyLevel = ref<DifficultyLevel>(DifficultyLevel.EASY);

const areAllModulesDisarmed = computed(() => {
  for (const module of modules.value) {
    if (module.state == ModuleState.ARMED) {
      return false;
    }
  }

  return true;
});
const haveSomeModulesFailed = computed(() => {
  for (const module of modules.value) {
    if (module.state == ModuleState.FAILED) {
      return true;
    }
  }

  return false;
});

export default () => {
  function clearModuleStatuses(): void {
    modules.value.splice(0, modules.value.length);
  }

  function markFinishedModulesReady(): void {
    modules.value.forEach(function (module: ModuleStructure, index: number) {
      if (
        module.state === ModuleState.DISARMED ||
        module.state === ModuleState.FAILED ||
        module.state === ModuleState.ARMED
      ) {
        modules.value[index].state = ModuleState.READY;
      }
    });
  }

  function markActiveModulesFailed(): void {
    modules.value.forEach(function (module: ModuleStructure, index: number) {
      if (
        module.state === ModuleState.DISARMED ||
        module.state === ModuleState.ARMED
      ) {
        modules.value[index].state = ModuleState.FAILED;
      }
    });
  }

  function armReadyModules(difficulty: DifficultyLevel): void {
    difficultyLevel.value = difficulty;
    modules.value.forEach(function (module: ModuleStructure, index: number) {
      if (module.state === ModuleState.READY) {
        modules.value[index].state = ModuleState.ARMED;
      }
    });
  }

  function disarmModule(index: number): void {
    if (modules.value[index].state === ModuleState.ARMED) {
      modules.value[index].state = ModuleState.DISARMED;
    }
  }

  function failModule(index: number): void {
    if (modules.value[index].state === ModuleState.ARMED) {
      modules.value[index].state = ModuleState.FAILED;
    }
  }

  function buildFromParams(
    width: number,
    height: number,
    moduleNames: Array<string>,
  ): void {
    modulesWidth.value = width;
    modulesHeight.value = height;

    modules.value = moduleNames.map((name: string) => {
      let status = ModuleState.DISABLED;
      if (name !== "placeholder" && name !== "timer") {
        status = ModuleState.READY;
      }

      return new ModuleStructure(getModuleComponent(name), status);
    });
  }

  return {
    buildFromParams,
    clearModuleStatuses,
    armReadyModules,
    disarmModule,
    failModule,
    areAllModulesDisarmed,
    markFinishedModulesReady,
    difficultyLevel,
    haveSomeModulesFailed,
    markActiveModulesFailed,
    modules,
    modulesWidth,
    modulesHeight,
  };
};
