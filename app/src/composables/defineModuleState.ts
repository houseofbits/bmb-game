import { computed, PropType, watch } from "vue";
import { ModuleState } from "@src/helpers/ModuleState";
import { DifficultyLevel } from "@src/helpers/difficultyLevelConstants";

export const ModuleProps = {
  index: {
    type: Number,
    required: true,
  },
  status: {
    type: Number as PropType<ModuleState>,
    required: true,
  },
  difficulty: {
    type: Number as PropType<DifficultyLevel>,
    default: () => DifficultyLevel.EASY,
  },
  serialNumber: {
    type: String,
    required: true,
  },
};

export const ModuleEmits = ["fail", "disarm"];

export default (props: any, emit: CallableFunction) => {
  const isArmed = computed(() => {
    return props.status == ModuleState.ARMED;
  });

  const isDisarmed = computed(() => {
    return props.status == ModuleState.DISARMED;
  });

  const isFailed = computed(() => {
    return props.status == ModuleState.FAILED;
  });

  let armedCallbackFunc: CallableFunction | null = null;
  let readyCallbackFunc: CallableFunction | null = null;
  let failedCallbackFunc: CallableFunction | null = null;

  function onArmed(func: CallableFunction): void {
    armedCallbackFunc = func;
  }

  function onReady(func: CallableFunction): void {
    readyCallbackFunc = func;
  }

  function onFailed(func: CallableFunction): void {
    failedCallbackFunc = func;
  }

  watch(
    () => props.status,
    (status: ModuleState) => {
      if (status == ModuleState.ARMED) {
        if (armedCallbackFunc) {
          armedCallbackFunc();
        }
      } else if (status == ModuleState.READY) {
        if (readyCallbackFunc) {
          readyCallbackFunc();
        }
      } else if (status == ModuleState.FAILED) {
        if (failedCallbackFunc) {
          failedCallbackFunc();
        }
      }
    },
  );

  function emitFailed(): void {
    emit("fail");
  }

  function emitDisarmed(): void {
    emit("disarm");
  }

  return {
    onArmed,
    onReady,
    onFailed,
    isArmed,
    isDisarmed,
    isFailed,
    emitFailed,
    emitDisarmed,
  };
};
