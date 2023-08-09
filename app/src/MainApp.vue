<script setup lang="ts">
import Box from "@src/components/Box.vue";
import { onMounted, ref } from "vue";
import Toolbar from "@src/components/Toolbar.vue";
import "@style/documentation.scss";
import Documentation from "@src/components/Documentation.vue";
import DeviceConfigurator from "@src/modules/DeviceConfigurator/DeviceConfigurator.vue";
import devicePresets from "@src/config/devicePresets";
import defineDeviceState from "@src/composables/defineDeviceState";
import defineDebugState from "@src/composables/defineDebugState";

const deviceState = defineDeviceState();
const debugState = defineDebugState();

const isDeviceConfiguratorVisible = ref(false);
const isDocumentationVisible = ref(false);

onMounted(() => {
  deviceState.buildFromParams(
    devicePresets[2].width,
    devicePresets[2].height,
    devicePresets[2].modules,
  );
});
</script>
<template>
  <div v-if="isDocumentationVisible" class="box-center-wrapper">
    <Documentation />
  </div>

  <div v-else class="box-center-wrapper">
    <Box />
  </div>

  <div class="debug-button">
    <v-switch
      v-model="debugState.isDebugModeEnabled.value"
      hide-details
      label="DEBUG MODE"
    ></v-switch>
  </div>

  <DeviceConfigurator
    v-if="isDeviceConfiguratorVisible"
    @close="isDeviceConfiguratorVisible = false"
  />

  <Toolbar
    @create-configuration="isDeviceConfiguratorVisible = true"
    @documentation="isDocumentationVisible = !isDocumentationVisible"
  />
</template>
