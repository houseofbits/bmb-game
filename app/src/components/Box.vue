<script setup lang="ts">
import defineDeviceState from "@src/composables/defineDeviceState";
import {DifficultyLevel} from "@src/helpers/difficultyLevelConstants";

const deviceState = defineDeviceState();

</script>
<template>
    <div class="device">
        <div class="device-row" :class="['device-width-'+deviceState.modulesWidth.value]">
            <component
                    v-for="(module, index) in deviceState.modules.value"
                    :is="module.component"
                    :index="index"
                    :status="module.state"
                    :difficulty="DifficultyLevel.EASY"
                    @disarm="() => deviceState.disarmModule(index)"
                    @fail="() => deviceState.failModule(index)"
            />
        </div>
    </div>
</template>