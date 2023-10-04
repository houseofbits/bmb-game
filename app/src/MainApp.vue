<script setup lang="ts">
import Device from "@src/components/Device.vue";
import { onMounted, ref } from "vue";
import Toolbar from "@src/components/Toolbar.vue";
import "@style/documentation.scss";
import DeviceConfigurator from "@src/modules/DeviceConfigurator/DeviceConfigurator.vue";
import devicePresets from "@src/config/devicePresets";
import defineDeviceState from "@src/composables/defineDeviceState";
import Documentation from "@src/modules/Documentation/components/Documentation.vue";
import AboutModal from "@src/components/AboutModal.vue";

const deviceState = defineDeviceState();

const isDeviceConfiguratorVisible = ref(false);
const isDocumentationVisible = ref(false);
const isAboutModalVisible = ref(false);

onMounted(() => {
  deviceState.buildFromParams(
    devicePresets[0].width,
    devicePresets[0].height,
    devicePresets[0].modules,
  );
});
</script>
<template>
  <div class="box-center-wrapper">
    <Device />
  </div>

  <div v-if="isDocumentationVisible" class="box-center-wrapper pa-2">
    <Documentation />
  </div>

  <DeviceConfigurator
    v-if="isDeviceConfiguratorVisible"
    @close="isDeviceConfiguratorVisible = false"
  />

  <AboutModal v-if="isAboutModalVisible" @close="isAboutModalVisible = false" />

  <Toolbar
    @create-configuration="isDeviceConfiguratorVisible = true"
    @documentation="isDocumentationVisible = !isDocumentationVisible"
    @about="isAboutModalVisible = true"
  />
</template>
