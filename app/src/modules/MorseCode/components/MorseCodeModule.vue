<script setup lang="ts">
import "@style/modules/morse-code.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import defineDebugState from "@src/composables/defineDebugState";
import { ref } from "vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import FramedLabel from "@src/components/FramedLabel.vue";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);
const debugState = defineDebugState();

const strikeNumber = ref<number>(0);
const isTransmitEnabled = ref(false);
const isBeepEnabled = ref(false);
</script>
<template>
  <div class="module morse-code-module">
    <div class="content">
      <FramedLabel
        radius="50%"
        left="250px"
        top="20px"
        height="110px"
        width="110px"
        text="MODE"
      >
        <div
          class="rotary-switch"
          @click="isTransmitEnabled = !isTransmitEnabled"
        >
          {{ isTransmitEnabled ? "TX" : "RX" }}
        </div>
      </FramedLabel>

      <FramedLabel
        radius="50%"
        left="250px"
        top="155px"
        height="110px"
        width="110px"
        text="TRANSMIT"
      >
        <div class="large-push-button">SEND</div>
      </FramedLabel>

      <FramedLabel
        radius="8PX"
        left="20px"
        top="20px"
        height="160px"
        width="120px"
        text="SIGNAL"
      >
      </FramedLabel>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
      :strike-number="strikeNumber"
    />
  </div>
</template>
