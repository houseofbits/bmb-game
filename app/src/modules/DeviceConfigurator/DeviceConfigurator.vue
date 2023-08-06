<script setup lang="ts">
import ConfiguratorModeModal from "@src/modules/DeviceConfigurator/ConfiguratorModeModal.vue";
import CustomDeviceConfigurationModal from "@src/modules/DeviceConfigurator/CustomDeviceConfigurationModal.vue";
import { ref } from "vue";
import defineDeviceState from "@src/composables/defineDeviceState";

const deviceState = defineDeviceState();

const emit = defineEmits(["apply", "close"]);

const isConfiguratorOptionsVisible = ref(true);
const isCustomConfiguratorVisible = ref(false);

function openCustomConfigurator(): void {
  isConfiguratorOptionsVisible.value = false;
  isCustomConfiguratorVisible.value = true;
}

function close() {
  isCustomConfiguratorVisible.value = false;
  emit("close");
}

function applyCustomConfiguration(
  width: number,
  height: number,
  modules: Array<string>,
): void {
  deviceState.buildFromParams(width, height, modules);
  emit("close");
}
</script>
<template>
  <ConfiguratorModeModal
    v-if="isConfiguratorOptionsVisible"
    @close="close"
    @apply="applyCustomConfiguration"
    @select-custom="openCustomConfigurator"
  />

  <CustomDeviceConfigurationModal
    v-if="isCustomConfiguratorVisible"
    @close="close"
    @apply="applyCustomConfiguration"
  />
</template>
