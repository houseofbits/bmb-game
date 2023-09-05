<script setup lang="ts">
import defineDeviceState from "@src/composables/defineDeviceState";
import { ref, watch } from "vue";
import ModuleStructure from "@src/structures/ModuleStructure";

const deviceState = defineDeviceState();

const id = ref(0);
watch(
  () => deviceState.modules.value,
  () => {
    id.value++;
  },
);

function getModuleKey(index: number): number {
  return index + id.value;
}
</script>
<template>
  <div
    class="device"
    :class="['device-width-' + deviceState.modulesWidth.value]"
  >
    <component
      v-for="(module, index) in deviceState.modules.value"
      :is="module.component"
      :key="getModuleKey(index)"
      :index="index"
      :status="module.state"
      :difficulty="deviceState.difficultyLevel.value"
      :serial-number="deviceState.serialNumber.value"
      @disarm="() => deviceState.disarmModule(index)"
      @fail="() => deviceState.failModule(index)"
    />
  </div>
</template>
