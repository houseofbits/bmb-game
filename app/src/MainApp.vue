<script setup lang="ts">
import Box from "@src/components/Box.vue";
import {onMounted, ref} from "vue";
import Toolbar from "@src/components/Toolbar.vue";
import "@style/documentation.scss";
import Documentation from "@src/components/Documentation.vue";
import DeviceConfigurator from "@src/modules/DeviceConfigurator/DeviceConfigurator.vue";
import * as devicePresets from "@src/config/devicePresets.json";
import defineDeviceState from "@src/composables/defineDeviceState";

const deviceState = defineDeviceState();

const isDeviceConfiguratorVisible = ref(false);
const isDocumentationVisible = ref(false);

onMounted(() => {
    deviceState.buildFromParams(devicePresets[0].width, devicePresets[0].height, devicePresets[0].modules);
});

</script>
<template>
    <div v-if="isDocumentationVisible" class="box-center-wrapper">
        <Documentation/>
    </div>

    <div v-else class="box-center-wrapper">
        <Box/>
    </div>

    <DeviceConfigurator v-if="isDeviceConfiguratorVisible" @close="isDeviceConfiguratorVisible = false"/>

    <Toolbar @create-configuration="isDeviceConfiguratorVisible = true"
             @documentation="isDocumentationVisible = !isDocumentationVisible"/>
</template>
